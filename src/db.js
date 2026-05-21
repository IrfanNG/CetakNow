import fs from 'node:fs/promises';
import path from 'node:path';
import pg from 'pg';

const { Pool } = pg;

const DATA_PATH = path.resolve('data/db.json');
const SEED_PATH = path.resolve('data/seed.json');

const LOCAL_ONLY_KEYS = ['subscription_leads'];

let pool;
let loggedMode = false;

export const TABLES = Object.freeze({
  shops: 'shops',
  users: 'users',
  subscriptions: 'subscriptions',
  shopPricing: 'shop_pricing',
  paperSizes: 'shop_paper_sizes',
  addons: 'addons',
  pickupSlots: 'pickup_slots',
  orders: 'orders',
  orderFiles: 'order_files',
  printSettings: 'order_print_settings',
  payments: 'payments',
  notifications: 'notifications'
});

export function databaseMode() {
  return process.env.DATABASE_URL ? 'postgres' : 'json';
}

export function databaseModeLabel() {
  return databaseMode() === 'postgres' ? 'PostgreSQL' : 'Local JSON fallback';
}

export function logDatabaseMode(logger = console.log) {
  if (loggedMode) return;
  loggedMode = true;
  logger(`Database mode: ${databaseModeLabel()}`);
}

function poolOptions() {
  const options = { connectionString: process.env.DATABASE_URL };
  if (process.env.PGSSLMODE === 'require') options.ssl = { rejectUnauthorized: false };
  return options;
}

export function getPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured. PostgreSQL adapter is unavailable.');
  pool ||= new Pool(poolOptions());
  return pool;
}

export async function query(sql, params = []) {
  return getPool().query(sql, params);
}

export async function withPgTransaction(callback) {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function closeDb() {
  if (!pool) return;
  const currentPool = pool;
  pool = undefined;
  await currentPool.end();
}

export async function checkPostgresConnection() {
  const result = await query('SELECT 1 AS ok');
  return result.rows[0]?.ok === 1;
}

export async function ensureDb() {
  await ensureLocalDb();
}

export async function readDb() {
  await ensureDb();
  if (databaseMode() === 'postgres') return readMixedDb();
  return readLocalDb();
}

export async function writeDb(db) {
  if (databaseMode() === 'postgres') {
    await persistAllTables(db);
    await writeLocalOnlyTables(db);
    return;
  }
  await writeLocalDb(db);
}

export async function tx(mutator) {
  const db = await readDb();
  const result = await mutator(db);
  await writeDb(db);
  return result;
}

export async function getShopBySlug(slug) {
  const db = await readDb();
  return db.shops.find((shop) => shop.slug === slug) || null;
}

export async function getUserByEmail(email) {
  const db = await readDb();
  const normalized = String(email || '').toLowerCase();
  return db.users.find((user) => String(user.email || '').toLowerCase() === normalized) || null;
}

export async function getSubscriptionByCode(code) {
  const db = await readDb();
  return (db.subscriptions || []).find((subscription) => subscription.subscription_code === code) || null;
}

export async function getShopPricing(shopId) {
  const db = await readDb();
  return (db.shop_pricing || []).find((pricing) => pricing.shop_id === shopId) || null;
}

export async function getShopAddons(shopId) {
  const db = await readDb();
  return (db.shop_products || []).filter((product) => product.shop_id === shopId);
}

export async function getPickupSlots(shopId) {
  const db = await readDb();
  return (db.pickup_slots || []).filter((slot) => slot.shop_id === shopId);
}

async function ensureLocalDb() {
  try {
    await fs.access(DATA_PATH);
  } catch {
    const seed = await fs.readFile(SEED_PATH, 'utf8');
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, seed);
  }
}

async function readLocalDb() {
  await ensureLocalDb();
  return JSON.parse(await fs.readFile(DATA_PATH, 'utf8'));
}

async function writeLocalDb(db) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(db, null, 2));
}

async function readMixedDb() {
  // Phase 4 mixed persistence layer:
  // - PostgreSQL is the source for all operational tables (shops, users,
  //   subscriptions, pricing, paper sizes, addons, pickup slots, payment
  //   settings, orders, order files, order print settings, payments,
  //   notifications).
  // - Local JSON remains only for subscription_leads.
  // Keep this compatibility object shaped like the old JSON database so existing
  // routes and UI can stay stable while persistence is migrated safely by phase.
  const localDb = await readLocalDb();
  const [
    shops,
    users,
    subscriptions,
    shopPricing,
    paperSizes,
    addons,
    pickupSlots,
    paymentSettings,
    orders,
    orderFiles,
    printSettings,
    payments,
    notifications
  ] = await Promise.all([
    queryRows('SELECT * FROM shops ORDER BY created_at ASC, id ASC'),
    queryRows('SELECT * FROM users ORDER BY created_at ASC, id ASC'),
    queryRows('SELECT * FROM subscriptions ORDER BY created_at ASC, id ASC'),
    queryRows('SELECT * FROM shop_pricing ORDER BY created_at ASC, id ASC'),
    queryRows('SELECT * FROM shop_paper_sizes ORDER BY sort_order ASC, created_at ASC, id ASC'),
    queryRows('SELECT * FROM addons ORDER BY created_at DESC, id ASC'),
    queryRows('SELECT * FROM pickup_slots ORDER BY day_of_week ASC, start_time ASC, id ASC'),
    queryRows('SELECT * FROM shop_payment_settings ORDER BY created_at ASC, id ASC'),
    queryRows('SELECT * FROM orders ORDER BY created_at ASC, id ASC'),
    queryRows('SELECT * FROM order_files ORDER BY created_at ASC, id ASC'),
    queryRows('SELECT * FROM order_print_settings ORDER BY created_at ASC, id ASC'),
    queryRows('SELECT * FROM payments ORDER BY created_at ASC, id ASC'),
    queryRows('SELECT * FROM notifications ORDER BY created_at ASC, id ASC')
  ]);

  return {
    ...localDb,
    shops: normalizeRows(shops, ['minimum_order_amount']),
    users: normalizeRows(users),
    subscriptions: normalizeRows(subscriptions, ['amount']),
    shop_pricing: normalizeRows(shopPricing, ['a4_bw_price_per_page', 'a4_color_price_per_page']),
    shop_paper_sizes: normalizeRows(paperSizes, ['bw_price_per_page', 'color_price_per_page', 'sort_order']),
    shop_products: normalizeRows(addons, ['price']),
    pickup_slots: normalizeRows(pickupSlots, ['day_of_week', 'max_orders']),
    shop_payment_settings: normalizeRows(paymentSettings),
    orders: reconstructOrders(orders, orderFiles, printSettings),
    payments: normalizeRows(payments, ['amount']),
    notifications: normalizeRows(notifications)
  };
}

async function queryRows(sql, params = []) {
  const result = await query(sql, params);
  return result.rows;
}

function normalizeRows(rows, numericKeys = []) {
  const numericSet = new Set(numericKeys);
  return rows.map((row) => normalizeRow(row, numericSet));
}

function normalizeRow(row, numericSet) {
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, normalizeValue(key, value, numericSet)]));
}

function normalizeValue(key, value, numericSet) {
  if (value instanceof Date) return value.toISOString();
  if (numericSet.has(key)) return number(value);
  return value;
}

function reconstructOrders(orders, orderFiles, printSettings) {
  // Joins normalized PG rows from orders + order_files + order_print_settings
  // back into the combined flat shape that existing routes/views expect.
  // Also normalizes PostgreSQL Date objects to ISO strings so the rest of
  // the app (which expects strings) works without localeCompare crashes.
  const filesByOrder = {};
  for (const file of orderFiles || []) {
    (filesByOrder[file.order_id] ||= []).push(file);
  }
  const settingsByOrder = {};
  for (const s of printSettings || []) {
    settingsByOrder[s.order_id] = s;
  }

  return (orders || []).map((order) => {
    const files = filesByOrder[order.id] || [];
    const settings = settingsByOrder[order.id] || {};
    const firstFile = files[0] || {};

    // Normalize Date objects from PostgreSQL to ISO strings.
    // TIMESTAMPTZ columns arrive as JS Date; this avoids localeCompare crashes.
    const createdAt = order.created_at instanceof Date ? order.created_at.toISOString() : (order.created_at || nowIso());
    const updatedAt = order.updated_at instanceof Date ? order.updated_at.toISOString() : (order.updated_at || nowIso());
    // DATE columns arrive as midnight-UTC Date; .toISOString().slice(0,10)
    // yields the correct YYYY-MM-DD in UTC, avoiding timezone shifts.
    const pickupDate = order.pickup_date instanceof Date ? order.pickup_date.toISOString().slice(0, 10) : (order.pickup_date || '');

    return {
      ...order,
      created_at: createdAt,
      updated_at: updatedAt,
      pickup_date: pickupDate,
      files: files.map((f) => ({
        original_file_name: f.original_file_name,
        file_path: f.file_path,
        page_count: f.page_count
      })),
      file_path: firstFile.file_path || '',
      original_file_name: firstFile.original_file_name || '',
      page_count: files.reduce((sum, f) => sum + (f.page_count || 0), 0),
      paper_size_id: settings.paper_size_id || null,
      paper_size: settings.paper_size || 'A4',
      print_type: settings.print_type || 'bw',
      sides: settings.sides || 'single',
      copies: Number(settings.copies || 1),
      subtotal: Number(settings.subtotal || 0),
      product_total: Number(settings.product_total || 0),
      product_items: settings.product_items || [],
      file_delete_at: firstFile.delete_at ? new Date(firstFile.delete_at).toISOString() : null,
      file_deleted_at: firstFile.deleted_at ? new Date(firstFile.deleted_at).toISOString() : null
    };
  });
}

async function persistAllTables(db) {
  // Phase 4 persists all operational tables to PostgreSQL: tenant/shop settings
  // (Phase 3) plus orders, order files, print settings, payments, and
  // notifications (Phase 4). Cleanup state (file deleted_at) is included.
  await withPgTransaction(async (client) => {
    // Phase 3 — tenant/account/shop settings
    for (const shop of db.shops || []) await upsertShop(client, shop);
    for (const user of db.users || []) await upsertUser(client, user);
    for (const subscription of db.subscriptions || []) await upsertSubscription(client, subscription);
    for (const pricing of db.shop_pricing || []) await upsertPricing(client, pricing);
    for (const size of db.shop_paper_sizes || []) await upsertPaperSize(client, size);
    for (const product of db.shop_products || []) await upsertAddon(client, product);
    for (const slot of db.pickup_slots || []) await upsertPickupSlot(client, slot);
    for (const settings of db.shop_payment_settings || []) await upsertPaymentSettings(client, settings);
    // Phase 4 — orders, files, print settings, payments, notifications
    for (const order of db.orders || []) {
      await upsertOrder(client, order);
      await upsertOrderPrintSettings(client, order);
      await upsertOrderFiles(client, order);
    }
    for (const payment of db.payments || []) await upsertPayment(client, payment);
    for (const notification of db.notifications || []) await upsertNotification(client, notification);
  });
}

async function writeLocalOnlyTables(db) {
  const localDb = await readLocalDb();
  for (const key of LOCAL_ONLY_KEYS) {
    localDb[key] = db[key] || [];
  }
  await writeLocalDb(localDb);
}

async function upsertShop(client, shop) {
  await client.query(`
    INSERT INTO shops (id, name, slug, shop_code, logo_url, primary_color, description, address, google_maps_url, phone, email, operating_hours, minimum_order_amount, is_active, plan, subscription_status, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      slug = EXCLUDED.slug,
      shop_code = EXCLUDED.shop_code,
      logo_url = EXCLUDED.logo_url,
      primary_color = EXCLUDED.primary_color,
      description = EXCLUDED.description,
      address = EXCLUDED.address,
      google_maps_url = EXCLUDED.google_maps_url,
      phone = EXCLUDED.phone,
      email = EXCLUDED.email,
      operating_hours = EXCLUDED.operating_hours,
      minimum_order_amount = EXCLUDED.minimum_order_amount,
      is_active = EXCLUDED.is_active,
      plan = EXCLUDED.plan,
      subscription_status = EXCLUDED.subscription_status,
      updated_at = EXCLUDED.updated_at
  `, [shop.id, shop.name, shop.slug, shop.shop_code || null, shop.logo_url || '', shop.primary_color || '#004581', shop.description || '', shop.address || '', shop.google_maps_url || '', shop.phone || '', shop.email || '', shop.operating_hours || '', money(shop.minimum_order_amount), shop.is_active ?? true, shop.plan || 'pilot', shop.subscription_status || 'inactive', timestamp(shop.created_at), timestamp(shop.updated_at)]);
}

async function upsertUser(client, user) {
  await client.query(`
    INSERT INTO users (id, name, email, password_hash, password, role, shop_id, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      password_hash = COALESCE(EXCLUDED.password_hash, users.password_hash),
      password = COALESCE(EXCLUDED.password, users.password),
      role = EXCLUDED.role,
      shop_id = EXCLUDED.shop_id,
      updated_at = EXCLUDED.updated_at
  `, [user.id, user.name, user.email, user.password_hash || null, user.password || null, user.role, user.shop_id || null, timestamp(user.created_at), timestamp(user.updated_at)]);
}

async function upsertSubscription(client, subscription) {
  await client.query(`
    INSERT INTO subscriptions (id, subscription_code, shop_id, plan, plan_label, customer_name, email, phone, amount, payment_status, status, paid_at, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    ON CONFLICT (id) DO UPDATE SET
      subscription_code = EXCLUDED.subscription_code,
      shop_id = EXCLUDED.shop_id,
      plan = EXCLUDED.plan,
      plan_label = EXCLUDED.plan_label,
      customer_name = EXCLUDED.customer_name,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      amount = EXCLUDED.amount,
      payment_status = EXCLUDED.payment_status,
      status = EXCLUDED.status,
      paid_at = EXCLUDED.paid_at,
      updated_at = EXCLUDED.updated_at
  `, [subscription.id, subscription.subscription_code, subscription.shop_id || null, subscription.plan || 'annual', subscription.plan_label || '', subscription.customer_name || '', subscription.email || '', subscription.phone || '', money(subscription.amount), subscription.payment_status || 'pending', subscription.status || 'active', subscription.paid_at || null, timestamp(subscription.created_at), timestamp(subscription.updated_at)]);
}

async function upsertPricing(client, pricing) {
  await client.query(`
    INSERT INTO shop_pricing (id, shop_id, a4_bw_price_per_page, a4_color_price_per_page, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6)
    ON CONFLICT (id) DO UPDATE SET
      shop_id = EXCLUDED.shop_id,
      a4_bw_price_per_page = EXCLUDED.a4_bw_price_per_page,
      a4_color_price_per_page = EXCLUDED.a4_color_price_per_page,
      updated_at = EXCLUDED.updated_at
  `, [pricing.id, pricing.shop_id, money(pricing.a4_bw_price_per_page), money(pricing.a4_color_price_per_page), timestamp(pricing.created_at), timestamp(pricing.updated_at)]);
}

async function upsertPaperSize(client, size) {
  await client.query(`
    INSERT INTO shop_paper_sizes (id, shop_id, label, bw_price_per_page, color_price_per_page, is_active, sort_order, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (id) DO UPDATE SET
      shop_id = EXCLUDED.shop_id,
      label = EXCLUDED.label,
      bw_price_per_page = EXCLUDED.bw_price_per_page,
      color_price_per_page = EXCLUDED.color_price_per_page,
      is_active = EXCLUDED.is_active,
      sort_order = EXCLUDED.sort_order,
      updated_at = EXCLUDED.updated_at
  `, [size.id, size.shop_id, size.label, money(size.bw_price_per_page), money(size.color_price_per_page), size.is_active ?? true, number(size.sort_order), timestamp(size.created_at), timestamp(size.updated_at)]);
}

async function upsertAddon(client, product) {
  await client.query(`
    INSERT INTO addons (id, shop_id, name, description, price, is_active, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    ON CONFLICT (id) DO UPDATE SET
      shop_id = EXCLUDED.shop_id,
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      price = EXCLUDED.price,
      is_active = EXCLUDED.is_active,
      updated_at = EXCLUDED.updated_at
  `, [product.id, product.shop_id, product.name, product.description || '', money(product.price), product.is_active ?? true, timestamp(product.created_at), timestamp(product.updated_at)]);
}

async function upsertPickupSlot(client, slot) {
  await client.query(`
    INSERT INTO pickup_slots (id, shop_id, day_of_week, start_time, end_time, max_orders, is_active, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (id) DO UPDATE SET
      shop_id = EXCLUDED.shop_id,
      day_of_week = EXCLUDED.day_of_week,
      start_time = EXCLUDED.start_time,
      end_time = EXCLUDED.end_time,
      max_orders = EXCLUDED.max_orders,
      is_active = EXCLUDED.is_active,
      updated_at = EXCLUDED.updated_at
  `, [slot.id, slot.shop_id, number(slot.day_of_week), slot.start_time, slot.end_time, number(slot.max_orders), slot.is_active ?? true, timestamp(slot.created_at), timestamp(slot.updated_at)]);
}

async function upsertPaymentSettings(client, settings) {
  await client.query(`
    INSERT INTO shop_payment_settings (id, shop_id, gateway_type, api_key, collection_id, x_signature_key, is_enabled, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (id) DO UPDATE SET
      shop_id = EXCLUDED.shop_id,
      gateway_type = EXCLUDED.gateway_type,
      api_key = EXCLUDED.api_key,
      collection_id = EXCLUDED.collection_id,
      x_signature_key = EXCLUDED.x_signature_key,
      is_enabled = EXCLUDED.is_enabled,
      updated_at = EXCLUDED.updated_at
  `, [settings.id, settings.shop_id, settings.gateway_type || 'billplz_mock', settings.api_key || '', settings.collection_id || '', settings.x_signature_key || '', settings.is_enabled ?? true, timestamp(settings.created_at), timestamp(settings.updated_at)]);
}

async function upsertOrder(client, order) {
  await client.query(`
    INSERT INTO orders (id, shop_id, order_code, customer_name, customer_phone, customer_email, notes, payment_status, order_status, pickup_date, pickup_slot_id, total_amount, minimum_order_amount, payment_reference, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    ON CONFLICT (id) DO UPDATE SET
      shop_id = EXCLUDED.shop_id,
      order_code = EXCLUDED.order_code,
      customer_name = EXCLUDED.customer_name,
      customer_phone = EXCLUDED.customer_phone,
      customer_email = EXCLUDED.customer_email,
      notes = EXCLUDED.notes,
      payment_status = EXCLUDED.payment_status,
      order_status = EXCLUDED.order_status,
      pickup_date = EXCLUDED.pickup_date,
      pickup_slot_id = EXCLUDED.pickup_slot_id,
      total_amount = EXCLUDED.total_amount,
      minimum_order_amount = EXCLUDED.minimum_order_amount,
      payment_reference = EXCLUDED.payment_reference,
      updated_at = EXCLUDED.updated_at
  `, [order.id, order.shop_id, order.order_code, order.customer_name || '', order.customer_phone || '', order.customer_email || '', order.notes || '', order.payment_status || 'pending', order.order_status || 'Pending Payment', order.pickup_date || null, order.pickup_slot_id || null, money(order.total_amount), money(order.minimum_order_amount), order.payment_reference || null, timestamp(order.created_at), timestamp(order.updated_at)]);
}

async function upsertOrderPrintSettings(client, order) {
  await client.query(`
    INSERT INTO order_print_settings (id, order_id, paper_size_id, paper_size, print_type, sides, copies, subtotal, product_total, product_items, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    ON CONFLICT (order_id) DO UPDATE SET
      paper_size_id = EXCLUDED.paper_size_id,
      paper_size = EXCLUDED.paper_size,
      print_type = EXCLUDED.print_type,
      sides = EXCLUDED.sides,
      copies = EXCLUDED.copies,
      subtotal = EXCLUDED.subtotal,
      product_total = EXCLUDED.product_total,
      product_items = EXCLUDED.product_items,
      updated_at = EXCLUDED.updated_at
  `, [id('print_settings'), order.id, order.paper_size_id || null, order.paper_size || 'A4', order.print_type || 'bw', order.sides || 'single', number(order.copies || 1), money(order.subtotal), money(order.product_total), JSON.stringify(order.product_items || []), timestamp(order.created_at), timestamp(order.updated_at)]);
}

async function upsertOrderFiles(client, order) {
  // Collect files from the combined order object. Does NOT delete physical PDFs;
  // only replaces metadata rows in order_files.
  const files = order.files?.length > 0
    ? order.files
    : (order.file_path
        ? [{ original_file_name: order.original_file_name, file_path: order.file_path, page_count: order.page_count || 1 }]
        : []);
  if (!files.length) return;
  // Delete existing metadata rows for this order, then insert fresh.
  await client.query('DELETE FROM order_files WHERE order_id = $1', [order.id]);
  for (const file of files) {
    await client.query(`
      INSERT INTO order_files (id, order_id, original_file_name, file_path, page_count, delete_at, deleted_at, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `, [
      id('file'),
      order.id,
      file.original_file_name || 'document.pdf',
      file.file_path || '',
      number(file.page_count || 0),
      order.file_delete_at || null,
      order.file_deleted_at || null,
      timestamp(order.created_at)
    ]);
  }
}

async function upsertPayment(client, payment) {
  await client.query(`
    INSERT INTO payments (id, order_id, subscription_id, shop_id, gateway_type, gateway_reference, amount, status, paid_at, raw_response, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    ON CONFLICT (id) DO UPDATE SET
      order_id = EXCLUDED.order_id,
      subscription_id = EXCLUDED.subscription_id,
      shop_id = EXCLUDED.shop_id,
      gateway_type = EXCLUDED.gateway_type,
      gateway_reference = EXCLUDED.gateway_reference,
      amount = EXCLUDED.amount,
      status = EXCLUDED.status,
      paid_at = EXCLUDED.paid_at,
      raw_response = EXCLUDED.raw_response,
      updated_at = EXCLUDED.updated_at
  `, [payment.id, payment.order_id || null, payment.subscription_id || null, payment.shop_id || null, payment.gateway_type || 'billplz_mock', payment.gateway_reference, money(payment.amount), payment.status || 'pending', payment.paid_at || null, JSON.stringify(payment.raw_response || {}), timestamp(payment.created_at), timestamp(payment.updated_at)]);
}

async function upsertNotification(client, notification) {
  await client.query(`
    INSERT INTO notifications (id, shop_id, order_id, type, recipient, status, sent_at, created_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    ON CONFLICT (id) DO UPDATE SET
      shop_id = EXCLUDED.shop_id,
      order_id = EXCLUDED.order_id,
      type = EXCLUDED.type,
      recipient = EXCLUDED.recipient,
      status = EXCLUDED.status,
      sent_at = EXCLUDED.sent_at
  `, [notification.id, notification.shop_id || null, notification.order_id || null, notification.type || 'email', notification.recipient || '', notification.status || 'sent', notification.sent_at || null, timestamp(notification.created_at)]);
}

function timestamp(value) {
  return value || nowIso();
}

function money(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

function number(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

export function nowIso() {
  return new Date().toISOString();
}

export function id(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function timeValue(value) {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function sortByNewest(a, b, field = 'created_at') {
  return timeValue(b[field]) - timeValue(a[field]);
}

export function sortByOldest(a, b, field = 'created_at') {
  return timeValue(a[field]) - timeValue(b[field]);
}
