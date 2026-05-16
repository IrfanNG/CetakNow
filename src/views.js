import { escapeHtml } from './http-utils.js';
import { formatMoney } from './pricing.js';
import { labelSlot } from './pickup.js';

export function layout(title, body, color = '#004581') {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title><link rel="stylesheet" href="/public/styles.css"><style>:root{--brand:${color}}</style></head><body>${body}</body></html>`;
}

export function landingPage({ leadCount = 0 } = {}) {
  return layout('CetakNow - Tempahan Print Online Mudah', `
  <main class="landing landing-blueprint">
    <nav class="quote-nav">
      <a class="quote-logo" href="/" aria-label="CetakNow home"><img src="/public/assets/primary-logo.png" alt="CetakNow"></a>
      <div class="quote-links"><a href="#home">Home</a><a href="#about">Tentang</a><a href="#problems">Masalah</a><a href="#solution">Penyelesaian</a><a href="#how">Cara Guna</a><a href="#pricing">Harga</a><a class="login-pill" href="/login">Log Masuk</a></div>
    </nav>

    <section id="home" class="quote-hero section-red section-blue">
      <div class="hero-logo-mark"><img src="/public/assets/icon.png" alt="CetakNow icon"></div>
      <p class="quote-kicker">Platform tempahan print online</p>
      <h1>Tempahan Print Online<br><span>Mudah & Tersusun</span></h1>
      <p class="quote-subtitle">Bantu kedai print terima fail PDF, kira harga, ambil bayaran, dan susun pickup tanpa mesej WhatsApp berselerak.</p>
      <div class="hero-mini-links"><span>✓ PDF Upload</span><span>✓ Bayar Dahulu</span><span>✓ Pickup Slot</span></div>
      <a class="scroll-cue" href="#about" aria-label="Scroll to about">↓</a>
    </section>

    <section id="about" class="quote-section white center-copy">
      <p class="quote-kicker">Tentang Kami</p>
      <h2>Apa Itu CetakNow?</h2>
      <p>CetakNow ialah platform digital ringkas untuk kedai print kecil menerima tempahan online secara lebih teratur. Pelanggan upload PDF, pilih tetapan print, bayar, dan ambil dokumen ikut slot pickup.</p>
    </section>

    <section id="problems" class="quote-section dark">
      <div class="center-copy"><h2>Masalah Kedai Print</h2><p>Adakah workflow harian kedai anda masih macam ini?</p></div>
      <div class="quote-card-grid three">
        <article class="quote-card"><span class="soft-icon">!</span><h3>Order Bercampur Dalam WhatsApp</h3><p>Fail, nota, payment proof, dan pickup time mudah tenggelam dalam chat pelanggan.</p></article>
        <article class="quote-card"><span class="soft-icon">□</span><h3>Harga Dikira Manual</h3><p>Staff perlu semak page, warna, copies, dan minimum order satu per satu sebelum print.</p></article>
        <article class="quote-card"><span class="soft-icon">⌁</span><h3>Pickup Tidak Tersusun</h3><p>Pelanggan datang serentak, status order tidak jelas, dan staff perlu ulang semak berkali-kali.</p></article>
      </div>
    </section>

    <section id="solution" class="quote-section solution-band section-blue">
      <div class="solution-copy">
        <p class="quote-kicker">Penyelesaian</p>
        <h2>Cara CetakNow Membantu Kedai Anda</h2>
        <ul class="tick-list"><li><b>Link Personal:</b> Kedai dapat satu link khas untuk pelanggan buat order sendiri.</li><li><b>Auto-Calculate:</b> Sistem kira harga berdasarkan page, print type, copies, dan minimum order.</li><li><b>Paid Orders Only:</b> Order diproses selepas bayaran, kurang risiko kerja sia-sia.</li><li><b>Dashboard Staff:</b> Semua order, fail, status, dan pickup slot tersusun dalam satu tempat.</li></ul>
      </div>
      <div class="logo-device" aria-label="CetakNow logo preview"><img src="/public/assets/icon.png" alt="CetakNow"><h3>CetakNow</h3><p>Print Online · Pay Online · Pick Up Easy</p></div>
    </section>

    <section class="quote-section white">
      <div class="center-copy"><h2>Untuk Siapa Platform Ini?</h2></div>
      <div class="quote-card-grid four compact"><article><span>🏪</span><b>Kedai Print Kecil</b></article><article><span>🎓</span><b>Kawasan Kampus</b></article><article><span>📄</span><b>Photostat Shop</b></article><article><span>🧾</span><b>Owner Urus Sendiri</b></article></div>
    </section>

    <section id="how" class="quote-section dark">
      <div class="center-copy"><h2>Macam Mana Ia Berfungsi?</h2></div>
      <div class="quote-card-grid three steps-clean"><article><span>1</span><h3>Daftar & Setup</h3><p>Kami setup page kedai, harga, minimum order, dan slot pickup.</p></article><article><span>2</span><h3>Kongsi Link</h3><p>Letak link CetakNow di WhatsApp, bio media sosial, atau poster kedai.</p></article><article><span>3</span><h3>Terima Order</h3><p>Pelanggan upload PDF, bayar, dan order masuk ke dashboard staff.</p></article></div>
    </section>

    <section class="quote-section security-band section-blue center-copy">
      <div class="lock-icon">⌂</div><h2>Privasi & Keselamatan Fail</h2><p>Fail PDF tidak dipaparkan secara public. Staff hanya akses melalui dashboard, dan fail dipadam automatik selepas 7 hari.</p><div class="security-tags"><span>Data Protected</span><span>Private Uploads</span><span>7-Day Cleanup</span></div>
    </section>

    <section id="pricing" class="quote-section white pricing-zone">
      <div class="center-copy"><p class="quote-kicker">Harga</p><h2>Harga Telus & Mudah</h2><p>Tiada sistem rumit. Sesuai untuk validasi awal kedai print.</p></div>
      <div class="pricing-cards">
        <article class="pricing-card"><h3>Pelan Bulanan</h3><p>Sesuai mula kecil</p><div class="price">RM49<span>/ bulan</span></div><ul class="tick-list"><li>RM99 setup sekali sahaja</li><li>Link kedai sendiri</li><li>Dashboard order</li><li>Pickup slot asas</li></ul><a class="quote-button outline-blue" href="#subscribe">Langgan Bulanan</a></article>
        <article class="pricing-card featured"><div class="popular-ribbon">Paling Popular</div><h3>Pelan Tahunan</h3><p>Jimat untuk kedai aktif</p><div class="price">RM499<span>/ tahun</span></div><ul class="tick-list"><li>Semua fungsi pelan bulanan</li><li>Nilai lebih jimat</li><li>Setup dibincang semasa onboarding</li><li>Priority manual support</li></ul><a class="quote-button solid-blue" href="#subscribe">Pilih Tahunan</a></article>
      </div>
      <p class="pricing-note">Onboarding dan langganan masih diurus secara manual untuk MVP.</p>
    </section>

    <section class="quote-section final-cta dark center-copy"><h2>Tunggu Apa Lagi?</h2><p>Bina sistem order yang lebih kemas, kurangkan kerja manual, dan mudahkan pelanggan hantar fail print.</p><a class="quote-button white" href="#subscribe">Daftar Sekarang</a><small>${leadCount} shop leads direkodkan setakat ini</small></section>

    <section id="subscribe" class="quote-section white subscribe-wrap">
      <div><p class="quote-kicker">Untuk Owner Kedai</p><h2>Daftar Minat Kedai Anda</h2><p>Isi maklumat ringkas. Kami akan hubungi anda untuk setup page CetakNow secara manual bagi fasa MVP.</p></div>
      <form class="form lead-form" method="post" action="/subscribe">
        <div class="two"><label>Nama owner <input required name="owner_name"></label><label>Nama kedai <input required name="shop_name"></label></div>
        <div class="two"><label>Telefon <input required name="phone" placeholder="60123456789"></label><label>Email <input required type="email" name="email"></label></div>
        <label>Lokasi / kawasan <input required name="location" placeholder="Dekat kampus, mall, taman..."></label>
        <label>Kaedah order sekarang <select name="current_order_method"><option value="whatsapp">WhatsApp</option><option value="walk_in">Walk-in sahaja</option><option value="google_form">Google Form</option><option value="other">Lain-lain</option></select></label>
        <label>Mesej optional <textarea name="message" placeholder="Ceritakan workflow print sekarang"></textarea></label>
        <button>Submit Interest</button>
      </form>
    </section>
  </main>`);
}

export function subscribeThanksPage() {
  return layout('Thanks - CetakNow', `<main class="page narrow"><section class="card success"><p class="eyebrow">Lead received</p><h1>Thanks — we’ll contact you to set up your CetakNow shop.</h1><p>Terima kasih. Team CetakNow akan hubungi anda untuk setup kedai secara manual bagi MVP.</p><a class="button" href="/">Back to landing page</a></section></main>`);
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

export function superDashboard({ shops, orders, leads = [] }) {
  const rows = shops.map((s) => `<tr><td>${escapeHtml(s.name)}</td><td>${s.slug}</td><td>${s.is_active ? 'Active' : 'Inactive'}</td><td>${s.plan}</td><td>${s.subscription_status}</td><td>${orders.filter((o) => o.shop_id === s.id).length}</td><td>${new Date(s.created_at).toLocaleDateString()}</td></tr>`).join('');
  const leadRows = leads.map((lead) => `<tr><td>${escapeHtml(lead.shop_name)}</td><td>${escapeHtml(lead.owner_name)}</td><td>${escapeHtml(lead.phone)}</td><td>${escapeHtml(lead.email)}</td><td>${escapeHtml(lead.location)}</td><td>${escapeHtml(lead.current_order_method)}</td><td>${escapeHtml(lead.status)}</td><td>${new Date(lead.created_at).toLocaleString()}</td></tr>`).join('');
  return layout('Super Admin', `<main class="page"><nav class="nav"><b>CetakNow Super Admin</b><a href="/logout">Logout</a></nav><section class="metrics"><div class="card"><b>${shops.length}</b><span>Shops</span></div><div class="card"><b>${orders.length}</b><span>Orders</span></div><div class="card"><b>${orders.filter((o) => o.payment_status === 'paid').length}</b><span>Paid</span></div><div class="card"><b>${leads.length}</b><span>Leads</span></div></section><section class="card"><h1>Shops</h1><table><thead><tr><th>Shop</th><th>Slug</th><th>Status</th><th>Plan</th><th>Subscription</th><th>Orders</th><th>Created</th></tr></thead><tbody>${rows}</tbody></table></section><section class="card lead-table"><h1>Subscription Leads</h1><table><thead><tr><th>Shop</th><th>Owner</th><th>Phone</th><th>Email</th><th>Location</th><th>Method</th><th>Status</th><th>Created</th></tr></thead><tbody>${leadRows || '<tr><td colspan="8">No leads yet.</td></tr>'}</tbody></table></section></main>`);
}

export function mockPaymentPage(order) {
  return layout('Mock Billplz', `<main class="page narrow"><section class="card"><p class="eyebrow">Billplz Mock</p><h1>Pay ${formatMoney(order.total_amount)}</h1><p>Order ${order.order_code}</p><form method="post" action="/payment/mock/${order.order_code}/success"><button>Simulate successful payment</button></form></section></main>`);
}

function dayName(index) {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][Number(index)] || 'Day';
}
