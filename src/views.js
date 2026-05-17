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
      <div class="quote-links"><a href="#home">Home</a><a href="#about">Tentang</a><a href="#problems">Masalah</a><a href="#solution">Penyelesaian</a><a href="#how">Cara Guna</a><a href="#pricing">Harga</a><a class="nav-subscribe" href="#pricing">Daftar</a><a class="login-pill" href="/login">Log Masuk</a></div>
    </nav>

    <section id="home" class="quote-hero section-red section-blue">
      <div class="hero-logo-mark"><img src="/public/assets/icon.png" alt="CetakNow icon"></div>
      <p class="quote-kicker">Platform tempahan print online</p>
      <h1>Tempahan Print Online<br><span>Mudah & Tersusun</span></h1>
      <p class="quote-subtitle">Bantu kedai print terima fail PDF, kira harga, ambil bayaran, dan susun pickup tanpa mesej WhatsApp berselerak.</p>
      <div class="hero-mini-links"><span>✓ Upload PDF</span><span>✓ Bayar Dahulu</span><span>✓ Slot Pickup</span></div>
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
      <div class="quote-card-grid three steps-clean"><article><span>1</span><h3>Langgan & Bayar</h3><p>Pilih pelan bulanan atau tahunan, isi email dan telefon, kemudian buat bayaran online.</p></article><article><span>2</span><h3>Setup Page Sendiri</h3><p>Selepas bayar, owner setup sendiri nama kedai, harga print, minimum order, waktu operasi, dan kawasan pickup.</p></article><article><span>3</span><h3>Auto Dapat Link Kedai</h3><p>CetakNow terus jana link kedai khas untuk dikongsi di WhatsApp, bio media sosial, atau poster kedai.</p></article></div>
    </section>

    <section class="quote-section security-band section-blue center-copy">
      <div class="lock-icon">⌂</div><h2>Privasi & Keselamatan Fail</h2><p>Fail PDF tidak dipaparkan secara umum. Staff hanya akses melalui dashboard, dan fail dipadam automatik selepas 7 hari.</p><div class="security-tags"><span>Fail Dilindungi</span><span>Upload Peribadi</span><span>Padam Selepas 7 Hari</span></div>
    </section>

    <section id="pricing" class="quote-section white pricing-zone">
      <div class="center-copy"><p class="quote-kicker">Harga</p><h2>Harga Telus & Mudah</h2><p>Tiada sistem rumit. Sesuai untuk validasi awal kedai print.</p></div>
      <div class="pricing-cards">
        <article class="pricing-card"><h3>Pelan Bulanan</h3><p>Sesuai mula kecil</p><div class="price">RM49<span>/ bulan</span></div><ul class="tick-list"><li>Link kedai sendiri</li><li>Dashboard order</li><li>Bayaran online</li><li>Fail dipadam automatik</li></ul><a class="quote-button outline-blue plan-trigger" href="#subscription-checkout" data-plan="monthly" data-plan-label="Pelan Bulanan" data-amount="49">Langgan Bulanan</a></article>
        <article class="pricing-card featured"><div class="popular-ribbon">Paling Popular</div><h3>Pelan Tahunan</h3><p>Jimat untuk kedai aktif</p><div class="price">RM499<span>/ tahun</span></div><ul class="tick-list"><li>Semua fungsi pelan bulanan</li><li>Nilai lebih jimat</li><li>Sokongan manual diutamakan</li><li>Fail dipadam automatik</li></ul><a class="quote-button solid-blue plan-trigger" href="#subscription-checkout" data-plan="annual" data-plan-label="Pelan Tahunan" data-amount="499">Pilih Tahunan</a></article>
      </div>
      <p class="pricing-note">Harga langganan tetap. Isi email dan telefon, kemudian teruskan bayaran.</p>
    </section>

    <section id="subscription-checkout" class="subscription-modal" aria-hidden="true">
      <a class="subscription-backdrop" href="#pricing" aria-label="Tutup checkout"></a>
      <form class="subscription-dialog" method="post" action="/subscriptions">
        <div class="subscription-head"><h2>Langgan CetakNow</h2><p><span class="modal-plan-label">Pelan Bulanan</span></p></div>
        <div class="subscription-body">
          <input type="hidden" name="plan" value="monthly">
          <label>Email * <input required type="email" name="email" placeholder="email@contoh.com" autocomplete="email"></label>
          <label>Nombor Telefon * <input required name="phone" inputmode="tel" autocomplete="tel" pattern="[0-9+ ]{9,16}" placeholder="0123456789"></label>
          <div class="subscription-total"><span>Harga Pelan</span><b>RM<span class="modal-plan-amount">49</span></b></div>
          <button>Teruskan Pembayaran</button>
          <a class="cancel-subscription" href="#pricing">Batal</a>
        </div>
      </form>
    </section>

    <footer class="quote-section final-cta footer-cta dark">
      <div class="footer-brand"><img src="/public/assets/primary-logo.png" alt="CetakNow"><p>Platform tempahan print online untuk kedai kecil yang mahu order lebih kemas, bayaran jelas, dan pickup lebih tersusun.</p></div>
      <div class="footer-main"><p class="quote-kicker">Langgan CetakNow</p><h2>Sedia susun order print kedai anda?</h2><p>Bawa pelanggan dari WhatsApp berselerak ke satu sistem order yang lebih mudah dikawal.</p><div class="footer-actions"><a class="quote-button white" href="#pricing">Daftar Sekarang</a><a class="footer-login" href="/login">Log Masuk Admin</a></div></div>
      <div class="footer-trust"><span>Bayaran online</span><span>Fail dipadam automatik</span><span>Dashboard order</span></div>
      <nav class="footer-links" aria-label="Footer navigation"><a href="#about">Tentang</a><a href="#problems">Masalah</a><a href="#how">Cara Guna</a><a href="#pricing">Harga</a></nav>
      <p class="footer-bottom">© 2026 CetakNow. Print Online, Pay Online, Pick Up Easy.</p>
    </footer>

    <script>
      const subscriptionModal = document.querySelector('#subscription-checkout');
      const subscriptionForm = document.querySelector('.subscription-dialog');
      const planInput = subscriptionForm?.querySelector('input[name="plan"]');
      const planLabel = document.querySelector('.modal-plan-label');
      const planAmount = document.querySelector('.modal-plan-amount');
      const paymentButton = subscriptionForm?.querySelector('button');
      function syncSubscriptionModal() {
        const isOpen = location.hash === '#subscription-checkout';
        subscriptionModal?.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      }
      document.querySelectorAll('.plan-trigger').forEach((trigger) => {
        trigger.addEventListener('click', () => {
          if (planInput) planInput.value = trigger.dataset.plan || 'monthly';
          if (planLabel) planLabel.textContent = trigger.dataset.planLabel || 'Pelan Bulanan';
          if (planAmount) planAmount.textContent = trigger.dataset.amount || '49';
          setTimeout(syncSubscriptionModal, 0);
        });
      });
      window.addEventListener('hashchange', syncSubscriptionModal);
      syncSubscriptionModal();
      subscriptionForm?.addEventListener('submit', () => {
        if (!subscriptionForm.checkValidity()) return;
        paymentButton.disabled = true;
        paymentButton.textContent = 'Menghantar...';
      });
    </script>

  </main>`);
}

export function subscribeThanksPage() {
  return layout('Terima Kasih - CetakNow', `<main class="page narrow"><section class="card success"><p class="eyebrow">Minat diterima</p><h1>Terima kasih, kami akan hubungi anda untuk setup CetakNow.</h1><p>Team CetakNow akan semak maklumat kedai dan hubungi anda untuk setup manual bagi fasa MVP.</p><a class="button" href="/">Kembali ke landing page</a></section></main>`);
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

export function superDashboard({ shops, orders, subscriptions = [] }) {
  const rows = shops.map((s) => `<tr><td>${escapeHtml(s.name)}</td><td>${s.slug}</td><td>${s.is_active ? 'Active' : 'Inactive'}</td><td>${s.plan}</td><td>${s.subscription_status}</td><td>${orders.filter((o) => o.shop_id === s.id).length}</td><td>${new Date(s.created_at).toLocaleDateString()}</td></tr>`).join('');
  const subscriptionRows = subscriptions.map((sub) => {
    const shop = sub.shop_id ? shops.find((s) => s.id === sub.shop_id) : null;
    const shopCell = shop ? `<a href="/shop/${escapeHtml(shop.slug)}">${escapeHtml(shop.name)}</a>` : '-';
    return `<tr><td>${escapeHtml(sub.subscription_code)}</td><td>${escapeHtml(sub.plan_label)}</td><td>${escapeHtml(sub.email)}</td><td>${escapeHtml(sub.phone)}</td><td>${formatMoney(sub.amount)}</td><td>${escapeHtml(sub.payment_status)}</td><td>${shopCell}</td><td>${new Date(sub.created_at).toLocaleString()}</td></tr>`;
  }).join('');
  return layout('Super Admin', `<main class="page"><nav class="nav"><b>CetakNow Super Admin</b><a href="/logout">Logout</a></nav><section class="metrics"><div class="card"><b>${shops.length}</b><span>Shops</span></div><div class="card"><b>${orders.length}</b><span>Orders</span></div><div class="card"><b>${orders.filter((o) => o.payment_status === 'paid').length}</b><span>Paid Orders</span></div><div class="card"><b>${subscriptions.filter((s) => s.payment_status === 'paid').length}</b><span>Paid Subscriptions</span></div></section><section class="card"><h1>Shops</h1><table><thead><tr><th>Shop</th><th>Slug</th><th>Status</th><th>Plan</th><th>Subscription</th><th>Orders</th><th>Created</th></tr></thead><tbody>${rows}</tbody></table></section><section class="card lead-table"><h1>Subscriptions</h1><table><thead><tr><th>Code</th><th>Plan</th><th>Email</th><th>Phone</th><th>Amount</th><th>Payment</th><th>Shop</th><th>Created</th></tr></thead><tbody>${subscriptionRows || '<tr><td colspan="8">No subscriptions yet.</td></tr>'}</tbody></table></section></main>`);
}

export function mockPaymentPage(order) {
  return layout('Mock Billplz', `<main class="page narrow"><section class="card"><p class="eyebrow">Billplz Mock</p><h1>Pay ${formatMoney(order.total_amount)}</h1><p>Order ${order.order_code}</p><form method="post" action="/payment/mock/${order.order_code}/success"><button>Simulate successful payment</button></form></section></main>`);
}

export function mockSubscriptionPaymentPage(subscription) {
  return layout('Mock Billplz Subscription', `<main class="page narrow"><section class="card"><p class="eyebrow">Billplz Mock</p><h1>Pay ${formatMoney(subscription.amount)}</h1><p>${escapeHtml(subscription.plan_label)} · ${escapeHtml(subscription.subscription_code)}</p><p>${escapeHtml(subscription.email)} · ${escapeHtml(subscription.phone)}</p><form method="post" action="/payment/subscription/mock/${subscription.subscription_code}/success"><button>Simulate successful payment</button></form></section></main>`);
}

export function subscriptionConfirmationPage(subscription, shop = null) {
  if (shop) {
    return layout('Link kedai siap - CetakNow', `<main class="page narrow setup-page"><section class="card success setup-success"><p class="eyebrow">Page kedai siap</p><h1>Link CetakNow kedai anda sudah dijana.</h1><p>Kongsi link ini di WhatsApp, bio media sosial, QR poster, atau mesej pelanggan.</p><div class="receipt shop-link-receipt"><p>Nama kedai: <b>${escapeHtml(shop.name)}</b></p><p>Link kedai: <a href="/shop/${escapeHtml(shop.slug)}"><b>/shop/${escapeHtml(shop.slug)}</b></a></p><p>Pelan: <b>${escapeHtml(subscription.plan_label)}</b></p></div><div class="setup-actions"><a class="button" href="/shop/${escapeHtml(shop.slug)}">Buka Page Kedai</a><a class="button ghost" href="/">Kembali ke landing page</a></div></section></main>`, shop.primary_color);
  }

  return layout('Setup kedai - CetakNow', `<main class="page setup-page">
    <section class="setup-hero card">
      <div><p class="eyebrow">Payment successful</p><h1>Langganan berjaya. Sekarang setup page kedai anda.</h1><p>Isi maklumat minimum dahulu. Selepas submit, CetakNow terus jana link kedai untuk pelanggan buat order.</p></div>
      <div class="setup-plan"><span>${escapeHtml(subscription.plan_label)}</span><b>${formatMoney(subscription.amount)}</b><small>${escapeHtml(subscription.subscription_code)}</small></div>
    </section>
    <section class="setup-grid">
      <form class="card form shop-setup-form" method="post" action="/subscriptions/${escapeHtml(subscription.subscription_code)}/setup">
        <h2>Maklumat kedai</h2>
        <label>Nama kedai * <input required name="shop_name" autocomplete="organization" placeholder="Contoh: Student Print Seksyen 7"></label>
        <label>Slug link kedai * <input required name="slug" pattern="[a-z0-9-]{3,64}" placeholder="student-print-seksyen-7" aria-describedby="slug-help"><small id="slug-help" class="muted">Link akan jadi /shop/<span class="slug-preview">nama-kedai</span></small></label>
        <div class="two"><label>Telefon kedai * <input required name="phone" inputmode="tel" autocomplete="tel" value="${escapeHtml(subscription.phone)}" placeholder="60123456789"></label><label>Waktu operasi * <input required name="operating_hours" placeholder="Mon-Sat, 9:00 AM - 9:00 PM"></label></div>
        <label>Alamat / kawasan * <textarea required name="address" placeholder="Dekat kampus, mall, taman..."></textarea></label>
        <div class="two"><label>Harga B/W A4 per page * <input required type="number" min="0" step="0.01" name="a4_bw_price_per_page" value="0.20"></label><label>Harga color A4 per page * <input required type="number" min="0" step="0.01" name="a4_color_price_per_page" value="1.00"></label></div>
        <label>Minimum order online * <input required type="number" min="0" step="0.01" name="minimum_order_amount" value="5.00"></label>
        <button>Jana Link Kedai</button>
        <p class="form-reassurance">Slot pickup asas akan disediakan automatik dan boleh dikemas kini kemudian.</p>
      </form>
      <aside class="card setup-preview">
        <p class="eyebrow">Preview link</p>
        <h2>/shop/<span class="slug-preview">nama-kedai</span></h2>
        <p>Page ini akan terima PDF, kira harga, ambil bayaran online, dan simpan order dalam dashboard staff.</p>
        <ul class="tick-list"><li>Link kedai sendiri</li><li>Bayaran online</li><li>Dashboard order</li><li>Fail dipadam automatik</li></ul>
      </aside>
    </section>
    <script>
      const shopNameInput = document.querySelector('input[name="shop_name"]');
      const slugInput = document.querySelector('input[name="slug"]');
      const previews = document.querySelectorAll('.slug-preview');
      let slugTouched = false;
      function toSlug(value) {
        return String(value || '').toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64);
      }
      function syncSlugPreview() {
        const slug = toSlug(slugInput?.value) || 'nama-kedai';
        previews.forEach((preview) => preview.textContent = slug);
      }
      shopNameInput?.addEventListener('input', () => {
        if (!slugTouched && slugInput) slugInput.value = toSlug(shopNameInput.value);
        syncSlugPreview();
      });
      slugInput?.addEventListener('input', () => {
        slugTouched = true;
        slugInput.value = toSlug(slugInput.value);
        syncSlugPreview();
      });
      syncSlugPreview();
    </script>
  </main>`);
}

function dayName(index) {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][Number(index)] || 'Day';
}
