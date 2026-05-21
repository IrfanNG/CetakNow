import fs from 'node:fs/promises';
import path from 'node:path';
import pg from 'pg';

const { Pool } = pg;

const DATA_PATH = path.resolve('data/db.json');
const SEED_PATH = path.resolve('data/seed.json');

const LOCAL_ONLY_KEYS = ['orders', 'payments', 'notifications', 'subscription_leads'];

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
    await persistPhase3Tables(db);
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
  // Temporary Phase 3 mixed persistence layer:
  // - PostgreSQL is the source for tenant/account/shop settings tables.
  // - Local JSON remains the source for orders, files, payments, notifications,
  //   and cleanup state until Phase 4 migrates those areas.
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
    paymentSettings
  ] = await Promise.all([
    queryRows('SELECT * FROM shops ORDER BY created_at ASC, id ASC'),
    queryRows('SELECT * FROM users ORDER BY created_at ASC, id ASC'),
    queryRows('SELECT * FROM subscriptions ORDER BY created_at ASC, id ASC'),
    queryRows('SELECT * FROM shop_pricing ORDER BY created_at ASC, id ASC'),
    queryRows('SELECT * FROM shop_paper_sizes ORDER BY sort_order ASC, created_at ASC, id ASC'),
    queryRows('SELECT * FROM addons ORDER BY created_at DESC, id ASC'),
    queryRows('SELECT * FROM pickup_slots ORDER BY day_of_week ASC, start_time ASC, id ASC'),
    queryRows('SELECT * FROM shop_payment_settings ORDER BY created_at ASC, id ASC')
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
    shop_payment_settings: normalizeRows(paymentSettings)
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

async function persistPhase3Tables(db) {
  // Phase 3 persists only tenant/account/shop settings tables. Do not persist
  // orders, order files, order print settings, payments, notifications, or
  // cleanup state here; those remain local JSON until Phase 4.
  await withPgTransaction(async (client) => {
    for (const shop of db.shops || []) await upsertShop(client, shop);
    for (const user of db.users || []) await upsertUser(client, user);
    for (const subscription of db.subscriptions || []) await upsertSubscription(client, subscription);
    for (const pricing of db.shop_pricing || []) await upsertPricing(client, pricing);
    for (const size of db.shop_paper_sizes || []) await upsertPaperSize(client, size);
    for (const product of db.shop_products || []) await upsertAddon(client, product);
    for (const slot of db.pickup_slots || []) await upsertPickupSlot(client, slot);
    for (const settings of db.shop_payment_settings || []) await upsertPaymentSettings(client, settings);
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
