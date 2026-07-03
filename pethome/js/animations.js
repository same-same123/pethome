'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initRipple();
  initParallax();
  initHeroEntrance();
  initAmbientBlobs();
});

// ─── RIPPLE ──────────────────────────────────────────────────────────────────
function initRipple() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
      left: ${e.clientX - rect.left}px;
      top: ${e.clientY - rect.top}px;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

// ─── PARALLAX ────────────────────────────────────────────────────────────────
function initParallax() {
  const heroBg = document.getElementById('hero-bg');
  if (!heroBg) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ─── HERO ENTRANCE ───────────────────────────────────────────────────────────
function initHeroEntrance() {
  const elements = [
    { selector: '.hero-badge',    delay: 100 },
    { selector: '.hero-title',    delay: 250 },
    { selector: '.hero-subtitle', delay: 400 },
    { selector: '.hero-pills',    delay: 550 },
    { selector: '.hero-actions',  delay: 700 }
  ];

  elements.forEach(({ selector, delay }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100);
  });
}

// ─── AMBIENT BLOBS ───────────────────────────────────────────────────────────
function initAmbientBlobs() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  for (let i = 0; i < 3; i++) {
    const blob = document.createElement('div');
    blob.className = 'ambient-blob';
    blob.style.cssText = `
      width: ${120 + i * 80}px;
      height: ${120 + i * 80}px;
      left: ${10 + i * 30}%;
      top: ${20 + i * 15}%;
      animation-delay: ${i * 1.5}s;
      animation-duration: ${6 + i * 2}s;
    `;
    hero.appendChild(blob);
  }
}

// ─── COUNTER ANIMATION ───────────────────────────────────────────────────────
window.animateCounters = function() {
  document.querySelectorAll('.stat-value[data-target]').forEach(el => {
    const raw = el.dataset.target;
    const num = parseInt(raw.replace(/\D/g, ''), 10);
    const suffix = raw.replace(/[\d]/g, '');
    if (isNaN(num)) return;

    let start = 0;
    const duration = 1500;
    const step = 16;
    const increment = num / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= num) {
        start = num;
        clearInterval(timer);
      }
      el.textContent = Math.floor(start) + suffix;
    }, step);
  });
};

// trigger counters when stats section is visible
const statsSection = document.getElementById('stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      window.animateCounters();
      statsObserver.disconnect();
    }
  }, { threshold: 0.4 });
  statsObserver.observe(statsSection);
}