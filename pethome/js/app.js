'use strict';

// ─── CONTACTS ───────────────────────────────────────────────────────────────
const CONTACTS = {
  telegram: 'https://t.me/your_telegram',
  phone: 'tel:+79991234567',
  phoneDisplay: '+7 999 123-45-67'
};

// ─── STATE ───────────────────────────────────────────────────────────────────
let currentLang = 'ru';
let langData = {};

// ─── BOOT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const detectedLang = TG.getLanguage();
  currentLang = ['ru', 'en', 'sr'].includes(detectedLang) ? detectedLang : 'ru';
  setActiveLangBtn(currentLang);
  bootSequence();
});

async function bootSequence() {
  await loadLang(currentLang);
  runLoadingAnimation();
}

function runLoadingAnimation() {
  const msgs = langData.loading?.messages || ['Loading…'];
  const bar = document.getElementById('loading-bar-fill');
  const msgEl = document.getElementById('loading-msg');
  let i = 0;
  msgEl.textContent = msgs[0];

  const interval = setInterval(() => {
    i++;
    if (i < msgs.length) {
      msgEl.textContent = msgs[i];
      bar.style.width = ((i / msgs.length) * 100) + '%';
    } else {
      clearInterval(interval);
      bar.style.width = '100%';
      setTimeout(showApp, 400);
    }
  }, 600);
}

function showApp() {
  const screen = document.getElementById('loading-screen');
  const app = document.getElementById('app');
  screen.style.opacity = '0';
  screen.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    screen.style.display = 'none';
    app.classList.remove('hidden');
    renderAll();
    initBehaviors();
  }, 500);
}

// ─── LANG ────────────────────────────────────────────────────────────────────
async function loadLang(lang) {
  try {
    const res = await fetch(`data/lang/${lang}.json`);
    langData = await res.json();
  } catch (e) {
    console.error('Lang load error:', e);
    langData = {};
  }
}

async function switchLang(lang) {
  currentLang = lang;
  setActiveLangBtn(lang);
  await loadLang(lang);
  renderAll();
}

function setActiveLangBtn(lang) {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function t(path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : ''), langData);
}

// ─── RENDER ALL ──────────────────────────────────────────────────────────────
function renderAll() {
  renderHero();
  renderNav();
  renderTrust();
  renderIndividualBanner();
  renderGallery();
  renderVideos();
  renderGuests();
  renderStories();
  renderReports();
  renderReviews();
  renderTimeline();
  renderStats();
  renderFaq();
  renderCta();
  renderFooter();
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function renderHero() {
  setText('hero-badge', t('hero.badge'));
  setText('hero-title', t('hero.title'));
  setText('hero-subtitle', t('hero.subtitle'));
  setText('hero-cta-text', t('hero.cta'));

  const pillsEl = document.getElementById('hero-pills');
  const pills = t('hero.pills');
  if (Array.isArray(pills)) {
    pillsEl.innerHTML = pills.map(p => `<span class="hero-pill">${p}</span>`).join('');
  }

  const bg = document.getElementById('hero-bg');
  bg.style.backgroundImage = `url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&h=800&fit=crop&q=80')`;

  document.getElementById('hero-cta-btn').onclick = () => {
    TG.haptic('light');
    document.getElementById('cta').scrollIntoView({ behavior: 'smooth' });
  };
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function renderNav() {
  const navItems = t('nav');
  if (!Array.isArray(navItems)) return;
  const inner = document.getElementById('nav-inner');
  inner.innerHTML = navItems.map(item =>
    `<button class="nav-item" data-target="${item.id}">${item.label}</button>`
  ).join('');

  inner.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      TG.haptic('light');
      const el = document.getElementById(btn.dataset.target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ─── TRUST ───────────────────────────────────────────────────────────────────
function renderTrust() {
  setText('trust-title', t('trust.title'));
  setText('trust-subtitle', t('trust.subtitle'));

  const grid = document.getElementById('trust-grid');
  const cards = t('trust.cards');
  if (!Array.isArray(cards)) return;

  grid.innerHTML = cards.map(card => `
    <div class="trust-card reveal-up">
      <div class="trust-icon">${card.icon}</div>
      <h3 class="trust-card-title">${card.title}</h3>
      <p class="trust-card-text">${card.text}</p>
    </div>
  `).join('');
}

// ─── INDIVIDUAL BANNER ───────────────────────────────────────────────────────
function renderIndividualBanner() {
  const banner = t('individual');
  if (!banner || !banner.title) return;

  const inner = document.getElementById('banner-inner');
  inner.innerHTML = `
    <div class="banner-icon">${banner.icon || '🏠'}</div>
    <div class="banner-text">
      <h3 class="banner-title">${banner.title}</h3>
      <p class="banner-desc">${banner.desc}</p>
    </div>
  `;
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────
function renderGallery() {
  setText('gallery-title', t('gallery.title'));
  setText('gallery-subtitle', t('gallery.subtitle'));

  const photos = t('gallery.photos');
  if (typeof window.renderGalleryGrid === 'function') {
    window.renderGalleryGrid(photos);
  }
}

// ─── VIDEOS ──────────────────────────────────────────────────────────────────
function renderVideos() {
  setText('videos-title', t('videos.title'));
  setText('videos-subtitle', t('videos.subtitle'));

  const videos = t('videos.items');
  if (typeof window.renderVideoGrid === 'function') {
    window.renderVideoGrid(videos);
  }
}

// ─── GUESTS ──────────────────────────────────────────────────────────────────
function renderGuests() {
  setText('guests-title', t('guests.title'));
  setText('guests-subtitle', t('guests.subtitle'));

  const grid = document.getElementById('guests-grid');
  const guests = t('guests.list');
  if (!Array.isArray(guests)) return;

  grid.innerHTML = guests.map(g => `
    <div class="guest-card reveal-up">
      <div class="guest-avatar">${g.emoji}</div>
      <div class="guest-info">
        <div class="guest-name">${g.name}</div>
        <div class="guest-breed">${g.breed}</div>
        <div class="guest-visits">${g.visits}</div>
      </div>
    </div>
  `).join('');
}

// ─── STORIES ─────────────────────────────────────────────────────────────────
function renderStories() {
  setText('stories-title', t('stories.title'));
  setText('stories-subtitle', t('stories.subtitle'));

  const list = document.getElementById('stories-list');
  const items = t('stories.items');
  if (!Array.isArray(items)) return;

  list.innerHTML = items.map(s => `
    <div class="story-card reveal-up">
      <div class="story-header">
        <span class="story-emoji">${s.emoji}</span>
        <div>
          <div class="story-pet">${s.pet}</div>
          <div class="story-owner">${s.owner}</div>
        </div>
        <div class="story-date">${s.date}</div>
      </div>
      <p class="story-text">${s.text}</p>
      ${s.individual ? `<div class="story-individual-badge">🏠 ${s.individual}</div>` : ''}
    </div>
  `).join('');
}

// ─── REPORTS ─────────────────────────────────────────────────────────────────
function renderReports() {
  setText('reports-title', t('reports.title'));
  setText('reports-subtitle', t('reports.subtitle'));

  const grid = document.getElementById('reports-grid');
  const items = t('reports.items');
  if (!Array.isArray(items)) return;

  grid.innerHTML = items.map(r => `
    <div class="report-card reveal-up">
      <div class="report-img-wrap">
        <img class="report-img" src="${r.img}" alt="${r.caption}" loading="lazy" />
        <div class="report-time">${r.time}</div>
      </div>
      <div class="report-body">
        <div class="report-caption">${r.caption}</div>
        <div class="report-desc">${r.desc}</div>
      </div>
    </div>
  `).join('');
}

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
function renderReviews() {
  setText('reviews-title', t('reviews.title'));
  setText('reviews-subtitle', t('reviews.subtitle'));

  const items = t('reviews.items');
  if (typeof window.renderReviewsSlider === 'function') {
    window.renderReviewsSlider(items);
  }
}

// ─── TIMELINE ────────────────────────────────────────────────────────────────
function renderTimeline() {
  setText('timeline-title', t('timeline.title'));
  setText('timeline-subtitle', t('timeline.subtitle'));

  const list = document.getElementById('timeline-list');
  const items = t('timeline.items');
  if (!Array.isArray(items)) return;

  list.innerHTML = items.map((item, i) => `
    <div class="timeline-item reveal-up" data-index="${i}">
      <div class="timeline-dot">${item.icon}</div>
      <div class="timeline-content">
        <div class="timeline-time">${item.time}</div>
        <div class="timeline-title-text">${item.title}</div>
        <div class="timeline-desc">${item.desc}</div>
      </div>
    </div>
  `).join('');
}

// ─── STATS ───────────────────────────────────────────────────────────────────
function renderStats() {
  const grid = document.getElementById('stats-grid');
  const items = t('stats.items');
  if (!Array.isArray(items)) return;

  grid.innerHTML = items.map(s => `
    <div class="stat-card reveal-up">
      <div class="stat-icon">${s.icon}</div>
      <div class="stat-value" data-target="${s.value}">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function renderFaq() {
  setText('faq-title', t('faq.title'));
  setText('faq-subtitle', t('faq.subtitle'));

  const list = document.getElementById('faq-list');
  const items = t('faq.items');
  if (!Array.isArray(items)) return;

  list.innerHTML = items.map((item, i) => `
    <div class="faq-item reveal-up" data-index="${i}">
      <button class="faq-question" aria-expanded="false">
        <span>${item.q}</span>
        <span class="faq-arrow">▾</span>
      </button>
      <div class="faq-answer">
        <p>${item.a}</p>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      TG.haptic('light');
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      list.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
      btn.setAttribute('aria-expanded', !isOpen);
    });
  });
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function renderCta() {
  setText('cta-title', t('cta.title'));
  setText('cta-subtitle', t('cta.subtitle'));
  setText('cta-tg-text', t('cta.telegram'));
  setText('cta-phone-text', t('cta.phone'));
  setText('cta-note', t('cta.note'));
  initCtaButtons();
}

function initCtaButtons() {
  const tgBtn = document.getElementById('cta-tg-btn');
  const phoneBtn = document.getElementById('cta-phone-btn');

  if (tgBtn) {
    tgBtn.onclick = () => {
      TG.haptic('medium');
      TG.openLink(CONTACTS.telegram);
    };
  }

  if (phoneBtn) {
    phoneBtn.onclick = () => {
      TG.haptic('medium');
      TG.openLink(CONTACTS.phone);
    };
  }
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function renderFooter() {
  setText('footer-tagline', t('footer.tagline'));
  setText('footer-copy', t('footer.copy'));

  const tgLink = document.getElementById('footer-tg-link');
  const phoneLink = document.getElementById('footer-phone-link');

  if (tgLink) {
    tgLink.textContent = 'Telegram';
    tgLink.onclick = () => TG.openLink(CONTACTS.telegram);
  }

  if (phoneLink) {
    phoneLink.textContent = CONTACTS.phoneDisplay;
    phoneLink.onclick = () => TG.openLink(CONTACTS.phone);
  }
}

// ─── BEHAVIORS ───────────────────────────────────────────────────────────────
function initBehaviors() {
  initScrollTop();
  initLangSwitcher();
  initNavHighlight();
  initRevealObserver();
  initHeroCta();
}

function initScrollTop() {
  const btn = document.getElementById('scroll-top-btn');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => {
    TG.haptic('light');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initLangSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      TG.haptic('light');
      switchLang(btn.dataset.lang);
    });
  });
}

function initNavHighlight() {
  const sections = document.querySelectorAll('[data-section]');
  const navItems = document.querySelectorAll('.nav-item');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(item => {
          item.classList.toggle('active', item.dataset.target === entry.target.id);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
}

function initRevealObserver() {
  const els = document.querySelectorAll('.reveal-up');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
}

function initHeroCta() {
  const btn = document.getElementById('hero-cta-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      TG.haptic('light');
      document.getElementById('cta').scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// ─── UTILS ───────────────────────────────────────────────────────────────────
function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined && text !== '') el.textContent = text;
}