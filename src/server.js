import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { readDb, tx, id, nowIso, ensureDb } from './db.js';
import { parseForm, parseMultipart, redirect, send, staticFile } from './http-utils.js';
import { loginUser, logoutUser, requireUser } from './auth.js';
import { detectPdfPageCount, isPdfFilename } from './pdf.js';
import { calculateTotal } from './pricing.js';
import { isSlotAvailable } from './pickup.js';
import { nextOrderCode } from './order.js';
import { createPayment, markPaymentPaid } from './payment.js';
import { sendPaidOrderEmail } from './notify.js';
import { confirmationPage, landingPage, loginPage, mockPaymentPage, mockSubscriptionPaymentPage, orderDetails, ordersManagementPage, revenuePage, shopDashboard, shopPage, shopsManagementPage, subscriptionConfirmationPage, superDashboard } from './views.js';

const MAX_PDF_SIZE = 50 * 1024 * 1024;

export async function app(req, res) {
  try {
    if (req.method === 'GET' && req.url.startsWith('/public/')) return (await staticFile(req, res)) || notFound(res);
    const url = new URL(req.url, `http://${req.headers.host}`);
    const db = await readDb();

    if (req.method === 'GET' && url.pathname === '/') return send(res, 200, landingPage({ leadCount: db.subscription_leads?.length || 0 }));
    if (req.method === 'POST' && url.pathname === '/subscriptions') return await createSubscription(req, res);
    const subMockPayMatch = url.pathname.match(/^\/payment\/subscription\/mock\/([^/]+)$/);
    if (req.method === 'GET' && subMockPayMatch) return renderMockSubscriptionPayment(res, db, subMockPayMatch[1]);
    const subMockSuccessMatch = url.pathname.match(/^\/payment\/subscription\/mock\/([^/]+)\/success$/);
    if (req.method === 'POST' && subMockSuccessMatch) return await completeMockSubscriptionPayment(res, subMockSuccessMatch[1]);
    const subConfirmMatch = url.pathname.match(/^\/subscriptions\/([^/]+)\/confirmation$/);
    if (req.method === 'GET' && subConfirmMatch) return renderSubscriptionConfirmation(res, db, subConfirmMatch[1]);
    const subSetupMatch = url.pathname.match(/^\/subscriptions\/([^/]+)\/setup$/);
    if (req.method === 'POST' && subSetupMatch) return await setupSubscriptionShop(req, res, subSetupMatch[1]);
    if (req.method === 'GET' && url.pathname === '/login') return send(res, 200, loginPage());
    if (req.method === 'POST' && url.pathname === '/login') return await handleLogin(req, res);
    if (req.method === 'GET' && url.pathname === '/logout') { logoutUser(req, res); return redirect(res, '/login'); }

    const shopMatch = url.pathname.match(/^\/shop\/([^/]+)$/);
    if (req.method === 'GET' && shopMatch) return renderShop(res, db, shopMatch[1]);

    const orderCreateMatch = url.pathname.match(/^\/shop\/([^/]+)\/orders$/);
    if (req.method === 'GET' && orderCreateMatch) return redirect(res, `/shop/${orderCreateMatch[1]}`);
    if (req.method === 'POST' && orderCreateMatch) return await createOrder(req, res, orderCreateMatch[1], url.origin);

    const mockPayMatch = url.pathname.match(/^\/payment\/mock\/([^/]+)$/);
    if (req.method === 'GET' && mockPayMatch) {
      const order = db.orders.find((o) => o.order_code === mockPayMatch[1]);
      if (!order) return notFound(res);
      return send(res, 200, mockPaymentPage(order));
    }

    const mockSuccessMatch = url.pathname.match(/^\/payment\/mock\/([^/]+)\/success$/);
    if (req.method === 'POST' && mockSuccessMatch) return await completeMockPayment(res, mockSuccessMatch[1]);

    const confirmMatch = url.pathname.match(/^\/orders\/([^/]+)\/confirmation$/);
    if (req.method === 'GET' && confirmMatch) return renderConfirmation(res, db, confirmMatch[1]);

    if (req.method === 'GET' && url.pathname === '/admin') return renderAdmin(req, res, db);
    if (req.method === 'GET' && url.pathname === '/admin/shops') return renderShopsManagement(req, res, db);
    if (req.method === 'GET' && url.pathname === '/admin/orders') return renderOrdersManagement(req, res, db, url.searchParams.get('updated') === '1', Number.parseInt(url.searchParams.get('page') || '1', 10));
    if (req.method === 'GET' && url.pathname === '/admin/revenue') return renderRevenue(req, res, db);
    const shopStatusMatch = url.pathname.match(/^\/admin\/shops\/([^/]+)\/status$/);
    if (req.method === 'POST' && shopStatusMatch) return await toggleShopStatus(req, res, shopStatusMatch[1]);
    const detailMatch = url.pathname.match(/^\/admin\/orders\/([^/]+)$/);
    if (req.method === 'GET' && detailMatch) return renderOrderDetail(req, res, db, detailMatch[1], url.searchParams.get('updated') === '1');
    const statusMatch = url.pathname.match(/^\/admin\/orders\/([^/]+)\/status$/);
    if (req.method === 'POST' && statusMatch) return await updateOrderStatus(req, res, statusMatch[1]);
    const downloadMatch = url.pathname.match(/^\/admin\/orders\/([^/]+)\/download$/);
    if (req.method === 'GET' && downloadMatch) return downloadOrderFile(req, res, db, downloadMatch[1]);
    if (req.method === 'GET' && url.pathname === '/admin/settings') return send(res, 200, '<meta http-equiv="refresh" content="0; url=/admin"><p>Settings editing scaffolded in data/db.json for MVP pilot.</p>');

    return notFound(res);
  } catch (error) {
    const status = error.status || 500;
    send(res, status, `<main class="page narrow"><section class="card alert"><h1>Error</h1><p>${escape(error.message)}</p><p><a href="javascript:history.back()">Back</a></p></section></main>`);
  }
}

async function handleLogin(req, res) {
  const form = await parseForm(req);
  const db = await readDb();
  const user = db.users.find((u) => u.email === form.email && u.password === form.password);
  if (!user) return send(res, 401, loginPage('Invalid email or password'));
  loginUser(res, user);
  redirect(res, '/admin');
}

async function createSubscription(req, res) {
  const form = await parseForm(req);
  const plan = form.plan === 'annual' ? 'annual' : 'monthly';
  const amount = plan === 'annual' ? 499 : 49;
  const code = await tx(async (db) => {
    db.subscriptions ||= [];
    db.payments ||= [];
    const email = String(form.email || '').trim();
    const phone = String(form.phone || '').trim();
    if (!email || !phone) throw Object.assign(new Error('Email and phone are required'), { status: 400 });
    const createdAt = nowIso();
    const subscriptionCode = `CN-SUB-${String(db.subscriptions.length + 1001).padStart(4, '0')}`;
    const subscription = {
      id: id('subscription'),
      subscription_code: subscriptionCode,
      plan,
      plan_label: plan === 'annual' ? 'Pelan Tahunan' : 'Pelan Bulanan',
      email,
      phone,
      amount,
      payment_status: 'pending',
      shop_id: null,
      created_at: createdAt,
      updated_at: createdAt
    };
    db.subscriptions.push(subscription);
    db.payments.push({
      id: id('payment'),
      subscription_id: subscription.id,
      order_id: null,
      shop_id: null,
      gateway_type: 'billplz_mock',
      gateway_reference: `MOCK-${subscriptionCode}`,
      amount,
      status: 'pending',
      paid_at: null,
      raw_response: {},
      created_at: createdAt,
      updated_at: createdAt
    });
    return subscriptionCode;
  });
  redirect(res, `/payment/subscription/mock/${code}`);
}

function renderMockSubscriptionPayment(res, db, code) {
  const subscription = db.subscriptions?.find((s) => s.subscription_code === code);
  if (!subscription) return notFound(res);
  send(res, 200, mockSubscriptionPaymentPage(subscription));
}

async function completeMockSubscriptionPayment(res, code) {
  await tx(async (db) => {
    const subscription = db.subscriptions?.find((s) => s.subscription_code === code);
    if (!subscription) throw Object.assign(new Error('Subscription not found'), { status: 404 });
    const payment = db.payments.find((p) => p.subscription_id === subscription.id);
    if (!payment) throw new Error('Payment not found');
    if (payment.status !== 'paid') {
      const paidAt = nowIso();
      payment.status = 'paid';
      payment.paid_at = paidAt;
      payment.raw_response = { mock: true };
      payment.updated_at = paidAt;
      subscription.payment_status = 'paid';
      subscription.updated_at = paidAt;
    }
  });
  redirect(res, `/subscriptions/${code}/confirmation`);
}

function renderSubscriptionConfirmation(res, db, code) {
  const subscription = db.subscriptions?.find((s) => s.subscription_code === code);
  if (!subscription || subscription.payment_status !== 'paid') return notFound(res);
  const shop = subscription.shop_id ? db.shops.find((s) => s.id === subscription.shop_id) : null;
  send(res, 200, subscriptionConfirmationPage(subscription, shop));
}

async function setupSubscriptionShop(req, res, code) {
  const form = await parseForm(req);
  const slugBase = slugify(form.slug || form.shop_name);
  if (!String(form.shop_name || '').trim()) throw Object.assign(new Error('Nama kedai diperlukan'), { status: 400 });
  if (!slugBase) throw Object.assign(new Error('Slug kedai tidak sah'), { status: 400 });

  await tx(async (db) => {
    const subscription = db.subscriptions?.find((s) => s.subscription_code === code);
    if (!subscription || subscription.payment_status !== 'paid') throw Object.assign(new Error('Subscription not found'), { status: 404 });
    const existingShop = subscription.shop_id ? db.shops.find((s) => s.id === subscription.shop_id) : null;
    if (existingShop) return existingShop.slug;

    db.shops ||= [];
    db.shop_pricing ||= [];
    db.pickup_slots ||= [];
    const createdAt = nowIso();
    const uniqueSlug = uniqueShopSlug(db, slugBase);
    const shopName = String(form.shop_name || '').trim();
    const shop = {
      id: id('shop'),
      name: shopName,
      slug: uniqueSlug,
      shop_code: shopCode(shopName, db.shops.length + 1),
      logo_url: '',
      primary_color: '#062b66',
      description: `Upload PDF, pilih tetapan print, bayar online, dan ambil dokumen anda di ${shopName}.`,
      address: String(form.address || '').trim(),
      google_maps_url: 'https://maps.google.com/',
      phone: String(form.phone || subscription.phone || '').trim(),
      email: subscription.email,
      operating_hours: String(form.operating_hours || '').trim(),
      minimum_order_amount: positiveMoney(form.minimum_order_amount, 5),
      is_active: true,
      plan: subscription.plan,
      subscription_status: 'active',
      created_at: createdAt,
      updated_at: createdAt
    };
    db.shops.push(shop);
    db.shop_pricing.push({
      id: id('pricing'),
      shop_id: shop.id,
      a4_bw_price_per_page: positiveMoney(form.a4_bw_price_per_page, 0.2),
      a4_color_price_per_page: positiveMoney(form.a4_color_price_per_page, 1),
      created_at: createdAt,
      updated_at: createdAt
    });
    for (const day of [1, 2, 3, 4, 5, 6]) {
      for (const [index, [start, end]] of [['09:00', '10:00'], ['10:00', '11:00'], ['11:00', '12:00']].entries()) {
        db.pickup_slots.push({
          id: id('slot'),
          shop_id: shop.id,
          day_of_week: day,
          start_time: start,
          end_time: end,
          max_orders: 5,
          is_active: true,
          created_at: createdAt,
          updated_at: createdAt
        });
      }
    }
    subscription.shop_id = shop.id;
    subscription.updated_at = createdAt;
    return shop.slug;
  });
  redirect(res, `/subscriptions/${code}/confirmation`);
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

function uniqueShopSlug(db, base) {
  let slug = base;
  let counter = 2;
  while (db.shops.some((shop) => shop.slug === slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

function positiveMoney(value, fallback) {
  const amount = Number.parseFloat(value);
  if (!Number.isFinite(amount) || amount < 0) return fallback;
  return Math.round(amount * 100) / 100;
}

function shopCode(name, index) {
  const initials = String(name || '')
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .replace(/[^a-z0-9]/gi, '')
    .toUpperCase()
    .slice(0, 3);
  return initials || `CN${index}`;
}

function renderShop(res, db, slug, error = '') {
  const shop = db.shops.find((s) => s.slug === slug);
  if (!shop || !shop.is_active) return send(res, 404, '<h1>Shop unavailable</h1>');
  const pricing = db.shop_pricing.find((p) => p.shop_id === shop.id);
  const slots = db.pickup_slots.filter((s) => s.shop_id === shop.id && s.is_active);
  send(res, 200, shopPage({ shop, pricing, slots, error }));
}

async function createOrder(req, res, slug, origin) {
  let fields = {};
  try {
    const parsed = await parseMultipart(req);
    fields = parsed.fields;
    const file = parsed.files.pdf;
    const paymentUrl = await tx(async (db) => {
    const shop = db.shops.find((s) => s.slug === slug && s.is_active);
    if (!shop) throw Object.assign(new Error('Shop unavailable'), { status: 404 });
    const pricing = db.shop_pricing.find((p) => p.shop_id === shop.id);
    if (!file?.value?.length || !isPdfFilename(file.filename)) throw Object.assign(new Error('PDF file required'), { status: 400 });
    if (file.value.length > MAX_PDF_SIZE) throw Object.assign(new Error('PDF exceeds 50MB limit'), { status: 400 });
    const pageCount = detectPdfPageCount(file.value);
    const copies = Math.max(1, Number.parseInt(fields.copies || '1', 10));
    const printType = fields.print_type === 'color' ? 'color' : 'bw';
    const sides = fields.sides === 'double' ? 'double' : 'single';
    const total = calculateTotal({ pageCount, printType, copies, pricing });
    if (total < Number(shop.minimum_order_amount)) throw Object.assign(new Error(`Jumlah pesanan ${total.toFixed(2)}. Minimum online order ialah RM${Number(shop.minimum_order_amount).toFixed(2)}.`), { status: 400 });
    if (fields.policy_agreed !== 'yes') throw Object.assign(new Error('Policy agreement required'), { status: 400 });
    const availability = isSlotAvailable({ db, shopId: shop.id, slotId: fields.pickup_slot_id, pickupDate: fields.pickup_date });
    if (!availability.ok) throw Object.assign(new Error(availability.reason), { status: 400 });
    const orderCode = nextOrderCode(db, shop);
    await fs.mkdir('storage/pdfs', { recursive: true });
    const safeOriginal = path.basename(file.filename).replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = path.resolve('storage/pdfs', `${orderCode}-${safeOriginal}`);
    await fs.writeFile(filePath, file.value);
    const createdAt = nowIso();
    const order = {
      id: id('order'), shop_id: shop.id, order_code: orderCode,
      customer_name: fields.customer_name || '', customer_phone: fields.customer_phone || '', customer_email: fields.customer_email || '',
      file_path: filePath, original_file_name: safeOriginal, page_count: pageCount, paper_size: 'A4', print_type: printType, sides, copies,
      notes: fields.notes || '', subtotal: total, total_amount: total, minimum_order_amount: shop.minimum_order_amount,
      payment_status: 'pending', order_status: 'Pending Payment', pickup_date: fields.pickup_date, pickup_slot_id: fields.pickup_slot_id,
      payment_reference: null, file_delete_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), file_deleted_at: null,
      created_at: createdAt, updated_at: createdAt
    };
    db.orders.push(order);
    const result = await createPayment({ db, order, shop, origin });
    order.payment_reference = result.payment.gateway_reference;
    return result.paymentUrl;
    });
    redirect(res, paymentUrl);
  } catch (error) {
    const db = await readDb();
    const shop = db.shops.find((s) => s.slug === slug);
    if (shop && error.status && error.status < 500) return renderShop(res, db, slug, error.message);
    throw error;
  }
}

async function completeMockPayment(res, orderCode) {
  await tx(async (db) => {
    const order = db.orders.find((o) => o.order_code === orderCode);
    if (!order) throw Object.assign(new Error('Order not found'), { status: 404 });
    const shop = db.shops.find((s) => s.id === order.shop_id);
    const slot = db.pickup_slots.find((s) => s.id === order.pickup_slot_id);
    markPaymentPaid(db, order, { mock: true });
    await sendPaidOrderEmail(db, { shop, order, slot });
  });
  redirect(res, `/orders/${orderCode}/confirmation`);
}

function renderConfirmation(res, db, orderCode) {
  const order = db.orders.find((o) => o.order_code === orderCode);
  if (!order || order.payment_status !== 'paid') return notFound(res);
  const shop = db.shops.find((s) => s.id === order.shop_id);
  const slot = db.pickup_slots.find((s) => s.id === order.pickup_slot_id);
  send(res, 200, confirmationPage(order, shop, slot));
}

function renderAdmin(req, res, db) {
  const user = requireUser(req, db);
  if (!user) return redirect(res, '/login');
  if (user.role === 'super_admin') return send(res, 200, superDashboard({ shops: db.shops, orders: db.orders, subscriptions: db.subscriptions || [] }));
  const shop = db.shops.find((s) => s.id === user.shop_id);
  const orders = db.orders.filter((o) => o.shop_id === user.shop_id).sort((a, b) => b.created_at.localeCompare(a.created_at));
  send(res, 200, shopDashboard({ user, shop, orders }));
}


function renderRevenue(req, res, db) {
  const user = requireUser(req, db);
  if (!user) return redirect(res, '/login');
  if (user.role === 'super_admin') {
    return send(res, 200, revenuePage({ user, shops: db.shops, orders: db.orders, payments: db.payments || [], subscriptions: db.subscriptions || [], mode: 'subscriptions' }));
  }
  const shop = db.shops.find((s) => s.id === user.shop_id);
  const orders = db.orders.filter((o) => o.shop_id === user.shop_id);
  const payments = (db.payments || []).filter((p) => p.shop_id === user.shop_id);
  send(res, 200, revenuePage({ user, shop, orders, payments, subscriptions: [], mode: 'orders' }));
}

function renderShopsManagement(req, res, db) {
  const user = requireUser(req, db, 'super_admin');
  if (!user) return notFound(res);
  send(res, 200, shopsManagementPage({ user, shops: db.shops, orders: db.orders }));
}

function renderOrdersManagement(req, res, db, updated = false, page = 1) {
  const user = requireUser(req, db);
  if (!user) return redirect(res, '/login');
  if (user.role === 'super_admin') {
    const orders = [...db.orders].sort((a, b) => b.created_at.localeCompare(a.created_at));
    return send(res, 200, ordersManagementPage({ user, shops: db.shops, orders, updated, page }));
  }
  const shop = db.shops.find((s) => s.id === user.shop_id);
  const orders = db.orders.filter((o) => o.shop_id === user.shop_id).sort((a, b) => b.created_at.localeCompare(a.created_at));
  send(res, 200, ordersManagementPage({ user, shop, orders, updated, page }));
}

async function toggleShopStatus(req, res, shopId) {
  await tx(async (db) => {
    const user = requireUser(req, db, 'super_admin');
    if (!user) throw Object.assign(new Error('Not found'), { status: 404 });
    const shop = db.shops.find((s) => s.id === shopId);
    if (!shop) throw Object.assign(new Error('Shop not found'), { status: 404 });
    shop.is_active = !shop.is_active;
    shop.updated_at = nowIso();
  });
  redirect(res, '/admin/shops');
}

function canAccessOrder(user, order) {
  return user?.role === 'super_admin' || (user?.role === 'shop_admin' && user.shop_id === order.shop_id);
}

function renderOrderDetail(req, res, db, orderId, updated = false) {
  const user = requireUser(req, db);
  const order = db.orders.find((o) => o.id === orderId);
  if (!user) return redirect(res, '/login');
  if (!order || !canAccessOrder(user, order)) return notFound(res);
  const shop = db.shops.find((s) => s.id === order.shop_id);
  const slot = db.pickup_slots.find((s) => s.id === order.pickup_slot_id);
  send(res, 200, orderDetails({ order, shop, slot, user, updated }));
}

async function updateOrderStatus(req, res, orderId) {
  const form = await parseForm(req);
  await tx(async (db) => {
    const user = requireUser(req, db);
    const order = db.orders.find((o) => o.id === orderId);
    if (!user) throw Object.assign(new Error('Login required'), { status: 401 });
    if (!order || !canAccessOrder(user, order)) throw Object.assign(new Error('Order not found'), { status: 404 });
    const allowed = ['Paid / New Order', 'Printing', 'Ready for Pickup', 'Completed', 'Cancelled', 'File Problem'];
    if (!allowed.includes(form.order_status)) throw Object.assign(new Error('Invalid status'), { status: 400 });
    order.order_status = form.order_status;
    order.updated_at = nowIso();
  });
  redirect(res, '/admin/orders?updated=1');
}

async function downloadOrderFile(req, res, db, orderId) {
  const user = requireUser(req, db);
  const order = db.orders.find((o) => o.id === orderId);
  if (!user) return redirect(res, '/login');
  if (!order || !canAccessOrder(user, order)) return notFound(res);
  if (order.file_deleted_at) return send(res, 410, '<h1>File deleted</h1><p>This PDF was auto-deleted for privacy.</p>');
  const data = await fs.readFile(order.file_path);
  res.writeHead(200, { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${order.original_file_name}"` });
  res.end(data);
}

function notFound(res) { send(res, 404, '<h1>Not found</h1>'); }
function escape(v) { return String(v).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }

if (import.meta.url === `file://${process.argv[1]}`) {
  await ensureDb();
  const port = Number(process.env.PORT || 3000);
  http.createServer(app).listen(port, '127.0.0.1', () => console.log(`CetakNow running at http://127.0.0.1:${port}`));
}
