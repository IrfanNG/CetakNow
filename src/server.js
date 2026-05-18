import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { readDb, tx, id, nowIso, ensureDb } from './db.js';
import { json, parseForm, parseMultipart, redirect, send, staticFile } from './http-utils.js';
import { loginUser, logoutUser, requireUser } from './auth.js';
import { detectPdfPageCount, isPdfFilename } from './pdf.js';
import { calculateTotal } from './pricing.js';
import { isSlotAvailable, syncPickupSlotsForShop } from './pickup.js';
import { nextOrderCode } from './order.js';
import { createPayment, markPaymentPaid } from './payment.js';
import { sendPaidOrderEmail } from './notify.js';
import { confirmationPage, landingPage, loginPage, mockPaymentPage, mockSubscriptionPaymentPage, orderDetails, ordersManagementPage, revenuePage, shopDashboard, shopDashboardSnapshot, shopPage, shopSettingsPage, shopsManagementPage, subscriptionConfirmationPage, subscriptionPage, superDashboard } from './views.js';

const MAX_PDF_SIZE = 50 * 1024 * 1024;
const MAX_PDF_FILES = 10;
const adminEventClients = new Map();

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
    if (req.method === 'GET' && url.pathname === '/admin/revenue') return renderRevenue(req, res, db, url.searchParams.get('date') || '', Number.parseInt(url.searchParams.get('page') || '1', 10));
    if (req.method === 'GET' && url.pathname === '/admin/subscription') return renderSubscriptionAdmin(req, res, db);
    if (req.method === 'GET' && url.pathname === '/admin/settings') return renderShopSettings(req, res, db, url.searchParams.get('updated') === '1');
    if (req.method === 'POST' && url.pathname === '/admin/settings') return await updateShopSettings(req, res);
    if (req.method === 'POST' && url.pathname === '/admin/products') return await createShopProduct(req, res);
    const productMatch = url.pathname.match(/^\/admin\/products\/([^/]+)$/);
    if (req.method === 'POST' && productMatch) return await updateShopProduct(req, res, productMatch[1]);
    if (req.method === 'POST' && url.pathname === '/admin/paper-sizes') return await createPaperSize(req, res);
    const paperSizeMatch = url.pathname.match(/^\/admin\/paper-sizes\/([^/]+)$/);
    if (req.method === 'POST' && paperSizeMatch) return await updatePaperSize(req, res, paperSizeMatch[1]);
    if (req.method === 'GET' && url.pathname === '/admin/dashboard.json') return renderDashboardJson(req, res, db);
    if (req.method === 'GET' && url.pathname === '/admin/events') return renderAdminEvents(req, res, db);
    const shopStatusMatch = url.pathname.match(/^\/admin\/shops\/([^/]+)\/status$/);
    if (req.method === 'POST' && shopStatusMatch) return await toggleShopStatus(req, res, shopStatusMatch[1]);
    const detailMatch = url.pathname.match(/^\/admin\/orders\/([^/]+)$/);
    if (req.method === 'GET' && detailMatch) return renderOrderDetail(req, res, db, detailMatch[1], url.searchParams.get('updated') === '1');
    const statusMatch = url.pathname.match(/^\/admin\/orders\/([^/]+)\/status$/);
    if (req.method === 'POST' && statusMatch) return await updateOrderStatus(req, res, statusMatch[1]);
    const downloadMatch = url.pathname.match(/^\/admin\/orders\/([^/]+)\/download(?:\/(\d+))?$/);
    if (req.method === 'GET' && downloadMatch) return downloadOrderFile(req, res, db, downloadMatch[1], Number.parseInt(downloadMatch[2] || '1', 10) - 1);

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
  const password = String(form.password || '');
  const passwordConfirm = String(form.password_confirm || '');
  if (!String(form.shop_name || '').trim()) throw Object.assign(new Error('Nama kedai diperlukan'), { status: 400 });
  if (!slugBase) throw Object.assign(new Error('Slug kedai tidak sah'), { status: 400 });
  if (password.length < 6) throw Object.assign(new Error('Password dashboard mesti sekurang-kurangnya 6 aksara'), { status: 400 });
  if (password !== passwordConfirm) throw Object.assign(new Error('Password dashboard tidak sama'), { status: 400 });

  await tx(async (db) => {
    const subscription = db.subscriptions?.find((s) => s.subscription_code === code);
    if (!subscription || subscription.payment_status !== 'paid') throw Object.assign(new Error('Subscription not found'), { status: 404 });
    const existingShop = subscription.shop_id ? db.shops.find((s) => s.id === subscription.shop_id) : null;
    if (existingShop) return existingShop.slug;

    db.shops ||= [];
    db.users ||= [];
    db.shop_pricing ||= [];
    db.pickup_slots ||= [];
    db.shop_payment_settings ||= [];
    db.shop_paper_sizes ||= [];
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
      google_maps_url: String(form.google_maps_url || '').trim() || 'https://maps.google.com/',
      phone: String(form.phone || subscription.phone || '').trim(),
      email: subscription.email,
      operating_hours: String(form.operating_hours || '').trim(),
      minimum_order_amount: 5,
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
      a4_bw_price_per_page: 0.2,
      a4_color_price_per_page: 1,
      created_at: createdAt,
      updated_at: createdAt
    });
    db.shop_paper_sizes.push({
      id: id('paper_size'),
      shop_id: shop.id,
      label: 'A4',
      bw_price_per_page: 0.2,
      color_price_per_page: 1,
      is_active: true,
      sort_order: 1,
      created_at: createdAt,
      updated_at: createdAt
    });
    db.shop_payment_settings.push({
      id: id('payment_settings'),
      shop_id: shop.id,
      gateway_type: 'billplz_mock',
      api_key: 'mock',
      collection_id: 'mock',
      x_signature_key: 'mock_secret',
      is_enabled: true,
      created_at: createdAt,
      updated_at: createdAt
    });
    syncPickupSlotsForShop(db, shop);
    const existingUser = db.users.find((u) => String(u.email).toLowerCase() === String(subscription.email).toLowerCase());
    if (existingUser && existingUser.role !== 'super_admin') {
      existingUser.name = existingUser.name || `${shopName} Owner`;
      existingUser.password = password;
      existingUser.role = 'shop_admin';
      existingUser.shop_id = shop.id;
      existingUser.updated_at = createdAt;
    } else if (!existingUser) {
      db.users.push({
        id: id('user'),
        name: `${shopName} Owner`,
        email: subscription.email,
        password,
        role: 'shop_admin',
        shop_id: shop.id,
        created_at: createdAt,
        updated_at: createdAt
      });
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
  const pricing = (db.shop_pricing || []).find((p) => p.shop_id === shop.id) || { a4_bw_price_per_page: 0.2, a4_color_price_per_page: 1 };
  const slots = db.pickup_slots
    .filter((s) => s.shop_id === shop.id && s.is_active)
    .sort((a, b) => daySort(a.day_of_week) - daySort(b.day_of_week) || String(a.start_time).localeCompare(String(b.start_time)));
  const products = (db.shop_products || []).filter((p) => p.shop_id === shop.id && p.is_active);
  const paperSizes = activePaperSizes(db, shop, pricing);
  send(res, 200, shopPage({ shop, pricing, slots, products, paperSizes, error }));
}

async function createOrder(req, res, slug, origin) {
  let fields = {};
  let createdShopId = '';
  try {
    const parsed = await parseMultipart(req);
    fields = parsed.fields;
    const uploadedFiles = normalizeUploadedFiles(parsed.files.pdf);
    const { paymentUrl, shopId } = await tx(async (db) => {
    const shop = db.shops.find((s) => s.slug === slug && s.is_active);
    if (!shop) throw Object.assign(new Error('Shop unavailable'), { status: 404 });
    const pricing = (db.shop_pricing || []).find((p) => p.shop_id === shop.id) || { a4_bw_price_per_page: 0.2, a4_color_price_per_page: 1 };
    const paperSizes = activePaperSizes(db, shop, pricing);
    const paperSize = paperSizes.find((size) => size.id === fields.paper_size_id) || paperSizes[0];
    const selectedProducts = selectedProductIds(fields.product_ids)
      .map((productId) => (db.shop_products || []).find((p) => p.id === productId && p.shop_id === shop.id && p.is_active))
      .filter(Boolean);
    if (!uploadedFiles.length) throw Object.assign(new Error('PDF file required'), { status: 400 });
    if (uploadedFiles.length > MAX_PDF_FILES) throw Object.assign(new Error(`Maximum ${MAX_PDF_FILES} PDF files per order`), { status: 400 });
    for (const file of uploadedFiles) {
      if (!file?.value?.length || !isPdfFilename(file.filename)) throw Object.assign(new Error('PDF file required'), { status: 400 });
      if (file.value.length > MAX_PDF_SIZE) throw Object.assign(new Error('PDF exceeds 50MB limit'), { status: 400 });
    }
    const uploadDetails = uploadedFiles.map((file) => ({
      file,
      originalName: path.basename(file.filename).replace(/[^a-zA-Z0-9._-]/g, '_') || 'document.pdf',
      pageCount: detectPdfPageCount(file.value)
    }));
    const pageCount = uploadDetails.reduce((sum, item) => sum + item.pageCount, 0);
    const copies = Math.max(1, Number.parseInt(fields.copies || '1', 10));
    const printType = fields.print_type === 'color' ? 'color' : 'bw';
    const sides = fields.sides === 'double' ? 'double' : 'single';
    const printTotal = calculateTotal({ pageCount, printType, copies, pricing, paperSize });
    const productItems = selectedProducts.map((product) => ({ product_id: product.id, name: product.name, price: Number(product.price || 0) }));
    const productTotal = productItems.reduce((sum, product) => sum + Number(product.price || 0), 0);
    const total = Math.round((printTotal + productTotal + Number.EPSILON) * 100) / 100;
    if (total < Number(shop.minimum_order_amount)) throw Object.assign(new Error(`Jumlah pesanan ${total.toFixed(2)}. Minimum online order ialah RM${Number(shop.minimum_order_amount).toFixed(2)}.`), { status: 400 });
    if (fields.policy_agreed !== 'yes') throw Object.assign(new Error('Policy agreement required'), { status: 400 });
    const availability = isSlotAvailable({ db, shopId: shop.id, slotId: fields.pickup_slot_id, pickupDate: fields.pickup_date });
    if (!availability.ok) throw Object.assign(new Error(availability.reason), { status: 400 });
    const orderCode = nextOrderCode(db, shop);
    await fs.mkdir('storage/pdfs', { recursive: true });
    const savedFiles = [];
    for (const [index, detail] of uploadDetails.entries()) {
      const filePath = path.resolve('storage/pdfs', `${orderCode}-${String(index + 1).padStart(2, '0')}-${detail.originalName}`);
      await fs.writeFile(filePath, detail.file.value);
      savedFiles.push({ original_file_name: detail.originalName, file_path: filePath, page_count: detail.pageCount });
    }
    const createdAt = nowIso();
    const fileDeleteAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const order = {
      id: id('order'), shop_id: shop.id, order_code: orderCode,
      customer_name: fields.customer_name || '', customer_phone: fields.customer_phone || '', customer_email: fields.customer_email || '',
      files: savedFiles, file_path: savedFiles[0].file_path, original_file_name: savedFiles[0].original_file_name, page_count: pageCount, paper_size_id: paperSize?.id || null, paper_size: paperSize?.label || 'A4', print_type: printType, sides, copies,
      notes: fields.notes || '', product_items: productItems, subtotal: printTotal, product_total: productTotal, total_amount: total, minimum_order_amount: shop.minimum_order_amount,
      payment_status: 'pending', order_status: 'Pending Payment', pickup_date: fields.pickup_date, pickup_slot_id: fields.pickup_slot_id,
      payment_reference: null, file_delete_at: fileDeleteAt, file_deleted_at: null,
      created_at: createdAt, updated_at: createdAt
    };
    db.orders.push(order);
    const result = await createPayment({ db, order, shop, origin });
    order.payment_reference = result.payment.gateway_reference;
    return { paymentUrl: result.paymentUrl, shopId: shop.id };
    });
    createdShopId = shopId;
    notifyAdminDashboard(createdShopId);
    redirect(res, paymentUrl);
  } catch (error) {
    const db = await readDb();
    const shop = db.shops.find((s) => s.slug === slug);
    if (shop && error.status && error.status < 500) return renderShop(res, db, slug, error.message);
    throw error;
  }
}

async function completeMockPayment(res, orderCode) {
  let paidShopId = '';
  await tx(async (db) => {
    const order = db.orders.find((o) => o.order_code === orderCode);
    if (!order) throw Object.assign(new Error('Order not found'), { status: 404 });
    const shop = db.shops.find((s) => s.id === order.shop_id);
    const slot = db.pickup_slots.find((s) => s.id === order.pickup_slot_id);
    markPaymentPaid(db, order, { mock: true });
    await sendPaidOrderEmail(db, { shop, order, slot });
    paidShopId = order.shop_id;
  });
  notifyAdminDashboard(paidShopId);
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

function shopDashboardData(db, user) {
  const shop = db.shops.find((s) => s.id === user.shop_id);
  const orders = db.orders.filter((o) => o.shop_id === user.shop_id).sort((a, b) => b.created_at.localeCompare(a.created_at));
  return { shop, orders };
}

function renderDashboardJson(req, res, db) {
  const user = requireUser(req, db);
  if (!user) return json(res, 401, { error: 'Login required' });
  if (user.role === 'super_admin') return json(res, 404, { error: 'Not found' });
  const { shop, orders } = shopDashboardData(db, user);
  if (!shop) return json(res, 404, { error: 'Shop not found' });
  json(res, 200, shopDashboardSnapshot({ orders }));
}

function renderAdminEvents(req, res, db) {
  const user = requireUser(req, db);
  if (!user || user.role !== 'shop_admin') return send(res, 401, 'Login required');
  const shopId = user.shop_id;
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive'
  });
  res.write(': connected\n\n');
  const clients = adminEventClients.get(shopId) || new Set();
  clients.add(res);
  adminEventClients.set(shopId, clients);
  req.on('close', () => {
    clients.delete(res);
    if (!clients.size) adminEventClients.delete(shopId);
  });
}

function notifyAdminDashboard(shopId) {
  if (!shopId) return;
  for (const res of adminEventClients.get(shopId) || []) {
    res.write(`event: dashboard\ndata: ${JSON.stringify({ updated_at: nowIso() })}\n\n`);
  }
}


function renderRevenue(req, res, db, selectedDate = '', page = 1) {
  const user = requireUser(req, db);
  if (!user) return redirect(res, '/login');
  if (user.role === 'super_admin') {
    return send(res, 200, revenuePage({ user, shops: db.shops, orders: db.orders, payments: db.payments || [], subscriptions: db.subscriptions || [], mode: 'subscriptions', selectedDate, page }));
  }
  const shop = db.shops.find((s) => s.id === user.shop_id);
  const orders = db.orders.filter((o) => o.shop_id === user.shop_id);
  const payments = (db.payments || []).filter((p) => p.shop_id === user.shop_id);
  send(res, 200, revenuePage({ user, shop, orders, payments, subscriptions: [], mode: 'orders', selectedDate, page }));
}

function renderSubscriptionAdmin(req, res, db) {
  const user = requireUser(req, db);
  if (!user) return redirect(res, '/login');
  if (user.role === 'super_admin') return redirect(res, '/admin');
  const shop = db.shops.find((s) => s.id === user.shop_id);
  if (!shop) return notFound(res);
  const subscription = (db.subscriptions || [])
    .filter((s) => s.shop_id === shop.id)
    .sort((a, b) => String(b.updated_at || b.created_at || '').localeCompare(String(a.updated_at || a.created_at || '')))[0] || null;
  const payment = subscription ? (db.payments || []).find((p) => p.subscription_id === subscription.id) : null;
  send(res, 200, subscriptionPage({ user, shop, subscription, payment }));
}

function renderShopSettings(req, res, db, updated = false) {
  const user = requireUser(req, db);
  if (!user) return redirect(res, '/login');
  if (user.role === 'super_admin') return redirect(res, '/admin');
  const shop = db.shops.find((s) => s.id === user.shop_id);
  if (!shop) return notFound(res);
  const pricing = (db.shop_pricing || []).find((p) => p.shop_id === shop.id);
  const products = (db.shop_products || []).filter((p) => p.shop_id === shop.id).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  const paperSizes = allPaperSizes(db, shop, pricing);
  send(res, 200, shopSettingsPage({ user, shop, pricing, products, paperSizes, updated }));
}

async function updateShopSettings(req, res) {
  const form = await parseForm(req);
  await tx(async (db) => {
    const user = requireUser(req, db);
    if (!user) throw Object.assign(new Error('Login required'), { status: 401 });
    if (user.role === 'super_admin') throw Object.assign(new Error('Not found'), { status: 404 });
    db.shop_pricing ||= [];
    const shop = db.shops.find((s) => s.id === user.shop_id);
    if (!shop) throw Object.assign(new Error('Shop not found'), { status: 404 });
    let pricing = db.shop_pricing.find((p) => p.shop_id === shop.id);
    if (!pricing) {
      pricing = { id: id('pricing'), shop_id: shop.id, a4_bw_price_per_page: 0.2, a4_color_price_per_page: 1, created_at: nowIso(), updated_at: nowIso() };
      db.shop_pricing.push(pricing);
    }
    const updatedAt = nowIso();
    shop.name = String(form.name || '').trim() || shop.name;
    shop.description = String(form.description || '').trim() || shop.description;
    shop.phone = String(form.phone || '').trim() || shop.phone;
    shop.address = String(form.address || '').trim() || shop.address;
    shop.google_maps_url = String(form.google_maps_url || '').trim() || shop.google_maps_url || 'https://maps.google.com/';
    shop.operating_hours = String(form.operating_hours || '').trim() || shop.operating_hours;
    shop.primary_color = normalizeHexColor(form.primary_color, shop.primary_color);
    shop.minimum_order_amount = positiveMoney(form.minimum_order_amount, shop.minimum_order_amount);
    shop.updated_at = updatedAt;
    pricing.updated_at = updatedAt;
    syncPickupSlotsForShop(db, shop);
  });
  redirect(res, '/admin/settings?updated=1');
}

async function createShopProduct(req, res) {
  const form = await parseForm(req);
  await tx(async (db) => {
    const user = requireUser(req, db);
    if (!user || user.role !== 'shop_admin') throw Object.assign(new Error('Not found'), { status: 404 });
    const shop = db.shops.find((s) => s.id === user.shop_id);
    if (!shop) throw Object.assign(new Error('Shop not found'), { status: 404 });
    db.shop_products ||= [];
    const now = nowIso();
    const name = String(form.name || '').trim();
    if (!name) throw Object.assign(new Error('Nama produk diperlukan'), { status: 400 });
    db.shop_products.push({
      id: id('product'),
      shop_id: shop.id,
      name,
      description: String(form.description || '').trim(),
      price: positiveMoney(form.price, 0),
      is_active: form.is_active === 'on',
      created_at: now,
      updated_at: now
    });
  });
  redirect(res, '/admin/settings?updated=1');
}

async function updateShopProduct(req, res, productId) {
  const form = await parseForm(req);
  await tx(async (db) => {
    const user = requireUser(req, db);
    if (!user || user.role !== 'shop_admin') throw Object.assign(new Error('Not found'), { status: 404 });
    const product = (db.shop_products || []).find((p) => p.id === productId && p.shop_id === user.shop_id);
    if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });
    const name = String(form.name || '').trim();
    if (!name) throw Object.assign(new Error('Nama produk diperlukan'), { status: 400 });
    product.name = name;
    product.description = String(form.description || '').trim();
    product.price = positiveMoney(form.price, product.price);
    product.is_active = form.is_active === 'on';
    product.updated_at = nowIso();
  });
  redirect(res, '/admin/settings?updated=1');
}

async function createPaperSize(req, res) {
  const form = await parseForm(req);
  await tx(async (db) => {
    const user = requireUser(req, db);
    if (!user || user.role !== 'shop_admin') throw Object.assign(new Error('Not found'), { status: 404 });
    const shop = db.shops.find((s) => s.id === user.shop_id);
    if (!shop) throw Object.assign(new Error('Shop not found'), { status: 404 });
    const pricing = (db.shop_pricing || []).find((p) => p.shop_id === shop.id);
    ensureDefaultPaperSize(db, shop, pricing);
    const now = nowIso();
    const label = String(form.label || '').trim().toUpperCase();
    if (!label) throw Object.assign(new Error('Nama saiz kertas diperlukan'), { status: 400 });
    db.shop_paper_sizes.push({
      id: id('paper_size'),
      shop_id: shop.id,
      label,
      bw_price_per_page: positiveMoney(form.bw_price_per_page, 0),
      color_price_per_page: positiveMoney(form.color_price_per_page, 0),
      is_active: form.is_active === 'on',
      sort_order: (db.shop_paper_sizes || []).filter((size) => size.shop_id === shop.id).length + 1,
      created_at: now,
      updated_at: now
    });
  });
  redirect(res, '/admin/settings?updated=1');
}

async function updatePaperSize(req, res, paperSizeId) {
  const form = await parseForm(req);
  await tx(async (db) => {
    const user = requireUser(req, db);
    if (!user || user.role !== 'shop_admin') throw Object.assign(new Error('Not found'), { status: 404 });
    const paperSize = (db.shop_paper_sizes || []).find((size) => size.id === paperSizeId && size.shop_id === user.shop_id);
    if (!paperSize) throw Object.assign(new Error('Paper size not found'), { status: 404 });
    const label = String(form.label || '').trim().toUpperCase();
    if (!label) throw Object.assign(new Error('Nama saiz kertas diperlukan'), { status: 400 });
    paperSize.label = label;
    paperSize.bw_price_per_page = positiveMoney(form.bw_price_per_page, paperSize.bw_price_per_page);
    paperSize.color_price_per_page = positiveMoney(form.color_price_per_page, paperSize.color_price_per_page);
    paperSize.is_active = form.is_active === 'on';
    paperSize.updated_at = nowIso();
  });
  redirect(res, '/admin/settings?updated=1');
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
  let changedShopId = '';
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
    changedShopId = order.shop_id;
  });
  notifyAdminDashboard(changedShopId);
  redirect(res, '/admin/orders?updated=1');
}

async function downloadOrderFile(req, res, db, orderId, fileIndex = 0) {
  const user = requireUser(req, db);
  const order = db.orders.find((o) => o.id === orderId);
  if (!user) return redirect(res, '/login');
  if (!order || !canAccessOrder(user, order)) return notFound(res);
  if (order.file_deleted_at) return send(res, 410, '<h1>File deleted</h1><p>This PDF was auto-deleted for privacy.</p>');
  const files = order.files?.length ? order.files : [{ file_path: order.file_path, original_file_name: order.original_file_name || 'order.pdf' }];
  const file = files[fileIndex];
  if (!file?.file_path) return notFound(res);
  const data = await fs.readFile(file.file_path);
  res.writeHead(200, { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${file.original_file_name || 'order.pdf'}"` });
  res.end(data);
}

function notFound(res) { send(res, 404, '<h1>Not found</h1>'); }
function escape(v) { return String(v).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
function normalizeHexColor(value, fallback = '#062b66') {
  const raw = String(value || '').trim();
  return /^#[0-9a-fA-F]{6}$/.test(raw) ? raw : fallback;
}
function selectedProductIds(value) {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).map((item) => String(item || '').trim()).filter(Boolean);
}
function normalizeUploadedFiles(value) {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).filter((file) => file?.filename && file?.value?.length);
}
function daySort(value) {
  const day = Number(value);
  return day === 0 ? 7 : day;
}
function fallbackPaperSize(shop, pricing = {}) {
  return {
    id: `legacy-a4-${shop.id}`,
    shop_id: shop.id,
    label: 'A4',
    bw_price_per_page: Number(pricing.a4_bw_price_per_page ?? 0.2),
    color_price_per_page: Number(pricing.a4_color_price_per_page ?? 1),
    is_active: true,
    sort_order: 1,
    created_at: shop.created_at,
    updated_at: pricing.updated_at || shop.updated_at
  };
}
function allPaperSizes(db, shop, pricing = {}) {
  const sizes = (db.shop_paper_sizes || [])
    .filter((size) => size.shop_id === shop.id)
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0) || String(a.label).localeCompare(String(b.label)));
  return sizes.length ? sizes : [fallbackPaperSize(shop, pricing)];
}
function activePaperSizes(db, shop, pricing = {}) {
  const active = allPaperSizes(db, shop, pricing).filter((size) => size.is_active);
  return active.length ? active : [fallbackPaperSize(shop, pricing)];
}
function ensureDefaultPaperSize(db, shop, pricing = {}) {
  db.shop_paper_sizes ||= [];
  if (db.shop_paper_sizes.some((size) => size.shop_id === shop.id)) return;
  db.shop_paper_sizes.push(fallbackPaperSize(shop, pricing));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await ensureDb();
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || '127.0.0.1';
  http.createServer(app).listen(port, host, () => console.log(`CetakNow running at http://${host}:${port}`));
}
