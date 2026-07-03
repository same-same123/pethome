/**
 * ============================================================
 * PetHome — Reviews Slider Module
 * slider.js
 *
 * Features:
 *   - Auto-advancing reviews carousel
 *   - Touch swipe support
 *   - Dot navigation
 *   - Prev / Next buttons
 *   - Pause on hover/touch
 *   - Smooth CSS transitions
 * ============================================================
 */

const ReviewsSlider = (function () {
  'use strict';

  /* ── State ── */
  let reviews = [];
  let currentIndex = 0;
  let autoplayTimer = null;
  let isPaused = false;
  let reviewAvatars = [];
  let petAvatars = [];

  /* ── DOM refs ── */
  let track, dotsContainer, prevBtn, nextBtn;

  /* ── Config ── */
  const AUTOPLAY_DELAY = 5000;

  /* ============================================================
     INIT
  ============================================================ */

  /**
   * @param {Object} translations
   * @param {Array}  avatarUrls    — reviewer avatar images
   * @param {Array}  petPhotoUrls  — pet photo images
   */
  function init(translations, avatarUrls, petPhotoUrls) {
    reviews       = translations?.reviews?.items || [];
    reviewAvatars = avatarUrls  || [];
    petAvatars    = petPhotoUrls || [];

    track        = document.getElementById('reviews-track');
    dotsContainer = document.getElementById('reviews-dots');
    prevBtn      = document.getElementById('reviews-prev');
    nextBtn      = document.getElementById('reviews-next');

    if (!track || !reviews.length) return;

    renderCards();
    renderDots();
    bindEvents();
    startAutoplay();
    revealVisible();
  }

  /* ============================================================
     RENDER CARDS
  ============================================================ */

  function renderCards() {
    if (!track) return;

    const esc = window.escHtml || ((s) => s);

    track.innerHTML = reviews.map((review, i) => {
      const stars = Array(review.rating).fill('<span class="review-star">★</span>').join('');
      const avatarUrl  = reviewAvatars[i % reviewAvatars.length] || '';
      const petUrl     = petAvatars[i % petAvatars.length] || '';

      return `
        <div class="review-card" data-index="${i}" role="article" aria-label="Review by ${esc(review.author)}">
          <div class="review-header">
            <img
              class="review-avatar"
              src="${avatarUrl}"
              alt="${esc(review.author)}"
              loading="lazy"
              width="56"
              height="56"
            />
            <div class="review-author-info">
              <div class="review-author-name">${esc(review.author)}</div>
              <div class="review-author-sub">${esc(review.sub)}</div>
            </div>
          </div>
          <div class="review-stars" aria-label="${review.rating} out of 5 stars" role="img">
            ${stars}
          </div>
          <p class="review-text">${esc(review.text)}</p>
          <div class="review-footer">
            <div class="review-pet-info">
              <img
                class="review-pet-photo"
                src="${petUrl}"
                alt="${esc(review.pet)}"
                loading="lazy"
                width="36"
                height="36"
              />
              <span class="review-pet-name">${esc(review.pet)}</span>
            </div>
            <span class="review-date">${esc(review.date)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ============================================================
     RENDER DOTS
  ============================================================ */

  function renderDots() {
    if (!dotsContainer) return;

    dotsContainer.innerHTML = reviews.map((_, i) => `
      <button
        class="reviews-dot${i === 0 ? ' active' : ''}"
        data-index="${i}"
        aria-label="Go to review ${i + 1}"
      ></button>
    `).join('');

    dotsContainer.querySelectorAll('.reviews-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        goTo(parseInt(dot.dataset.index, 10));
        if (window.TelegramApp) TelegramApp.hapticLight();
      });
    });
  }

  /* ============================================================
     NAVIGATION
  ============================================================ */

  function goTo(index) {
    if (!reviews.length) return;
    currentIndex = ((index % reviews.length) + reviews.length) % reviews.length;
    applyTransform();
    updateDots();
    resetAutoplay();
  }

  function applyTransform() {
    if (!track) return;

    /* Calculate offset: center the active card */
    const cards = track.querySelectorAll('.review-card');
    if (!cards.length) return;

    const containerWidth = track.parentElement?.offsetWidth || window.innerWidth;
    const cardWidth = cards[0]?.offsetWidth || 400;
    const gap = 20; // matches CSS gap var(--space-5)

    /* Offset to center the active card */
    const offset = (containerWidth / 2) - (cardWidth / 2) - currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(${offset}px)`;

    /* Scale inactive cards slightly */
    cards.forEach((card, i) => {
      const isActive = i === currentIndex;
      card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease';
      card.style.transform = isActive ? 'scale(1)' : 'scale(0.97)';
      card.style.opacity = isActive ? '1' : '0.6';
    });
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.reviews-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  /* ============================================================
     AUTOPLAY
  ============================================================ */

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      if (!isPaused) {
        goTo(currentIndex + 1);
      }
    }, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  /* ============================================================
     EVENT BINDING
  ============================================================ */

  function bindEvents() {
    /* Prev / Next buttons */
    prevBtn?.addEventListener('click', () => {
      goTo(currentIndex - 1);
      if (window.TelegramApp) TelegramApp.hapticLight();
    });

    nextBtn?.addEventListener('click', () => {
      goTo(currentIndex + 1);
      if (window.TelegramApp) TelegramApp.hapticLight();
    });

    /* Pause on hover */
    track?.addEventListener('mouseenter', () => { isPaused = true; });
    track?.addEventListener('mouseleave', () => { isPaused = false; });

    /* Touch swipe */
    let touchStartX = 0;
    let touchStartTime = 0;

    track?.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
      isPaused = true;
    }, { passive: true });

    track?.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dt = Date.now() - touchStartTime;
      isPaused = false;

      if (dt < 400 && Math.abs(dx) > 40) {
        if (dx < 0) {
          goTo(currentIndex + 1);
        } else {
          goTo(currentIndex - 1);
        }
        if (window.TelegramApp) TelegramApp.hapticLight();
      }
    }, { passive: true });

    /* Resize recalculate */
    window.addEventListener('resize', () => {
      applyTransform();
    }, { passive: true });
  }

  /* ============================================================
     REVEAL VISIBLE CARDS
  ============================================================ */

  function revealVisible() {
    setTimeout(() => {
      document.querySelectorAll('.review-card').forEach((card) => {
        card.classList.add('visible');
      });
      /* Apply initial transform after cards are visible */
      applyTransform();
    }, 100);
  }

  /* ============================================================
     PUBLIC API
  ============================================================ */

  return {
    init,
    goTo,
  };
})();

window.ReviewsSlider = ReviewsSlider;