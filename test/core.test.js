import test from 'node:test';
import assert from 'node:assert/strict';
import { detectPdfPageCount } from '../src/pdf.js';
import { calculateTotal } from '../src/pricing.js';
import { isSlotAvailable } from '../src/pickup.js';

const pdf = Buffer.from('%PDF-1.4\n1 0 obj << /Type /Page >> endobj\n2 0 obj << /Type /Page >> endobj\n%%EOF', 'latin1');

test('detects PDF page count', () => {
  assert.equal(detectPdfPageCount(pdf), 2);
});

test('rejects non-PDF', () => {
  assert.throws(() => detectPdfPageCount(Buffer.from('not-a-pdf-file')), /Invalid PDF/);
});

test('calculates simple MVP pricing', () => {
  assert.equal(calculateTotal({ pageCount: 10, printType: 'bw', copies: 2, pricing: { a4_bw_price_per_page: 0.2, a4_color_price_per_page: 1 } }), 4);
  assert.equal(calculateTotal({ pageCount: 10, printType: 'color', copies: 2, pricing: { a4_bw_price_per_page: 0.2, a4_color_price_per_page: 1 } }), 20);
});

test('pickup slot rejects full slot', () => {
  const db = {
    pickup_slots: [{ id: 'slot1', shop_id: 'shop1', day_of_week: 1, start_time: '10:00', end_time: '11:00', max_orders: 1, is_active: true }],
    orders: [{ shop_id: 'shop1', pickup_date: '2030-01-07', pickup_slot_id: 'slot1', order_status: 'Paid / New Order' }]
  };
  const result = isSlotAvailable({ db, shopId: 'shop1', slotId: 'slot1', pickupDate: '2030-01-07', now: new Date('2030-01-01T00:00:00') });
  assert.equal(result.ok, false);
  assert.match(result.reason, /fully booked/);
});
