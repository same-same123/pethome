/**
 * ============================================================
 * PetHome — Main Application
 * app.js
 *
 * Responsibilities:
 *   - Boot sequence (loading screen → main app)
 *   - Multilanguage system (load/switch/apply)
 *   - DOM rendering (trust, stats, FAQ, timeline, stories,
 *     reports, guests, regulars)
 *   - Section navigation tracking
 *   - Scroll-to-top button
 *   - Language switcher UI
 *   - Hero CTA scroll behavior
 *   - CTA button actions
 * ============================================================
 */

(function () {
  'use strict';

  /* ============================================================
     CONSTANTS
  ============================================================ */

  /** Supported languages */
  const SUPPORTED_LANGS = ['ru', 'en', 'sr'];
  const DEFAULT_LANG = 'en';
  const LANG_STORAGE_KEY = 'pethome_lang';

  /** Language flag/label map */
  const LANG_META = {
    ru: { flag: '🇷🇺', code: 'RU', name: 'Русский' },
    en: { flag: '🇬🇧', code: 'EN', name: 'English' },
    sr: { flag: '🇷🇸', code: 'SR', name: 'Српски' },
  };

  /** Contact links — replace with real values */
  const CONTACTS = {
    telegram: 'https://t.me/serbian_pets',
    whatsapp:  'https://wa.me/381631462563',
    phone:     'tel:+381631462563',
  };

  /** Gallery images (Unsplash) */
  const GALLERY_IMAGES = [
    {
      src: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=600&fit=crop&q=80',
      srcset: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop&q=80 400w, https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=600&fit=crop&q=80 800w',
    },
    {
      src: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop&q=80',
      srcset: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&q=80 400w, https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop&q=80 800w',
    },
    {
      src: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop&q=80',
      srcset: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&q=80 400w, https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop&q=80 800w',
    },
    {
      src: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop&q=80',
      srcset: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&q=80 400w, https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop&q=80 800w',
    },
    {
      src: 'https://images.unsplash.com/photo-1530041539828-114de669390e?w=800&h=600&fit=crop&q=80',
      srcset: 'https://images.unsplash.com/photo-1530041539828-114de669390e?w=400&h=300&fit=crop&q=80 400w, https://images.unsplash.com/photo-1530041539828-114de669390e?w=800&h=600&fit=crop&q=80 800w',
    },
    {
      src: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&h=600&fit=crop&q=80',
      srcset: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&h=300&fit=crop&q=80 400w, https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&h=600&fit=crop&q=80 800w',
    },
    {
      src: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=600&fit=crop&q=80',
      srcset: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop&q=80 400w, https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=600&fit=crop&q=80 800w',
    },
    {
      src: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&h=600&fit=crop&q=80',
      srcset: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400&h=300&fit=crop&q=80 400w, https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&h=600&fit=crop&q=80 800w',
    },
    {
      src: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=800&h=600&fit=crop&q=80',
      srcset: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=400&h=300&fit=crop&q=80 400w, https://images.unsplash.com/photo-1560743641-3914f2c45636?w=800&h=600&fit=crop&q=80 800w',
    },
  ];

  /** Guest avatar images */
  const GUEST_PHOTOS = [
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=440&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530041539828-114de669390e?w=600&h=440&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=440&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=440&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=440&fit=crop&q=80',
  ];

  /** Regular guest avatars */
  const REGULAR_PHOTOS = [
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=180&h=180&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530041539828-114de669390e?w=180&h=180&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=180&h=180&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=180&h=180&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=180&h=180&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=180&h=180&fit=crop&q=80',
  ];

  /** Story images */
  const STORY_IMAGES = [
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530041539828-114de669390e?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&h=600&fit=crop&q=80',
  ];

  /** Report images */
  const REPORT_IMAGES = [
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=450&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=450&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=450&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530041539828-114de669390e?w=600&h=450&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=450&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=450&fit=crop&q=80',
  ];

  /** Review avatar images */
  const REVIEW_AVATARS = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=112&h=112&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=112&h=112&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=112&h=112&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=112&h=112&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=112&h=112&fit=crop&q=80',
  ];

  /** Video thumbnail images */
  const VIDEO_THUMBS = [
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=560&h=350&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=560&h=350&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=560&h=350&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530041539828-114de669390e?w=560&h=350&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=560&h=350&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=560&h=350&fit=crop&q=80',
  ];

  /* ============================================================
     STATE
  ============================================================ */
  let currentLang = DEFAULT_LANG;
  let translations = {};
  let sectionsObserver = null;
  let scrollTopBtn = null;

  /* ============================================================
     LANGUAGE SYSTEM
  ============================================================ */

  /**
   * Determine initial language:
   *   1. LocalStorage saved preference
   *   2. Telegram user language
   *   3. Browser language
   *   4. Default (en)
   */
  function detectLanguage() {
    /* 1 — Saved preference */
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;

    /* 2 — Telegram language */
    const tgLang = TelegramApp.getLanguageCode();
    if (tgLang && SUPPORTED_LANGS.includes(tgLang)) return tgLang;

    /* 3 — Browser language */
    const browserLang = (navigator.language || '').split('-')[0].toLowerCase();
    if (SUPPORTED_LANGS.includes(browserLang)) return browserLang;

    /* 4 — Default */
    return DEFAULT_LANG;
  }

  /**
   * Load language JSON from data/lang/
   * @param {string} lang
   * @returns {Promise<Object>}
   */
  async function loadTranslations(lang) {
    try {
      const res = await fetch(`data/lang/${lang}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(`[i18n] Failed to load "${lang}", falling back to "${DEFAULT_LANG}".`, err);
      if (lang !== DEFAULT_LANG) {
        return loadTranslations(DEFAULT_LANG);
      }
      return {};
    }
  }

  /**
   * Apply translations to DOM elements with data-i18n attribute
   * @param {Object} t — translations object
   */
  function applyTranslations(t) {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const value = getNestedValue(t, key);
      if (value !== undefined) {
        el.textContent = value;
      }
    });
  }

  /**
   * Get nested value from object by dot-notation key
   * e.g. getNestedValue(t, 'hero.title1') → t.hero.title1
   */
  function getNestedValue(obj, key) {
    return key.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
  }

  /**
   * Switch language
   * @param {string} lang
   */
  async function switchLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;

    currentLang = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.setAttribute('lang', lang);

    /* Load translations */
    translations = await loadTranslations(lang);

    /* Apply static translations */
    applyTranslations(translations);

    /* Re-render all dynamic sections */
    renderTrustCards();
    renderTimeline();
    renderStats();
    renderFaq();
    renderStories();
    renderReports();
    renderGuests();
    renderRegulars();

    /* Re-render sliders (reviews & guests are in slider.js) */
    if (window.ReviewsSlider) window.ReviewsSlider.init(translations);
    if (window.GalleryModule) window.GalleryModule.updateCaptions(translations);
    if (window.VideoModule) window.VideoModule.init(translations);

    /* Update lang switcher UI */
    updateLangSwitcherUI(lang);

    /* Trigger re-observation for animations */
    setTimeout(reObserveElements, 50);

    TelegramApp.hapticLight();
  }

  /**
   * Update language switcher button and active state
   */
  function updateLangSwitcherUI(lang) {
    const meta = LANG_META[lang];
    if (!meta) return;

    const flagEl = document.getElementById('lang-flag');
    const codeEl = document.getElementById('lang-code');
    if (flagEl) flagEl.textContent = meta.flag;
    if (codeEl) codeEl.textContent = meta.code;

    /* Mark active option */
    document.querySelectorAll('.lang-option').forEach((opt) => {
      opt.classList.toggle('active', opt.dataset.lang === lang);
    });
  }

  /* ============================================================
     RENDERING — TRUST CARDS
  ============================================================ */

  function renderTrustCards() {
    const grid = document.getElementById('trust-grid');
    if (!grid || !translations.trust?.items) return;

    grid.innerHTML = translations.trust.items.map((item) => `
      <div class="trust-card reveal-up" role="article">
        <div class="trust-card-icon" aria-hidden="true">${item.icon}</div>
        <h3 class="trust-card-title">${escHtml(item.title)}</h3>
        <p class="trust-card-desc">${escHtml(item.desc)}</p>
      </div>
    `).join('');
  }

  /* ============================================================
     RENDERING — TIMELINE
  ============================================================ */

  function renderTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container || !translations.timeline?.items) return;

    container.innerHTML = translations.timeline.items.map((item) => `
      <div class="timeline-item" role="listitem">
        <div class="timeline-time">${escHtml(item.time)}</div>
        <div class="timeline-dot-wrap">
          <div class="timeline-dot"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-title">
            <span class="timeline-emoji" aria-hidden="true">${item.emoji}</span>${escHtml(item.title)}
          </div>
          <div class="timeline-desc">${escHtml(item.desc)}</div>
        </div>
      </div>
    `).join('');
  }

  /* ============================================================
     RENDERING — STATS
  ============================================================ */

  function renderStats() {
    const grid = document.getElementById('stats-grid');
    if (!grid || !translations.stats?.items) return;

    grid.innerHTML = translations.stats.items.map((item) => `
      <div class="stat-card" role="article">
        <div class="stat-icon" aria-hidden="true">${item.icon}</div>
        <div class="stat-number" data-target="${item.number}" data-prefix="${escHtml(item.prefix)}" data-suffix="${escHtml(item.suffix)}">
          <span class="stat-prefix">${escHtml(item.prefix)}</span>0<span class="stat-suffix">${escHtml(item.suffix)}</span>
        </div>
        <div class="stat-label">${escHtml(item.label)}</div>
      </div>
    `).join('');
  }

  /* ============================================================
     RENDERING — FAQ
  ============================================================ */

  function renderFaq() {
    const list = document.getElementById('faq-list');
    if (!list || !translations.faq?.items) return;

    list.innerHTML = translations.faq.items.map((item, i) => `
      <div class="faq-item" data-index="${i}">
        <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${i}">
          <span class="faq-q-text">${escHtml(item.q)}</span>
          <span class="faq-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2V12M2 7H12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </span>
        </button>
        <div class="faq-answer" id="faq-answer-${i}" role="region">
          <div class="faq-answer-inner">${escHtml(item.a)}</div>
        </div>
      </div>
    `).join('');

    /* Re-bind FAQ accordion */
    initFaqAccordion();
  }

  /**
   * FAQ accordion behavior
   */
  function initFaqAccordion() {
    const items = document.querySelectorAll('.faq-item');

    items.forEach((item) => {
      const btn = item.querySelector('.faq-question');
      if (!btn) return;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        /* Close all */
        items.forEach((i) => {
          i.classList.remove('open');
          const b = i.querySelector('.faq-question');
          if (b) b.setAttribute('aria-expanded', 'false');
        });

        /* Open clicked if was closed */
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          TelegramApp.hapticLight();
        }
      });
    });
  }

  /* ============================================================
     RENDERING — STORIES
  ============================================================ */

  function renderStories() {
    const list = document.getElementById('stories-list');
    if (!list || !translations.stories?.items) return;

    list.innerHTML = translations.stories.items.map((story, i) => `
      <div class="story-card" role="article">
        <div class="story-image">
          <img
            src="${STORY_IMAGES[i % STORY_IMAGES.length]}"
            alt="${escHtml(story.name)}"
            loading="lazy"
          />
          <div class="story-emoji-badge" aria-hidden="true">${story.emoji}</div>
        </div>
        <div class="story-body">
          <div class="story-name">${escHtml(story.name)}</div>
          <h3 class="story-title">${escHtml(story.title)}</h3>
          <p class="story-text">${escHtml(story.text)}</p>
          <blockquote class="story-quote">${escHtml(story.quote)}</blockquote>
          <div class="story-outcome">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ${escHtml(story.outcome)}
          </div>
        </div>
      </div>
    `).join('');
  }

  /* ============================================================
     RENDERING — REPORTS
  ============================================================ */

  function renderReports() {
    const grid = document.getElementById('reports-grid');
    if (!grid || !translations.reports?.items) return;

    grid.innerHTML = translations.reports.items.map((report, i) => `
      <div class="report-card" role="article" data-index="${i}">
        <div class="report-photo">
          <img
            src="${REPORT_IMAGES[i % REPORT_IMAGES.length]}"
            alt="${escHtml(report.pet)}"
            loading="lazy"
          />
          <div class="report-date-badge">${escHtml(report.date)}</div>
        </div>
        <div class="report-body">
          <div class="report-pet-name">${escHtml(report.pet)}</div>
          <div class="report-caption">${escHtml(report.caption)}</div>
          <div class="report-mood">
            <span aria-hidden="true">😊</span>
            ${escHtml(report.mood)}
          </div>
        </div>
      </div>
    `).join('');

    /* Report cards open in gallery lightbox */
    document.querySelectorAll('.report-card').forEach((card, i) => {
      card.addEventListener('click', () => {
        if (window.GalleryModule) {
          window.GalleryModule.openReports(i);
        }
        TelegramApp.hapticLight();
      });
    });
  }

  /* ============================================================
     RENDERING — GUESTS
  ============================================================ */

  function renderGuests() {
    const track = document.getElementById('guests-track');
    if (!track || !translations.guests?.items) return;

    track.innerHTML = translations.guests.items.map((guest, i) => `
      <div class="guest-card" role="article">
        <img
          class="guest-photo"
          src="${GUEST_PHOTOS[i % GUEST_PHOTOS.length]}"
          alt="${escHtml(guest.name)}"
          loading="lazy"
        />
        <div class="guest-body">
          <div class="guest-name-row">
            <div class="guest-name">${escHtml(guest.name)}</div>
            <div class="guest-age">${escHtml(guest.age)}</div>
          </div>
          <div class="guest-breed">${escHtml(guest.breed)}</div>
          <div class="guest-meta">
            <div class="guest-meta-item">
              <span class="guest-meta-icon" aria-hidden="true">📅</span>
              <span>${escHtml(guest.days)}</span>
            </div>
            <div class="guest-meta-item">
              <span class="guest-meta-icon" aria-hidden="true">🎾</span>
              <span>${escHtml(guest.toy)}</span>
            </div>
            <div class="guest-meta-item">
              <span class="guest-meta-icon" aria-hidden="true">🍖</span>
              <span>${escHtml(guest.treat)}</span>
            </div>
          </div>
          <p class="guest-story">"${escHtml(guest.story)}"</p>
        </div>
      </div>
    `).join('');

    /* Init drag scroll for guests track */
    initDragScroll(document.querySelector('.guests-scroll-container'), track);
  }

  /* ============================================================
     RENDERING — REGULARS
  ============================================================ */

  function renderRegulars() {
    const grid = document.getElementById('regulars-grid');
    if (!grid || !translations.regulars?.items) return;

    const visitsLabel = translations.regulars?.visits_label || 'visits';

    grid.innerHTML = translations.regulars.items.map((regular, i) => `
      <div class="regular-item reveal-up" data-delay="${i * 80}" role="article">
        <div class="regular-avatar">
          <img
            class="regular-photo"
            src="${REGULAR_PHOTOS[i % REGULAR_PHOTOS.length]}"
            alt="${escHtml(regular.name)}"
            loading="lazy"
          />
          <div class="regular-visits-badge">${regular.visits}</div>
        </div>
        <div class="regular-name">${escHtml(regular.name)}</div>
        <div class="regular-visits">${regular.visits} ${escHtml(visitsLabel)}</div>
      </div>
    `).join('');
  }

  /* ============================================================
     DRAG SCROLL
  ============================================================ */

  /**
   * Enable drag-to-scroll on a container
   * @param {HTMLElement} container
   * @param {HTMLElement} track
   */
  function initDragScroll(container, track) {
    if (!container || !track) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      container.classList.add('active');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.classList.remove('active');
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
      container.classList.remove('active');
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    });

    /* Touch support */
    let touchStartX = 0;
    let touchScrollLeft = 0;

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = container.scrollLeft;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      const diff = touchStartX - e.touches[0].pageX;
      container.scrollLeft = touchScrollLeft + diff;
    }, { passive: true });
  }

  /* ============================================================
     SECTION NAVIGATION
  ============================================================ */

  function initSectionNav() {
    const nav = document.getElementById('section-nav');
    const dots = document.querySelectorAll('.section-nav-dot');
    const sections = document.querySelectorAll('.section[data-section]');

    if (!nav || !dots.length || !sections.length) return;

    /* Show nav after first scroll */
    const showNav = () => {
      if (window.scrollY > 200) {
        nav.classList.add('visible');
      } else {
        nav.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', showNav, { passive: true });

    /* Dot click → smooth scroll to section */
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const sectionId = dot.dataset.section;
        const target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          TelegramApp.hapticLight();
        }
      });
    });

    /* Intersection observer to track active section */
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.section;
            dots.forEach((dot) => {
              dot.classList.toggle('active', dot.dataset.section === id);
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((s) => sectionObserver.observe(s));
  }

  /* ============================================================
     SCROLL TO TOP
  ============================================================ */

  function initScrollTop() {
    scrollTopBtn = document.getElementById('scroll-top');
    if (!scrollTopBtn) return;

    window.addEventListener(
      'scroll',
      () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
      },
      { passive: true }
    );

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      TelegramApp.hapticLight();
    });
  }

  /* ============================================================
     LANGUAGE SWITCHER UI
  ============================================================ */

  function initLangSwitcher() {
    const btn = document.getElementById('lang-btn');
    const dropdown = document.getElementById('lang-dropdown');
    const options = document.querySelectorAll('.lang-option');

    if (!btn || !dropdown) return;

    /* Toggle dropdown */
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      dropdown.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      TelegramApp.hapticLight();
    });

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    /* Language selection */
    options.forEach((opt) => {
      opt.addEventListener('click', () => {
        const lang = opt.dataset.lang;
        dropdown.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        switchLanguage(lang);
      });
    });
  }

  /* ============================================================
     HERO CTA
  ============================================================ */

  function initHeroCta() {
    const cta = document.querySelector('.hero-cta');
    if (!cta) return;

    cta.addEventListener('click', () => {
      const trustSection = document.getElementById('trust');
      if (trustSection) {
        trustSection.scrollIntoView({ behavior: 'smooth' });
      }
      TelegramApp.hapticLight();
    });
  }

  /* ============================================================
     CTA CONTACT BUTTONS
  ============================================================ */

  function initCtaButtons() {
    const btnTelegram = document.getElementById('btn-telegram');
    const btnWhatsapp = document.getElementById('btn-whatsapp');
    const btnCall = document.getElementById('btn-call');

    if (btnTelegram) {
      btnTelegram.addEventListener('click', () => {
        TelegramApp.hapticMedium();
        TelegramApp.openTelegramLink(CONTACTS.telegram);
      });
    }

    if (btnWhatsapp) {
      btnWhatsapp.addEventListener('click', () => {
        TelegramApp.hapticMedium();
        TelegramApp.openLink(CONTACTS.whatsapp);
      });
    }

    if (btnCall) {
      btnCall.addEventListener('click', () => {
        TelegramApp.hapticMedium();
        window.location.href = CONTACTS.phone;
      });
    }
  }

  /* ============================================================
     INTERSECTION OBSERVER — REVEAL ANIMATIONS
  ============================================================ */

  function initRevealObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            /* Only animate once */
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    sectionsObserver = observer;

    /* Observe all animatable elements */
    observeElements();
  }

  function observeElements() {
    const selectors = [
      '.reveal-up',
      '.reveal-left',
      '.reveal-right',
      '.reveal-fade',
      '.reveal-scale',
      '.trust-card',
      '.gallery-item',
      '.story-card',
      '.report-card',
      '.stat-card',
      '.faq-item',
      '.timeline-item',
      '.review-card',
      '.regular-item',
    ];

    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        sectionsObserver.observe(el);
      });
    });
  }

  function reObserveElements() {
    observeElements();
  }

  /* ============================================================
     STAT COUNTER ANIMATION
  ============================================================ */

  function initStatCounters() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    /* Will be called after stats are rendered */
    document.querySelectorAll('.stat-number[data-target]').forEach((el) => {
      observer.observe(el);
    });

    /* Also observe dynamically after re-render */
    window._reInitStatCounters = () => {
      document.querySelectorAll('.stat-number[data-target]').forEach((el) => {
        observer.observe(el);
      });
    };
  }

  /**
   * Animate number counting up
   * @param {HTMLElement} el
   */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const update = (timestamp) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(easeOut(progress) * target);

      el.innerHTML = `<span class="stat-prefix">${prefix}</span>${formatNumber(current)}<span class="stat-suffix">${suffix}</span>`;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }

  /**
   * Format large numbers with commas
   */
  function formatNumber(n) {
    if (n >= 1000) {
      return n.toLocaleString();
    }
    return String(n);
  }

  /* ============================================================
     LOADING SCREEN
  ============================================================ */

  function hideLoadingScreen() {
    const screen = document.getElementById('loading-screen');
    const app = document.getElementById('app');

    if (!screen) return;

    screen.classList.add('ready');

    setTimeout(() => {
      screen.classList.add('hidden');
      if (app) app.classList.add('loaded');

      /* Hide completely after transition */
      setTimeout(() => {
        screen.style.display = 'none';
      }, 900);
    }, 2200);
  }

  /* ============================================================
     PAGE PROGRESS BAR
  ============================================================ */

  function initProgressBar() {
    const bar = document.createElement('div');
    bar.className = 'page-progress';
    document.body.appendChild(bar);

    window.addEventListener(
      'scroll',
      () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        bar.style.transform = `scaleX(${progress})`;
      },
      { passive: true }
    );
  }

  /* ============================================================
     PARALLAX HERO
  ============================================================ */

  function initHeroParallax() {
    const heroBg = document.querySelector('.hero-bg-img');
    if (!heroBg) return;

    let ticking = false;

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const heroHeight = document.getElementById('hero')?.offsetHeight || window.innerHeight;

            if (scrollY < heroHeight) {
              const offset = scrollY * 0.35;
              heroBg.style.transform = `scale(1.05) translateY(${offset}px)`;
            }

            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ============================================================
     UTILITY: HTML ESCAPE
  ============================================================ */

  function escHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* Expose for other modules */
  window.escHtml = escHtml;

  /* ============================================================
     BOOT SEQUENCE
  ============================================================ */

  async function boot() {
    /* 1 — Init Telegram */
    TelegramApp.init();

    /* 2 — Detect language */
    currentLang = detectLanguage();
    document.documentElement.setAttribute('lang', currentLang);

    /* 3 — Load translations */
    translations = await loadTranslations(currentLang);

    /* 4 — Apply static i18n */
    applyTranslations(translations);

    /* 5 — Render dynamic sections */
    renderTrustCards();
    renderTimeline();
    renderStats();
    renderFaq();
    renderStories();
    renderReports();
    renderGuests();
    renderRegulars();

    /* 6 — Init gallery (sets images for lightbox) */
    if (window.GalleryModule) {
      window.GalleryModule.init(GALLERY_IMAGES, translations);
    }

    /* 7 — Init video module */
    if (window.VideoModule) {
      window.VideoModule.init(translations, VIDEO_THUMBS);
    }

    /* 8 — Init reviews slider */
    if (window.ReviewsSlider) {
      window.ReviewsSlider.init(translations, REVIEW_AVATARS, GUEST_PHOTOS);
    }

    /* 9 — Init UI behaviors */
    initLangSwitcher();
    updateLangSwitcherUI(currentLang);
    initHeroCta();
    initCtaButtons();
    initSectionNav();
    initScrollTop();
    initRevealObserver();
    initStatCounters();
    initProgressBar();
    initHeroParallax();

    /* 10 — Hide loading screen */
    hideLoadingScreen();

    /* Expose translations for other modules */
    window._translations = translations;
    window._currentLang = currentLang;
    window._switchLanguage = switchLanguage;
  }

  /* Run on DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
