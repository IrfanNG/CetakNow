import { id, nowIso } from './db.js';

export async function createPayment({ db, order, shop, origin }) {
  const settings = db.shop_payment_settings.find((s) => s.shop_id === shop.id && s.is_enabled);
  if (!settings) throw new Error('Payment is not enabled for this shop');
  const payment = {
    id: id('payment'),
    order_id: order.id,
    shop_id: shop.id,
    gateway_type: settings.gateway_type,
    gateway_reference: `MOCK-${order.order_code}`,
    amount: order.total_amount,
    status: 'pending',
    paid_at: null,
    raw_response: {},
    created_at: nowIso(),
    updated_at: nowIso()
  };
  db.payments.push(payment);
  if (settings.gateway_type === 'billplz' && process.env.BILLPLZ_LIVE === 'true') {
    return createBillplzBill({ order, shop, settings, origin, payment });
  }
  return { payment, paymentUrl: `/payment/mock/${order.order_code}` };
}

async function createBillplzBill({ order, shop, settings, origin, payment }) {
  const auth = Buffer.from(`${settings.api_key}:`).toString('base64');
  const params = new URLSearchParams({
    collection_id: settings.collection_id,
    email: order.customer_email || shop.email,
    name: order.customer_name,
    amount: String(Math.round(order.total_amount * 100)),
    callback_url: `${origin}/payment/billplz/webhook`,
    redirect_url: `${origin}/orders/${order.order_code}/confirmation`,
    description: `CetakNow ${order.order_code}`
  });
  const response = await fetch('https://www.billplz.com/api/v3/bills', {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
  if (!response.ok) throw new Error(`Billplz bill failed: ${response.status}`);
  const data = await response.json();
  payment.gateway_reference = data.id;
  payment.raw_response = data;
  return { payment, paymentUrl: data.url };
}

export function markPaymentPaid(db, order, raw = {}) {
  const payment = db.payments.find((p) => p.order_id === order.id);
  if (!payment) throw new Error('Payment not found');
  if (payment.status === 'paid') return payment;
  payment.status = 'paid';
  payment.paid_at = nowIso();
  payment.raw_response = raw;
  payment.updated_at = nowIso();
  order.payment_status = 'paid';
  order.order_status = 'Paid / New Order';
  order.updated_at = nowIso();
  return payment;
}
