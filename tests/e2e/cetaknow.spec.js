import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const pdfPath = path.resolve('tests/fixtures/one-page.pdf');
const textPath = path.resolve('tests/fixtures/not-a-pdf.txt');

async function resetDb() {
  await fs.copyFile('data/seed.json', 'data/db.json');
  await fs.rm('storage/pdfs', { recursive: true, force: true });
  await fs.mkdir('storage/pdfs', { recursive: true });
  await fs.writeFile('storage/pdfs/.gitkeep', '');
  await fs.rm('storage/mail.log', { force: true });
}

async function fillValidOrder(page, { copies = '5', printType = 'color', notes = 'test notes', date = '2030-01-07' } = {}) {
  await page.goto('/shop/qalamirma');
  await page.locator('input[name="pdf"]').setInputFiles(pdfPath);
  await page.selectOption('select[name="print_type"]', printType);
  await page.fill('input[name="copies"]', copies);
  await page.fill('input[name="pickup_date"]', date);
  await expect(page.locator('select[name="pickup_slot_id"]')).toContainText('09:00 - 10:00');
  await page.fill('input[name="customer_name"]', 'Muhammad Nur Irfan Bin Mohd Ariff');
  await page.fill('input[name="customer_phone"]', '0183823063');
  await page.fill('input[name="customer_email"]', 'muhdnurirfanmohdariff@gmail.com');
  await page.fill('textarea[name="notes"]', notes);
  await page.check('input[name="policy_agreed"]');
}

async function createPaidOrder(page, options = {}) {
  await fillValidOrder(page, options);
  await page.getByRole('button', { name: 'Proceed to payment' }).click();
  await expect(page).toHaveURL(/\/payment\/mock\/CN-QI-1001/);
  await expect(page.getByText('Pay RM')).toBeVisible();
  await page.getByRole('button', { name: 'Simulate successful payment' }).click();
  await expect(page).toHaveURL(/\/orders\/CN-QI-1001\/confirmation/);
  await expect(page.getByText('Your print order has been received.')).toBeVisible();
}


async function seedPaidOrders(count = 12) {
  const db = JSON.parse(await fs.readFile('data/db.json', 'utf8'));
  db.orders = Array.from({ length: count }, (_, i) => {
    const number = i + 1;
    const code = `CN-QI-${String(1000 + number).padStart(4, '0')}`;
    return {
      id: `order_${number}`,
      shop_id: 'shop_qalamirma',
      order_code: code,
      customer_name: `Customer ${number}`,
      customer_phone: `601000000${String(number).padStart(2, '0')}`,
      customer_email: `customer${number}@example.test`,
      original_file_name: 'one-page.pdf',
      file_path: 'storage/pdfs/.gitkeep',
      page_count: 1,
      print_type: 'bw',
      sides: 'single',
      copies: 5,
      total_amount: 5,
      payment_status: 'paid',
      order_status: number % 2 ? 'Paid / New Order' : 'Ready for Pickup',
      pickup_date: '2030-01-07',
      pickup_slot_id: 'slot_qi_d1_1',
      notes: '',
      file_delete_at: '2030-01-14T00:00:00.000Z',
      created_at: `2026-05-${String(number).padStart(2, '0')}T00:00:00.000Z`,
      updated_at: `2026-05-${String(number).padStart(2, '0')}T00:00:00.000Z`
    };
  });
  await fs.writeFile('data/db.json', JSON.stringify(db, null, 2));
}


async function seedRevenueOrders() {
  const db = JSON.parse(await fs.readFile('data/db.json', 'utf8'));
  db.orders = [
    { id: 'order_may_17', shop_id: 'shop_qalamirma', order_code: 'CN-QI-2001', customer_name: 'May Customer', customer_phone: '60111111111', customer_email: 'may@example.test', original_file_name: 'one-page.pdf', file_path: 'storage/pdfs/.gitkeep', page_count: 1, print_type: 'color', sides: 'single', copies: 10, total_amount: 10, payment_status: 'paid', order_status: 'Paid / New Order', pickup_date: '2030-01-07', pickup_slot_id: 'slot_qi_d1_1', notes: '', file_delete_at: '2030-01-14T00:00:00.000Z', created_at: '2026-05-17T10:00:00.000Z', updated_at: '2026-05-17T10:00:00.000Z' },
    { id: 'order_may_18', shop_id: 'shop_qalamirma', order_code: 'CN-QI-2002', customer_name: 'Month Customer', customer_phone: '60222222222', customer_email: 'month@example.test', original_file_name: 'one-page.pdf', file_path: 'storage/pdfs/.gitkeep', page_count: 1, print_type: 'bw', sides: 'single', copies: 25, total_amount: 5, payment_status: 'paid', order_status: 'Paid / New Order', pickup_date: '2030-01-07', pickup_slot_id: 'slot_qi_d1_1', notes: '', file_delete_at: '2030-01-14T00:00:00.000Z', created_at: '2026-05-18T10:00:00.000Z', updated_at: '2026-05-18T10:00:00.000Z' },
    { id: 'order_april', shop_id: 'shop_qalamirma', order_code: 'CN-QI-1999', customer_name: 'April Customer', customer_phone: '60333333333', customer_email: 'april@example.test', original_file_name: 'one-page.pdf', file_path: 'storage/pdfs/.gitkeep', page_count: 1, print_type: 'color', sides: 'single', copies: 20, total_amount: 20, payment_status: 'paid', order_status: 'Paid / New Order', pickup_date: '2030-01-07', pickup_slot_id: 'slot_qi_d1_1', notes: '', file_delete_at: '2030-01-14T00:00:00.000Z', created_at: '2026-04-30T10:00:00.000Z', updated_at: '2026-04-30T10:00:00.000Z' }
  ];
  db.payments = [
    { id: 'payment_may_17', order_id: 'order_may_17', shop_id: 'shop_qalamirma', gateway_type: 'billplz_mock', gateway_reference: 'MOCK-CN-QI-2001', amount: 10, status: 'paid', paid_at: '2026-05-17T10:00:00.000Z', raw_response: {}, created_at: '2026-05-17T10:00:00.000Z', updated_at: '2026-05-17T10:00:00.000Z' },
    { id: 'payment_may_18', order_id: 'order_may_18', shop_id: 'shop_qalamirma', gateway_type: 'billplz_mock', gateway_reference: 'MOCK-CN-QI-2002', amount: 5, status: 'paid', paid_at: '2026-05-18T10:00:00.000Z', raw_response: {}, created_at: '2026-05-18T10:00:00.000Z', updated_at: '2026-05-18T10:00:00.000Z' },
    { id: 'payment_april', order_id: 'order_april', shop_id: 'shop_qalamirma', gateway_type: 'billplz_mock', gateway_reference: 'MOCK-CN-QI-1999', amount: 20, status: 'paid', paid_at: '2026-04-30T10:00:00.000Z', raw_response: {}, created_at: '2026-04-30T10:00:00.000Z', updated_at: '2026-04-30T10:00:00.000Z' }
  ];
  await fs.writeFile('data/db.json', JSON.stringify(db, null, 2));
}


async function seedRevenuePaginationOrders(count = 12) {
  const db = JSON.parse(await fs.readFile('data/db.json', 'utf8'));
  db.orders = Array.from({ length: count }, (_, i) => {
    const number = i + 1;
    return { id: `revenue_order_${number}`, shop_id: 'shop_qalamirma', order_code: `CN-QI-${3000 + number}`, customer_name: `Revenue Customer ${number}`, customer_phone: `6012345${String(number).padStart(4, '0')}`, customer_email: `revenue${number}@example.test`, original_file_name: 'one-page.pdf', file_path: 'storage/pdfs/.gitkeep', page_count: 1, print_type: 'color', sides: 'single', copies: 10, total_amount: number, payment_status: 'paid', order_status: 'Paid / New Order', pickup_date: '2030-01-07', pickup_slot_id: 'slot_qi_d1_1', notes: '', file_delete_at: '2030-01-14T00:00:00.000Z', created_at: `2026-05-${String(number).padStart(2, '0')}T10:00:00.000Z`, updated_at: `2026-05-${String(number).padStart(2, '0')}T10:00:00.000Z` };
  });
  db.payments = db.orders.map((order, i) => {
    const number = i + 1;
    return { id: `revenue_payment_${number}`, order_id: order.id, shop_id: 'shop_qalamirma', gateway_type: 'billplz_mock', gateway_reference: `MOCK-${order.order_code}`, amount: number, status: 'paid', paid_at: `2026-05-${String(number).padStart(2, '0')}T10:00:00.000Z`, raw_response: {}, created_at: `2026-05-${String(number).padStart(2, '0')}T10:00:00.000Z`, updated_at: `2026-05-${String(number).padStart(2, '0')}T10:00:00.000Z` };
  });
  await fs.writeFile('data/db.json', JSON.stringify(db, null, 2));
}

async function login(page, email) {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', 'password');
  await page.getByRole('button', { name: 'Log Masuk' }).click();
  await expect(page).toHaveURL('/admin');
}

test.beforeEach(async () => {
  await resetDb();
});


test('login page matches CetakNow theme and routes new owners to pricing', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Log Masuk Admin' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Log Masuk' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Belum ada akaun? Langgan' })).toHaveAttribute('href', '/#pricing');
});

test('landing page explains SaaS and routes CTAs to pricing', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Tempahan Print Online/ })).toBeVisible();
  await expect(page.locator('#pricing').getByText('Bayaran online')).toBeVisible();
  await expect(page.getByText('RM49/ bulan')).toBeVisible();
  await expect(page.getByText('Paid Orders Only')).toBeVisible();
  await expect(page.locator('.hero-mini-links').getByText('Upload PDF')).toBeVisible();
  await expect(page.getByText('Dashboard Staff:')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Setup Page Sendiri' })).toBeVisible();
  await expect(page.getByText('owner setup sendiri nama kedai')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Auto Dapat Link Kedai' })).toBeVisible();

  await page.getByRole('link', { name: 'Daftar', exact: true }).click();
  await expect(page.locator('#pricing')).toBeInViewport();

  await page.getByRole('link', { name: 'Daftar Sekarang' }).click();
  await expect(page.locator('#pricing')).toBeInViewport();

  await expect(page.getByRole('heading', { name: 'Sedia susun order print kedai anda?' })).toBeVisible();
  await expect(page.locator('.footer-trust').getByText('Bayaran online')).toBeVisible();
  await expect(page.locator('.footer-trust').getByText('Fail dipadam automatik')).toBeVisible();
  await expect(page.locator('.footer-trust').getByText('Dashboard order')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Log Masuk' })).toHaveAttribute('href', '/login');
});


test('shop owner can subscribe and pay from pricing modal', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Pilih Tahunan' }).click();
  await expect(page.locator('#subscription-checkout')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.getByText('Pelan Tahunan').last()).toBeVisible();
  await expect(page.getByText('RM499').last()).toBeVisible();

  await page.fill('input[name="email"]', 'owner@studentprint.test');
  await page.fill('input[name="phone"]', '60123450000');
  await page.getByRole('button', { name: 'Teruskan Pembayaran' }).click();
  await expect(page).toHaveURL(/\/payment\/subscription\/mock\/CN-SUB-1001/);
  await expect(page.getByText('Pay RM499.00')).toBeVisible();

  await page.getByRole('button', { name: 'Simulate successful payment' }).click();
  await expect(page).toHaveURL(/\/subscriptions\/CN-SUB-1001\/confirmation/);
  await expect(page.getByText('Sekarang setup page kedai anda.')).toBeVisible();
  await page.fill('input[name="shop_name"]', 'Student Print Test');
  await expect(page.locator('input[name="slug"]')).toHaveValue('student-print-test');
  await expect(page.locator('input[name="operating_hours"]')).toHaveValue('Mon-Sat, 9:00 AM - 9:00 PM');
  await expect(page.locator('input[name="a4_bw_price_per_page"]')).toHaveCount(0);
  await expect(page.locator('input[name="a4_color_price_per_page"]')).toHaveCount(0);
  await expect(page.locator('input[name="minimum_order_amount"]')).toHaveCount(0);
  await page.fill('textarea[name="address"]', 'Kawasan kampus test');
  await expect(page.locator('input[type="url"][name="google_maps_url"]')).toHaveCount(1);
  await page.fill('input[name="google_maps_url"]', 'https://maps.google.com/?q=student+print+test');
  await expect(page.getByText('Email login:')).toBeVisible();
  await page.fill('input[name="password"]', 'student123');
  await page.fill('input[name="password_confirm"]', 'student123');
  await page.getByRole('button', { name: 'Jana Link Kedai' }).click();
  await expect(page).toHaveURL(/\/subscriptions\/CN-SUB-1001\/confirmation/);
  await expect(page.getByText('Link CetakNow kedai anda sudah dijana.')).toBeVisible();
  await expect(page.getByRole('link', { name: '/shop/student-print-test' })).toHaveAttribute('href', '/shop/student-print-test');
  await page.goto('/shop/student-print-test');
  await expect(page.getByRole('link', { name: 'Maps' })).toHaveAttribute('href', 'https://maps.google.com/?q=student+print+test');
  await expect(page.getByRole('heading', { name: 'Student Print Test Online Print Order' })).toBeVisible();
  await expect(page.getByText('A4 B/W: RM0.20 / page')).toBeVisible();

  await page.goto('/login');
  await page.fill('input[name="email"]', 'owner@studentprint.test');
  await page.fill('input[name="password"]', 'student123');
  await page.getByRole('button', { name: 'Log Masuk' }).click();
  await expect(page.getByRole('heading', { name: 'Ringkasan' })).toBeVisible();
  await expect(page.getByText('Student Print Test Dashboard')).toBeVisible();
});

test('public shop page renders branding, pricing, and mobile-safe form basics', async ({ page }) => {
  await page.goto('/shop/qalamirma');
  await expect(page.getByRole('heading', { name: 'Qalam Irma Online Print Order' })).toBeVisible();
  await expect(page.getByText('A4 B/W: RM0.20 / page')).toBeVisible();
  await expect(page.getByText('A4 Color: RM1.00 / page')).toBeVisible();
  await expect(page.getByText('Minimum online order: RM5.00')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Maps' })).toHaveAttribute('href', /maps.google.com/);
  await page.setViewportSize({ width: 390, height: 900 });
  await expect(page.getByRole('button', { name: 'Proceed to payment' })).toBeVisible();
});

test('pickup slot dropdown only shows slots for selected date and handles closed Sunday', async ({ page }) => {
  await page.goto('/shop/qalamirma');
  await page.fill('input[name="pickup_date"]', '2030-01-07'); // Monday
  await expect(page.locator('select[name="pickup_slot_id"]')).toContainText('09:00 - 10:00');
  await expect(page.locator('select[name="pickup_slot_id"]')).not.toContainText('Tue');

  await page.fill('input[name="pickup_date"]', '2030-01-13'); // Sunday
  await expect(page.locator('select[name="pickup_slot_id"]')).toContainText('No pickup slots for this date');
  await expect(page.locator('select[name="pickup_slot_id"]')).toBeDisabled();
});

test('below minimum order shows popup on same shop page', async ({ page }) => {
  await fillValidOrder(page, { copies: '1', printType: 'bw', notes: 'below minimum' });
  await page.getByRole('button', { name: 'Proceed to payment' }).click();
  await expect(page).toHaveURL('/shop/qalamirma/orders');
  await expect(page.getByRole('heading', { name: 'Cannot proceed' })).toBeVisible();
  await expect(page.getByText('Minimum online order ialah RM5.00')).toBeVisible();
});

test('invalid file is rejected with customer-friendly popup', async ({ page }) => {
  await page.goto('/shop/qalamirma');
  await page.locator('input[name="pdf"]').setInputFiles(textPath);
  await page.selectOption('select[name="print_type"]', 'color');
  await page.fill('input[name="copies"]', '10');
  await page.fill('input[name="pickup_date"]', '2030-01-07');
  await page.fill('input[name="customer_name"]', 'Test User');
  await page.fill('input[name="customer_phone"]', '60111111111');
  await page.check('input[name="policy_agreed"]');
  await page.getByRole('button', { name: 'Proceed to payment' }).click();
  await expect(page.getByRole('heading', { name: 'Cannot proceed' })).toBeVisible();
  await expect(page.getByText('PDF file required')).toBeVisible();
});

test('happy path: customer pays, confirmation shown, shop admin sees order with notes and downloads PDF', async ({ page }) => {
  await createPaidOrder(page, { copies: '5', printType: 'color', notes: 'print clearly' });
  await expect(page.getByText('Order ID: CN-QI-1001')).toBeVisible();
  await expect(page.getByText('Total: RM5.00')).toBeVisible();

  await login(page, 'admin@qalamirma.local');
  await expect(page.getByText('Qalam Irma Dashboard')).toBeVisible();
  await expect(page.getByRole('link', { name: 'CN-QI-1001' })).toBeVisible();
  await page.getByRole('link', { name: 'CN-QI-1001' }).click();
  await expect(page.getByRole('heading', { name: 'CN-QI-1001' })).toBeVisible();
  await expect(page.getByText('Pages: 1')).toBeVisible();
  await expect(page.getByText('Type: color')).toBeVisible();
  await expect(page.getByText('Copies: 5')).toBeVisible();
  await expect(page.getByText('Notes: print clearly')).toBeVisible();

  const download = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download PDF' }).click();
  expect((await download).suggestedFilename()).toContain('one-page.pdf');
});

test('shop admin sidebar opens Langganan page with plan and public shop link', async ({ page }) => {
  await login(page, 'admin@qalamirma.local');
  await expect(page.getByRole('link', { name: /Langganan/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Link Kedai/ })).toHaveCount(0);

  await page.getByRole('link', { name: /Langganan/ }).click();
  await expect(page).toHaveURL('/admin/subscription');
  await expect(page.getByRole('heading', { name: 'Langganan' })).toBeVisible();
  await expect(page.getByText('Pilot')).toBeVisible();
  await expect(page.getByRole('link', { name: '/shop/qalamirma' })).toHaveAttribute('href', '/shop/qalamirma');
  await expect(page.getByRole('link', { name: 'Buka Link Kedai' })).toHaveAttribute('href', '/shop/qalamirma');
});

test('shop admin can update order status lifecycle', async ({ page }) => {
  await createPaidOrder(page);
  await login(page, 'admin@qalamirma.local');
  await page.getByRole('link', { name: 'CN-QI-1001' }).click();

  for (const status of ['Printing', 'Ready for Pickup', 'Completed', 'File Problem', 'Cancelled']) {
    await page.selectOption('select[name="order_status"]', status);
    await page.getByRole('button', { name: 'Update status' }).click();
    await expect(page).toHaveURL('/admin/orders?updated=1');
    await expect(page.getByText('Status order berjaya dikemaskini.')).toBeVisible();
    await expect(page.locator('tbody').getByText(status)).toBeVisible();
    await page.getByRole('link', { name: 'Urus' }).click();
  }
});

test('order management paginates newest orders first', async ({ page }) => {
  await seedPaidOrders(12);
  await login(page, 'admin@qalamirma.local');
  await page.goto('/admin/orders');
  await expect(page.locator('tbody .admin-link').first()).toHaveText('CN-QI-1012');
  await expect(page.getByRole('link', { name: 'CN-QI-1001' })).toHaveCount(0);
  await expect(page.getByText('Page 1 / 2')).toBeVisible();
  await page.getByRole('link', { name: 'Seterusnya' }).click();
  await expect(page).toHaveURL('/admin/orders?page=2');
  await expect(page.locator('tbody .admin-link').first()).toHaveText('CN-QI-1002');
  await expect(page.getByRole('link', { name: 'CN-QI-1001' })).toBeVisible();
});

test('shop admin can monitor paid order revenue', async ({ page }) => {
  await createPaidOrder(page, { copies: '10', printType: 'color' });
  await login(page, 'admin@qalamirma.local');
  await page.goto('/admin/revenue');
  await expect(page.getByRole('heading', { name: 'Ringkasan Hasil' })).toBeVisible();
  await expect(page.getByText('Hasil Tarikh Ini')).toBeVisible();
  await expect(page.getByText('RM10.00')).toBeVisible();
  await expect(page.getByText('CN-QI-1001')).toBeVisible();
});

test('shop admin can filter sales by selected date', async ({ page }) => {
  await seedRevenueOrders();
  await login(page, 'admin@qalamirma.local');
  await page.goto('/admin/revenue?date=2026-05-17');
  await expect(page.locator('input[name="date"]')).toHaveValue('2026-05-17');
  await expect(page.getByRole('button', { name: 'Semak Tarikh' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Hari Ini' })).toHaveAttribute('href', '/admin/revenue');
  await expect(page.getByText('Paparan berdasarkan tarikh: 17/05/2026')).toBeVisible();
  await expect(page.getByText('Hasil Tarikh Ini')).toBeVisible();
  await expect(page.getByText('RM10.00').first()).toBeVisible();
  await expect(page.getByText('RM15.00')).toBeVisible();
  await expect(page.getByText('RM35.00')).toBeVisible();
  await expect(page.getByText('CN-QI-2001')).toBeVisible();
  await expect(page.getByText('CN-QI-2002')).toBeVisible();
  await expect(page.getByText('CN-QI-1999')).toHaveCount(0);
});

test('revenue table paginates selected month transactions', async ({ page }) => {
  await seedRevenuePaginationOrders(12);
  await login(page, 'admin@qalamirma.local');
  await page.goto('/admin/revenue?date=2026-05-12');
  await expect(page.getByText('Page 1 / 2')).toBeVisible();
  await expect(page.getByText('CN-QI-3012')).toBeVisible();
  await expect(page.getByText('CN-QI-3001')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Seterusnya' })).toHaveAttribute('href', '/admin/revenue?date=2026-05-12&page=2');
  await page.getByRole('link', { name: 'Seterusnya' }).click();
  await expect(page).toHaveURL('/admin/revenue?date=2026-05-12&page=2');
  await expect(page.getByText('Page 2 / 2')).toBeVisible();
  await expect(page.getByText('CN-QI-3001')).toBeVisible();
});

test('super admin can monitor paid subscription revenue', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Pilih Tahunan' }).click();
  await page.fill('input[name="email"]', 'owner2@studentprint.test');
  await page.fill('input[name="phone"]', '60123459999');
  await page.getByRole('button', { name: 'Teruskan Pembayaran' }).click();
  await page.getByRole('button', { name: 'Simulate successful payment' }).click();
  await login(page, 'owner@cetaknow.local');
  await page.goto('/admin/revenue');
  await expect(page.getByRole('heading', { name: 'Ringkasan Hasil' })).toBeVisible();
  await expect(page.getByText('Langganan Berbayar')).toBeVisible();
  await expect(page.getByText('RM499.00')).toBeVisible();
  await expect(page.getByText('CN-SUB-1001')).toBeVisible();
});

test('super admin sees SaaS metrics and Qalam Irma tenant', async ({ page }) => {
  await createPaidOrder(page);
  await login(page, 'owner@cetaknow.local');
  await expect(page.getByText('CetakNow Super Admin')).toBeVisible();
  await expect(page.getByText('Qalam Irma')).toBeVisible();
  await expect(page.getByText('pilot_free')).toBeVisible();
  await expect(page.getByText('Jumlah Langganan')).toBeVisible();
});

test('paid order writes email notification log only after payment', async ({ page }) => {
  await fillValidOrder(page, { copies: '5', printType: 'color' });
  await page.getByRole('button', { name: 'Proceed to payment' }).click();
  await expect(fs.readFile('storage/mail.log', 'utf8')).rejects.toThrow();

  await page.getByRole('button', { name: 'Simulate successful payment' }).click();
  const log = await fs.readFile('storage/mail.log', 'utf8');
  expect(log).toContain('Subject: New Paid Print Order - CN-QI-1001');
  expect(log).toContain('Customer Name: Muhammad Nur Irfan Bin Mohd Ariff');
});

test('expired uploaded file cleanup removes PDF but keeps order record', async ({ page }) => {
  await createPaidOrder(page);
  const db = JSON.parse(await fs.readFile('data/db.json', 'utf8'));
  db.orders[0].file_delete_at = '2000-01-01T00:00:00.000Z';
  await fs.writeFile('data/db.json', JSON.stringify(db, null, 2));

  await execFileAsync('node', ['src/cleanup.js']);
  const cleaned = JSON.parse(await fs.readFile('data/db.json', 'utf8'));
  expect(cleaned.orders[0].file_deleted_at).toBeTruthy();

  await login(page, 'admin@qalamirma.local');
  await page.getByRole('link', { name: 'CN-QI-1001' }).click();
  await page.getByRole('link', { name: 'Download PDF' }).click();
  await expect(page.getByText('File deleted')).toBeVisible();
});

test('unknown shop and invalid admin order return not found/unavailable safely', async ({ page }) => {
  await page.goto('/shop/unknown');
  await expect(page.getByText('Shop unavailable')).toBeVisible();
  await login(page, 'admin@qalamirma.local');
  await page.goto('/admin/orders/not-real');
  await expect(page.getByText('Not found')).toBeVisible();
});
