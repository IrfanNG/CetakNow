import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(__dirname, '../data/db.json');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required to migrate orders to PostgreSQL.');
  process.exit(1);
}

const poolOptions = { connectionString: process.env.DATABASE_URL };
if (process.env.PGSSLMODE === 'require') {
  poolOptions.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolOptions);

function timestamp(value) {
  return value || new Date().toISOString();
}

function money(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

function number(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

function id(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
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

async function upsertOrderFiles(client, order) {
  const files = order.files?.length > 0
    ? order.files
    : (order.file_path
        ? [{ original_file_name: order.original_file_name, file_path: order.file_path, page_count: order.page_count || 1 }]
        : []);
  if (!files.length) return;
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

async function migrate() {
  const raw = await fs.readFile(dataPath, 'utf8');
  const data = JSON.parse(raw);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Load all existing IDs to skip duplicates and validate FK references
    const [existingOrders, existingSubscriptions, existingPayments, existingNotifications] = await Promise.all([
      client.query('SELECT id FROM orders'),
      client.query('SELECT id FROM subscriptions'),
      client.query('SELECT id FROM payments'),
      client.query('SELECT id FROM notifications')
    ]);

    let existingOrderIds = new Set(existingOrders.rows.map((r) => r.id));
    const existingSubscriptionIds = new Set(existingSubscriptions.rows.map((r) => r.id));
    const existingPaymentIds = new Set(existingPayments.rows.map((r) => r.id));
    const existingNotificationIds = new Set(existingNotifications.rows.map((r) => r.id));

    let orderCount = 0;
    let orderFileCount = 0;
    let printSettingsCount = 0;
    let paymentCount = 0;
    let paymentSkippedCount = 0;
    let notificationCount = 0;
    let notificationSkippedCount = 0;

    // --- Migrate orders ---
    for (const order of data.orders || []) {
      if (existingOrderIds.has(order.id)) continue;
      await upsertOrder(client, order);
      orderCount++;
      await upsertOrderPrintSettings(client, order);
      printSettingsCount++;
      const files = order.files?.length > 0
        ? order.files
        : (order.file_path
            ? [{ original_file_name: order.original_file_name, file_path: order.file_path, page_count: order.page_count || 1 }]
            : []);
      if (files.length) {
        await upsertOrderFiles(client, order);
        orderFileCount++;
      }
    }

    // Re-query order IDs so newly inserted orders are visible for FK validation
    // on payments and notifications in this same transaction.
    const allOrders = await client.query('SELECT id FROM orders');
    existingOrderIds = new Set(allOrders.rows.map((r) => r.id));

    // --- Migrate payments ---
    for (const payment of data.payments || []) {
      if (existingPaymentIds.has(payment.id)) continue;

      // Validate that all referenced records exist in PostgreSQL before inserting.
      // If any FK target is missing, skip the payment with a clear warning.
      const invalidRefs = [];
      if (payment.order_id && !existingOrderIds.has(payment.order_id)) {
        invalidRefs.push(`order_id ${payment.order_id}`);
      }
      if (payment.subscription_id && !existingSubscriptionIds.has(payment.subscription_id)) {
        invalidRefs.push(`subscription_id ${payment.subscription_id}`);
      }

      if (invalidRefs.length) {
        console.warn(`Skipping payment ${payment.id} because ${invalidRefs.join(' and ')} ${invalidRefs.length === 1 ? 'does' : 'do'} not exist in PostgreSQL.`);
        paymentSkippedCount++;
        continue;
      }

      await upsertPayment(client, payment);
      paymentCount++;
    }

    // --- Migrate notifications ---
    for (const notification of data.notifications || []) {
      if (existingNotificationIds.has(notification.id)) continue;

      // Notifications have an FK to orders(id); skip if the referenced order
      // was not migrated.
      if (notification.order_id && !existingOrderIds.has(notification.order_id)) {
        console.warn(`Skipping notification ${notification.id} because order_id ${notification.order_id} does not exist in PostgreSQL.`);
        notificationSkippedCount++;
        continue;
      }

      await upsertNotification(client, notification);
      notificationCount++;
    }

    await client.query('COMMIT');
    console.log(`\nOrders migration completed. Summary:`);
    console.log(`  Orders:           ${orderCount} migrated`);
    console.log(`  Order files:      ${orderFileCount} migrated`);
    console.log(`  Print settings:   ${printSettingsCount} migrated`);
    console.log(`  Payments:         ${paymentCount} migrated, ${paymentSkippedCount} skipped`);
    console.log(`  Notifications:    ${notificationCount} migrated, ${notificationSkippedCount} skipped`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Orders migration failed.');
    console.error(error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

await migrate();
