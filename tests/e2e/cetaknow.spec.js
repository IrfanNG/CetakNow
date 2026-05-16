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

async function login(page, email) {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', 'password');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/admin');
}

test.beforeEach(async () => {
  await resetDb();
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

test('shop admin can update order status lifecycle', async ({ page }) => {
  await createPaidOrder(page);
  await login(page, 'admin@qalamirma.local');
  await page.getByRole('link', { name: 'CN-QI-1001' }).click();

  for (const status of ['Printing', 'Ready for Pickup', 'Completed', 'File Problem', 'Cancelled']) {
    await page.selectOption('select[name="order_status"]', status);
    await page.getByRole('button', { name: 'Update status' }).click();
    await expect(page.locator('select[name="order_status"]')).toHaveValue(status);
  }
});

test('super admin sees SaaS metrics and Qalam Irma tenant', async ({ page }) => {
  await createPaidOrder(page);
  await login(page, 'owner@cetaknow.local');
  await expect(page.getByText('CetakNow Super Admin')).toBeVisible();
  await expect(page.getByText('Qalam Irma')).toBeVisible();
  await expect(page.getByText('pilot_free')).toBeVisible();
  await expect(page.getByText('Paid')).toBeVisible();
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
