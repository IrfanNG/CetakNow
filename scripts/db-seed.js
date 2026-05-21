import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.resolve(__dirname, '../data/seed.json');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required to seed the PostgreSQL database.');
  process.exit(1);
}

const poolOptions = { connectionString: process.env.DATABASE_URL };
if (process.env.PGSSLMODE === 'require') {
  poolOptions.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolOptions);

const DEFAULT_PASSWORD_HASH = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8CUU54J4NSpzQKyljgd8KCO6CLH.VO';

function timestamp(value) {
  return value || new Date().toISOString();
}

async function upsertShop(client, shop) {
  await client.query(`
    INSERT INTO shops (id, name, slug, shop_code, logo_url, primary_color, description, address, google_maps_url, phone, email, operating_hours, minimum_order_amount, is_active, plan, subscription_status, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
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
  `, [shop.id, shop.name, shop.slug, shop.shop_code, shop.logo_url || '', shop.primary_color || '#004581', shop.description || '', shop.address || '', shop.google_maps_url || '', shop.phone || '', shop.email || '', shop.operating_hours || '', shop.minimum_order_amount || 0, shop.is_active ?? true, shop.plan || 'pilot', shop.subscription_status || 'pilot_free', timestamp(shop.created_at), timestamp(shop.updated_at)]);
}

async function upsertUser(client, user) {
  await client.query(`
    INSERT INTO users (id, name, email, password_hash, password, role, shop_id, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      role = EXCLUDED.role,
      shop_id = EXCLUDED.shop_id,
      updated_at = EXCLUDED.updated_at
  `, [user.id, user.name, user.email, user.password_hash || DEFAULT_PASSWORD_HASH, user.password || null, user.role, user.shop_id || null, timestamp(user.created_at), timestamp(user.updated_at)]);
}

async function upsertSubscription(client, subscription) {
  await client.query(`
    INSERT INTO subscriptions (id, subscription_code, shop_id, plan, plan_label, customer_name, email, phone, amount, payment_status, status, paid_at, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    ON CONFLICT (subscription_code) DO UPDATE SET
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
  `, [subscription.id, subscription.subscription_code, subscription.shop_id || null, subscription.plan || 'annual', subscription.plan_label || 'Pelan Tahunan', subscription.customer_name || '', subscription.email, subscription.phone || '', subscription.amount || 0, subscription.payment_status || 'paid', subscription.status || 'active', subscription.paid_at || null, timestamp(subscription.created_at), timestamp(subscription.updated_at)]);
}

async function upsertPricing(client, pricing) {
  await client.query(`
    INSERT INTO shop_pricing (id, shop_id, a4_bw_price_per_page, a4_color_price_per_page, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6)
    ON CONFLICT (shop_id) DO UPDATE SET
      a4_bw_price_per_page = EXCLUDED.a4_bw_price_per_page,
      a4_color_price_per_page = EXCLUDED.a4_color_price_per_page,
      updated_at = EXCLUDED.updated_at
  `, [pricing.id, pricing.shop_id, pricing.a4_bw_price_per_page || 0, pricing.a4_color_price_per_page || 0, timestamp(pricing.created_at), timestamp(pricing.updated_at)]);
}

async function upsertPaperSize(client, size) {
  await client.query(`
    INSERT INTO shop_paper_sizes (id, shop_id, label, bw_price_per_page, color_price_per_page, is_active, sort_order, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (shop_id, label) DO UPDATE SET
      bw_price_per_page = EXCLUDED.bw_price_per_page,
      color_price_per_page = EXCLUDED.color_price_per_page,
      is_active = EXCLUDED.is_active,
      sort_order = EXCLUDED.sort_order,
      updated_at = EXCLUDED.updated_at
  `, [size.id, size.shop_id, size.label, size.bw_price_per_page || 0, size.color_price_per_page || 0, size.is_active ?? true, size.sort_order || 0, timestamp(size.created_at), timestamp(size.updated_at)]);
}

async function upsertAddon(client, addon) {
  await client.query(`
    INSERT INTO addons (id, shop_id, name, description, price, is_active, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    ON CONFLICT (shop_id, name) DO UPDATE SET
      description = EXCLUDED.description,
      price = EXCLUDED.price,
      is_active = EXCLUDED.is_active,
      updated_at = EXCLUDED.updated_at
  `, [addon.id, addon.shop_id, addon.name, addon.description || '', addon.price || 0, addon.is_active ?? true, timestamp(addon.created_at), timestamp(addon.updated_at)]);
}

async function upsertPickupSlot(client, slot) {
  await client.query(`
    INSERT INTO pickup_slots (id, shop_id, day_of_week, start_time, end_time, max_orders, is_active, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (shop_id, day_of_week, start_time, end_time) DO UPDATE SET
      max_orders = EXCLUDED.max_orders,
      is_active = EXCLUDED.is_active,
      updated_at = EXCLUDED.updated_at
  `, [slot.id, slot.shop_id, slot.day_of_week, slot.start_time, slot.end_time, slot.max_orders || 0, slot.is_active ?? true, timestamp(slot.created_at), timestamp(slot.updated_at)]);
}

async function upsertPaymentSettings(client, settings) {
  await client.query(`
    INSERT INTO shop_payment_settings (id, shop_id, gateway_type, api_key, collection_id, x_signature_key, is_enabled, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (shop_id) DO UPDATE SET
      gateway_type = EXCLUDED.gateway_type,
      api_key = EXCLUDED.api_key,
      collection_id = EXCLUDED.collection_id,
      x_signature_key = EXCLUDED.x_signature_key,
      is_enabled = EXCLUDED.is_enabled,
      updated_at = EXCLUDED.updated_at
  `, [settings.id, settings.shop_id, settings.gateway_type || 'billplz_mock', settings.api_key || '', settings.collection_id || '', settings.x_signature_key || '', settings.is_enabled ?? true, timestamp(settings.created_at), timestamp(settings.updated_at)]);
}

async function seed() {
  const raw = await fs.readFile(seedPath, 'utf8');
  const data = JSON.parse(raw);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const shop of data.shops || []) await upsertShop(client, shop);
    for (const user of data.users || []) await upsertUser(client, user);

    const subscriptions = data.subscriptions?.length ? data.subscriptions : [{
      id: 'sub_qalamirma_pilot',
      subscription_code: 'SUB-QI-PILOT',
      shop_id: 'shop_qalamirma',
      plan: 'pilot',
      plan_label: 'CetakNow Pilot',
      customer_name: 'Qalam Irma',
      email: 'admin@qalamirma.local',
      phone: '60123456789',
      amount: 0,
      payment_status: 'paid',
      status: 'active',
      paid_at: '2026-05-16T00:00:00.000Z',
      created_at: '2026-05-16T00:00:00.000Z',
      updated_at: '2026-05-16T00:00:00.000Z'
    }];

    for (const subscription of subscriptions) await upsertSubscription(client, subscription);
    for (const pricing of data.shop_pricing || []) await upsertPricing(client, pricing);
    for (const size of data.shop_paper_sizes || []) await upsertPaperSize(client, size);
    for (const addon of data.shop_products || []) await upsertAddon(client, addon);
    for (const slot of data.pickup_slots || []) await upsertPickupSlot(client, slot);
    for (const settings of data.shop_payment_settings || []) await upsertPaymentSettings(client, settings);

    await client.query('COMMIT');
    console.log('Database seed completed.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database seed failed.');
    console.error(error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

await seed();
