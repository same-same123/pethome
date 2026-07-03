/**
 * ============================================================
 * PetHome — Animations Module
 * animations.js
 *
 * Handles:
 *   - Ripple effect on buttons
 *   - Parallax on section backgrounds
 *   - Smooth counter re-trigger
 *   - Timeline active state by time
 *   - Hero entrance animation sequence
 * ============================================================
 */

(function () {
  'use strict';

  /* ============================================================
     RIPPLE EFFECT
  ============================================================ */

  /**
   * Add ripple effect to all buttons
   */
  function initRipple() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-primary, .btn-secondary, .btn-ghost, .hero-cta');
      if (!btn) return;

      const style = getComputedStyle(btn);
      if (style.position === 'static') {
        btn.style.position = 'relative';
      }
      btn.style.overflow = 'hidden';

      const wave = document.createElement('span');
      wave.className = 'ripple-wave';

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      wave.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
      `;

      btn.appendChild(wave);

      wave.addEventListener('animationend', () => wave.remove());
    });
  }

  /* ============================================================
     TIMELINE ACTIVE TIME
     Highlights the current time block in the timeline
  ============================================================ */

  function initTimelineActivetime() {
    const updateActive = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const items = document.querySelectorAll('.timeline-item');
      let lastActive = null;

      items.forEach((item) => {
        const timeEl = item.querySelector('.timeline-time');
        if (!timeEl) return;

        const timeText = timeEl.textContent.trim(); // "08:00"
        const parts = timeText.split(':');
        if (parts.length !== 2) return;

        const itemMinutes = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);

        if (itemMinutes <= currentMinutes) {
          lastActive = item;
        }
      });

      items.forEach((item) => item.classList.remove('active-time'));
      if (lastActive) {
        lastActive.classList.add('active-time');
      }
    };

    updateActive();
    /* Update every minute */
    setInterval(updateActive, 60000);
  }

  /* ============================================================
     AMBIENT BLOBS — decorative background elements
  ============================================================ */

  function initAmbientBlobs() {
    const sections = [
      { id: 'trust', color: 'green' },
      { id: 'stories', color: 'blue' },
      { id: 'stats', color: 'green' },
    ];

    sections.forEach(({ id, color }) => {
      const section = document.getElementById(id);
      if (!section) return;

      const blob = document.createElement('div');
      blob.className = `ambient-blob ambient-blob-${color}`;
      blob.style.cssText = `
        width: 300px;
        height: 300px;
        top: ${Math.random() * 60}%;
        ${Math.random() > 0.5 ? 'left' : 'right'}: -100px;
        animation-delay: ${Math.random() * 4}s;
      `;

      section.style.position = 'relative';
      section.appendChild(blob);
    });
  }

  /* ============================================================
     SMOOTH SCROLL SNAPPING FOR SECTIONS
  ============================================================ */

  function initSmoothScrollIndicator() {
    let lastScrollY = window.scrollY;
    let scrollDirection = 'down';

    window.addEventListener(
      'scroll',
      () => {
        scrollDirection = window.scrollY > lastScrollY ? 'down' : 'up';
        lastScrollY = window.scrollY;
      },
      { passive: true }
    );

    /* Expose direction for other modules */
    window._scrollDirection = () => scrollDirection;
  }

  /* ============================================================
     HERO CONTENT ENTRANCE STAGGER
     Adds progressive visibility classes to hero elements
  ============================================================ */

  function initHeroEntrance() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    const elements = heroContent.querySelectorAll('.reveal-up');

    elements.forEach((el, i) => {
      el.style.transitionDelay = `${(i + 1) * 120 + 400}ms`;
      /* Trigger after loading screen fades */
      setTimeout(() => {
        el.classList.add('visible');
      }, 2400 + i * 120);
    });
  }

  /* ============================================================
     LAZY VIDEO POSTER LOAD
     Defers video thumbnail images until section is visible
  ============================================================ */

  function initLazyVideoPosters() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const img = entry.target.querySelector('.video-thumb-img[data-src]');
          if (img) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }

          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '200px' }
    );

    document.querySelectorAll('.video-card').forEach((card) => {
      observer.observe(card);
    });
  }

  /* ============================================================
     CARD TILT EFFECT (subtle 3D on hover — desktop only)
  ============================================================ */

  function initCardTilt() {
    /* Only on devices with fine pointer (mouse) */
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cards = document.querySelectorAll('.trust-card, .review-card, .stat-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        const tiltX = ((y - cy) / cy) * 4;
        const tiltY = ((x - cx) / cx) * -4;

        card.style.transform = `translateY(-4px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ============================================================
     SECTION BACKGROUND PARALLAX
  ============================================================ */

  function initSectionParallax() {
    const sections = document.querySelectorAll('.section-stories, .section-reports');
    if (!sections.length) return;

    let ticking = false;

    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        requestAnimationFrame(() => {
          sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight;

            if (rect.bottom < 0 || rect.top > vh) {
              ticking = false;
              return;
            }

            const progress = (vh - rect.top) / (vh + rect.height);
            const offset = (progress - 0.5) * 30;

            const bg = section.querySelector('.section-bg-parallax');
            if (bg) {
              bg.style.transform = `translateY(${offset}px)`;
            }
          });
          ticking = false;
        });
        ticking = true;
      },
      { passive: true }
    );
  }

  /* ============================================================
     STAT COUNTER RE-TRIGGER ON LANGUAGE SWITCH
  ============================================================ */

  function watchStatsReRender() {
    /* MutationObserver watches stats-grid for content changes */
    const statsGrid = document.getElementById('stats-grid');
    if (!statsGrid) return;

    const observer = new MutationObserver(() => {
      if (window._reInitStatCounters) {
        setTimeout(window._reInitStatCounters, 50);
      }
    });

    observer.observe(statsGrid, { childList: true });
  }

  /* ============================================================
     FADE IN SECTIONS ON FIRST LOAD
  ============================================================ */

  function initSectionFadeIn() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    document.querySelectorAll('.section').forEach((s) => {
      observer.observe(s);
    });
  }

  /* ============================================================
     INIT — wait for DOM + app boot
  ============================================================ */

  function init() {
    initRipple();
    initAmbientBlobs();
    initSmoothScrollIndicator();
    initHeroEntrance();
    initSectionParallax();
    watchStatsReRender();
    initSectionFadeIn();

    /* These depend on rendered content — delay slightly */
    setTimeout(() => {
      initTimelineActivetime();
      initCardTilt();
      initLazyVideoPosters();
    }, 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();