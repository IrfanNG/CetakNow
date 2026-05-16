import { escapeHtml } from './http-utils.js';
import { formatMoney } from './pricing.js';
import { labelSlot } from './pickup.js';

export function layout(title, body, color = '#004581') {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title><link rel="stylesheet" href="/public/styles.css"><style>:root{--brand:${color}}</style></head><body>${body}</body></html>`;
}

export function shopPage({ shop, pricing, slots, error = '' }) {
  const slotData = JSON.stringify(slots.map((s) => ({
    id: s.id,
    day: Number(s.day_of_week),
    label: `${labelSlot(s)} · max ${s.max_orders}`
  }))).replace(/</g, '\\u003c');
  const firstSlot = slots[0] ? `<option value="${slots[0].id}">${dayName(slots[0].day_of_week)} ${labelSlot(slots[0])} · max ${slots[0].max_orders}</option>` : '<option value="">No pickup slots configured</option>';
  return layout(`${shop.name} Online Print`, `
  <main class="page">
    <section class="hero card">
      <div><p class="eyebrow">CetakNow Pilot</p><h1>${escapeHtml(shop.name)} Online Print Order</h1><p>${escapeHtml(shop.description)}</p></div>
      <a class="map" href="${escapeHtml(shop.google_maps_url)}">Maps</a>
    </section>
    ${error ? `<div class="modal-backdrop"><div class="modal"><h2>Cannot proceed</h2><p>${escapeHtml(error)}</p><a class="button" href="/shop/${shop.slug}">Back to order form</a></div></div>` : ''}
    <section class="grid">
      <form class="card form" action="/shop/${shop.slug}/orders" method="post" enctype="multipart/form-data">
        <h2>Print Online Now</h2>
        <label>PDF file <input required type="file" name="pdf" accept="application/pdf,.pdf"></label>
        <div class="two"><label>Print type <select name="print_type"><option value="bw">Black & White (${formatMoney(pricing.a4_bw_price_per_page)}/page)</option><option value="color">Color (${formatMoney(pricing.a4_color_price_per_page)}/page)</option></select></label><label>Sides <select name="sides"><option value="single">Single-sided</option><option value="double">Double-sided</option></select></label></div>
        <label>Copies <input required type="number" name="copies" min="1" value="1"></label>
        <div class="two"><label>Pickup date <input required type="date" name="pickup_date"></label><label>Pickup slot <select name="pickup_slot_id">${firstSlot}</select></label></div>
        <div class="two"><label>Name <input required name="customer_name" autocomplete="name"></label><label>Phone <input required name="customer_phone" placeholder="60123456789"></label></div>
        <label>Email optional <input type="email" name="customer_email"></label>
        <label>Notes optional <textarea name="notes" placeholder="Extra instruction"></textarea></label>
        <label class="check"><input required type="checkbox" name="policy_agreed" value="yes"> Minimum pesanan print online ialah ${formatMoney(shop.minimum_order_amount)}. Semua pesanan perlu dibayar sebelum diproses. Fail dipadam selepas 7 hari.</label>
        <button>Proceed to payment</button>
      </form>
      <aside class="card"><h2>Pricing</h2><p>A4 B/W: <b>${formatMoney(pricing.a4_bw_price_per_page)}</b> / page</p><p>A4 Color: <b>${formatMoney(pricing.a4_color_price_per_page)}</b> / page</p><p>Minimum online order: <b>${formatMoney(shop.minimum_order_amount)}</b></p><hr><p>${escapeHtml(shop.address)}</p><p>${escapeHtml(shop.operating_hours)}</p><p>${escapeHtml(shop.phone)}</p></aside>
    </section>
    <script>
      const allSlots = ${slotData};
      const pickupDate = document.querySelector('input[name="pickup_date"]');
      const pickupSlot = document.querySelector('select[name="pickup_slot_id"]');
      function syncPickupSlots() {
        if (!pickupDate?.value || !pickupSlot) return;
        const previous = pickupSlot.value;
        const day = new Date(pickupDate.value + 'T00:00:00').getDay();
        const selectedSlots = allSlots.filter((slot) => slot.day === day);
        pickupSlot.innerHTML = '';
        if (!selectedSlots.length) {
          const option = document.createElement('option');
          option.value = '';
          option.textContent = 'No pickup slots for this date';
          pickupSlot.appendChild(option);
          pickupSlot.disabled = true;
          return;
        }
        pickupSlot.disabled = false;
        for (const slot of selectedSlots) {
          const option = document.createElement('option');
          option.value = slot.id;
          option.textContent = slot.label;
          pickupSlot.appendChild(option);
        }
        if (selectedSlots.some((slot) => slot.id === previous)) pickupSlot.value = previous;
      }
      pickupDate?.addEventListener('change', syncPickupSlots);
      pickupDate?.addEventListener('input', syncPickupSlots);
      pickupSlot?.addEventListener('focus', syncPickupSlots);
      pickupSlot?.addEventListener('mousedown', syncPickupSlots);
      window.addEventListener('pageshow', syncPickupSlots);
      syncPickupSlots();
      setTimeout(syncPickupSlots, 0);
      setTimeout(syncPickupSlots, 100);
    </script>
  </main>`, shop.primary_color);
}

export function confirmationPage(order, shop, slot) {
  return layout('Order received', `<main class="page narrow"><section class="card success"><p class="eyebrow">Payment successful</p><h1>Your print order has been received.</h1><p>Pesanan print anda telah diterima.</p><div class="receipt"><p>Order ID: <b>${order.order_code}</b></p><p>Pickup: <b>${order.pickup_date}, ${labelSlot(slot)}</b></p><p>Total: <b>${formatMoney(order.total_amount)}</b></p></div><p>Please show your order ID when collecting your document.</p><a class="button" href="/shop/${shop.slug}">Create another order</a></section></main>`, shop.primary_color);
}

export function loginPage(error = '') {
  return layout('CetakNow Login', `<main class="page narrow"><form class="card form" method="post" action="/login"><h1>Admin Login</h1>${error ? `<div class="alert">${escapeHtml(error)}</div>` : ''}<label>Email <input name="email" type="email" required></label><label>Password <input name="password" type="password" required></label><button>Login</button><p class="muted">Demo: owner@cetaknow.local / password · admin@qalamirma.local / password</p></form></main>`);
}

export function shopDashboard({ user, shop, orders }) {
  const rows = orders.map((o) => `<tr><td><a href="/admin/orders/${o.id}">${o.order_code}</a></td><td>${escapeHtml(o.customer_name)}</td><td>${escapeHtml(o.customer_phone)}</td><td>${o.pickup_date}</td><td>${formatMoney(o.total_amount)}</td><td><span class="pill">${o.payment_status}</span></td><td>${o.order_status}</td><td>${new Date(o.created_at).toLocaleString()}</td></tr>`).join('');
  return layout('Shop Dashboard', `<main class="page"><nav class="nav"><b>${escapeHtml(shop.name)} Dashboard</b><a href="/admin/settings">Settings</a><a href="/logout">Logout</a></nav><section class="card"><h1>Orders</h1><table><thead><tr><th>Order ID</th><th>Customer</th><th>Phone</th><th>Pickup</th><th>Total</th><th>Payment</th><th>Status</th><th>Created</th></tr></thead><tbody>${rows || '<tr><td colspan="8">No orders yet.</td></tr>'}</tbody></table></section></main>`, shop.primary_color);
}

export function orderDetails({ order, shop, slot }) {
  const statuses = ['Paid / New Order', 'Printing', 'Ready for Pickup', 'Completed', 'Cancelled', 'File Problem'].map((s) => `<option ${order.order_status === s ? 'selected' : ''}>${s}</option>`).join('');
  return layout(order.order_code, `<main class="page narrow"><section class="card"><h1>${order.order_code}</h1><p>${escapeHtml(order.customer_name)} · <a href="https://wa.me/${escapeHtml(order.customer_phone)}">WhatsApp</a></p><div class="receipt"><p>Pages: ${order.page_count}</p><p>Type: ${order.print_type}</p><p>Sides: ${order.sides}</p><p>Copies: ${order.copies}</p><p>Notes: ${order.notes ? escapeHtml(order.notes) : '-'}</p><p>Pickup: ${order.pickup_date}, ${labelSlot(slot)}</p><p>Total: ${formatMoney(order.total_amount)}</p><p>File delete at: ${new Date(order.file_delete_at).toLocaleString()}</p></div><p><a class="button" href="/admin/orders/${order.id}/download">Download PDF</a></p><form method="post" action="/admin/orders/${order.id}/status"><label>Status <select name="order_status">${statuses}</select></label><button>Update status</button></form><p><a href="/admin">Back</a></p></section></main>`, shop.primary_color);
}

export function superDashboard({ shops, orders }) {
  const rows = shops.map((s) => `<tr><td>${escapeHtml(s.name)}</td><td>${s.slug}</td><td>${s.is_active ? 'Active' : 'Inactive'}</td><td>${s.plan}</td><td>${s.subscription_status}</td><td>${orders.filter((o) => o.shop_id === s.id).length}</td><td>${new Date(s.created_at).toLocaleDateString()}</td></tr>`).join('');
  return layout('Super Admin', `<main class="page"><nav class="nav"><b>CetakNow Super Admin</b><a href="/logout">Logout</a></nav><section class="metrics"><div class="card"><b>${shops.length}</b><span>Shops</span></div><div class="card"><b>${orders.length}</b><span>Orders</span></div><div class="card"><b>${orders.filter((o) => o.payment_status === 'paid').length}</b><span>Paid</span></div></section><section class="card"><h1>Shops</h1><table><thead><tr><th>Shop</th><th>Slug</th><th>Status</th><th>Plan</th><th>Subscription</th><th>Orders</th><th>Created</th></tr></thead><tbody>${rows}</tbody></table></section></main>`);
}

export function mockPaymentPage(order) {
  return layout('Mock Billplz', `<main class="page narrow"><section class="card"><p class="eyebrow">Billplz Mock</p><h1>Pay ${formatMoney(order.total_amount)}</h1><p>Order ${order.order_code}</p><form method="post" action="/payment/mock/${order.order_code}/success"><button>Simulate successful payment</button></form></section></main>`);
}

function dayName(index) {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][Number(index)] || 'Day';
}
