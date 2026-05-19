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
    </section>

    <section id="about" class="quote-section white center-copy">
      <p class="quote-kicker">Tentang Kami</p>
      <h2>Apa Itu CetakNow?</h2>
      <p>CetakNow ialah platform digital ringkas untuk kedai print kecil menerima tempahan online secara lebih teratur. Pelanggan upload PDF, pilih tetapan print, bayar, dan ambil dokumen ikut slot pickup.</p>
    </section>

    <section id="problems" class="quote-section dark">
      <div class="center-copy"><h2>Masalah Kedai Print</h2><p>Adakah workflow harian kedai anda masih macam ini?</p></div>
      <div class="problem-rail">
        <article class="problem-row"><span>01</span><div><h3>Order Bercampur Dalam WhatsApp</h3><p>Fail, nota, payment proof, dan pickup time mudah tenggelam dalam chat pelanggan.</p></div></article>
        <article class="problem-row"><span>02</span><div><h3>Harga Dikira Manual</h3><p>Staff perlu semak page, warna, copies, dan minimum order satu per satu sebelum print.</p></div></article>
        <article class="problem-row"><span>03</span><div><h3>Pickup Tidak Tersusun</h3><p>Pelanggan datang serentak, status order tidak jelas, dan staff perlu ulang semak berkali-kali.</p></div></article>
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
      <div class="audience-strip">
        <span>🏪 Kedai Print Kecil</span>
        <span>🎓 Kawasan Kampus</span>
        <span>📄 Photostat Shop</span>
        <span>🧾 Owner Urus Sendiri</span>
      </div>
    </section>

    <section id="how" class="quote-section dark">
      <div class="center-copy"><h2>Macam Mana Ia Berfungsi?</h2></div>
      <ol class="steps-rail">
        <li><span>1</span><div><h3>Langgan & Bayar</h3><p>Pilih pelan bulanan atau tahunan, isi email dan telefon, kemudian buat bayaran online.</p></div></li>
        <li><span>2</span><div><h3>Setup Page Sendiri</h3><p>Selepas bayar, owner setup sendiri nama kedai, harga print, minimum order, waktu operasi, dan kawasan pickup.</p></div></li>
        <li><span>3</span><div><h3>Auto Dapat Link Kedai</h3><p>CetakNow terus jana link kedai khas untuk dikongsi di WhatsApp, bio media sosial, atau poster kedai.</p></div></li>
      </ol>
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
      <div class="footer-main"><p class="quote-kicker">Langgan CetakNow</p><h2>Sedia susun order print kedai anda?</h2><p>Bawa pelanggan dari WhatsApp berselerak ke satu sistem order yang lebih mudah dikawal.</p><div class="footer-actions"><a class="quote-button white" href="#pricing">Daftar Sekarang</a><a class="footer-login" href="/login">Log Masuk</a></div></div>
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

export function shopPage({ shop, pricing, slots, products = [], paperSizes = [], error = '' }) {
  const slotData = JSON.stringify(slots.map((s) => ({
    id: s.id,
    day: Number(s.day_of_week),
    label: `${labelSlot(s)} · max ${s.max_orders}`
  }))).replace(/</g, '\u003c');
  const firstSlot = slots[0] ? `<option value="${slots[0].id}">${dayName(slots[0].day_of_week)} ${labelSlot(slots[0])} · max ${slots[0].max_orders}</option>` : '<option value="">No pickup slots configured</option>';
  const activePaperSizes = paperSizes.length ? paperSizes : [{ id: 'a4', label: 'A4', bw_price_per_page: pricing.a4_bw_price_per_page, color_price_per_page: pricing.a4_color_price_per_page }];
  const paperSizeData = JSON.stringify(activePaperSizes.map((size) => ({
    id: size.id,
    label: size.label,
    bw: Number(size.bw_price_per_page || 0),
    color: Number(size.color_price_per_page || 0)
  }))).replace(/</g, '\u003c');
  const paperSizeOptions = activePaperSizes.map((size, index) => `<option value="${escapeHtml(size.id)}" ${index === 0 ? 'selected' : ''}>${escapeHtml(size.label)}</option>`).join('');
  const firstPaperSize = activePaperSizes[0];
  const productOptions = products.map((product) => `<label class="product-option"><input type="checkbox" name="product_ids" value="${escapeHtml(product.id)}"><span><b>${escapeHtml(product.name)}</b>${product.description ? `<small>${escapeHtml(product.description)}</small>` : ''}</span><strong>${formatMoney(product.price)}</strong></label>`).join('');
  const productSection = productOptions ? `<section class="product-addons"><p class="eyebrow">Add-on optional</p><h3>Tambah produk servis</h3><div class="product-options">${productOptions}</div></section>` : '';
  return layout(`${shop.name} Online Print`, `
  <main class="shop-order-page">
    <section class="shop-hero-panel">
      <div>
        <p class="eyebrow">CetakNow Pilot</p>
        <h1>${escapeHtml(shop.name)} Online Print Order</h1>
        <p>${escapeHtml(shop.description)}</p>
      </div>
      <a class="map" href="${escapeHtml(shop.google_maps_url)}">Maps</a>
    </section>
    ${error ? `<div class="modal-backdrop"><div class="modal"><h2>Cannot proceed</h2><p>${escapeHtml(error)}</p><a class="button" href="/shop/${shop.slug}">Back to order form</a></div></div>` : ''}
    <section class="shop-order-grid">
      <form class="shop-order-card" action="/shop/${shop.slug}/orders" method="post" enctype="multipart/form-data">
        <div class="form-head"><p class="eyebrow">Order form</p><h2>Tempah Print Online</h2></div>
        <div class="field-block"><label>PDF file(s) <input required multiple type="file" name="pdf" accept="application/pdf,.pdf"></label></div>
        <div class="two"><label>Paper size <select name="paper_size_id">${paperSizeOptions}</select></label><label>Print type <select name="print_type"><option value="bw">Black & White (${formatMoney(firstPaperSize.bw_price_per_page)}/page)</option><option value="color">Color (${formatMoney(firstPaperSize.color_price_per_page)}/page)</option></select></label></div>
        <label>Sides <select name="sides"><option value="single">Single-sided</option><option value="double">Double-sided</option></select></label>
        <label>Copies <input required type="number" name="copies" min="1" value="1"></label>
        ${productSection}
        <div class="two"><label>Pickup date <input required type="date" name="pickup_date"></label><label>Pickup slot <select name="pickup_slot_id">${firstSlot}</select></label></div>
        <div class="two"><label>Name <input required name="customer_name" autocomplete="name"></label><label>Phone <input required name="customer_phone" placeholder="60123456789"></label></div>
        <label>Email optional <input type="email" name="customer_email"></label>
        <label>Notes optional <textarea name="notes" placeholder="Extra instruction"></textarea></label>
        <label class="check shop-policy"><input required type="checkbox" name="policy_agreed" value="yes"><span>Minimum pesanan print online ialah ${formatMoney(shop.minimum_order_amount)}. Semua pesanan perlu dibayar sebelum diproses. Fail dipadam selepas 7 hari.</span></label>
        <button class="shop-submit">Teruskan ke Pembayaran</button>
      </form>
    </section>
    <script>
      const allSlots = ${slotData};
      const allPaperSizes = ${paperSizeData};
      const pickupDate = document.querySelector('input[name="pickup_date"]');
      const pickupSlot = document.querySelector('select[name="pickup_slot_id"]');
      const paperSizeSelect = document.querySelector('select[name="paper_size_id"]');
      const printTypeSelect = document.querySelector('select[name="print_type"]');
      function money(value) {
        return 'RM' + Number(value || 0).toFixed(2);
      }
      function syncPrintTypePrices() {
        const size = allPaperSizes.find((item) => item.id === paperSizeSelect?.value) || allPaperSizes[0];
        if (!size || !printTypeSelect) return;
        const selected = printTypeSelect.value || 'bw';
        printTypeSelect.innerHTML = '<option value="bw">Black & White (' + money(size.bw) + '/page)</option><option value="color">Color (' + money(size.color) + '/page)</option>';
        printTypeSelect.value = selected;
      }
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
      paperSizeSelect?.addEventListener('change', syncPrintTypePrices);
      window.addEventListener('pageshow', syncPickupSlots);
      syncPickupSlots();
      syncPrintTypePrices();
      setTimeout(syncPickupSlots, 0);
      setTimeout(syncPickupSlots, 100);
    </script>
  </main>`, shop.primary_color);
}

export function confirmationPage(order, shop, slot) {
  return layout('Order received', `<main class="page narrow"><section class="card success"><p class="eyebrow">Payment successful</p><h1>Your print order has been received.</h1><p>Pesanan print anda telah diterima.</p><div class="receipt"><p>Order ID: <b>${order.order_code}</b></p><p>Pickup: <b>${order.pickup_date}, ${labelSlot(slot)}</b></p><p>Total: <b>${formatMoney(order.total_amount)}</b></p></div><p>Please show your order ID when collecting your document.</p><a class="button" href="/shop/${shop.slug}">Create another order</a></section></main>`, shop.primary_color);
}

export function loginPage(error = '') {
  return layout('CetakNow Login', `<main class="login-page"><section class="login-shell"><div class="login-brand-panel"><a class="login-logo" href="/" aria-label="CetakNow home"><img src="/public/assets/primary-logo.png" alt="CetakNow"></a><p class="quote-kicker">Admin access</p><h1>Log Masuk Admin</h1><p>Urus order, bayaran, fail PDF, dan pickup slot kedai dari satu dashboard yang tersusun.</p><div class="login-trust"><span>Bayaran dahulu</span><span>Dashboard order</span><span>Link kedai sendiri</span></div></div><form class="login-card" method="post" action="/login"><div class="login-form-head"><p class="quote-kicker">CetakNow Dashboard</p><h2>Akses dashboard kedai</h2></div>${error ? `<div class="alert">${escapeHtml(error)}</div>` : ''}<label>Email <input name="email" type="email" autocomplete="email" required></label><label>Password <input name="password" type="password" autocomplete="current-password" required></label><button>Log Masuk</button><div class="login-subscribe"><p>Belum ada akaun kedai?</p><a href="/#pricing">Belum ada akaun? Langgan</a></div><p class="muted login-demo">Demo: owner@cetaknow.local / password · admin@qalamirma.local / password</p></form></section></main>`);
}

function statusClass(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'default';
}

function adminShell({ title, subtitle, userLabel, active = 'overview', body, role = 'Shop Dashboard', shopSlug = '' }) {
  const shopLink = shopSlug ? `/shop/${escapeHtml(shopSlug)}` : '/';
  const subscriptionLink = role === 'Super Admin' ? shopLink : '/admin/subscription';
  const shopsHref = role === 'Super Admin' ? '/admin/shops' : '/admin/orders';
  const item = (key, href, icon, label, hint = '') => `<a class="admin-side-item ${active === key ? 'active' : ''}" href="${href}" aria-current="${active === key ? 'page' : 'false'}"><span class="side-icon ${icon}" aria-hidden="true"></span><em>${label}${hint ? `<small>${hint}</small>` : ''}</em></a>`;
  const shopSettingsItem = role === 'Super Admin' ? '' : item('settings', '/admin/settings', 'settings', 'Tetapan', 'Kedai & harga');
  return `<main class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-brand"><img src="/public/assets/primary-logo.png" alt="CetakNow"><span>${escapeHtml(role)}</span></div>
      <nav class="admin-side-nav" aria-label="Admin navigation">
        ${item('overview', '/admin', 'home', 'Ringkasan', 'Dashboard')}
        ${item('orders', shopsHref, 'orders', role === 'Super Admin' ? 'Kedai' : 'Order', role === 'Super Admin' ? 'Urus tenant' : 'Senarai kerja')}
        ${item('revenue', '/admin/revenue', 'revenue', 'Hasil', 'Revenue')}
        ${item(role === 'Super Admin' ? 'shop' : 'subscription', subscriptionLink, 'external', role === 'Super Admin' ? 'Landing' : 'Langganan', role === 'Super Admin' ? 'Buka page' : 'Plan & link')}
        ${shopSettingsItem}
      </nav>
      <div class="admin-user"><b>${escapeHtml(userLabel || title)}</b><a href="/logout"><span class="side-icon logout" aria-hidden="true"></span> Logout</a></div>
    </aside>
    <section class="admin-main">
      <header class="admin-topbar"><div><p>${escapeHtml(subtitle)}</p><h1>${escapeHtml(title)}</h1></div><a class="admin-menu-button" href="/logout">Logout</a></header>
      ${body}
    </section>
  </main>`;
}

function planLabel(value = '') {
  const plan = String(value || '').toLowerCase();
  if (plan === 'annual' || plan === 'yearly') return 'Pelan Tahunan';
  if (plan === 'monthly') return 'Pelan Bulanan';
  if (plan === 'pilot') return 'Pilot';
  return value ? String(value) : 'Pilot';
}

function displayDateTime(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleString() : '-';
}

export function subscriptionPage({ user, shop, subscription = null, payment = null }) {
  const publicLink = `/shop/${escapeHtml(shop.slug)}`;
  const label = subscription?.plan_label || planLabel(subscription?.plan || shop.plan);
  const status = shop.subscription_status || subscription?.payment_status || 'pilot_free';
  const amount = subscription?.amount ?? payment?.amount ?? 0;
  const body = `<section class="admin-detail subscription-detail">
    <p class="eyebrow">Langganan kedai</p>
    <div class="detail-title"><div><h1>Maklumat Langganan</h1><p>${escapeHtml(shop.name)} · ${publicLink}</p></div><span class="status-chip ${statusClass(status)}">${escapeHtml(status)}</span></div>
    <div class="receipt detail-grid">
      <p><span>Plan</span><b>${escapeHtml(label)}</b></p>
      <p><span>Status</span><b>${escapeHtml(status)}</b></p>
      <p><span>Code</span><b>${escapeHtml(subscription?.subscription_code || '-')}</b></p>
      <p><span>Email</span><b>${escapeHtml(subscription?.email || user.email || shop.email || '-')}</b></p>
      <p><span>Amount Paid</span><b>${formatMoney(amount)}</b></p>
      <p><span>Created</span><b>${displayDateTime(subscription?.created_at || shop.created_at)}</b></p>
      <p><span>Paid At</span><b>${displayDateTime(payment?.paid_at)}</b></p>
      <p><span>Public Shop Link</span><b><a href="${publicLink}">${publicLink}</a></b></p>
    </div>
    <div class="detail-actions">
      <a class="button" href="${publicLink}">Buka Link Kedai</a>
      <button class="button ghost" type="button" data-copy-link="${publicLink}">Copy link</button>
    </div>
    <script>
      document.querySelector('[data-copy-link]')?.addEventListener('click', async (event) => {
        const button = event.currentTarget;
        const link = button.getAttribute('data-copy-link');
        try {
          await navigator.clipboard.writeText(location.origin + link);
          button.textContent = 'Copied';
        } catch {
          button.textContent = link;
        }
      });
    </script>
  </section>`;
  return layout('Langganan', adminShell({ title: 'Langganan', subtitle: `${shop.name} Dashboard`, userLabel: user.email, active: 'subscription', role: 'Shop Dashboard', shopSlug: shop.slug, body }), shop.primary_color);
}

function metricCard(label, value, tone = 'blue', icon = 'orders', featured = false) {
  return `<article class="admin-kpi ${tone} ${featured ? 'featured' : ''}"><div><span>${escapeHtml(label)}</span><b>${value}</b></div><i class="kpi-icon ${icon}" aria-hidden="true"></i></article>`;
}

function storyBand(title, subtitle, stats = [], cta = '') {
  const statMarkup = stats.map((stat) => `<div><span>${escapeHtml(stat.label)}</span><b>${stat.value}</b><small>${escapeHtml(stat.hint || '')}</small></div>`).join('');
  return `<section class="admin-story-band">
    <div class="admin-story-copy">
      <p class="eyebrow">Ringkasan live</p>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(subtitle)}</p>
      ${cta ? `<a class="button" href="${escapeHtml(cta.href)}">${escapeHtml(cta.label)}</a>` : ''}
    </div>
    <div class="admin-story-stats">${statMarkup}</div>
  </section>`;
}

export function shopDashboardSnapshot({ orders }) {
  const totalOrders = orders.length;
  const readyOrders = orders.filter((o) => o.order_status === 'Ready for Pickup').length;
  const activeOrders = orders.filter((o) => !['Completed', 'Cancelled'].includes(o.order_status)).length;
  const today = new Date().toISOString().slice(0, 10);
  const todayPickups = orders.filter((o) => o.pickup_date === today).length;
  const orderRows = orders.map((o) => `<tr><td><a class="admin-link" href="/admin/orders/${o.id}">${escapeHtml(o.order_code)}</a></td><td><b>${escapeHtml(o.customer_name)}</b><small>${escapeHtml(o.customer_phone)}</small></td><td>${escapeHtml(o.pickup_date)}</td><td>${formatMoney(o.total_amount)}</td><td><span class="pill ${statusClass(o.payment_status)}">${escapeHtml(o.payment_status)}</span></td><td><span class="status-chip ${statusClass(o.order_status)}">${escapeHtml(o.order_status)}</span></td><td>${new Date(o.created_at).toLocaleString()}</td></tr>`).join('');
  return {
    activeOrders,
    totalOrders,
    readyOrders,
    todayPickups,
    orderCountLabel: `${orders.length} total`,
    orderRows: orderRows || '<tr><td class="empty-state" colspan="7"><b>Belum ada order.</b><span>Kongsi link kedai untuk mula terima order berbayar.</span></td></tr>'
  };
}

export function shopDashboard({ user, shop, orders }) {
  const snapshot = shopDashboardSnapshot({ orders });
  const body = `${storyBand(
      `${snapshot.readyOrders} order sudah ready untuk pickup`,
      `${snapshot.activeOrders} order masih bergerak · ${snapshot.todayPickups} pickup hari ini`,
      [
        { label: 'Total order', value: snapshot.totalOrders, hint: 'keseluruhan queue' },
        { label: 'Aktif', value: snapshot.activeOrders, hint: 'belum selesai' },
        { label: 'Ready pickup', value: snapshot.readyOrders, hint: 'boleh diserahkan' }
      ],
      { href: '/admin/orders', label: 'Semak order sekarang' }
    )}
    <section id="orders" class="admin-panel"><div class="panel-head"><div><p class="eyebrow">Senarai kerja</p><h2>Order Masuk</h2></div><span data-dashboard-order-count>${snapshot.orderCountLabel}</span></div><div class="table-wrap"><table><thead><tr><th>Order ID</th><th>Customer</th><th>Pickup</th><th>Total</th><th>Payment</th><th>Status</th><th>Created</th></tr></thead><tbody data-dashboard-order-rows>${snapshot.orderRows}</tbody></table></div></section>
    <script>
      let dashboardPoll = null;
      async function refreshDashboard() {
        const response = await fetch('/admin/dashboard.json', { headers: { Accept: 'application/json' } });
        if (!response.ok) return;
        const data = await response.json();
        const kpis = document.querySelector('[data-dashboard-kpis]');
        const insight = document.querySelector('[data-dashboard-insight]');
        const orderCount = document.querySelector('[data-dashboard-order-count]');
        const orderRows = document.querySelector('[data-dashboard-order-rows]');
        if (kpis) kpis.innerHTML = data.kpis;
        if (insight) insight.innerHTML = data.insight;
        if (orderCount) orderCount.textContent = data.orderCountLabel;
        if (orderRows) orderRows.innerHTML = data.orderRows;
      }
      function startDashboardPolling() {
        if (!dashboardPoll) dashboardPoll = setInterval(refreshDashboard, 5000);
      }
      if ('EventSource' in window) {
        const events = new EventSource('/admin/events');
        events.addEventListener('dashboard', refreshDashboard);
        events.onerror = startDashboardPolling;
      } else {
        startDashboardPolling();
      }
    </script>`;
  return layout('Shop Dashboard', adminShell({ title: 'Ringkasan', subtitle: `${shop.name} Dashboard`, userLabel: user.email, role: 'Shop Dashboard', shopSlug: shop.slug, body }), shop.primary_color);
}

export function shopSettingsPage({ user, shop, pricing = {}, products = [], paperSizes = [], updated = false }) {
  const publicLink = `/shop/${escapeHtml(shop.slug)}`;
  const successBanner = updated ? '<div class="admin-success" role="status">Tetapan kedai berjaya dikemaskini.</div>' : '';
  const paperSizeRows = paperSizes.map((size) => String(size.id).startsWith('legacy-a4-')
    ? `<div class="product-edit-row paper-size-legacy"><label>Saiz <input readonly value="${escapeHtml(size.label)}"></label><label>B/W per page (RM) <input readonly value="${formatMoney(size.bw_price_per_page)}"></label><label>Color per page (RM) <input readonly value="${formatMoney(size.color_price_per_page)}"></label><p class="muted">A4 legacy. Tambah saiz baru untuk aktifkan manager.</p></div>`
    : `<form class="product-edit-row" method="post" action="/admin/paper-sizes/${escapeHtml(size.id)}">
      <label>Saiz <input required name="label" value="${escapeHtml(size.label)}"></label>
      <label>B/W per page (RM) <input required type="number" min="0" step="0.01" name="bw_price_per_page" value="${Number(size.bw_price_per_page).toFixed(2)}"></label>
      <label>Color per page (RM) <input required type="number" min="0" step="0.01" name="color_price_per_page" value="${Number(size.color_price_per_page).toFixed(2)}"></label>
      <label class="check product-active"><input type="checkbox" name="is_active" ${size.is_active ? 'checked' : ''}> <span>Aktif</span></label>
      <button type="submit">Simpan Saiz</button>
    </form>`).join('');
  const productRows = products.map((product) => `<form class="product-edit-row" method="post" action="/admin/products/${escapeHtml(product.id)}">
    <label>Nama <input required name="name" value="${escapeHtml(product.name)}"></label>
    <label>Description <input name="description" value="${escapeHtml(product.description || '')}"></label>
    <label>Harga (RM) <input required type="number" min="0" step="0.01" name="price" value="${Number(product.price).toFixed(2)}"></label>
    <label class="check product-active"><input type="checkbox" name="is_active" ${product.is_active ? 'checked' : ''}> <span>Aktif</span></label>
    <button type="submit">Simpan Produk</button>
  </form>`).join('');
  const body = `${successBanner}<form class="admin-settings-form" method="post" action="/admin/settings">
    <section class="admin-panel settings-panel">
      <div class="panel-head"><div><p class="eyebrow">Maklumat kedai</p><h2>Profil public shop</h2></div><span>Link dikunci: ${publicLink}</span></div>
      <div class="settings-grid">
        <label>Nama kedai <input required name="name" value="${escapeHtml(shop.name)}"></label>
        <label>Telefon kedai <input required name="phone" value="${escapeHtml(shop.phone)}" inputmode="tel"></label>
        <label class="settings-full">Description <textarea required name="description">${escapeHtml(shop.description)}</textarea></label>
        <label class="settings-full">Alamat / kawasan <textarea required name="address">${escapeHtml(shop.address)}</textarea></label>
        <label>Google Maps URL <input name="google_maps_url" type="url" value="${escapeHtml(shop.google_maps_url)}"></label>
        <label>Waktu operasi <input required name="operating_hours" value="${escapeHtml(shop.operating_hours)}"></label>
        <label>Warna utama <input required name="primary_color" type="color" value="${escapeHtml(shop.primary_color || '#062b66')}"></label>
        <label>Public link <input readonly value="${publicLink}" aria-label="Public shop link"></label>
      </div>
    </section>
    <div class="settings-actions"><button type="submit">Simpan Tetapan</button><a class="button ghost" href="${publicLink}">Buka Link Kedai</a></div>
  </form>
  <section class="admin-panel settings-panel product-manager">
    <div class="panel-head"><div><p class="eyebrow">Pricing</p><h2>Harga ikut saiz kertas</h2></div><span>Dipaparkan di page order</span></div>
    <div class="product-manager-body">
      <details class="settings-accordion" open>
        <summary>
          <span>Minimum order & saiz kertas</span>
          <small>${paperSizes.length} saiz, RM${Number(shop.minimum_order_amount ?? 5).toFixed(2)} minimum</small>
        </summary>
        <div class="settings-accordion-body">
          <form class="minimum-order-row" method="post" action="/admin/settings">
            <label>Minimum online order (RM) <input required type="number" min="0" step="0.01" name="minimum_order_amount" value="${Number(shop.minimum_order_amount ?? 5).toFixed(2)}"></label>
            <input type="hidden" name="name" value="${escapeHtml(shop.name)}">
            <input type="hidden" name="phone" value="${escapeHtml(shop.phone)}">
            <input type="hidden" name="description" value="${escapeHtml(shop.description)}">
            <input type="hidden" name="address" value="${escapeHtml(shop.address)}">
            <input type="hidden" name="google_maps_url" value="${escapeHtml(shop.google_maps_url)}">
            <input type="hidden" name="operating_hours" value="${escapeHtml(shop.operating_hours)}">
            <input type="hidden" name="primary_color" value="${escapeHtml(shop.primary_color || '#062b66')}">
            <button type="submit">Simpan Minimum</button>
          </form>
          <form class="product-create-row" method="post" action="/admin/paper-sizes">
            <label>Saiz <input required name="label" placeholder="Contoh: A3"></label>
            <label>B/W per page (RM) <input required type="number" min="0" step="0.01" name="bw_price_per_page" value="0.00"></label>
            <label>Color per page (RM) <input required type="number" min="0" step="0.01" name="color_price_per_page" value="0.00"></label>
            <label class="check product-active"><input type="checkbox" name="is_active" checked> <span>Aktif</span></label>
            <button type="submit">Tambah Saiz</button>
          </form>
          <div class="product-edit-list">${paperSizeRows || '<p class="empty-products">Belum ada saiz kertas.</p>'}</div>
        </div>
      </details>
    </div>
  </section>
  <section class="admin-panel settings-panel product-manager">
    <div class="panel-head"><div><p class="eyebrow">Produk / Add-on</p><h2>Produk tambahan order</h2></div><span>Checkbox di page order</span></div>
    <div class="product-manager-body">
      <details class="settings-accordion">
        <summary>
          <span>Produk tambahan order</span>
          <small>${products.length} produk add-on</small>
        </summary>
        <div class="settings-accordion-body">
          <form class="product-create-row" method="post" action="/admin/products">
            <label>Nama produk <input required name="name" placeholder="Contoh: Binding"></label>
            <label>Description <input name="description" placeholder="Comb bind / cover / laminate"></label>
            <label>Harga (RM) <input required type="number" min="0" step="0.01" name="price" value="0.00"></label>
            <label class="check product-active"><input type="checkbox" name="is_active" checked> <span>Aktif</span></label>
            <button type="submit">Tambah Produk</button>
          </form>
          <div class="product-edit-list">${productRows || '<p class="empty-products">Belum ada produk add-on.</p>'}</div>
        </div>
      </details>
    </div>
  </section>`;
  return layout('Tetapan Kedai', adminShell({ title: 'Tetapan Kedai', subtitle: `${shop.name} Dashboard`, userLabel: user.email, active: 'settings', role: 'Shop Dashboard', shopSlug: shop.slug, body }), shop.primary_color);
}


function dateParts(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return { day: '', month: '', year: '' };
  const iso = date.toISOString();
  return { day: iso.slice(0, 10), month: iso.slice(0, 7), year: iso.slice(0, 4) };
}

function sumAmount(items) {
  return items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

function normalizeDateInput(value) {
  const raw = String(value || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return new Date().toISOString().slice(0, 10);
  const date = new Date(`${raw}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === raw ? raw : new Date().toISOString().slice(0, 10);
}

function displayDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-GB');
}

export function revenuePage({ user, shop = null, shops = [], orders = [], payments = [], subscriptions = [], mode = 'orders', selectedDate = '', page = 1 }) {
  const today = new Date().toISOString().slice(0, 10);
  const reportDate = normalizeDateInput(selectedDate);
  const month = reportDate.slice(0, 7);
  const year = reportDate.slice(0, 4);
  const source = payments
    .filter((p) => p.status === 'paid' && p.paid_at)
    .filter((p) => mode === 'subscriptions' ? p.subscription_id : p.order_id)
    .map((payment) => {
      const order = payment.order_id ? orders.find((o) => o.id === payment.order_id) : null;
      const subscription = payment.subscription_id ? subscriptions.find((s) => s.id === payment.subscription_id) : null;
      const paymentShop = order ? shops.find((s) => s.id === order.shop_id) : null;
      return { payment, order, subscription, shop: shop || paymentShop, parts: dateParts(payment.paid_at), amount: Number(payment.amount || 0) };
    })
    .sort((a, b) => String(b.payment.paid_at).localeCompare(String(a.payment.paid_at)));
  const daily = source.filter((item) => item.parts.day === reportDate);
  const monthly = source.filter((item) => item.parts.month === month);
  const yearly = source.filter((item) => item.parts.year === year);
  const visibleRows = source.filter((item) => item.parts.month === month);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / pageSize));
  const currentPage = Math.min(Math.max(Number.isFinite(page) ? page : 1, 1), totalPages);
  const pageRows = visibleRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const queryDate = `date=${encodeURIComponent(reportDate)}`;
  const pagination = visibleRows.length > pageSize ? `<div class="table-pagination"><a class="page-link ${currentPage === 1 ? 'disabled' : ''}" ${currentPage === 1 ? 'aria-disabled="true"' : `href="/admin/revenue?${queryDate}&page=${currentPage - 1}"`}>Sebelumnya</a><span>Page ${currentPage} / ${totalPages}</span><a class="page-link ${currentPage === totalPages ? 'disabled' : ''}" ${currentPage === totalPages ? 'aria-disabled="true"' : `href="/admin/revenue?${queryDate}&page=${currentPage + 1}"`}>Seterusnya</a></div>` : '';
  const rows = pageRows.map((item) => {
    const ref = item.order?.order_code || item.subscription?.subscription_code || item.payment.gateway_reference || item.payment.id;
    const sourceLabel = mode === 'subscriptions'
      ? `${item.subscription?.plan_label || 'Langganan'}${item.shop ? ` · ${escapeHtml(item.shop.name)}` : ''}`
      : `${item.order?.customer_name ? escapeHtml(item.order.customer_name) : 'Order print'}${item.order?.customer_phone ? `<small>${escapeHtml(item.order.customer_phone)}</small>` : ''}`;
    return `<tr><td>${new Date(item.payment.paid_at).toLocaleString()}</td><td><b>${escapeHtml(ref)}</b></td><td>${sourceLabel}</td><td><b>${formatMoney(item.amount)}</b></td></tr>`;
  }).join('');
  const title = 'Ringkasan Hasil';
  const subtitle = mode === 'subscriptions' ? 'Revenue langganan platform' : `${shop?.name || 'Kedai'} Revenue`;
  const body = `<section class="admin-kpi-grid revenue-kpis">
      ${metricCard('Hasil Tarikh Ini', formatMoney(sumAmount(daily)), 'red', 'paid', true)}
      ${metricCard('Bulan Ini', formatMoney(sumAmount(monthly)), 'blue', 'paid')}
      ${metricCard('Tahun Ini', formatMoney(sumAmount(yearly)), 'yellow', 'alert')}
      ${metricCard('Jumlah Transaksi', source.length, 'green', 'check')}
    </section>
    <section class="admin-panel revenue-panel"><div class="panel-head"><div><p class="eyebrow">Pemantauan hasil</p><h2>${mode === 'subscriptions' ? 'Langganan Berbayar' : 'Order Berbayar'}</h2><p class="revenue-date-note">Paparan berdasarkan tarikh: ${displayDate(reportDate)}</p></div><span>${source.length} transaksi</span></div><form class="revenue-filter" method="get" action="/admin/revenue"><label>Tarikh <input type="date" name="date" value="${escapeHtml(reportDate)}" aria-label="Pilih tarikh revenue"></label><a href="/admin/revenue">Hari Ini</a></form><script>document.querySelector('.revenue-filter input[name="date"]')?.addEventListener('change', (event) => { if (event.target.value) location.href = '/admin/revenue?date=' + encodeURIComponent(event.target.value); });</script><div class="table-wrap"><table><thead><tr><th>Paid At</th><th>Reference</th><th>Source</th><th>Amount</th></tr></thead><tbody>${rows || '<tr><td class="empty-state" colspan="4"><b>Belum ada hasil berbayar.</b><span>Transaksi akan muncul selepas bayaran berjaya.</span></td></tr>'}</tbody></table></div>${pagination}</section>`;
  const role = user.role === 'super_admin' ? 'Super Admin' : 'Shop Dashboard';
  return layout(title, adminShell({ title, subtitle, userLabel: user.email, active: 'revenue', role, shopSlug: shop?.slug || '', body }), shop?.primary_color);
}

export function ordersManagementPage({ user, shop = null, shops = [], orders, updated = false, page = 1 }) {
  const totalOrders = orders.length;
  const readyOrders = orders.filter((o) => o.order_status === 'Ready for Pickup').length;
  const activeOrders = orders.filter((o) => !['Completed', 'Cancelled'].includes(o.order_status)).length;
  const today = new Date().toISOString().slice(0, 10);
  const todayPickups = orders.filter((o) => o.pickup_date === today).length;
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(totalOrders / pageSize));
  const currentPage = Math.min(Math.max(Number.isFinite(page) ? page : 1, 1), totalPages);
  const pageOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const rows = pageOrders.map((o) => {
    const orderShop = shop || shops.find((s) => s.id === o.shop_id);
    const customer = `<b>${escapeHtml(o.customer_name)}</b><small>${escapeHtml(o.customer_phone)}</small>`;
    const shopCell = orderShop ? `<small>${escapeHtml(orderShop.name)}</small>` : '';
    return `<tr><td><a class="admin-link" href="/admin/orders/${o.id}">${o.order_code}</a>${shopCell}</td><td>${customer}</td><td>${o.pickup_date}</td><td>${formatMoney(o.total_amount)}</td><td><span class="pill ${statusClass(o.payment_status)}">${o.payment_status}</span></td><td><span class="status-chip ${statusClass(o.order_status)}">${o.order_status}</span></td><td>${new Date(o.created_at).toLocaleString()}</td><td><a class="table-action neutral" href="/admin/orders/${o.id}">Urus</a></td></tr>`;
  }).join('');
  const pagination = totalOrders > pageSize ? `<div class="table-pagination"><a class="page-link ${currentPage === 1 ? 'disabled' : ''}" ${currentPage === 1 ? 'aria-disabled="true"' : `href="/admin/orders?page=${currentPage - 1}"`}>Sebelumnya</a><span>Page ${currentPage} / ${totalPages}</span><a class="page-link ${currentPage === totalPages ? 'disabled' : ''}" ${currentPage === totalPages ? 'aria-disabled="true"' : `href="/admin/orders?page=${currentPage + 1}"`}>Seterusnya</a></div>` : '';
  const successBanner = updated ? '<div class="admin-success" role="status">Status order berjaya dikemaskini.</div>' : '';
  const body = `${successBanner}<section class="admin-kpi-grid">
      ${metricCard('Total Order', totalOrders, 'red', 'orders', true)}
      ${metricCard('Order Aktif', activeOrders, 'blue', 'paid')}
      ${metricCard('Sedia Pickup', readyOrders, 'yellow', 'alert')}
      ${metricCard('Pickup Hari Ini', todayPickups, 'green', 'check')}
    </section>
    <section class="admin-panel"><div class="panel-head"><div><p class="eyebrow">Pengurusan kerja</p><h2>Senarai Order</h2></div><span>${orders.length} total</span></div><div class="table-wrap"><table><thead><tr><th>Order ID</th><th>Customer</th><th>Pickup</th><th>Total</th><th>Payment</th><th>Status</th><th>Created</th><th>Action</th></tr></thead><tbody>${rows || '<tr><td class="empty-state" colspan="8"><b>Belum ada order.</b><span>Order pelanggan akan muncul di sini selepas checkout.</span></td></tr>'}</tbody></table></div>${pagination}</section>`;
  const role = user.role === 'super_admin' ? 'Super Admin' : 'Shop Dashboard';
  const title = 'Pengurusan Order';
  const subtitle = shop ? `${shop.name} Dashboard` : 'Semua order platform';
  return layout(title, adminShell({ title, subtitle, userLabel: user.email, active: user.role === 'super_admin' ? '' : 'orders', role, shopSlug: shop?.slug || '', body }), shop?.primary_color);
}

export function orderDetails({ order, shop, slot, user, updated = false }) {
  const statuses = ['Paid / New Order', 'Printing', 'Ready for Pickup', 'Completed', 'Cancelled', 'File Problem'].map((s) => `<option ${order.order_status === s ? 'selected' : ''}>${s}</option>`).join('');
  const successBanner = updated ? '<div class="admin-success" role="status">Status order berjaya dikemaskini.</div>' : '';
  const addOns = (order.product_items || []).map((product) => `${escapeHtml(product.name)} (${formatMoney(product.price)})`).join('<br>') || '-';
  const files = order.files?.length ? order.files : [{ original_file_name: order.original_file_name || 'order.pdf', page_count: order.page_count, file_path: order.file_path }];
  const fileLinks = files.map((file, index) => `<a class="button ${index ? 'ghost' : ''}" href="/admin/orders/${order.id}/download/${index + 1}">Download PDF ${files.length > 1 ? index + 1 : ''}</a>`).join('');
  const fileList = files.map((file, index) => `<li><b>${escapeHtml(file.original_file_name || `PDF ${index + 1}`)}</b><span>${Number(file.page_count || 0)} page(s)</span></li>`).join('');
  const body = `${successBanner}<section class="admin-detail"><p class="eyebrow">Order detail</p><div class="detail-title"><div><h1>${order.order_code}</h1><p>${escapeHtml(order.customer_name)} · <a href="https://wa.me/${escapeHtml(order.customer_phone)}">WhatsApp</a></p></div><span class="status-chip ${statusClass(order.order_status)}">${order.order_status}</span></div><div class="receipt detail-grid"><p><span>Files</span><b>${files.length}</b></p><p><span>Pages</span><b>${order.page_count}</b></p><p><span>Paper size</span><b>${escapeHtml(order.paper_size || 'A4')}</b></p><p><span>Type</span><b>${order.print_type}</b></p><p><span>Sides</span><b>${order.sides}</b></p><p><span>Copies</span><b>${order.copies}</b></p><p><span>Add-ons</span><b>${addOns}</b></p><p><span>Pickup</span><b>${order.pickup_date}, ${labelSlot(slot)}</b></p><p><span>Print subtotal</span><b>${formatMoney(order.subtotal ?? order.total_amount)}</b></p><p><span>Add-on total</span><b>${formatMoney(order.product_total || 0)}</b></p><p><span>Total</span><b>${formatMoney(order.total_amount)}</b></p><p><span>Notes</span><b>${order.notes ? escapeHtml(order.notes) : '-'}</b></p><p><span>File delete at</span><b>${new Date(order.file_delete_at).toLocaleString()}</b></p></div><div class="file-list"><p class="eyebrow">Uploaded PDFs</p><ul>${fileList}</ul></div><div class="detail-actions">${fileLinks}<a class="button ghost" href="/admin">Back to dashboard</a></div><form class="status-form" method="post" action="/admin/orders/${order.id}/status"><label>Status <select name="order_status">${statuses}</select></label><button>Update status</button></form></section>`;
  return layout(order.order_code, adminShell({ title: order.order_code, subtitle: 'Order detail', userLabel: user?.email || shop.name, active: 'orders', role: 'Shop Dashboard', shopSlug: shop.slug, body }), shop.primary_color);
}

export function superDashboard({ shops, orders, subscriptions = [] }) {
  const successfulSubscriptions = subscriptions.filter((s) => s.payment_status === 'paid').length;
  const activeShops = shops.filter((s) => s.is_active).length;
  const rows = shops.map((s) => `<tr><td><b>${escapeHtml(s.name)}</b><small>/shop/${escapeHtml(s.slug)}</small></td><td><span class="status-chip ${s.is_active ? 'active' : 'inactive'}">${s.is_active ? 'Active' : 'Inactive'}</span></td><td>${escapeHtml(s.plan)}</td><td><span class="pill ${statusClass(s.subscription_status)}">${escapeHtml(s.subscription_status)}</span></td><td>${orders.filter((o) => o.shop_id === s.id).length}</td><td>${new Date(s.created_at).toLocaleDateString()}</td></tr>`).join('');
  const subscriptionRows = subscriptions.map((sub) => {
    const shop = sub.shop_id ? shops.find((s) => s.id === sub.shop_id) : null;
    const shopCell = shop ? `<a class="admin-link" href="/shop/${escapeHtml(shop.slug)}">${escapeHtml(shop.name)}</a>` : '-';
    return `<tr><td><b>${escapeHtml(sub.subscription_code)}</b><small>${escapeHtml(sub.plan_label)}</small></td><td>${escapeHtml(sub.email)}</td><td>${escapeHtml(sub.phone)}</td><td>${formatMoney(sub.amount)}</td><td><span class="pill ${statusClass(sub.payment_status)}">${escapeHtml(sub.payment_status)}</span></td><td>${shopCell}</td><td>${new Date(sub.created_at).toLocaleString()}</td></tr>`;
  }).join('');
  const body = `${storyBand(
      `${activeShops} kedai aktif sedang beroperasi`,
      `${successfulSubscriptions} langganan berbayar direkodkan · ${shops.length} tenant keseluruhan`,
      [
        { label: 'Jumlah kedai', value: shops.length, hint: 'tenant platform' },
        { label: 'Aktif', value: activeShops, hint: 'sedang online' },
        { label: 'Langganan', value: successfulSubscriptions, hint: 'bayaran berjaya' }
      ],
      { href: '#orders', label: 'Semak tenant' }
    )}
    <section id="orders" class="admin-panel"><div class="panel-head"><div><p class="eyebrow">Tenant aktif</p><h2>Kedai</h2></div><span>${shops.length} total</span></div><div class="table-wrap"><table><thead><tr><th>Shop</th><th>Status</th><th>Plan</th><th>Subscription</th><th>Orders</th><th>Created</th></tr></thead><tbody>${rows}</tbody></table></div></section>
    <section class="admin-panel lead-table"><div class="panel-head"><div><p class="eyebrow">Pemerolehan</p><h2>Langganan</h2></div><span>${subscriptions.length} total</span></div><div class="table-wrap"><table><thead><tr><th>Code</th><th>Email</th><th>Phone</th><th>Amount</th><th>Payment</th><th>Shop</th><th>Created</th></tr></thead><tbody>${subscriptionRows || '<tr><td class="empty-state" colspan="7"><b>No subscriptions yet.</b><span>Paid subscription leads will appear here.</span></td></tr>'}</tbody></table></div></section>`;
  return layout('Super Admin', adminShell({ title: 'CetakNow Super Admin', subtitle: 'Ringkasan Platform', userLabel: 'owner@cetaknow.local', role: 'Super Admin', body }));
}

export function shopsManagementPage({ user, shops, orders }) {
  const activeShops = shops.filter((s) => s.is_active).length;
  const inactiveShops = shops.length - activeShops;
  const rows = shops.map((s) => {
    const orderCount = orders.filter((o) => o.shop_id === s.id).length;
    const actionLabel = s.is_active ? 'Nyahaktifkan' : 'Aktifkan';
    const actionClass = s.is_active ? 'danger' : 'success';
    return `<tr><td><b>${escapeHtml(s.name)}</b><small>/shop/${escapeHtml(s.slug)}</small></td><td><span class="status-chip ${s.is_active ? 'active' : 'inactive'}">${s.is_active ? 'Active' : 'Inactive'}</span></td><td>${escapeHtml(s.plan)}</td><td><span class="pill ${statusClass(s.subscription_status)}">${escapeHtml(s.subscription_status)}</span></td><td>${orderCount}</td><td>${new Date(s.created_at).toLocaleDateString()}</td><td><form class="inline-action" method="post" action="/admin/shops/${s.id}/status"><button class="table-action ${actionClass}" type="submit">${actionLabel}</button></form></td></tr>`;
  }).join('');
  const body = `<section class="admin-kpi-grid">
      ${metricCard('Jumlah Kedai', shops.length, 'red', 'orders', true)}
      ${metricCard('Kedai Aktif', activeShops, 'blue', 'paid')}
      ${metricCard('Tidak Aktif', inactiveShops, 'yellow', 'alert')}
    </section>
    <section class="admin-panel"><div class="panel-head"><div><p class="eyebrow">Pengurusan tenant</p><h2>Senarai Kedai</h2></div><span>${shops.length} total</span></div><div class="table-wrap"><table><thead><tr><th>Kedai</th><th>Status</th><th>Plan</th><th>Subscription</th><th>Orders</th><th>Created</th><th>Action</th></tr></thead><tbody>${rows || '<tr><td class="empty-state" colspan="7"><b>Belum ada kedai.</b><span>Kedai yang berjaya setup akan muncul di sini.</span></td></tr>'}</tbody></table></div></section>`;
  return layout('Pengurusan Kedai', adminShell({ title: 'Pengurusan Kedai', subtitle: 'Urus tenant CetakNow', userLabel: user.email, active: 'orders', role: 'Super Admin', body }));
}

export function mockPaymentPage(order) {
  return layout('Mock Billplz', `<main class="page narrow"><section class="card"><p class="eyebrow">Billplz Mock</p><h1>Pay ${formatMoney(order.total_amount)}</h1><p>Order ${order.order_code}</p><form method="post" action="/payment/mock/${order.order_code}/success"><button>Simulate successful payment</button></form></section></main>`);
}

export function mockSubscriptionPaymentPage(subscription) {
  return layout('Mock Billplz Subscription', `<main class="page narrow"><section class="card"><p class="eyebrow">Billplz Mock</p><h1>Pay ${formatMoney(subscription.amount)}</h1><p>${escapeHtml(subscription.plan_label)} · ${escapeHtml(subscription.subscription_code)}</p><p>${escapeHtml(subscription.email)} · ${escapeHtml(subscription.phone)}</p><form method="post" action="/payment/subscription/mock/${subscription.subscription_code}/success"><button>Simulate successful payment</button></form></section></main>`);
}

export function subscriptionConfirmationPage(subscription, shop = null) {
  if (shop) {
    return layout('Link kedai siap - CetakNow', `<main class="page narrow setup-page"><section class="card success setup-success"><p class="eyebrow">Page kedai siap</p><h1>Link CetakNow kedai anda sudah dijana.</h1><p>Kongsi link ini di WhatsApp, bio media sosial, QR poster, atau mesej pelanggan.</p><div class="receipt shop-link-receipt"><p>Nama kedai: <b>${escapeHtml(shop.name)}</b></p><p>Link kedai: <a href="/shop/${escapeHtml(shop.slug)}"><b>/shop/${escapeHtml(shop.slug)}</b></a></p><p>Pelan: <b>${escapeHtml(subscription.plan_label)}</b></p><p>Login dashboard: <b>${escapeHtml(subscription.email)}</b></p></div><div class="setup-actions"><a class="button" href="/login">Log Masuk Dashboard</a><a class="button ghost" href="/shop/${escapeHtml(shop.slug)}">Buka Page Kedai</a><a class="button ghost" href="/">Kembali ke landing page</a></div></section></main>`, shop.primary_color);
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
        <div class="two"><label>Telefon kedai * <input required name="phone" inputmode="tel" autocomplete="tel" value="${escapeHtml(subscription.phone)}" placeholder="60123456789"></label><fieldset class="operating-hours-picker"><legend>Waktu operasi *</legend><input type="hidden" name="operating_hours" value="Mon-Sat, 9:00 AM - 9:00 PM"><div class="day-picker" aria-label="Pilih hari operasi"><label><input type="checkbox" value="Mon" checked>Mon</label><label><input type="checkbox" value="Tue" checked>Tue</label><label><input type="checkbox" value="Wed" checked>Wed</label><label><input type="checkbox" value="Thu" checked>Thu</label><label><input type="checkbox" value="Fri" checked>Fri</label><label><input type="checkbox" value="Sat" checked>Sat</label><label><input type="checkbox" value="Sun">Sun</label></div><div class="time-picker"><label>Buka <input type="time" class="open-time" value="09:00"></label><label>Tutup <input type="time" class="close-time" value="21:00"></label></div><small class="muted operating-preview">Waktu operasi: Mon-Sat, 9:00 AM - 9:00 PM</small></fieldset></div>
        <label>Alamat / kawasan * <textarea required name="address" placeholder="Dekat kampus, mall, taman..."></textarea></label>
        <label>Link lokasi kedai <input name="google_maps_url" type="url" placeholder="https://maps.google.com/..."><small class="muted">Optional. Paste link lokasi kedai dari Google Maps atau Waze.</small></label>
        <div class="dashboard-account-block"><p class="eyebrow">Akaun dashboard owner</p><h3>Login untuk urus order kedai</h3><p class="muted">Email login: <b>${escapeHtml(subscription.email)}</b></p><div class="two"><label>Password dashboard * <input required name="password" type="password" minlength="6" autocomplete="new-password"></label><label>Sahkan password * <input required name="password_confirm" type="password" minlength="6" autocomplete="new-password"></label></div></div>
        <button>Jana Link Kedai</button>
        <p class="form-reassurance">Slot pickup asas dan harga default akan disediakan dahulu. Harga boleh dikemas kini kemudian dalam dashboard owner.</p>
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
      const operatingInput = document.querySelector('input[name="operating_hours"]');
      const operatingPreview = document.querySelector('.operating-preview');
      const dayInputs = [...document.querySelectorAll('.day-picker input[type="checkbox"]')];
      const openTime = document.querySelector('.open-time');
      const closeTime = document.querySelector('.close-time');
      let slugTouched = false;
      function toSlug(value) {
        return String(value || '').toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64);
      }
      function syncSlugPreview() {
        const slug = toSlug(slugInput?.value) || 'nama-kedai';
        previews.forEach((preview) => preview.textContent = slug);
      }
      function formatTime(value) {
        const [hourRaw, minute = '00'] = String(value || '').split(':');
        const hour = Number(hourRaw);
        if (!Number.isFinite(hour)) return '';
        const suffix = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return displayHour + ':' + minute + ' ' + suffix;
      }
      function formatDays(days) {
        const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        if (days.length === 6 && days.every((day, index) => day === order[index])) return 'Mon-Sat';
        if (days.length === 7) return 'Mon-Sun';
        return days.join(', ');
      }
      function syncOperatingHours() {
        const days = dayInputs.filter((input) => input.checked).map((input) => input.value);
        const dayLabel = formatDays(days) || 'Hari belum dipilih';
        const start = formatTime(openTime?.value || '09:00');
        const end = formatTime(closeTime?.value || '21:00');
        const value = dayLabel + ', ' + start + ' - ' + end;
        if (operatingInput) operatingInput.value = value;
        if (operatingPreview) operatingPreview.textContent = 'Waktu operasi: ' + value;
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
      dayInputs.forEach((input) => input.addEventListener('change', syncOperatingHours));
      openTime?.addEventListener('input', syncOperatingHours);
      closeTime?.addEventListener('input', syncOperatingHours);
      syncSlugPreview();
      syncOperatingHours();
    </script>
  </main>`);
}

function dayName(index) {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][Number(index)] || 'Day';
}
