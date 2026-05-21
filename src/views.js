import { escapeHtml } from './http-utils.js';
import { formatMoney } from './pricing.js';
import { labelSlot } from './pickup.js';

export function layout(title, body, color = '#004581') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/public/styles.css">
  <style>
    :root {
      --brand: ${color};
      --cn-navy: #062b66;
      --cn-deep: #071426;
      --cn-blue: #0b4f9f;
      --cn-yellow: #ffc20a;
      --cn-yellow-soft: #fff4c7;
      --cn-ice: #eaf4ff;
    }
    body {
      font-family: 'Inter', sans-serif;
    }
    .text-balance {
      text-wrap: balance;
    }
  </style>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: '${color}',
            'cn-navy': '#062b66',
            'cn-deep': '#071426',
            'cn-blue': '#0b4f9f',
            'cn-yellow': '#ffc20a',
            'cn-yellow-soft': '#fff4c7',
            'cn-ice': '#eaf4ff',
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
        }
      }
    }
  </script>
</head>
<body class="bg-white text-[#142033] antialiased overflow-x-hidden">${body}</body>
</html>`;
}

export function landingPage({ leadCount = 0 } = {}) {
  const icons = {
    upload: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>`,
    calculator: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>`,
    package: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
    shield: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
    store: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>`,
    grad: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    lock: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    mail: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    arrow: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`
  };

  return layout('CetakNow - Tempahan Print Online Mudah', `
  <main class="relative">
    <!-- Navbar -->
    <nav class="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 md:h-20">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <a href="/" class="flex items-center space-x-2">
              <img class="h-8 md:h-10 w-auto" src="/public/assets/primary-logo.png" alt="CetakNow">
            </a>
          </div>
          <!-- Desktop nav links -->
          <div class="hidden md:flex items-center space-x-8">
            <a href="#about" class="text-slate-600 hover:text-cn-navy font-semibold transition-colors">Tentang</a>
            <a href="#problems" class="text-slate-600 hover:text-cn-navy font-semibold transition-colors">Masalah</a>
            <a href="#how" class="text-slate-600 hover:text-cn-navy font-semibold transition-colors">Cara Guna</a>
            <a href="#pricing" class="text-slate-600 hover:text-cn-navy font-semibold transition-colors">Harga</a>
          </div>
          <!-- Desktop buttons + Mobile hamburger -->
          <div class="flex items-center">
            <!-- Desktop: Log Masuk + Daftar -->
            <div class="hidden md:flex items-center space-x-4">
              <a href="/login" class="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all text-sm">Log Masuk</a>
              <a href="#pricing" class="px-6 py-2.5 rounded-full bg-cn-yellow text-cn-deep font-black shadow-lg shadow-cn-yellow/20 hover:scale-[1.02] active:scale-95 transition-all text-sm">Daftar</a>
            </div>
            <!-- Mobile: hamburger button -->
            <button id="mobile-menu-btn" class="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors" aria-label="Buka menu">
              <svg id="menu-icon-open" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              <svg id="menu-icon-close" class="hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile menu overlay -->
    <div id="mobile-menu" class="fixed inset-0 z-50 md:hidden hidden" aria-hidden="true">
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" id="mobile-menu-backdrop"></div>
      <div class="fixed right-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
        <div class="flex justify-end p-4">
          <button id="mobile-menu-close" class="flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors" aria-label="Tutup menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div class="px-6 pb-8 space-y-1">
          <a href="#about" class="block px-4 py-3 rounded-xl text-slate-700 hover:bg-cn-ice font-semibold transition-colors">Tentang</a>
          <a href="#problems" class="block px-4 py-3 rounded-xl text-slate-700 hover:bg-cn-ice font-semibold transition-colors">Masalah</a>
          <a href="#how" class="block px-4 py-3 rounded-xl text-slate-700 hover:bg-cn-ice font-semibold transition-colors">Cara Guna</a>
          <a href="#pricing" class="block px-4 py-3 rounded-xl text-slate-700 hover:bg-cn-ice font-semibold transition-colors">Harga</a>
          <hr class="my-4 border-slate-100">
          <a href="/login" class="block w-full text-center px-5 py-3 rounded-full border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all">Log Masuk</a>
          <a href="#pricing" class="block w-full text-center px-5 py-3 rounded-full bg-cn-yellow text-cn-deep font-black shadow-lg shadow-cn-yellow/20 hover:scale-[1.02] active:scale-95 transition-all">Daftar</a>
        </div>
      </div>
    </div>

    <!-- Hero -->
    <header id="home" class="relative overflow-hidden bg-gradient-to-b from-cn-ice via-[#f7fbff] to-white pt-16 pb-24 md:pt-24 md:pb-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div class="flex justify-center mb-8">
          <img src="/public/assets/icon.png" alt="CetakNow icon" class="h-32 w-auto drop-shadow-2xl animate-[float_6s_ease-in-out_infinite]">
        </div>
        <p class="inline-block px-4 py-1.5 rounded-full bg-cn-blue/10 text-cn-blue text-xs font-black tracking-widest uppercase mb-6">Platform Tempahan Print Online</p>
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-black text-cn-deep tracking-tight text-balance leading-[0.9] mb-8">
          Tempahan Print Online<br><span class="text-cn-blue">Mudah & Tersusun</span>
        </h1>
        <p class="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-10">
          Bantu kedai print terima fail PDF, kira harga, ambil bayaran, dan susun pickup tanpa mesej WhatsApp berselerak.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a href="#pricing" class="w-full sm:w-auto px-10 py-4 rounded-full bg-cn-yellow text-cn-deep text-lg font-black shadow-xl shadow-cn-yellow/30 hover:scale-105 transition-all">Daftar Sekarang</a>
          <a href="#solution" class="w-full sm:w-auto px-10 py-4 rounded-full bg-white text-cn-navy text-lg font-black border-2 border-slate-100 shadow-sm hover:bg-slate-50 transition-all">Lihat Demo</a>
        </div>
        <div class="flex flex-wrap justify-center gap-6 text-sm font-bold text-slate-500">
          <span class="flex items-center gap-2"><span class="text-green-500">${icons.check}</span> Upload PDF</span>
          <span class="flex items-center gap-2"><span class="text-green-500">${icons.check}</span> Auto Kira Harga</span>
          <span class="flex items-center gap-2"><span class="text-green-500">${icons.check}</span> Slot Pickup</span>
        </div>
      </div>
      <!-- Abstract shapes -->
      <div class="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-cn-blue/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-cn-yellow/5 rounded-full blur-3xl"></div>
    </header>

    <!-- About / What is it -->
    <section id="about" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <p class="text-cn-blue font-black tracking-widest uppercase text-sm mb-4">Tentang Kami</p>
          <h2 class="text-3xl md:text-5xl font-black text-cn-deep mb-6 leading-tight">Apa Itu CetakNow?</h2>
          <p class="text-lg text-slate-600 font-medium leading-relaxed">
            CetakNow ialah platform digital ringkas untuk kedai print kecil menerima tempahan online secara lebih teratur.
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-cn-blue/20 hover:bg-white hover:shadow-2xl hover:shadow-cn-blue/10 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl bg-cn-blue/10 text-cn-blue flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">${icons.upload}</div>
            <h3 class="text-xl font-black text-cn-deep mb-3">Upload PDF</h3>
            <p class="text-slate-600 font-medium leading-relaxed">Pelanggan terus upload fail PDF dari telefon atau laptop tanpa perlu WhatsApp.</p>
          </div>
          <div class="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-cn-yellow/20 hover:bg-white hover:shadow-2xl hover:shadow-cn-yellow/10 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl bg-cn-yellow/10 text-cn-deep flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">${icons.calculator}</div>
            <h3 class="text-xl font-black text-cn-deep mb-3">Auto Kira Harga</h3>
            <p class="text-slate-600 font-medium leading-relaxed">Sistem kira harga automatik berdasarkan saiz, warna, dan jumlah muka surat.</p>
          </div>
          <div class="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-cn-blue/20 hover:bg-white hover:shadow-2xl hover:shadow-cn-blue/10 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl bg-cn-blue/10 text-cn-blue flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">${icons.package}</div>
            <h3 class="text-xl font-black text-cn-deep mb-3">Pickup Tersusun</h3>
            <p class="text-slate-600 font-medium leading-relaxed">Order tersusun mengikut slot masa pilihan pelanggan. Tiada lagi pelanggan datang serentak.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Problems -->
    <section id="problems" class="py-24 bg-cn-deep text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-5xl font-black mb-6 leading-tight">Masalah Kedai Print</h2>
          <p class="text-lg text-slate-400 font-medium">Adakah workflow harian kedai anda masih sesak dan berselerak?</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
            <div class="text-4xl font-black text-cn-yellow mb-6 opacity-40 group-hover:opacity-100 transition-opacity">01</div>
            <h3 class="text-xl font-black mb-3">Order Bercampur Dalam WhatsApp</h3>
            <p class="text-slate-400 font-medium leading-relaxed">Fail, nota, dan bukti bayaran mudah tenggelam dalam ratusan chat harian.</p>
          </div>
          <div class="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
            <div class="text-4xl font-black text-cn-yellow mb-6 opacity-40 group-hover:opacity-100 transition-opacity">02</div>
            <h3 class="text-xl font-black mb-3">Harga Dikira Manual</h3>
            <p class="text-slate-400 font-medium leading-relaxed">Staff penat semak satu-satu detail order sebelum boleh bagitahu harga kepada pelanggan.</p>
          </div>
          <div class="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
            <div class="text-4xl font-black text-cn-yellow mb-6 opacity-40 group-hover:opacity-100 transition-opacity">03</div>
            <h3 class="text-xl font-black mb-3">Pickup Tidak Tersusun</h3>
            <p class="text-slate-400 font-medium leading-relaxed">Pelanggan datang serentak, staff keliru order mana yang sudah siap atau belum bayar.</p>
          </div>
          <div class="p-8 rounded-2xl bg-white/5 border border-cn-yellow/30 bg-cn-yellow/5 hover:bg-cn-yellow/10 transition-all group">
            <div class="text-4xl font-black text-cn-yellow mb-6 opacity-100">04</div>
            <h3 class="text-xl font-black mb-3">Customer Tak Datang Pickup</h3>
            <p class="text-slate-300 font-medium leading-relaxed">Kedai dah print, tapi customer tak muncul. Rugi kertas, ink, dan masa berharga anda.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Solution / Product Preview -->
    <section id="solution" class="py-24 bg-gradient-to-br from-cn-navy to-cn-blue overflow-hidden text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p class="text-cn-yellow font-black tracking-widest uppercase text-sm mb-4">Penyelesaian</p>
            <h2 class="text-3xl md:text-5xl font-black mb-8 leading-tight">Cara CetakNow Membantu Kedai Anda</h2>
            <ul class="space-y-6">
              <li class="flex items-start gap-4">
                <div class="mt-1 w-6 h-6 rounded-full bg-cn-yellow flex-shrink-0 flex items-center justify-center text-cn-deep">${icons.check}</div>
                <div>
                  <h4 class="text-xl font-black mb-1">Link Personal Kedai</h4>
                  <p class="text-slate-300 font-medium">Dapatkan satu link khas untuk pelanggan buat order sendiri tanpa perlu ke kaunter.</p>
                </div>
              </li>
              <li class="flex items-start gap-4">
                <div class="mt-1 w-6 h-6 rounded-full bg-cn-yellow flex-shrink-0 flex items-center justify-center text-cn-deep">${icons.check}</div>
                <div>
                  <h4 class="text-xl font-black mb-1">Auto-Calculate Page & Harga</h4>
                  <p class="text-slate-300 font-medium">Sistem kira harga berdasarkan saiz, warna, copies, dan minimum order secara live.</p>
                </div>
              </li>
              <li class="flex items-start gap-4">
                <div class="mt-1 w-6 h-6 rounded-full bg-cn-yellow flex-shrink-0 flex items-center justify-center text-cn-deep">${icons.check}</div>
                <div>
                  <h4 class="text-xl font-black mb-1">Paid Orders Only</h4>
                  <p class="text-slate-300 font-medium">Hanya print order yang sudah dibayar. Sifar risiko kerugian printing tak dituntut.</p>
                </div>
              </li>
              <li class="flex items-start gap-4">
                <div class="mt-1 w-6 h-6 rounded-full bg-cn-yellow flex-shrink-0 flex items-center justify-center text-cn-deep">${icons.check}</div>
                <div>
                  <h4 class="text-xl font-black mb-1">Dashboard Staff Tersusun</h4>
                  <p class="text-slate-300 font-medium">Semua order, fail PDF, status, dan waktu pickup tersusun kemas dalam satu dashboard.</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="relative">
            <!-- Mockup Phone -->
            <div class="relative mx-auto w-[320px] h-[640px] bg-cn-deep rounded-[3rem] border-[10px] border-cn-deep shadow-2xl overflow-hidden">
              <div class="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-cn-deep rounded-b-2xl z-20"></div>
              <div class="absolute inset-0 bg-white p-6 pt-12">
                <div class="flex items-center justify-between mb-8">
                  <div class="bg-cn-blue/10 px-3 py-1 rounded-full text-[10px] font-black text-cn-blue uppercase tracking-wider">CetakNow Order</div>
                  <div class="text-slate-400">${icons.package}</div>
                </div>
                <div class="space-y-6">
                  <div class="text-center border-b border-slate-100 pb-6">
                    <p class="text-xs text-slate-500 font-bold uppercase mb-1">Order ID</p>
                    <h5 class="text-2xl font-black text-cn-deep">CN-QI-1001</h5>
                    <div class="inline-block mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase">Berjaya Dibayar</div>
                  </div>
                  <div class="space-y-4">
                    <div class="flex justify-between items-center text-sm">
                      <span class="text-slate-500 font-bold">File</span>
                      <span class="text-cn-deep font-black">assignment_v2.pdf</span>
                    </div>
                    <div class="flex justify-between items-center text-sm">
                      <span class="text-slate-500 font-bold">Print</span>
                      <span class="text-cn-deep font-black">24 Pages · Color</span>
                    </div>
                    <div class="flex justify-between items-center text-sm">
                      <span class="text-slate-500 font-bold">Pickup</span>
                      <span class="text-cn-deep font-black underline">Hari Ini · 4:00 PM</span>
                    </div>
                  </div>
                  <div class="mt-8 p-5 bg-slate-50 rounded-2xl">
                    <div class="flex justify-between items-center text-xs mb-2">
                      <span class="text-slate-500 font-bold">Jumlah Pembayaran</span>
                    </div>
                    <div class="text-3xl font-black text-cn-deep">RM8.40</div>
                  </div>
                  <button class="w-full py-4 bg-cn-blue text-white rounded-xl font-black text-sm shadow-lg">Sedia Untuk Diambil</button>
                </div>
              </div>
            </div>
            <!-- Decorative circle -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cn-yellow/20 rounded-full blur-[100px] -z-10"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Target Audience -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-5xl font-black text-cn-deep mb-6 leading-tight">Untuk Siapa Platform Ini?</h2>
          <p class="text-lg text-slate-600 font-medium">Dibina khas untuk operasi kedai print yang sibuk melayan pelanggan.</p>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center">
            <div class="w-12 h-12 rounded-xl bg-cn-blue/10 text-cn-blue flex items-center justify-center mb-4 mx-auto">${icons.store}</div>
            <h4 class="font-black text-cn-deep mb-1">Kedai Print Kecil</h4>
            <p class="text-xs text-slate-500 font-semibold">Urus order lebih profesional.</p>
          </div>
          <div class="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center">
            <div class="w-12 h-12 rounded-xl bg-cn-blue/10 text-cn-blue flex items-center justify-center mb-4 mx-auto">${icons.grad}</div>
            <h4 class="font-black text-cn-deep mb-1">Kawasan Kampus</h4>
            <p class="text-xs text-slate-500 font-semibold">Sesuai untuk volume tinggi.</p>
          </div>
          <div class="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center">
            <div class="w-12 h-12 rounded-xl bg-cn-blue/10 text-cn-blue flex items-center justify-center mb-4 mx-auto">${icons.file}</div>
            <h4 class="font-black text-cn-deep mb-1">Photostat Shop</h4>
            <p class="text-xs text-slate-500 font-semibold">Mudahkan servis printing.</p>
          </div>
          <div class="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center">
            <div class="w-12 h-12 rounded-xl bg-cn-blue/10 text-cn-blue flex items-center justify-center mb-4 mx-auto">${icons.user}</div>
            <h4 class="font-black text-cn-deep mb-1">Owner Urus Sendiri</h4>
            <p class="text-xs text-slate-500 font-semibold">Jimat masa dan tenaga anda.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section id="how" class="py-24 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-5xl font-black text-cn-deep mb-6 leading-tight">Macam Mana Ia Berfungsi?</h2>
          <p class="text-lg text-slate-600 font-medium">3 langkah mudah untuk digitalkan kedai print anda.</p>
        </div>
        <div class="grid lg:grid-cols-3 gap-12 relative">
          <!-- Connector line -->
          <div class="hidden lg:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-slate-200 -z-0"></div>
          
          <div class="relative z-10 text-center">
            <div class="w-16 h-16 rounded-2xl bg-cn-navy text-white flex items-center justify-center text-2xl font-black mx-auto mb-8 shadow-xl">1</div>
            <h3 class="text-xl font-black text-cn-deep mb-4">Langgan & Bayar</h3>
            <p class="text-slate-600 font-medium leading-relaxed">Pilih pelan bulanan atau tahunan yang sesuai, kemudian aktifkan akaun kedai anda secara online.</p>
          </div>
          <div class="relative z-10 text-center">
            <div class="w-16 h-16 rounded-2xl bg-cn-navy text-white flex items-center justify-center text-2xl font-black mx-auto mb-8 shadow-xl">2</div>
            <h3 class="text-xl font-black text-cn-deep mb-4">Setup Page Kedai</h3>
            <p class="text-slate-600 font-medium leading-relaxed">Masukkan nama kedai, harga print, minimum order, waktu operasi, dan slot pickup kedai anda.</p>
          </div>
          <div class="relative z-10 text-center">
            <div class="w-16 h-16 rounded-2xl bg-cn-navy text-white flex items-center justify-center text-2xl font-black mx-auto mb-8 shadow-xl">3</div>
            <h3 class="text-xl font-black text-cn-deep mb-4">Dapat Link Kedai</h3>
            <p class="text-slate-600 font-medium leading-relaxed">Kongsi link CetakNow kedai anda di WhatsApp, bio media sosial, atau poster di depan kedai.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Privacy / Security -->
    <section class="py-24 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-cn-ice rounded-[2rem] p-10 md:p-16 border-2 border-cn-blue/5 flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
          <div class="w-24 h-24 rounded-3xl bg-cn-blue text-white flex flex-shrink-0 items-center justify-center shadow-xl shadow-cn-blue/20 animate-pulse">
            <div class="scale-[2]">${icons.lock}</div>
          </div>
          <div>
            <h2 class="text-2xl md:text-4xl font-black text-cn-deep mb-4">Privasi & Keselamatan Fail</h2>
            <p class="text-lg text-slate-600 font-medium leading-relaxed mb-6">
              Kami faham privasi pelanggan adalah utama. Fail PDF tidak dipaparkan secara umum dan hanya boleh diakses oleh staff melalui dashboard.
            </p>
            <div class="flex flex-wrap justify-center md:justify-start gap-3">
              <span class="px-4 py-2 rounded-lg bg-white text-cn-blue text-sm font-black border border-cn-blue/10">Fail Dilindungi</span>
              <span class="px-4 py-2 rounded-lg bg-white text-cn-blue text-sm font-black border border-cn-blue/10">Upload Peribadi</span>
              <span class="px-4 py-2 rounded-lg bg-white text-cn-blue text-sm font-black border border-cn-blue/10">Padam Selepas 7 Hari</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="py-24 bg-slate-50 border-y border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <p class="text-cn-blue font-black tracking-widest uppercase text-sm mb-4">Harga</p>
          <h2 class="text-3xl md:text-5xl font-black text-cn-deep mb-6 leading-tight">Harga Telus & Mudah</h2>
          <p class="text-lg text-slate-600 font-medium">Tiada yuran setup. Hanya pilih pelan yang sesuai untuk fasa validasi kedai anda.</p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <!-- Monthly -->
          <article class="relative p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500">
            <div class="mb-8">
              <h3 class="text-2xl font-black text-cn-deep mb-2">Plan Bulanan</h3>
              <p class="text-slate-500 font-bold">Sesuai untuk mula kecil</p>
            </div>
            <div class="mb-10">
              <div class="flex items-baseline gap-1">
                <span class="text-4xl font-black text-cn-deep">RM49</span>
                <span class="text-slate-500 font-bold">/bulan</span>
              </div>
            </div>
            <ul class="space-y-4 mb-12">
              <li class="flex items-center gap-3 font-bold text-slate-600 leading-tight">
                <span class="text-cn-blue">${icons.check}</span> Link kedai sendiri
              </li>
              <li class="flex items-center gap-3 font-bold text-slate-600 leading-tight">
                <span class="text-cn-blue">${icons.check}</span> Dashboard order
              </li>
              <li class="flex items-center gap-3 font-bold text-slate-600 leading-tight">
                <span class="text-cn-blue">${icons.check}</span> Bayaran online
              </li>
              <li class="flex items-center gap-3 font-bold text-slate-600 leading-tight">
                <span class="text-cn-blue">${icons.check}</span> Custom harga print
              </li>
              <li class="flex items-center gap-3 font-bold text-slate-600 leading-tight">
                <span class="text-cn-blue">${icons.check}</span> Pickup slot
              </li>
              <li class="flex items-center gap-3 font-bold text-slate-600 leading-tight">
                <span class="text-cn-blue">${icons.check}</span> Fail dipadam automatik
              </li>
            </ul>
            <a href="#subscription-checkout" 
               class="plan-trigger block w-full py-5 rounded-2xl border-2 border-cn-blue text-cn-blue text-center font-black text-lg hover:bg-cn-blue hover:text-white transition-all"
               data-plan="monthly" data-plan-label="Pelan Bulanan" data-amount="49">
              Langgan Bulanan
            </a>
          </article>

          <!-- Yearly -->
          <article class="relative p-10 rounded-[2.5rem] bg-cn-navy text-white shadow-2xl shadow-cn-navy/30 hover:scale-[1.02] transition-all duration-500 overflow-hidden">
            <div class="absolute top-8 right-8 px-4 py-1 rounded-full bg-cn-yellow text-cn-deep text-[10px] font-black uppercase tracking-widest">Paling Popular</div>
            <!-- Glow effect -->
            <div class="absolute -top-24 -right-24 w-64 h-64 bg-cn-blue/20 rounded-full blur-3xl"></div>
            
            <div class="mb-8 relative z-10">
              <h3 class="text-2xl font-black mb-2">Plan Tahunan</h3>
              <p class="text-white/60 font-bold">Jimat untuk kedai aktif</p>
            </div>
            <div class="mb-10 relative z-10">
              <div class="flex items-baseline gap-1">
                <span class="text-5xl font-black text-white">RM499</span>
                <span class="text-white/60 font-bold">/tahun</span>
              </div>
              <p class="text-cn-yellow text-xs font-black mt-2">Jimat RM89 berbanding bulanan!</p>
            </div>
            <ul class="space-y-4 mb-12 relative z-10">
              <li class="flex items-center gap-3 font-bold text-white/90 leading-tight">
                <span class="text-cn-yellow">${icons.check}</span> Semua fungsi pelan bulanan
              </li>
              <li class="flex items-center gap-3 font-bold text-white/90 leading-tight">
                <span class="text-cn-yellow">${icons.check}</span> Nilai lebih jimat
              </li>
              <li class="flex items-center gap-3 font-bold text-white/90 leading-tight">
                <span class="text-cn-yellow">${icons.check}</span> Sokongan manual diutamakan
              </li>
              <li class="flex items-center gap-3 font-bold text-white/90 leading-tight">
                <span class="text-cn-yellow">${icons.check}</span> Fail dipadam automatik
              </li>
            </ul>
            <a href="#subscription-checkout" 
               class="plan-trigger block w-full py-5 rounded-2xl bg-cn-yellow text-cn-deep text-center font-black text-lg shadow-xl shadow-cn-yellow/20 hover:scale-105 transition-all relative z-10"
               data-plan="annual" data-plan-label="Pelan Tahunan" data-amount="499">
              Pilih Tahunan
            </a>
          </article>
        </div>
        <p class="text-center mt-12 text-slate-500 font-bold text-sm">Harga langganan tetap. Tiada yuran tersembunyi.</p>
      </div>
    </section>

    <!-- Footer CTA -->
    <footer class="py-24 bg-cn-deep text-white text-center px-4 overflow-hidden relative">
      <div class="max-w-4xl mx-auto relative z-10">
        <p class="text-cn-yellow font-black tracking-widest uppercase text-xs mb-6">Mula Sekarang</p>
        <h2 class="text-4xl md:text-6xl font-black mb-8 leading-[1.1] text-balance">Sedia susun order print kedai anda?</h2>
        <p class="text-xl text-slate-400 font-medium mb-12 max-w-2xl mx-auto">
          Bawa pelanggan dari WhatsApp berselerak ke satu sistem order yang lebih mudah dikawal.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#pricing" class="w-full sm:w-auto px-12 py-5 rounded-full bg-cn-yellow text-cn-deep text-xl font-black shadow-2xl shadow-cn-yellow/20 hover:scale-105 transition-all">Daftar Sekarang</a>
          <a href="#solution" class="w-full sm:w-auto px-12 py-5 rounded-full bg-white/10 text-white text-xl font-black border border-white/20 hover:bg-white/20 transition-all">Lihat Demo</a>
        </div>
      </div>
      <!-- Background logo -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[4] pointer-events-none -z-0">
        <img src="/public/assets/icon.png" alt="">
      </div>
      <div class="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto text-left relative z-10">
        <div class="flex flex-col items-center md:items-start">
          <img src="/public/assets/primary-logo.png" alt="CetakNow" class="h-10 mb-6 brightness-0 invert opacity-80">
          <p class="text-slate-500 text-sm font-bold">© 2026 CetakNow. Print Online, Pay Online, Pick Up Easy.</p>
        </div>
        <div class="flex gap-8 text-sm font-black text-slate-400">
          <a href="#about" class="hover:text-white transition-colors">Tentang</a>
          <a href="#problems" class="hover:text-white transition-colors">Masalah</a>
          <a href="#how" class="hover:text-white transition-colors">Cara Guna</a>
          <a href="#pricing" class="hover:text-white transition-colors">Harga</a>
        </div>
      </div>
    </footer>

    <!-- Subscription Checkout Modal -->
    <section id="subscription-checkout" class="subscription-modal group fixed inset-0 z-[100] overflow-y-auto transition-all duration-300 opacity-0 pointer-events-none" aria-hidden="true">
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity">
        <a class="absolute inset-0" href="#pricing" aria-label="Tutup checkout"></a>
      </div>
      
      <div class="relative min-h-screen flex justify-center p-4">
        <form class="subscription-dialog relative my-auto bg-white w-full max-w-[520px] rounded-[2.5rem] shadow-2xl shadow-cn-navy/20 flex flex-col transition-transform scale-95 duration-300" 
              method="post" action="/subscriptions">
          
          <!-- Header -->
          <div class="relative pt-10 pb-6 px-6 sm:px-10 md:px-12 bg-white rounded-t-[2.5rem]">
            <a href="#pricing" class="absolute top-6 right-6 sm:right-10 md:right-12 p-2 text-slate-400 hover:text-cn-deep hover:bg-slate-50 rounded-full transition-all" aria-label="Tutup">
              ${icons.x}
            </a>
            
            <div class="inline-block px-3 py-1 rounded-full bg-cn-yellow text-cn-deep text-[10px] font-black uppercase tracking-widest mb-4 modal-plan-badge">
              Pelan Bulanan
            </div>
            <h2 class="text-2xl font-black text-cn-deep tracking-tight mb-1">Langgan CetakNow</h2>
            <p class="text-slate-500 font-bold text-xs">Isi maklumat anda untuk teruskan langganan.</p>
          </div>

          <!-- Body -->
          <div class="px-6 sm:px-10 md:px-12 pb-10 space-y-6">
            <input type="hidden" name="plan" value="monthly">
            
            <!-- Selected Plan Summary Card -->
            <div class="p-5 rounded-2xl bg-cn-ice border border-cn-blue/10">
              <div class="flex justify-between items-center mb-3">
                <span class="text-[10px] font-black text-cn-blue uppercase tracking-widest">Plan Terpilih</span>
                <span class="text-cn-deep font-black text-xs modal-plan-price-label">RM49/bulan</span>
              </div>
              <ul class="grid grid-cols-2 gap-x-4 gap-y-2">
                <li class="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                  <span class="text-cn-blue scale-75">${icons.check}</span> Kedai Sendiri
                </li>
                <li class="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                  <span class="text-cn-blue scale-75">${icons.check}</span> Order Dashboard
                </li>
                <li class="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                  <span class="text-cn-blue scale-75">${icons.check}</span> Bayaran Online
                </li>
                <li class="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                  <span class="text-cn-blue scale-75">${icons.check}</span> Custom Harga
                </li>
              </ul>
            </div>

            <!-- Fields -->
            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Email</label>
                <div class="relative group">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cn-blue transition-colors">
                    ${icons.mail}
                  </span>
                  <input required type="email" name="email" placeholder="nama@email.com" autocomplete="email"
                         class="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-cn-blue focus:bg-white outline-none font-bold text-base transition-all">
                </div>
              </div>
              
              <div class="space-y-1.5">
                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Nombor Telefon</label>
                <div class="relative group">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cn-blue transition-colors">
                    ${icons.phone}
                  </span>
                  <input required name="phone" inputmode="tel" autocomplete="tel" pattern="[0-9+ ]{9,16}" placeholder="0123456789"
                         class="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-cn-blue focus:bg-white outline-none font-bold text-base transition-all">
                </div>
                <p class="text-[9px] text-slate-400 font-bold italic pl-1 leading-tight">Kami akan gunakan nombor ini untuk hubungi anda berkaitan akaun.</p>
              </div>
            </div>

            <!-- Price Box -->
            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Jumlah Bayaran</span>
              <div class="flex items-baseline gap-1">
                <span class="text-3xl font-black text-cn-deep">RM<span class="modal-plan-amount">49</span></span>
              </div>
              <p class="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5 modal-billing-interval">Billed Monthly</p>
            </div>

            <!-- CTA & Trust -->
            <div class="space-y-4">
              <div class="text-center">
                <p class="text-[10px] text-slate-500 font-bold mb-3 flex items-center justify-center gap-1.5">
                  <span class="text-green-500 scale-75">${icons.shield}</span> Pembayaran selamat. Akaun aktif segera.
                </p>
                <button type="submit" 
                        class="w-full py-4 rounded-xl bg-cn-navy text-white font-black text-lg shadow-lg shadow-cn-navy/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                  <span>Teruskan Pembayaran</span>
                  ${icons.arrow}
                </button>
              </div>
              
              <div class="flex items-center justify-center gap-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <span class="flex items-center gap-1">${icons.check} No Setup Fee</span>
                <span class="flex items-center gap-1">${icons.check} Cancel Anytime</span>
              </div>

              <div class="text-center pt-1">
                <a href="#pricing" class="inline-block text-slate-400 hover:text-cn-navy font-black text-xs transition-colors py-1">Batal</a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>

    <script>
      const subscriptionModal = document.querySelector('#subscription-checkout');
      const subscriptionDialog = document.querySelector('.subscription-dialog');
      const planInput = subscriptionDialog?.querySelector('input[name="plan"]');
      const planBadge = document.querySelector('.modal-plan-badge');
      const planPriceLabel = document.querySelector('.modal-plan-price-label');
      const planAmount = document.querySelector('.modal-plan-amount');
      const billingInterval = document.querySelector('.modal-billing-interval');
      const paymentButton = subscriptionDialog?.querySelector('button[type="submit"]');
      
      function syncSubscriptionModal() {
        const isOpen = location.hash === '#subscription-checkout';
        if (!subscriptionModal || !subscriptionDialog) return;

        subscriptionModal.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        
        if (isOpen) {
          subscriptionModal.classList.remove('opacity-0', 'pointer-events-none');
          subscriptionModal.classList.add('opacity-100', 'pointer-events-auto');
          subscriptionDialog.classList.remove('scale-95');
          subscriptionDialog.classList.add('scale-100');
          document.body.style.overflow = 'hidden';
        } else {
          subscriptionModal.classList.remove('opacity-100', 'pointer-events-auto');
          subscriptionModal.classList.add('opacity-0', 'pointer-events-none');
          subscriptionDialog.classList.remove('scale-100');
          subscriptionDialog.classList.add('scale-95');
          document.body.style.overflow = 'auto';
        }
      }

      document.querySelectorAll('.plan-trigger').forEach((trigger) => {
        trigger.addEventListener('click', () => {
          const plan = trigger.dataset.plan || 'monthly';
          const label = trigger.dataset.planLabel || 'Pelan Bulanan';
          const amount = trigger.dataset.amount || '49';
          
          if (planInput) planInput.value = plan;
          if (planBadge) planBadge.textContent = label;
          if (planAmount) planAmount.textContent = amount;
          
          if (planPriceLabel) {
            planPriceLabel.textContent = \`RM\${amount}/\${plan === 'annual' ? 'tahun' : 'bulan'}\`;
          }
          
          if (billingInterval) {
            billingInterval.textContent = \`Billed \${plan === 'annual' ? 'Yearly' : 'Monthly'}\`;
          }
          
          setTimeout(syncSubscriptionModal, 0);
        });
      });

      window.addEventListener('hashchange', syncSubscriptionModal);
      syncSubscriptionModal();

      subscriptionDialog?.addEventListener('submit', (e) => {
        if (!subscriptionDialog.checkValidity()) return;
        paymentButton.disabled = true;
        paymentButton.innerHTML = '<span>Memproses...</span>';
        paymentButton.classList.add('opacity-70', 'cursor-not-allowed');
      });

      // Mobile menu toggle
      const mobileMenu = document.getElementById('mobile-menu');
      const menuBtn = document.getElementById('mobile-menu-btn');
      const menuClose = document.getElementById('mobile-menu-close');
      const menuBackdrop = document.getElementById('mobile-menu-backdrop');
      const menuIconOpen = document.getElementById('menu-icon-open');
      const menuIconClose = document.getElementById('menu-icon-close');

      function openMenu() {
        mobileMenu.classList.remove('hidden');
        mobileMenu.setAttribute('aria-hidden', 'false');
        menuIconOpen.classList.add('hidden');
        menuIconClose.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }

      function closeMenu() {
        mobileMenu.classList.add('hidden');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuIconOpen.classList.remove('hidden');
        menuIconClose.classList.add('hidden');
        document.body.style.overflow = '';
      }

      menuBtn?.addEventListener('click', () => {
        if (mobileMenu.classList.contains('hidden')) openMenu();
        else closeMenu();
      });
      menuClose?.addEventListener('click', closeMenu);
      menuBackdrop?.addEventListener('click', closeMenu);
      mobileMenu?.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
      });

      // Close mobile menu on resize to desktop
      window.addEventListener('resize', function () {
        if (window.innerWidth >= 768) {
          if (mobileMenu && !mobileMenu.classList.contains('hidden')) closeMenu();
        }
      });

      // Simple animation styles
      if (!document.getElementById('cn-animations')) {
        const style = document.createElement('style');
        style.id = 'cn-animations';
        style.textContent = \`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          html { scroll-behavior: smooth; }
          #mobile-menu > div:last-child {
            animation: slideIn 0.25s ease-out;
          }
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        \`;
        document.head.appendChild(style);
      }
    </script>
  </main>`);
}

export function subscribeThanksPage() {
  return layout('Terima Kasih - CetakNow', `
  <main class="min-h-screen bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-[2.5rem] shadow-2xl shadow-cn-navy/5 overflow-hidden border border-slate-100 text-center">
        <div class="bg-green-500 p-12 text-white">
          <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p class="text-sm font-black uppercase tracking-[0.2em] mb-2 opacity-80">Minat Diterima</p>
          <h1 class="text-3xl md:text-4xl font-black leading-tight">Terima kasih, kami akan hubungi anda.</h1>
        </div>
        <div class="p-8 md:p-12 space-y-6">
          <p class="text-lg text-slate-600 font-medium leading-relaxed">
            Team CetakNow akan semak maklumat anda dan hubungi untuk fasa setup manual.
          </p>
          <a href="/" class="inline-block px-10 py-4 rounded-full bg-cn-navy text-white font-black text-lg shadow-xl shadow-cn-navy/20 hover:scale-105 transition-all">Kembali ke landing page</a>
        </div>
      </div>
    </div>
  </main>`);
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
  const productSection = productOptions ? `<section class="form-group product-addons"><div class="group-head"><p class="eyebrow">Add-on optional</p><h3>Tambah produk servis</h3></div><div class="product-options">${productOptions}</div></section>` : '';
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
        <section class="form-group">
          <div class="group-head"><p class="eyebrow">Upload & print settings</p><h3>Fail dan pilihan cetakan</h3></div>
          <div class="field-block"><label>PDF file(s) <input required multiple type="file" name="pdf" accept="application/pdf,.pdf"><small>PDF sahaja. Pastikan fail akhir yang ingin dicetak.</small></label></div>
          <div class="two"><label>Paper size <select name="paper_size_id">${paperSizeOptions}</select></label><label>Print type <select name="print_type"><option value="bw">Black & White (${formatMoney(firstPaperSize.bw_price_per_page)}/page)</option><option value="color">Color (${formatMoney(firstPaperSize.color_price_per_page)}/page)</option></select></label></div>
          <div class="two"><label>Sides <select name="sides"><option value="single">Single-sided</option><option value="double">Double-sided</option></select></label><label>Copies <input required type="number" name="copies" min="1" value="1"></label></div>
        </section>
        ${productSection}
        <section class="form-group">
          <div class="group-head"><p class="eyebrow">Pickup information</p><h3>Masa ambil pesanan</h3></div>
          <div class="two"><label>Pickup date <input required type="date" name="pickup_date"></label><label>Pickup slot <select name="pickup_slot_id">${firstSlot}</select></label></div>
        </section>
        <section class="form-group">
          <div class="group-head"><p class="eyebrow">Customer information</p><h3>Maklumat pelanggan</h3></div>
          <div class="two"><label>Name <input required name="customer_name" autocomplete="name"></label><label>Phone <input required name="customer_phone" placeholder="60123456789"></label></div>
          <label>Email optional <input type="email" name="customer_email"></label>
          <label>Notes optional <textarea name="notes" placeholder="Extra instruction"></textarea></label>
        </section>
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
  return layout('CetakNow Login', `
  <main class="min-h-screen grid grid-cols-1 lg:grid-cols-12 relative bg-gradient-to-br from-cn-ice via-white to-cn-yellow-soft/10 overflow-x-hidden">
    <!-- Faint grid pattern background -->
    <div class="absolute inset-0 opacity-40 pointer-events-none" style="background-image: radial-gradient(rgba(11,79,159,0.06) 1.5px, transparent 1.5px); background-size: 24px 24px;"></div>
    
    <!-- Soft background glows -->
    <div class="absolute top-1/4 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-cn-yellow/5 blur-[80px] sm:blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/4 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-cn-blue/5 blur-[80px] sm:blur-[120px] pointer-events-none"></div>

    <!-- Left Column: Login Form -->
    <div class="col-span-1 lg:col-span-5 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-white/90 backdrop-blur-xl relative z-10 border-b lg:border-b-0 lg:border-r border-slate-100 shadow-xl">
      <div class="w-full max-w-md mx-auto">
        <!-- Logo -->
        <div class="mb-8 flex justify-center lg:justify-start">
          <a href="/" class="inline-block transition-transform hover:scale-[1.02]">
            <img src="/public/assets/primary-logo.png" alt="CetakNow" class="h-10 drop-shadow-sm">
          </a>
        </div>

        <!-- Role Badge -->
        <div class="flex justify-center lg:justify-start">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cn-ice text-cn-blue mb-4 border border-cn-blue/10">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Pemilik Kedai
          </span>
        </div>

        <!-- Welcome Headings -->
        <div class="space-y-2 mb-8 text-center lg:text-left">
          <h1 class="text-3xl font-extrabold text-cn-navy tracking-tight">Selamat Kembali</h1>
          <p class="text-base font-bold text-cn-deep">Log masuk ke dashboard kedai anda</p>
          <p class="text-xs text-slate-500 font-medium leading-relaxed max-w-sm mx-auto lg:mx-0">
            Urus order print, fail customer, bayaran, dan pickup slot dalam satu tempat.
          </p>
        </div>
        
        <!-- Form Card -->
        <form class="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-cn-navy/5 space-y-5" method="post" action="/login" novalidate>
          ${error ? `<div class="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-bold flex items-center gap-2.5">
            <svg class="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <span class="leading-tight">${escapeHtml(error)}</span>
          </div>` : ''}
          
          <!-- Email Input -->
          <div class="space-y-1.5 relative">
            <label for="email" class="block text-[10px] font-extrabold text-cn-navy uppercase tracking-widest">Email Kedai</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                </svg>
              </div>
              <input id="email" name="email" type="email" autocomplete="email" required placeholder="owner@kedai.com"
                     class="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-cn-navy focus:ring-2 focus:ring-cn-yellow/40 outline-none font-medium text-cn-deep text-sm transition-all">
            </div>
            <p id="email-error" class="hidden text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Sila masukkan email yang sah
            </p>
          </div>
          
          <!-- Password Input -->
          <div class="space-y-1.5 relative">
            <div class="flex justify-between items-center">
              <label for="password" class="block text-[10px] font-extrabold text-cn-navy uppercase tracking-widest">Password</label>
              <a href="/forgot-password" class="text-[11px] font-bold text-cn-blue hover:text-cn-navy hover:underline transition-colors">Lupa password?</a>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input id="password" name="password" type="password" autocomplete="current-password" required placeholder="Masukkan password"
                     class="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 border border-slate-200 focus:border-cn-navy focus:ring-2 focus:ring-cn-yellow/40 outline-none font-medium text-cn-deep text-sm transition-all">
              
              <button id="toggle-password" type="button" class="absolute inset-y-0 right-0 w-10 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                <!-- Eye Icon -->
                <svg id="eye-icon" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <!-- Eye Off Icon -->
                <svg id="eye-off-icon" class="h-4 w-4 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p id="password-error" class="hidden text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Sila masukkan password anda
            </p>
          </div>
          
          <!-- Submit Button -->
          <div class="pt-2">
            <button type="submit" class="w-full h-11 bg-cn-navy hover:bg-cn-navy/95 active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-md shadow-cn-navy/15 hover:shadow-lg transition-all flex items-center justify-center gap-2">
              Log Masuk
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          <!-- Secure/Trust Microcopy -->
          <div class="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-bold">
            <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Akses selamat ke dashboard kedai anda.</span>
          </div>
          
          <!-- Register CTA -->
          <div class="pt-5 border-t border-slate-100 text-center space-y-3">
            <p class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Belum ada akaun kedai?</p>
            <a href="/#pricing" class="inline-flex w-full h-11 items-center justify-center rounded-xl border border-cn-yellow bg-cn-yellow/10 hover:bg-cn-yellow/20 text-cn-navy font-bold text-sm transition-all hover:scale-[1.01]">
              Daftar Kedai Anda
            </a>
          </div>
        </form>
      </div>
    </div>

    <!-- Right Column: Benefits & Preview Panel -->
    <div class="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 xl:p-24 relative overflow-hidden bg-slate-50/50 lg:bg-transparent">
      <div class="w-full max-w-lg space-y-10 relative z-10">
        <!-- Benefit Copy -->
        <div class="space-y-5">
          <h2 class="text-3xl font-extrabold text-cn-navy leading-tight">Urus order print dalam satu dashboard</h2>
          <ul class="space-y-4">
            <li class="flex items-center gap-3 text-cn-deep font-bold text-sm">
              <span class="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              Lihat order berbayar
            </li>
            <li class="flex items-center gap-3 text-cn-deep font-bold text-sm">
              <span class="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              Download fail PDF customer
            </li>
            <li class="flex items-center gap-3 text-cn-deep font-bold text-sm">
              <span class="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              Susun pickup slot
            </li>
            <li class="flex items-center gap-3 text-cn-deep font-bold text-sm">
              <span class="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              Update status order
            </li>
          </ul>
        </div>

        <!-- Mini Dashboard Preview Card -->
        <div class="relative bg-white border border-slate-100 rounded-2xl p-5 shadow-xl shadow-cn-navy/5 w-full mx-auto lg:mx-0 transition-all hover:shadow-2xl hover:scale-[1.01] duration-300">
          <!-- Abstract mini-header -->
          <div class="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Order Terkini</span>
            <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1 border border-emerald-100">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Paid
            </span>
          </div>
          
          <!-- Order details -->
          <div class="space-y-3">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-400 font-bold">Order ID</span>
              <span class="text-cn-navy font-bold">CN-QI-1001</span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-400 font-bold">Pickup Time</span>
              <span class="text-cn-deep font-bold">4:00 PM</span>
            </div>
            <div class="flex justify-between items-center text-xs pt-2 border-t border-slate-50">
              <span class="text-slate-400 font-bold">Total</span>
              <span class="text-cn-navy font-extrabold text-sm">RM8.40</span>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="mt-4 flex gap-2">
            <span class="w-full h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors border border-slate-100 cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              PDF
            </span>
            <span class="w-full h-8 rounded-lg bg-cn-navy text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer hover:bg-cn-navy/90">
              Selesai
            </span>
          </div>
        </div>
      </div>
    </div>
  </main>

  <script>
    // Inline validation logic
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    form.addEventListener('submit', function(e) {
      let hasError = false;

      // Validate email
      const emailValue = emailInput.value.trim();
      if (!emailValue) {
        emailError.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Sila masukkan email kedai anda';
        emailError.classList.remove('hidden');
        emailInput.classList.add('border-red-500', 'focus:ring-red-100');
        emailInput.classList.remove('border-slate-200', 'focus:ring-cn-yellow/40');
        hasError = true;
      } else if (!validateEmail(emailValue)) {
        emailError.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Sila masukkan email yang sah (contoh: owner@kedai.com)';
        emailError.classList.remove('hidden');
        emailInput.classList.add('border-red-500', 'focus:ring-red-100');
        emailInput.classList.remove('border-slate-200', 'focus:ring-cn-yellow/40');
        hasError = true;
      } else {
        emailError.classList.add('hidden');
        emailInput.classList.remove('border-red-500', 'focus:ring-red-100');
        emailInput.classList.add('border-slate-200', 'focus:ring-cn-yellow/40');
      }

      // Validate password
      const passwordValue = passwordInput.value;
      if (!passwordValue) {
        passwordError.classList.remove('hidden');
        passwordInput.classList.add('border-red-500', 'focus:ring-red-100');
        passwordInput.classList.remove('border-slate-200', 'focus:ring-cn-yellow/40');
        hasError = true;
      } else {
        passwordError.classList.add('hidden');
        passwordInput.classList.remove('border-red-500', 'focus:ring-red-100');
        passwordInput.classList.add('border-slate-200', 'focus:ring-cn-yellow/40');
      }

      if (hasError) {
        e.preventDefault();
      }
    });

    // Input listeners to clear errors on typing
    emailInput.addEventListener('input', function() {
      emailError.classList.add('hidden');
      emailInput.classList.remove('border-red-500', 'focus:ring-red-100');
      emailInput.classList.add('border-slate-200', 'focus:ring-cn-yellow/40');
    });

    passwordInput.addEventListener('input', function() {
      passwordError.classList.add('hidden');
      passwordInput.classList.remove('border-red-500', 'focus:ring-red-100');
      passwordInput.classList.add('border-slate-200', 'focus:ring-cn-yellow/40');
    });

    function validateEmail(email) {
      const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      return re.test(email);
    }

    // Password visibility toggle
    const toggleBtn = document.getElementById('toggle-password');
    const eyeIcon = document.getElementById('eye-icon');
    const eyeOffIcon = document.getElementById('eye-off-icon');

    toggleBtn.addEventListener('click', function() {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.add('hidden');
        eyeOffIcon.classList.remove('hidden');
      } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('hidden');
        eyeOffIcon.classList.add('hidden');
      }
    });
  </script>
  `);
}

function statusClass(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'default';
}

function badgeLabel(role = '') {
  return role === 'Super Admin' ? 'Super Admin' : 'SHOP DASHBOARD';
}

function copyUrlButton(link, label = 'Copy Link') {
  return `<button type="button" class="table-action ghost copy-link" data-copy-link="${escapeHtml(link)}">${escapeHtml(label)}</button>`;
}

function shopLinkAction(link, label = 'Buka Link Kedai') {
  return `<a class="admin-action secondary" href="${escapeHtml(link)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
}

function shopCopyAction(link, label = 'Salin Link') {
  return `<button type="button" class="admin-action ghost copy-link" data-copy-link="${escapeHtml(link)}">${escapeHtml(label)}</button>`;
}

function adminRowActions({ id, slug, active }) {
  const deactivateLabel = active ? 'Deactivate' : 'Activate';
  return `<details class="row-actions">
    <summary aria-label="Open tenant actions">Actions</summary>
    <div class="row-actions-menu">
      <a href="/admin/shops/${escapeHtml(id)}">View</a>
      <a href="/admin/shops/${escapeHtml(id)}#edit">Edit</a>
      <a href="/shop/${escapeHtml(slug)}" target="_blank" rel="noreferrer">Open Page</a>
      <form method="post" action="/admin/shops/${escapeHtml(id)}/status">
        <button class="${active ? 'danger' : ''}" type="submit">${deactivateLabel}</button>
      </form>
    </div>
  </details>`;
}

function adminShell({ title, subtitle, userLabel, active = 'overview', body, role = 'Shop Dashboard', shopSlug = '', headerActions = '' }) {
  const shopLink = shopSlug ? `/shop/${escapeHtml(shopSlug)}` : '/';
  const subscriptionLink = role === 'Super Admin' ? shopLink : '/admin/subscription';
  const shopsHref = role === 'Super Admin' ? '/admin/shops' : '/admin/orders';
  const item = (key, href, icon, label, hint = '') => `<a class="admin-side-item ${active === key ? 'active' : ''}" href="${href}" aria-current="${active === key ? 'page' : 'false'}"><span class="side-icon ${icon}" aria-hidden="true"></span><em>${label}${hint ? `<small>${hint}</small>` : ''}</em></a>`;
  const shopSettingsItem = role === 'Super Admin' ? '' : item('settings', '/admin/settings', 'settings', 'Tetapan', 'Kedai & harga');
  return `<main class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-brand"><img src="/public/assets/primary-logo.png" alt="CetakNow"><span>${escapeHtml(badgeLabel(role))}</span></div>
      <nav class="admin-side-nav" aria-label="Admin navigation">
        ${item('overview', '/admin', 'home', role === 'Super Admin' ? 'Overview' : 'Ringkasan', role === 'Super Admin' ? 'Platform' : 'Dashboard')}
        ${item('orders', shopsHref, 'orders', role === 'Super Admin' ? 'Shops' : 'Order', role === 'Super Admin' ? 'Tenants' : 'Senarai kerja')}
        ${item('revenue', '/admin/revenue', 'revenue', role === 'Super Admin' ? 'Revenue' : 'Hasil', role === 'Super Admin' ? 'Platform' : 'Bayaran')}
        ${item(role === 'Super Admin' ? 'shop' : 'subscription', subscriptionLink, 'external', role === 'Super Admin' ? 'Website' : 'Langganan', role === 'Super Admin' ? 'Landing' : 'Plan & link')}
        ${shopSettingsItem}
      </nav>
      <div class="admin-user"><div><b>${escapeHtml(userLabel || title)}</b><small>${escapeHtml(badgeLabel(role))}</small></div><a href="/logout"><span class="side-icon logout" aria-hidden="true"></span> Logout</a></div>
    </aside>
    <section class="admin-main">
      <header class="admin-topbar"><div><span class="admin-role-badge">${escapeHtml(badgeLabel(role))}</span><p>${escapeHtml(subtitle)}</p><h1>${escapeHtml(title)}</h1></div><div class="admin-topbar-actions">${headerActions ? headerActions : ''}<a class="admin-menu-button" href="/logout">Logout</a></div></header>
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

function formatDateTimeMY(value) {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true,
  }).format(date);
}

function formatDateMY(value) {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(date);
}

function planStatusLabel(status = '') {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'active') return 'Active';
  if (normalized === 'inactive') return 'Inactive';
  if (normalized === 'pending') return 'Pending';
  if (normalized === 'paid') return 'Paid';
  if (normalized === 'pilot_free') return 'Pilot';
  return status ? String(status) : 'All';
}

function copyScript() {
  return `<script>
      document.querySelectorAll('[data-copy-link]').forEach((button) => {
        button.addEventListener('click', async () => {
          const link = button.getAttribute('data-copy-link');
          const fullLink = link.startsWith('http') ? link : location.origin + link;
          try {
            await navigator.clipboard.writeText(fullLink);
            const previous = button.textContent;
            button.textContent = 'Copied';
            window.setTimeout(() => { button.textContent = previous; }, 1200);
          } catch {
            button.textContent = link;
          }
        });
      });
      const rowActionDetails = [...document.querySelectorAll('.row-actions')];
      function placeRowActionMenu(details) {
        const summary = details.querySelector('summary');
        const menu = details.querySelector('.row-actions-menu');
        if (!summary || !menu || !details.open) return;
        const rect = summary.getBoundingClientRect();
        const width = Math.min(190, Math.max(168, menu.offsetWidth || 176));
        const viewportPadding = 12;
        const left = Math.min(window.innerWidth - width - viewportPadding, Math.max(viewportPadding, rect.right - width));
        const menuHeight = menu.offsetHeight || 160;
        const opensUp = rect.bottom + 8 + menuHeight > window.innerHeight - viewportPadding;
        const top = opensUp ? Math.max(viewportPadding, rect.top - menuHeight - 8) : rect.bottom + 8;
        menu.style.setProperty('--row-menu-left', left + 'px');
        menu.style.setProperty('--row-menu-top', top + 'px');
        menu.style.setProperty('--row-menu-width', width + 'px');
      }
      rowActionDetails.forEach((details) => {
        details.addEventListener('toggle', () => {
          if (details.open) {
            rowActionDetails.forEach((item) => {
              if (item !== details) item.removeAttribute('open');
            });
            placeRowActionMenu(details);
          }
        });
      });
      window.addEventListener('resize', () => rowActionDetails.forEach(placeRowActionMenu));
      window.addEventListener('scroll', () => rowActionDetails.forEach(placeRowActionMenu), true);
      document.addEventListener('click', (event) => {
        rowActionDetails.forEach((details) => {
          if (details.open && !details.contains(event.target)) details.removeAttribute('open');
        });
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') rowActionDetails.forEach((details) => details.removeAttribute('open'));
      });
    </script>`;
}

export function subscriptionPage({ user, shop, subscription = null, payment = null }) {
  const publicLink = `/shop/${escapeHtml(shop.slug)}`;
  const label = subscription?.plan_label || planLabel(subscription?.plan || shop.plan);
  const status = shop.subscription_status || subscription?.payment_status || 'pilot_free';
  const amount = subscription?.amount ?? payment?.amount ?? 0;
  const headerActions = `${shopLinkAction(publicLink)}${shopCopyAction(publicLink)}`;
  const body = `<section class="admin-detail subscription-detail">
    <p class="eyebrow">Langganan</p>
    <div class="detail-title"><div><h1>Status Pelan</h1><p>${escapeHtml(shop.name)} · Link kedai aktif</p></div><span class="status-chip ${statusClass(status)}">${escapeHtml(status)}</span></div>
    <div class="receipt detail-grid">
      <p><span>Plan</span><b>${escapeHtml(label)}</b></p>
      <p><span>Status</span><b>${escapeHtml(status)}</b></p>
      <p><span>Code</span><b>${escapeHtml(subscription?.subscription_code || '-')}</b></p>
      <p><span>Email</span><b>${escapeHtml(subscription?.email || user.email || shop.email || '-')}</b></p>
      <p><span>Amount Paid</span><b>${formatMoney(amount)}</b></p>
      <p><span>Created</span><b>${formatDateTimeMY(subscription?.created_at || shop.created_at)}</b></p>
      <p><span>Paid At</span><b>${formatDateTimeMY(payment?.paid_at)}</b></p>
      <p><span>Link Kedai</span><b><span class="shop-path-row"><a href="${publicLink}">${publicLink}</a>${copyUrlButton(publicLink, 'Salin')}</span></b></p>
    </div>
  </section>`;
  return layout('Langganan', adminShell({ title: 'Langganan', subtitle: 'Semak status langganan dan link kedai anda.', userLabel: user.email, active: 'subscription', role: 'Shop Dashboard', shopSlug: shop.slug, body, headerActions }), shop.primary_color);
}

function metricCard(label, value, tone = 'blue', icon = 'orders', featured = false, helper = '') {
  return `<article class="admin-kpi ${tone} ${featured ? 'featured' : ''}"><div><span>${escapeHtml(label)}</span><b>${value}</b>${helper ? `<small>${escapeHtml(helper)}</small>` : ''}</div><i class="kpi-icon ${icon}" aria-hidden="true"></i></article>`;
}

function storyBand(title, subtitle, stats = [], cta = '', actions = []) {
  const statMarkup = stats.map((stat) => `<div><span>${escapeHtml(stat.label)}</span><b>${stat.value}</b><small>${escapeHtml(stat.hint || '')}</small></div>`).join('');
  const actionMarkup = actions.length ? `<div class="summary-actions">${actions.map((action) => action.copy ? shopCopyAction(action.href, action.label) : shopLinkAction(action.href, action.label)).join('')}</div>` : '';
  return `<section class="admin-story-band">
    <div class="admin-story-copy">
      <p class="eyebrow">Ringkasan order</p>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(subtitle)}</p>
      ${cta ? `<a class="button" href="${escapeHtml(cta.href)}">${escapeHtml(cta.label)}</a>` : ''}
      ${actionMarkup}
    </div>
    <div class="admin-story-stats">${statMarkup}</div>
  </section>`;
}

function dashboardLiveScript() {
  return `<script>
      (() => {
        let dashboardPoll = null;
        let refreshingDashboard = false;
        function bindCopyButtons() {
          document.querySelectorAll('[data-copy-link]:not([data-dashboard-copy-ready])').forEach((button) => {
            button.setAttribute('data-dashboard-copy-ready', '1');
            button.addEventListener('click', async () => {
              const link = button.getAttribute('data-copy-link');
              const fullLink = link.startsWith('http') ? link : location.origin + link;
              try {
                await navigator.clipboard.writeText(fullLink);
                const previous = button.textContent;
                button.textContent = 'Copied';
                window.setTimeout(() => { button.textContent = previous; }, 1200);
              } catch {
                button.textContent = link;
              }
            });
          });
        }
        async function refreshDashboard() {
          if (refreshingDashboard) return;
          refreshingDashboard = true;
          try {
            const response = await fetch('/admin/dashboard.json', { headers: { Accept: 'application/json' } });
            if (!response.ok) return;
            const data = await response.json();
            const story = document.querySelector('[data-dashboard-story]');
            const kpis = document.querySelector('[data-dashboard-kpis]');
            const orderCount = document.querySelector('[data-dashboard-order-count]');
            const orderRows = document.querySelector('[data-dashboard-order-rows]');
            const shopCount = document.querySelector('[data-dashboard-shop-count]');
            const shopRows = document.querySelector('[data-dashboard-shop-rows]');
            const subscriptionCount = document.querySelector('[data-dashboard-subscription-count]');
            const subscriptionRows = document.querySelector('[data-dashboard-subscription-rows]');
            if (story && data.storyHtml) story.innerHTML = data.storyHtml;
            if (kpis && data.kpisHtml) kpis.innerHTML = data.kpisHtml;
            if (orderCount && data.orderCountLabel) orderCount.textContent = data.orderCountLabel;
            if (orderRows && data.orderRows) orderRows.innerHTML = data.orderRows;
            if (shopCount && data.shopCountLabel) shopCount.textContent = data.shopCountLabel;
            if (shopRows && data.shopRows) shopRows.innerHTML = data.shopRows;
            if (subscriptionCount && data.subscriptionCountLabel) subscriptionCount.textContent = data.subscriptionCountLabel;
            if (subscriptionRows && data.subscriptionRows) subscriptionRows.innerHTML = data.subscriptionRows;
            bindCopyButtons();
          } finally {
            refreshingDashboard = false;
          }
        }
        function startDashboardPolling() {
          if (!dashboardPoll) dashboardPoll = setInterval(refreshDashboard, 5000);
        }
        startDashboardPolling();
        window.addEventListener('focus', refreshDashboard);
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) refreshDashboard();
        });
        bindCopyButtons();
        if ('EventSource' in window) {
          const events = new EventSource('/admin/events');
          events.addEventListener('dashboard', refreshDashboard);
          events.onerror = startDashboardPolling;
        }
      })();
    </script>`;
}

export function shopDashboardSnapshot({ orders, publicLink = '' }) {
  const totalOrders = orders.length;
  const readyOrders = orders.filter((o) => o.order_status === 'Ready for Pickup').length;
  const activeOrders = orders.filter((o) => !['Completed', 'Cancelled'].includes(o.order_status)).length;
  const today = new Date().toISOString().slice(0, 10);
  const todayPickups = orders.filter((o) => o.pickup_date === today).length;
  const orderRows = orders.map((o) => `<tr><td><a class="admin-link" href="/admin/orders/${o.id}">${escapeHtml(o.order_code)}</a></td><td><b>${escapeHtml(o.customer_name)}</b><small>${escapeHtml(o.customer_phone)}</small></td><td>${escapeHtml(o.pickup_date)}</td><td>${formatMoney(o.total_amount)}</td><td><span class="pill ${statusClass(o.payment_status)}">${escapeHtml(o.payment_status)}</span></td><td><span class="status-chip ${statusClass(o.order_status)}">${escapeHtml(o.order_status)}</span></td><td>${formatDateTimeMY(o.created_at)}</td></tr>`).join('');
  const leadTitle = totalOrders ? `${readyOrders} order sudah ready untuk pickup` : 'Belum ada order lagi';
  const leadSubtitle = totalOrders
    ? `${activeOrders} order masih bergerak · ${todayPickups} pickup hari ini`
    : 'Kongsi link kedai anda untuk mula terima order berbayar.';
  return {
    activeOrders,
    totalOrders,
    readyOrders,
    todayPickups,
    storyHtml: storyBand(
      leadTitle,
      leadSubtitle,
      [
        { label: 'Total order', value: totalOrders, hint: 'keseluruhan queue' },
        { label: 'Aktif', value: activeOrders, hint: 'belum selesai' },
        { label: 'Ready pickup', value: readyOrders, hint: 'boleh diserahkan' }
      ],
      { href: '/admin/orders', label: 'Semak order sekarang' }
    ),
    orderCountLabel: `${orders.length} total`,
    orderRows: orderRows || `<tr><td class="empty-state" colspan="7"><b>Belum ada order.</b><span>Kongsi link kedai anda untuk mula terima order berbayar.</span>${publicLink ? `<div class="empty-state-actions">${shopLinkAction(publicLink)}${shopCopyAction(publicLink, 'Salin Link Kedai')}</div>` : ''}</td></tr>`
  };
}

export function shopDashboard({ user, shop, orders }) {
  const publicLink = `/shop/${escapeHtml(shop.slug)}`;
  const snapshot = shopDashboardSnapshot({ orders, publicLink });
  const headerActions = `${shopLinkAction(publicLink)}${shopCopyAction(publicLink)}`;
  const body = `<div data-dashboard-story>${snapshot.storyHtml}</div>
    <section id="orders" class="admin-panel"><div class="panel-head"><div><p class="eyebrow">Senarai kerja</p><h2>Order Masuk</h2></div><span data-dashboard-order-count>${snapshot.orderCountLabel}</span></div><div class="table-wrap"><table><thead><tr><th>Order ID</th><th>Customer</th><th>Pickup</th><th>Total</th><th>Payment</th><th>Status</th><th>Created</th></tr></thead><tbody data-dashboard-order-rows>${snapshot.orderRows}</tbody></table></div></section>
    ${dashboardLiveScript()}`;
  return layout('Shop Dashboard', adminShell({ title: 'Ringkasan', subtitle: 'Pantau order print dan pickup pelanggan.', userLabel: user.email, role: 'Shop Dashboard', shopSlug: shop.slug, body, headerActions }), shop.primary_color);
}

export function shopSettingsPage({ user, shop, pricing = {}, products = [], paperSizes = [], updated = false }) {
  const publicLink = `/shop/${escapeHtml(shop.slug)}`;
  const headerActions = `${shopLinkAction(publicLink)}${shopCopyAction(publicLink)}`;
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
    <label>Penerangan <input name="description" value="${escapeHtml(product.description || '')}"></label>
    <label>Harga (RM) <input required type="number" min="0" step="0.01" name="price" value="${Number(product.price).toFixed(2)}"></label>
    <label class="check product-active"><input type="checkbox" name="is_active" ${product.is_active ? 'checked' : ''}> <span>Aktif</span></label>
    <button type="submit">Simpan Produk</button>
  </form>`).join('');
  const body = `${successBanner}<form class="admin-settings-form" method="post" action="/admin/settings">
    <section class="admin-panel settings-panel">
      <div class="panel-head"><div><p class="eyebrow">Maklumat kedai</p><h2>Profil kedai</h2></div><span class="settings-link-meta">Link dikunci: ${publicLink}</span></div>
      <div class="settings-grid">
        <label>Nama kedai <input required name="name" value="${escapeHtml(shop.name)}"></label>
        <label>Telefon kedai <input required name="phone" value="${escapeHtml(shop.phone)}" inputmode="tel"></label>
        <label class="settings-full">Penerangan <textarea required name="description">${escapeHtml(shop.description)}</textarea></label>
        <label class="settings-full">Alamat / kawasan <textarea required name="address">${escapeHtml(shop.address)}</textarea></label>
        <label>Google Maps URL <input name="google_maps_url" type="url" value="${escapeHtml(shop.google_maps_url)}"></label>
        <label>Waktu operasi <input required name="operating_hours" value="${escapeHtml(shop.operating_hours)}"></label>
        <label>Warna utama <input required name="primary_color" type="color" value="${escapeHtml(shop.primary_color || '#062b66')}"></label>
        <label class="settings-readonly">Link kedai <input readonly value="${publicLink}" aria-label="Public shop link"></label>
      </div>
      <div class="settings-actions"><button type="submit">Simpan Tetapan</button></div>
    </section>
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
  return layout('Tetapan Kedai', adminShell({ title: 'Tetapan Kedai', subtitle: 'Urus profil kedai, harga, dan tetapan order.', userLabel: user.email, active: 'settings', role: 'Shop Dashboard', shopSlug: shop.slug, body, headerActions }), shop.primary_color);
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

function normalizeRangeInput(value) {
  const range = String(value || '').toLowerCase();
  if (['today', 'week', 'month', 'year'].includes(range)) return range;
  return 'month';
}

function toUtcDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function rangeWindow(range, baseDate = new Date()) {
  const base = new Date(baseDate);
  const safeBase = Number.isNaN(base.getTime()) ? new Date() : base;
  const end = new Date(Date.UTC(safeBase.getUTCFullYear(), safeBase.getUTCMonth(), safeBase.getUTCDate(), 23, 59, 59, 999));
  let start = new Date(end);
  if (range === 'today') {
    start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 0, 0, 0, 0));
  } else if (range === 'week') {
    const day = end.getUTCDay();
    start = new Date(end);
    start.setUTCDate(end.getUTCDate() - day);
    start.setUTCHours(0, 0, 0, 0);
  } else if (range === 'year') {
    start = new Date(Date.UTC(end.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
  } else {
    start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1, 0, 0, 0, 0));
  }
  return { start, end };
}

function filterByWindow(items, getDate, range, baseDate) {
  const { start, end } = rangeWindow(range, baseDate);
  return items.filter((item) => {
    const date = new Date(getDate(item));
    return !Number.isNaN(date.getTime()) && date >= start && date <= end;
  });
}

export function revenuePage({ user, shop = null, shops = [], orders = [], payments = [], subscriptions = [], mode = 'orders', selectedDate = '', range = '', page = 1 }) {
  const reportDate = normalizeDateInput(selectedDate || new Date().toISOString().slice(0, 10));
  const activeRange = normalizeRangeInput(range);
  const baseDate = new Date(`${reportDate}T00:00:00Z`);
  const source = payments
    .filter((p) => p.status === 'paid' && p.paid_at)
    .filter((p) => mode === 'subscriptions' ? p.subscription_id : p.order_id)
    .map((payment) => {
      const order = payment.order_id ? orders.find((o) => o.id === payment.order_id) : null;
      const subscription = payment.subscription_id ? subscriptions.find((s) => s.id === payment.subscription_id) : null;
      const paymentShop = order ? shops.find((s) => s.id === order.shop_id) : null;
      const effectiveShop = shop || paymentShop || (subscription?.shop_id ? shops.find((s) => s.id === subscription.shop_id) : null);
      return { payment, order, subscription, shop: effectiveShop, parts: dateParts(payment.paid_at), amount: Number(payment.amount || 0) };
    })
    .sort((a, b) => String(b.payment.paid_at).localeCompare(String(a.payment.paid_at)));
  const filteredRows = activeRange === 'month'
    ? source.filter((item) => item.parts.month === reportDate.slice(0, 7))
    : filterByWindow(source, (item) => item.payment.paid_at, activeRange, baseDate);
  const daily = source.filter((item) => item.parts.day === reportDate);
  const weekly = filterByWindow(source, (item) => item.payment.paid_at, 'week', baseDate);
  const monthly = source.filter((item) => item.parts.month === reportDate.slice(0, 7));
  const yearly = source.filter((item) => item.parts.year === reportDate.slice(0, 4));
  const visibleRows = filteredRows;
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / pageSize));
  const currentPage = Math.min(Math.max(Number.isFinite(page) ? page : 1, 1), totalPages);
  const pageRows = visibleRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const queryParts = new URLSearchParams();
  queryParts.set('date', reportDate);
  if (activeRange) queryParts.set('range', activeRange);
  const queryDate = queryParts.toString();
  const pagination = visibleRows.length > pageSize ? `<div class="table-pagination"><a class="page-link ${currentPage === 1 ? 'disabled' : ''}" ${currentPage === 1 ? 'aria-disabled="true"' : `href="/admin/revenue?${queryDate}&page=${currentPage - 1}"`}>Sebelumnya</a><span>Page ${currentPage} / ${totalPages}</span><a class="page-link ${currentPage === totalPages ? 'disabled' : ''}" ${currentPage === totalPages ? 'aria-disabled="true"' : `href="/admin/revenue?${queryDate}&page=${currentPage + 1}"`}>Seterusnya</a></div>` : '';
  const isSubscriptionReport = mode === 'subscriptions';
  const rows = pageRows.map((item) => {
    const ref = item.order?.order_code || item.subscription?.subscription_code || item.payment.gateway_reference || item.payment.id;
    const paymentLabel = item.payment.status === 'paid' ? 'Paid' : planStatusLabel(item.payment.status);
    if (!isSubscriptionReport) {
      const customer = item.order?.customer_name || item.payment.customer_name || '-';
      const customerPhone = item.order?.customer_phone || item.payment.customer_phone || '';
      return `<tr><td>${formatDateTimeMY(item.payment.paid_at)}</td><td><b>${escapeHtml(ref)}</b></td><td><b>${escapeHtml(customer)}</b>${customerPhone ? `<small>${escapeHtml(customerPhone)}</small>` : ''}</td><td><b>${formatMoney(item.amount)}</b></td><td><span class="pill ${statusClass(item.payment.status)}">${escapeHtml(paymentLabel)}</span></td></tr>`;
    }
    const shopName = item.shop?.name || item.order?.customer_name || '-';
    const plan = item.subscription?.plan_label || item.shop?.plan || 'Paid';
    const sourceLabel = `${escapeHtml(plan)}${item.shop ? `<small>${escapeHtml(item.shop.name)}</small>` : ''}`;
    return `<tr><td>${formatDateTimeMY(item.payment.paid_at)}</td><td><b>${escapeHtml(ref)}</b></td><td><b>${escapeHtml(shopName)}</b>${item.shop ? `<small>/shop/${escapeHtml(item.shop.slug)}</small>` : ''}</td><td>${sourceLabel}</td><td><b>${formatMoney(item.amount)}</b></td><td><span class="pill ${statusClass(item.payment.status)}">${escapeHtml(paymentLabel)}</span></td></tr>`;
  }).join('');
  const title = isSubscriptionReport ? 'Revenue Overview' : 'Hasil Order';
  const subtitle = isSubscriptionReport ? 'Track paid subscriptions and platform revenue.' : 'Pantau bayaran order print yang berjaya.';
  const currentRangeLabel = activeRange === 'today' ? 'Today' : activeRange === 'week' ? 'This Week' : activeRange === 'year' ? 'This Year' : 'This Month';
  const headerActions = isSubscriptionReport ? `<button class="admin-action primary" type="button" disabled aria-disabled="true">Export CSV</button>` : '';
  const body = `<section class="admin-kpi-grid revenue-kpis">
      ${metricCard('Hasil Tarikh Ini', formatMoney(sumAmount(daily)), 'red', 'paid', true, `Paparan: ${formatDateMY(reportDate)}`)}
      ${metricCard('Bulan Ini', formatMoney(sumAmount(monthly)), 'blue', 'paid', false, `${weekly.length} transaksi minggu ini`)}
      ${metricCard('Tahun Ini', formatMoney(sumAmount(yearly)), 'yellow', 'alert', false, `${currentRangeLabel} aktif`)}
      ${metricCard('Jumlah Transaksi', source.length, 'green', 'check', false, `${source.length ? 'Transaksi berbayar' : 'Belum ada transaksi'}`)}
    </section>
    <section class="admin-panel revenue-panel">
      <div class="panel-head revenue-head">
        <div><p class="eyebrow">Pemantauan hasil</p><h2>${isSubscriptionReport ? 'Langganan Berbayar' : 'Order Berbayar'}</h2><p class="revenue-date-note">Paparan berdasarkan tarikh: ${formatDateMY(reportDate)}</p></div>
        <span>${source.length} transaksi</span>
      </div>
      <form class="revenue-filter" method="get" action="/admin/revenue">
        <div class="revenue-range-links">
          <a class="${activeRange === 'today' ? 'active' : ''}" href="/admin/revenue?date=${encodeURIComponent(reportDate)}&range=today">Today</a>
          <a class="${activeRange === 'week' ? 'active' : ''}" href="/admin/revenue?date=${encodeURIComponent(reportDate)}&range=week">This Week</a>
          <a class="${activeRange === 'month' ? 'active' : ''}" href="/admin/revenue?date=${encodeURIComponent(reportDate)}&range=month">This Month</a>
          <a class="${activeRange === 'year' ? 'active' : ''}" href="/admin/revenue?date=${encodeURIComponent(reportDate)}&range=year">This Year</a>
        </div>
        <label>Tarikh <input type="date" name="date" value="${escapeHtml(reportDate)}" aria-label="Pilih tarikh revenue"></label>
        <input type="hidden" name="range" value="${escapeHtml(activeRange)}">
        <a href="/admin/revenue">Hari Ini</a>
      </form>
      <script>
        document.querySelector('.revenue-filter input[name="date"]')?.addEventListener('change', (event) => {
          if (event.target.value) {
            const params = new URLSearchParams(location.search);
            params.set('date', event.target.value);
            if (!params.get('range')) params.set('range', 'month');
            location.href = '/admin/revenue?' + params.toString();
          }
        });
      </script>
      <div class="table-wrap">
        <table>
          <thead>${isSubscriptionReport ? '<tr><th>Paid At</th><th>Reference</th><th>Shop</th><th>Plan</th><th>Amount</th><th>Payment</th></tr>' : '<tr><th>Paid At</th><th>Order ID</th><th>Customer</th><th>Amount</th><th>Payment</th></tr>'}</thead>
          <tbody>${rows || (isSubscriptionReport ? '<tr><td class="empty-state" colspan="6"><b>Belum ada transaksi berbayar.</b><span>Langganan yang berjaya dibayar akan dipaparkan di sini.</span></td></tr>' : '<tr><td class="empty-state" colspan="5"><b>Belum ada transaksi berbayar.</b><span>Bayaran order pelanggan akan dipaparkan di sini.</span></td></tr>')}</tbody>
        </table>
      </div>
      ${pagination}
    </section>`;
  const role = user.role === 'super_admin' ? 'Super Admin' : 'Shop Dashboard';
  return layout(title, adminShell({ title, subtitle, userLabel: user.email, active: 'revenue', role, shopSlug: shop?.slug || '', body, headerActions }), shop?.primary_color);
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
    return `<tr><td><a class="admin-link" href="/admin/orders/${o.id}">${o.order_code}</a>${shopCell}</td><td>${customer}</td><td>${o.pickup_date}</td><td>${formatMoney(o.total_amount)}</td><td><span class="pill ${statusClass(o.payment_status)}">${o.payment_status}</span></td><td><span class="status-chip ${statusClass(o.order_status)}">${o.order_status}</span></td><td>${formatDateTimeMY(o.created_at)}</td><td><a class="table-action neutral" href="/admin/orders/${o.id}">Urus</a></td></tr>`;
  }).join('');
  const pagination = totalOrders > pageSize ? `<div class="table-pagination"><a class="page-link ${currentPage === 1 ? 'disabled' : ''}" ${currentPage === 1 ? 'aria-disabled="true"' : `href="/admin/orders?page=${currentPage - 1}"`}>Sebelumnya</a><span>Page ${currentPage} / ${totalPages}</span><a class="page-link ${currentPage === totalPages ? 'disabled' : ''}" ${currentPage === totalPages ? 'aria-disabled="true"' : `href="/admin/orders?page=${currentPage + 1}"`}>Seterusnya</a></div>` : '';
  const successBanner = updated ? '<div class="admin-success" role="status">Status order berjaya dikemaskini.</div>' : '';
  const body = `${successBanner}<section class="admin-kpi-grid">
      ${metricCard('Total Order', totalOrders, 'red', 'orders', true)}
      ${metricCard('Order Aktif', activeOrders, 'blue', 'paid')}
      ${metricCard('Sedia Pickup', readyOrders, 'yellow', 'alert')}
      ${metricCard('Pickup Hari Ini', todayPickups, 'green', 'check')}
    </section>
    <section class="admin-panel"><div class="panel-head"><div><p class="eyebrow">Pengurusan kerja</p><h2>Order Pelanggan</h2></div><span>${orders.length} total</span></div><div class="table-wrap"><table><thead><tr><th>Order ID</th><th>Customer</th><th>Pickup</th><th>Total</th><th>Payment</th><th>Status</th><th>Created</th><th>Action</th></tr></thead><tbody>${rows || '<tr><td class="empty-state" colspan="8"><b>Belum ada order.</b><span>Order pelanggan akan muncul di sini selepas checkout.</span></td></tr>'}</tbody></table></div>${pagination}</section>`;
  const role = user.role === 'super_admin' ? 'Super Admin' : 'Shop Dashboard';
  const title = 'Pengurusan Order';
  const subtitle = shop ? 'Urus senarai order pelanggan.' : 'Semua order platform';
  return layout(title, adminShell({ title, subtitle, userLabel: user.email, active: user.role === 'super_admin' ? '' : 'orders', role, shopSlug: shop?.slug || '', body }), shop?.primary_color);
}

export function orderDetails({ order, shop, slot, user, updated = false }) {
  const statuses = ['Paid / New Order', 'Printing', 'Ready for Pickup', 'Completed', 'Cancelled', 'File Problem'].map((s) => `<option ${order.order_status === s ? 'selected' : ''}>${s}</option>`).join('');
  const successBanner = updated ? '<div class="admin-success" role="status">Status order berjaya dikemaskini.</div>' : '';
  const addOns = (order.product_items || []).map((product) => `${escapeHtml(product.name)} (${formatMoney(product.price)})`).join('<br>') || '-';
  const files = order.files?.length ? order.files : [{ original_file_name: order.original_file_name || 'order.pdf', page_count: order.page_count, file_path: order.file_path }];
  const fileLinks = files.map((file, index) => `<a class="button ${index ? 'ghost' : ''}" href="/admin/orders/${order.id}/download/${index + 1}">Download PDF ${files.length > 1 ? index + 1 : ''}</a>`).join('');
  const fileList = files.map((file, index) => `<li><b>${escapeHtml(file.original_file_name || `PDF ${index + 1}`)}</b><span>${Number(file.page_count || 0)} page(s)</span></li>`).join('');
  const body = `${successBanner}<section class="admin-detail"><p class="eyebrow">Order detail</p><div class="detail-title"><div><h1>${order.order_code}</h1><p>${escapeHtml(order.customer_name)} · <a href="https://wa.me/${escapeHtml(order.customer_phone)}">WhatsApp</a></p></div><span class="status-chip ${statusClass(order.order_status)}">${order.order_status}</span></div><div class="receipt detail-grid"><p><span>Files</span><b>${files.length}</b></p><p><span>Pages</span><b>${order.page_count}</b></p><p><span>Paper size</span><b>${escapeHtml(order.paper_size || 'A4')}</b></p><p><span>Type</span><b>${order.print_type}</b></p><p><span>Sides</span><b>${order.sides}</b></p><p><span>Copies</span><b>${order.copies}</b></p><p><span>Add-ons</span><b>${addOns}</b></p><p><span>Pickup</span><b>${order.pickup_date}, ${labelSlot(slot)}</b></p><p><span>Print subtotal</span><b>${formatMoney(order.subtotal ?? order.total_amount)}</b></p><p><span>Add-on total</span><b>${formatMoney(order.product_total || 0)}</b></p><p><span>Total</span><b>${formatMoney(order.total_amount)}</b></p><p><span>Notes</span><b>${order.notes ? escapeHtml(order.notes) : '-'}</b></p><p><span>File delete at</span><b>${formatDateTimeMY(order.file_delete_at)}</b></p></div><div class="file-list"><p class="eyebrow">Uploaded PDFs</p><ul>${fileList}</ul></div><div class="detail-actions">${fileLinks}<a class="button ghost" href="/admin">Back to dashboard</a></div><form class="status-form" method="post" action="/admin/orders/${order.id}/status"><label>Status <select name="order_status">${statuses}</select></label><button>Update status</button></form></section>`;
  return layout(order.order_code, adminShell({ title: order.order_code, subtitle: 'Order detail', userLabel: user?.email || shop.name, active: 'orders', role: 'Shop Dashboard', shopSlug: shop.slug, body }), shop.primary_color);
}

function superShopSummary(shops, orders, subscriptions) {
  const successfulSubscriptions = subscriptions.filter((s) => s.payment_status === 'paid').length;
  const activeShops = shops.filter((s) => s.is_active).length;
  const now = new Date();
  return {
    activeShops,
    successfulSubscriptions,
    totalShops: shops.length,
    revenueThisMonth: subscriptions.filter((s) => {
      if (s.payment_status !== 'paid') return false;
      const paidAt = new Date(s.updated_at || s.created_at || '');
      return !Number.isNaN(paidAt.getTime()) && paidAt.getFullYear() === now.getFullYear() && paidAt.getMonth() === now.getMonth();
    }).reduce((sum, s) => sum + Number(s.amount || 0), 0)
  };
}

function superKpisHtml(stats) {
  return `${metricCard('Total Shops', stats.totalShops, 'red', 'orders', true, 'Tenant keseluruhan')}
      ${metricCard('Active Shops', stats.activeShops, 'blue', 'paid', false, 'Sedang beroperasi')}
      ${metricCard('Paid Subscriptions', stats.successfulSubscriptions, 'yellow', 'alert', false, 'Bayaran berjaya')}
      ${metricCard('Revenue This Month', formatMoney(stats.revenueThisMonth), 'green', 'check', false, 'Subscription revenue')}`;
}

function superShopCard(shop, orders, subscriptions) {
  const orderCount = orders.filter((o) => o.shop_id === shop.id).length;
  const subscription = subscriptions.find((sub) => sub.shop_id === shop.id) || null;
  const slugLink = `/shop/${escapeHtml(shop.slug)}`;
  const plan = planLabel(shop.plan);
  const statusBadge = shop.is_active ? 'active' : 'inactive';
  const paymentBadge = statusClass(shop.subscription_status);
  return `<tr>
      <td class="shop-cell">
        <a class="admin-link" href="/admin/shops/${escapeHtml(shop.id)}"><b>${escapeHtml(shop.name)}</b></a>
        <div class="shop-path-row"><span>${slugLink}</span>${copyUrlButton(slugLink, 'Copy')}</div>
      </td>
      <td><span class="status-chip ${statusBadge}">${shop.is_active ? 'Active' : 'Inactive'}</span></td>
      <td><span class="plan-chip ${statusClass(shop.plan)}">${escapeHtml(plan)}</span></td>
      <td><span class="pill ${paymentBadge}">${escapeHtml(planStatusLabel(shop.subscription_status))}</span></td>
      <td>${orderCount}</td>
      <td>${formatDateMY(shop.created_at)}</td>
      <td>${adminRowActions({ id: shop.id, slug: shop.slug, active: shop.is_active })}</td>
    </tr>`;
}

function superSubscriptionRows(shops, subscriptions) {
  return subscriptions.map((sub) => {
    const shop = sub.shop_id ? shops.find((s) => s.id === sub.shop_id) : null;
    const shopCell = shop ? `<a class="admin-link" href="/shop/${escapeHtml(shop.slug)}">${escapeHtml(shop.name)}</a>` : '-';
    return `<tr><td><b>${escapeHtml(sub.subscription_code)}</b><small>${escapeHtml(sub.plan_label)}</small></td><td>${escapeHtml(sub.email)}</td><td>${escapeHtml(sub.phone)}</td><td>${formatMoney(sub.amount)}</td><td><span class="pill ${statusClass(sub.payment_status)}">${escapeHtml(planStatusLabel(sub.payment_status))}</span></td><td>${shopCell}</td><td>${formatDateTimeMY(sub.created_at)}</td></tr>`;
  }).join('');
}

export function superDashboardSnapshot({ shops, orders, subscriptions = [] }) {
  const stats = superShopSummary(shops, orders, subscriptions);
  const shopRows = shops.map((s) => superShopCard(s, orders, subscriptions)).join('');
  const subscriptionRows = superSubscriptionRows(shops, subscriptions);
  return {
    ...stats,
    kpisHtml: superKpisHtml(stats),
    shopCountLabel: `${shops.length} total`,
    shopRows: shopRows || '<tr><td class="empty-state" colspan="7"><b>Belum ada kedai.</b><span>Kedai yang berjaya setup akan muncul di sini.</span></td></tr>',
    subscriptionCountLabel: `${subscriptions.length} total`,
    subscriptionRows: subscriptionRows || '<tr><td class="empty-state" colspan="7"><b>No subscriptions yet.</b><span>Paid subscription leads will appear here.</span></td></tr>'
  };
}

function superTenantForm({ shop = null, action = '', created = false }) {
  const isNew = !shop;
  const defaults = shop || {
    name: '',
    slug: '',
    email: '',
    phone: '',
    description: '',
      plan: 'pilot',
      subscription_status: 'pilot_free',
      is_active: true,
      primary_color: '#004581'
  };
  const passwordValue = isNew ? 'password' : '';
  return `<section class="admin-panel super-tenant-form" id="edit">
    <div class="panel-head">
      <div><p class="eyebrow">${isNew ? 'Tambah tenant' : 'Tenant detail'}</p><h2>${isNew ? 'Tambah Tenant Baru' : 'Edit Tenant'}</h2><p class="revenue-date-note">${isNew ? 'Create a new tenant and its public shop page.' : 'Review tenant settings, public page, and status.'}</p></div>
      <span>${escapeHtml(defaults.slug ? `/shop/${defaults.slug}` : 'Tenant draft')}</span>
    </div>
    ${created ? '<div class="admin-success" role="status">Tenant berjaya disimpan.</div>' : ''}
    <form class="super-tenant-grid" method="post" action="${escapeHtml(action)}">
      <label>Tenant name<input required name="name" value="${escapeHtml(defaults.name)}" placeholder="Contoh: Qalam Irma"></label>
      <label>Public slug<input required name="slug" value="${escapeHtml(defaults.slug)}" placeholder="qalam-irma"></label>
      <label>Owner email<input required type="email" name="email" value="${escapeHtml(defaults.email)}" placeholder="owner@kedai.com"></label>
      <label>Temporary password<input name="password" value="${escapeHtml(passwordValue)}" placeholder="${isNew ? 'password' : 'leave blank to keep current'}"></label>
      <label>Phone<input required name="phone" value="${escapeHtml(defaults.phone)}" placeholder="60123456789"></label>
      <label>Plan<select name="plan">
        <option value="pilot" ${String(defaults.plan) === 'pilot' ? 'selected' : ''}>Pilot</option>
        <option value="monthly" ${String(defaults.plan) === 'monthly' ? 'selected' : ''}>Monthly</option>
        <option value="yearly" ${String(defaults.plan) === 'yearly' ? 'selected' : ''}>Yearly</option>
      </select></label>
      <label>Subscription status<select name="subscription_status">
        <option value="pilot_free" ${String(defaults.subscription_status) === 'pilot_free' ? 'selected' : ''}>pilot_free</option>
        <option value="pending" ${String(defaults.subscription_status) === 'pending' ? 'selected' : ''}>pending</option>
        <option value="paid" ${String(defaults.subscription_status) === 'paid' ? 'selected' : ''}>paid</option>
        <option value="inactive" ${String(defaults.subscription_status) === 'inactive' ? 'selected' : ''}>inactive</option>
      </select></label>
      <label>Status<select name="is_active">
        <option value="1" ${defaults.is_active ? 'selected' : ''}>Active</option>
        <option value="0" ${!defaults.is_active ? 'selected' : ''}>Inactive</option>
      </select></label>
      <label>Primary color<input type="color" name="primary_color" value="${escapeHtml(defaults.primary_color || '#004581')}"></label>
      <label class="tenant-full">Description<textarea name="description" placeholder="Ringkas public page">${escapeHtml(defaults.description || '')}</textarea></label>
      <div class="tenant-actions">
        <a class="admin-action ghost" href="/admin/shops">Back</a>
        <button type="submit" class="admin-action primary">${isNew ? 'Tambah Tenant' : 'Simpan Tenant'}</button>
      </div>
    </form>
  </section>`;
}

function filterShopsForAdmin(shops, { q = '', status = '', plan = '' } = {}) {
  const query = String(q || '').trim().toLowerCase();
  const statusFilter = String(status || '').toLowerCase();
  const planFilter = String(plan || '').toLowerCase();
  return shops.filter((shop) => {
    const matchesQuery = !query || [shop.name, shop.slug, shop.email, shop.phone].some((value) => String(value || '').toLowerCase().includes(query));
    const matchesStatus = !statusFilter || statusFilter === 'all' || (statusFilter === 'active' ? shop.is_active : statusFilter === 'inactive' ? !shop.is_active : true);
    const matchesPlan = !planFilter || planFilter === 'all' || String(shop.plan || '').toLowerCase() === planFilter;
    return matchesQuery && matchesStatus && matchesPlan;
  });
}

export function superDashboard({ shops, orders, subscriptions = [], userEmail = 'owner@cetaknow.local' }) {
  const snapshot = superDashboardSnapshot({ shops, orders, subscriptions });
  const body = `<section class="admin-kpi-grid" data-dashboard-kpis>
      ${snapshot.kpisHtml}
    </section>
    <section id="orders" class="admin-panel">
      <div class="panel-head"><div><p class="eyebrow">Tenant aktif</p><h2>Shops</h2></div><span data-dashboard-shop-count>${snapshot.shopCountLabel}</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Shop</th><th>Status</th><th>Plan</th><th>Subscription</th><th>Orders</th><th>Created</th><th>Action</th></tr></thead>
          <tbody data-dashboard-shop-rows>${snapshot.shopRows}</tbody>
        </table>
      </div>
    </section>
    <section class="admin-panel lead-table">
      <div class="panel-head"><div><p class="eyebrow">Pemerolehan</p><h2>Langganan Berbayar</h2></div><span data-dashboard-subscription-count>${snapshot.subscriptionCountLabel}</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Code</th><th>Email</th><th>Phone</th><th>Amount</th><th>Payment</th><th>Shop</th><th>Created</th></tr></thead>
          <tbody data-dashboard-subscription-rows>${snapshot.subscriptionRows}</tbody>
        </table>
      </div>
    </section>${copyScript()}${dashboardLiveScript()}`;
  return layout('Platform Overview', adminShell({ title: 'Platform Overview', subtitle: 'Manage shops, subscriptions, and revenue across CetakNow.', userLabel: userEmail, role: 'Super Admin', body }));
}

export function shopsManagementPage({ user, shops, orders, subscriptions = [], filters = {} }) {
  const activeShops = shops.filter((s) => s.is_active).length;
  const inactiveShops = shops.length - activeShops;
  const filteredShops = filterShopsForAdmin(shops, filters);
  const rows = filteredShops.map((s) => superShopCard(s, orders, subscriptions)).join('');
  const body = `<section class="admin-kpi-grid">
      ${metricCard('Jumlah Kedai', shops.length, 'red', 'orders', true, 'Tenant platform')}
      ${metricCard('Kedai Aktif', activeShops, 'blue', 'paid', false, 'Online sekarang')}
      ${metricCard('Tidak Aktif', inactiveShops, 'yellow', 'alert', false, 'Perlu semakan')}
    </section>
    <section class="admin-panel">
      <div class="panel-head panel-head-actions">
        <div><p class="eyebrow">Pengurusan tenant</p><h2>Senarai Kedai</h2></div>
      </div>
      <form class="shop-filters" method="get" action="/admin/shops">
        <label>Search shop name<input name="q" value="${escapeHtml(filters.q || '')}" placeholder="Search shop name..."></label>
        <label>Status<select name="status">
          <option value="all" ${!filters.status || filters.status === 'all' ? 'selected' : ''}>All</option>
          <option value="active" ${filters.status === 'active' ? 'selected' : ''}>Active</option>
          <option value="inactive" ${filters.status === 'inactive' ? 'selected' : ''}>Inactive</option>
        </select></label>
        <label>Plan<select name="plan">
          <option value="all" ${!filters.plan || filters.plan === 'all' ? 'selected' : ''}>All</option>
          <option value="pilot" ${filters.plan === 'pilot' ? 'selected' : ''}>Pilot</option>
          <option value="monthly" ${filters.plan === 'monthly' ? 'selected' : ''}>Monthly</option>
          <option value="yearly" ${filters.plan === 'yearly' ? 'selected' : ''}>Yearly</option>
        </select></label>
        <div class="filter-actions">
          <button type="submit" class="admin-action primary">Filter</button>
          <a class="admin-action ghost" href="/admin/shops">Reset</a>
        </div>
      </form>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Kedai</th><th>Status</th><th>Plan</th><th>Subscription</th><th>Orders</th><th>Created</th><th>Action</th></tr></thead>
          <tbody>${rows || '<tr><td class="empty-state" colspan="7"><b>Belum ada kedai.</b><span>Kedai yang berjaya setup akan muncul di sini.</span></td></tr>'}</tbody>
        </table>
      </div>
    </section>${copyScript()}`;
  return layout('Shop Management', adminShell({ title: 'Shop Management', subtitle: 'Manage tenant shops, public pages, plans, and shop status.', userLabel: user.email, active: 'orders', role: 'Super Admin', body }));
}

export function superShopDetailPage({ user, shop, orders, subscriptions = [], created = false }) {
  const stats = {
    orderCount: orders.filter((o) => o.shop_id === shop.id).length,
    subscription: subscriptions.find((sub) => sub.shop_id === shop.id) || null
  };
  const body = `
    <section class="admin-kpi-grid">
      ${metricCard('Orders', stats.orderCount, 'red', 'orders', true, 'Platform usage')}
      ${metricCard('Status', shop.is_active ? 'Active' : 'Inactive', 'blue', 'paid', false, 'Tenant state')}
      ${metricCard('Plan', planLabel(shop.plan), 'yellow', 'alert', false, planStatusLabel(shop.subscription_status))}
      ${metricCard('Subscription', planStatusLabel(stats.subscription?.payment_status || shop.subscription_status), 'green', 'check', false, shop.email || '-')}
    </section>
    ${superTenantForm({ shop, action: `/admin/shops/${escapeHtml(shop.id)}`, created })}${copyScript()}`;
  return layout(shop.name, adminShell({ title: 'Shop Management', subtitle: 'Manage tenant shops, public pages, plans, and shop status.', userLabel: user.email, active: 'orders', role: 'Super Admin', body }));
}

export function mockPaymentPage(order) {
  return layout('Mock Billplz', `<main class="page narrow"><section class="card"><p class="eyebrow">Billplz Mock</p><h1>Pay ${formatMoney(order.total_amount)}</h1><p>Order ${order.order_code}</p><form method="post" action="/payment/mock/${order.order_code}/success"><button>Simulate successful payment</button></form></section></main>`);
}

export function mockSubscriptionPaymentPage(subscription) {
  return layout('Mock Billplz Subscription', `<main class="page narrow"><section class="card"><p class="eyebrow">Billplz Mock</p><h1>Pay ${formatMoney(subscription.amount)}</h1><p>${escapeHtml(subscription.plan_label)} · ${escapeHtml(subscription.subscription_code)}</p><p>${escapeHtml(subscription.email)} · ${escapeHtml(subscription.phone)}</p><form method="post" action="/payment/subscription/mock/${subscription.subscription_code}/success"><button>Simulate successful payment</button></form></section></main>`);
}

export function subscriptionConfirmationPage(subscription, shop = null) {
  if (shop) {
    const publicLink = `/shop/${escapeHtml(shop.slug)}`;
    return layout('Link kedai siap - CetakNow', `
    <main class="setup-success-page min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="setup-success-wrap max-w-3xl mx-auto">
        <div class="setup-success-card bg-white rounded-[2.5rem] shadow-2xl shadow-cn-navy/5 overflow-hidden border border-slate-100">
          <div class="setup-success-hero p-12 text-center">
            <div class="setup-success-check w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p class="setup-success-badge text-sm font-black uppercase tracking-[0.2em] mb-2">Setup Berjaya</p>
            <h1 class="text-3xl md:text-4xl font-black leading-tight">Page kedai anda sudah siap</h1>
            <p class="setup-success-subtitle">
              Link CetakNow anda telah dijana. Kongsi link ini di WhatsApp, bio media sosial, atau poster kedai untuk mula terima order print online.
            </p>
          </div>
          
          <div class="setup-success-body p-8 md:p-12 space-y-8">
            <div class="setup-summary-card bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-4">
              <div class="setup-summary-row flex justify-between items-center border-b border-slate-200 pb-4">
                <span class="text-slate-500 font-bold uppercase text-xs tracking-wider">Nama Kedai</span>
                <span class="text-cn-deep font-black">${escapeHtml(shop.name)}</span>
              </div>
              <div class="setup-summary-row setup-summary-link flex justify-between items-center border-b border-slate-200 pb-4">
                <span class="text-slate-500 font-bold uppercase text-xs tracking-wider">Link Kedai</span>
                <span class="setup-link-actions">
                  <a href="${publicLink}" class="text-cn-blue font-black underline hover:text-cn-navy transition-colors">${publicLink}</a>
                  <button type="button" class="setup-copy-link" data-copy-link="${publicLink}">Salin Link Kedai</button>
                </span>
              </div>
              <div class="setup-summary-row flex justify-between items-center border-b border-slate-200 pb-4">
                <span class="text-slate-500 font-bold uppercase text-xs tracking-wider">Pelan</span>
                <span class="text-cn-deep font-black">${escapeHtml(subscription.plan_label)}</span>
              </div>
              <div class="setup-summary-row flex justify-between items-center">
                <span class="text-slate-500 font-bold uppercase text-xs tracking-wider">Login Email</span>
                <span class="text-cn-deep font-black">${escapeHtml(subscription.email)}</span>
              </div>
            </div>
            
            <div class="setup-success-actions flex flex-col sm:flex-row gap-4 pt-4">
              <a href="/login" class="flex-1 py-4 bg-cn-navy text-white text-center rounded-2xl font-black text-lg shadow-xl shadow-cn-navy/20 hover:scale-[1.02] active:scale-95 transition-all">Log Masuk Dashboard</a>
              <a href="${publicLink}" class="setup-secondary-action flex-1 py-4 bg-white text-cn-navy text-center border-2 border-slate-100 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all">Buka Page Kedai</a>
            </div>
            <a href="/" class="setup-home-link block text-center text-slate-400 font-bold hover:text-slate-600 transition-colors py-2">Kembali ke laman utama</a>
          </div>
        </div>
      </div>
      <script>
        document.querySelectorAll('[data-copy-link]').forEach((button) => {
          button.addEventListener('click', async () => {
            const link = button.getAttribute('data-copy-link');
            const fullLink = link.startsWith('http') ? link : location.origin + link;
            try {
              await navigator.clipboard.writeText(fullLink);
              const previous = button.textContent;
              button.textContent = 'Link disalin';
              window.setTimeout(() => { button.textContent = previous; }, 1400);
            } catch {
              button.textContent = link;
            }
          });
        });
      </script>
    </main>`, shop.primary_color);
  }

  return layout('Setup kedai - CetakNow', `
  <main class="setup-onboarding min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="setup-onboarding-grid grid lg:grid-cols-[1fr_380px] gap-8">
        <div class="setup-onboarding-card bg-white rounded-[2.5rem] shadow-2xl shadow-cn-navy/5 overflow-hidden border border-slate-100">
          <div class="setup-success-head bg-cn-yellow p-10 md:p-12">
            <div class="flex items-center gap-4 mb-4">
              <div class="setup-success-icon w-12 h-12 bg-white rounded-xl flex items-center justify-center text-cn-deep">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17 4 12"/></svg>
              </div>
              <p class="text-sm font-black uppercase tracking-[0.2em] text-cn-deep/80">Bayaran Berjaya</p>
            </div>
            <h1 class="text-3xl md:text-5xl font-black text-cn-deep leading-tight">Sekarang, setup page kedai anda.</h1>
            <p class="mt-6 text-cn-deep/70 font-bold text-lg leading-relaxed">
              Isi maklumat minimum dahulu. Selepas dihantar, CetakNow akan jana link kedai untuk pelanggan anda.
            </p>
          </div>
          
          <form class="setup-form p-8 md:p-12 space-y-10" method="post" action="/subscriptions/${escapeHtml(subscription.subscription_code)}/setup" novalidate>
            <div class="setup-form-section space-y-8">
              <h2 class="setup-section-title text-2xl font-black text-cn-deep border-b-2 border-cn-yellow/30 pb-2 inline-block">Maklumat Kedai</h2>
              
              <div class="setup-fields grid gap-6">
                <div class="setup-field space-y-2">
                  <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">Nama Kedai *</label>
                  <input required name="shop_name" autocomplete="organization" placeholder="Contoh: Student Print Seksyen 7"
                         class="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-cn-blue focus:bg-white outline-none font-bold transition-all">
                  <small class="setup-error" data-error-for="shop_name"></small>
                </div>
                
                <div class="setup-field setup-link-field space-y-2">
                  <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">Link Kedai *</label>
                  <div class="relative">
                    <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold italic">/shop/</span>
                    <input required name="slug" pattern="[a-z0-9-]{3,64}" placeholder="nama-kedai"
                           class="w-full h-14 pl-20 pr-5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-cn-blue focus:bg-white outline-none font-bold transition-all">
                  </div>
                  <p class="setup-help text-[10px] text-slate-400 font-bold italic pl-2">Guna huruf kecil, nombor, dan dash sahaja. Contoh: qalam-irma</p>
                  <p class="setup-help text-[10px] text-slate-400 font-bold italic pl-2">Preview: cetaknow.com/shop/<span class="slug-preview text-cn-blue not-italic">nama-kedai</span></p>
                  <small class="setup-error" data-error-for="slug"></small>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="setup-field space-y-2">
                    <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">Telefon Kedai *</label>
                    <input required name="phone" inputmode="tel" autocomplete="tel" value="${escapeHtml(subscription.phone)}" placeholder="0123456789"
                           class="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-cn-blue focus:bg-white outline-none font-bold transition-all">
                    <small class="setup-error" data-error-for="phone"></small>
                  </div>
                  
                  <div class="setup-field space-y-2">
                    <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">Waktu Operasi *</label>
                    <div class="relative">
                      <input type="hidden" name="operating_hours" value="Mon-Sat, 9:00 AM - 9:00 PM">
                      <button type="button" onclick="document.getElementById('hours-modal').showModal()" 
                              class="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-slate-100 text-left font-bold text-slate-600 hover:bg-slate-100 transition-all flex items-center justify-between">
                        <span class="operating-preview truncate">Mon-Sat, 9:00 AM - 9:00 PM</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </button>
                    </div>
                    <p class="setup-help text-[10px] text-slate-400 font-bold italic pl-2">Contoh: Mon-Sat, 9:00 AM - 9:00 PM</p>
                    <small class="setup-error" data-error-for="operating_hours"></small>
                  </div>
                </div>
                
                <div class="setup-field space-y-2">
                  <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">Alamat / Kawasan *</label>
                  <textarea required name="address" placeholder="Dekat kampus, mall, taman..."
                            class="w-full p-5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-cn-blue focus:bg-white outline-none font-bold transition-all min-height-[100px]"></textarea>
                  <small class="setup-error" data-error-for="address"></small>
                </div>
                
                <div class="setup-field space-y-2">
                  <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">Link Lokasi Kedai (Optional)</label>
                  <input name="google_maps_url" type="url" placeholder="https://maps.google.com/..."
                         class="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-cn-blue focus:bg-white outline-none font-bold transition-all">
                </div>
              </div>
            </div>
            
            <div class="setup-form-section space-y-8 pt-6">
              <h2 class="setup-section-title text-2xl font-black text-cn-deep border-b-2 border-cn-blue/30 pb-2 inline-block">Akaun Dashboard</h2>
              <div class="setup-email-box p-6 bg-cn-ice rounded-3xl border border-cn-blue/10 mb-6">
                <p class="setup-email-title text-sm font-black text-cn-blue uppercase tracking-widest">Email untuk log masuk</p>
                <p class="setup-email-value text-cn-deep font-black">${escapeHtml(subscription.email)}</p>
                <p class="setup-email-help text-sm font-bold text-slate-500">Email ini akan digunakan untuk akses dashboard kedai.</p>
              </div>
              
              <div class="grid md:grid-cols-2 gap-6">
                <div class="setup-field space-y-2">
                  <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">Password Dashboard *</label>
                  <input required name="password" type="password" minlength="6" autocomplete="new-password" placeholder="••••••••"
                         class="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-cn-blue focus:bg-white outline-none font-bold transition-all">
                  <small class="setup-error" data-error-for="password"></small>
                </div>
                <div class="setup-field space-y-2">
                  <label class="block text-xs font-black text-slate-500 uppercase tracking-widest">Sahkan Password *</label>
                  <input required name="password_confirm" type="password" minlength="6" autocomplete="new-password" placeholder="••••••••"
                         class="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-cn-blue focus:bg-white outline-none font-bold transition-all">
                  <small class="setup-error" data-error-for="password_confirm"></small>
                </div>
              </div>
            </div>
            
            <div class="setup-submit-block pt-8">
              <button class="setup-submit w-full py-5 bg-cn-blue text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-cn-blue/20 hover:scale-[1.02] active:scale-95 transition-all" disabled>Simpan & Jana Link Kedai</button>
              <p class="setup-reassurance mt-6 text-center text-slate-400 font-bold text-xs italic">
                Harga print default dan slot pickup asas akan disediakan. Anda boleh ubah tetapan ini dalam dashboard selepas page kedai dijana.
              </p>
            </div>
          </form>
        </div>
        
        <aside class="setup-sidebar space-y-8">
          <div class="setup-side-card bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-cn-navy/5">
            <p class="text-xs font-black text-cn-blue uppercase tracking-widest mb-4">Ringkasan Pelan</p>
            <div class="flex justify-between items-end mb-6">
              <div>
                <h3 class="text-xl font-black text-cn-deep">${escapeHtml(subscription.plan_label)}</h3>
                <p class="text-xs text-slate-400 font-bold">${escapeHtml(subscription.subscription_code)}</p>
              </div>
              <div class="text-2xl font-black text-cn-deep">${formatMoney(subscription.amount)}</div>
            </div>
            <ul class="space-y-3">
              <li class="flex items-center gap-3 text-sm font-bold text-slate-600">
                <span class="text-cn-yellow"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> Link kedai sendiri
              </li>
              <li class="flex items-center gap-3 text-sm font-bold text-slate-600">
                <span class="text-cn-yellow"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> Bayaran online
              </li>
              <li class="flex items-center gap-3 text-sm font-bold text-slate-600">
                <span class="text-cn-yellow"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> Dashboard order
              </li>
              <li class="flex items-center gap-3 text-sm font-bold text-slate-600">
                <span class="text-cn-yellow"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> Fail dipadam automatik
              </li>
            </ul>
          </div>
          
          <div class="setup-side-card setup-preview-card p-8 bg-cn-navy rounded-[2rem] text-white overflow-hidden relative">
             <div class="relative z-10">
               <h4 class="font-black mb-2 italic text-cn-yellow uppercase tracking-widest text-xs">Preview Link</h4>
               <p class="text-lg font-black leading-tight mb-4">/shop/<span class="slug-preview">nama-kedai</span></p>
               <p class="text-sm text-white/60 font-medium leading-relaxed">
                 Page ini akan digunakan pelanggan untuk upload PDF, pilih tetapan print, bayar online, dan pilih pickup.
               </p>
             </div>
             <div class="absolute -right-10 -bottom-10 opacity-10 scale-[2] -rotate-12 pointer-events-none">
               <img src="/public/assets/icon.png" alt="">
             </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- Hours Modal -->
    <dialog id="hours-modal" class="hours-modal p-0 rounded-3xl shadow-2xl backdrop:bg-cn-deep/60 backdrop:backdrop-blur-sm border-0">
      <div class="hours-modal-shell w-full max-w-md bg-white">
        <div class="hours-modal-head p-8 bg-cn-blue text-white text-center">
          <button type="button" class="hours-modal-close" onclick="document.getElementById('hours-modal').close()" aria-label="Tutup modal">×</button>
          <h3 class="text-2xl font-black">Waktu Operasi</h3>
          <p class="text-white/70 font-bold text-sm mt-1">Pilih hari dan masa kedai dibuka.</p>
        </div>
        <div class="hours-modal-body p-8 space-y-8">
          <div class="hours-section space-y-4">
            <p class="hours-label text-xs font-black text-slate-500 uppercase tracking-widest">Hari Operasi</p>
            <div class="day-picker flex flex-wrap gap-2">
              ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => `
                <label class="day-chip flex-1 min-w-[60px]">
                  <input type="checkbox" value="${day}" ${day !== 'Sun' ? 'checked' : ''} class="peer hidden">
                  <span>${day}</span>
                </label>
              `).join('')}
            </div>
          </div>
          
          <div class="hours-time-grid grid grid-cols-2 gap-4">
            <div class="hours-time-field space-y-2">
              <label class="hours-label block text-xs font-black text-slate-500 uppercase tracking-widest">Waktu Buka</label>
              <input type="time" class="open-time w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-100 font-bold" value="09:00">
            </div>
            <div class="hours-time-field space-y-2">
              <label class="hours-label block text-xs font-black text-slate-500 uppercase tracking-widest">Waktu Tutup</label>
              <input type="time" class="close-time w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-100 font-bold" value="21:00">
            </div>
          </div>
          
          <div class="hours-modal-footer">
          <button type="button" onclick="document.getElementById('hours-modal').close()" 
                  class="hours-done w-full py-4 bg-cn-navy text-white rounded-2xl font-black text-lg shadow-xl shadow-cn-navy/20">Selesai</button>
          </div>
        </div>
      </div>
    </dialog>

    <script>
      const shopNameInput = document.querySelector('input[name="shop_name"]');
      const slugInput = document.querySelector('input[name="slug"]');
      const previews = document.querySelectorAll('.slug-preview');
      const operatingInput = document.querySelector('input[name="operating_hours"]');
      const operatingPreview = document.querySelector('.operating-preview');
      const dayInputs = [...document.querySelectorAll('#hours-modal input[type="checkbox"]')];
      const openTime = document.querySelector('.open-time');
      const closeTime = document.querySelector('.close-time');
      const setupForm = document.querySelector('.setup-form');
      const submitButton = document.querySelector('.setup-submit');
      const errorNodes = document.querySelectorAll('[data-error-for]');
      let slugTouched = false;
      function toSlug(value) {
        return String(value || '').toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64);
      }
      function syncSlugPreview() {
        const slug = toSlug(slugInput?.value) || 'nama-kedai';
        previews.forEach((preview) => preview.textContent = slug);
      }
      function field(name) {
        return setupForm?.querySelector('[name="' + name + '"]');
      }
      function setError(name, message = '') {
        const input = field(name);
        const error = setupForm?.querySelector('[data-error-for="' + name + '"]');
        if (error) error.textContent = message;
        input?.classList.toggle('setup-invalid', Boolean(message));
      }
      function validateSetup(showErrors = false) {
        const values = {
          shop_name: field('shop_name')?.value.trim() || '',
          slug: toSlug(field('slug')?.value || ''),
          phone: field('phone')?.value.trim() || '',
          operating_hours: field('operating_hours')?.value.trim() || '',
          address: field('address')?.value.trim() || '',
          password: field('password')?.value || '',
          password_confirm: field('password_confirm')?.value || ''
        };
        const errors = {};
        if (!values.shop_name) errors.shop_name = 'Masukkan nama kedai.';
        if (!values.slug || values.slug.length < 3) errors.slug = 'Masukkan link kedai sekurang-kurangnya 3 aksara.';
        if (!/^[a-z0-9-]+$/.test(values.slug)) errors.slug = 'Guna huruf kecil, nombor, dan dash sahaja.';
        if (!/^[0-9+ -]{9,16}$/.test(values.phone)) errors.phone = 'Masukkan nombor telefon yang sah.';
        if (!values.operating_hours || values.operating_hours.startsWith('Hari belum dipilih')) errors.operating_hours = 'Pilih hari dan waktu operasi.';
        if (!values.address) errors.address = 'Masukkan alamat atau kawasan kedai.';
        if (values.password.length < 6) errors.password = 'Password mesti sekurang-kurangnya 6 aksara.';
        if (!values.password_confirm || values.password_confirm !== values.password) errors.password_confirm = 'Password tidak sama.';
        if (showErrors) {
          errorNodes.forEach((node) => setError(node.dataset.errorFor, errors[node.dataset.errorFor] || ''));
        }
        if (submitButton) submitButton.disabled = Object.keys(errors).length > 0;
        return errors;
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
        if (operatingPreview) operatingPreview.textContent = value;
        validateSetup(false);
      }
      shopNameInput?.addEventListener('input', () => {
        if (!slugTouched && slugInput) slugInput.value = toSlug(shopNameInput.value);
        syncSlugPreview();
        validateSetup(false);
      });
      slugInput?.addEventListener('input', () => {
        slugTouched = true;
        slugInput.value = toSlug(slugInput.value);
        syncSlugPreview();
        validateSetup(false);
      });
      setupForm?.querySelectorAll('input, textarea').forEach((input) => {
        input.addEventListener('input', () => validateSetup(false));
      });
      setupForm?.addEventListener('submit', (event) => {
        const errors = validateSetup(true);
        if (Object.keys(errors).length) {
          event.preventDefault();
          setupForm.querySelector('.setup-invalid')?.focus();
          return;
        }
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = 'Menjana...';
        }
      });
      dayInputs.forEach((input) => input.addEventListener('change', syncOperatingHours));
      openTime?.addEventListener('input', syncOperatingHours);
      closeTime?.addEventListener('input', syncOperatingHours);
      syncSlugPreview();
      syncOperatingHours();
      validateSetup(false);
    </script>
  </main>`);
}

function dayName(index) {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][Number(index)] || 'Day';
}
