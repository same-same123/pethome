/**
 * ============================================================
 * PetHome — Gallery Module
 * gallery.js
 *
 * Features:
 *   - Masonry photo grid rendering
 *   - Lightbox with backdrop
 *   - Touch swipe navigation
 *   - Double-tap zoom
 *   - Keyboard navigation (arrows + Escape)
 *   - Photo counter indicator
 *   - Report photos lightbox
 * ============================================================
 */

const GalleryModule = (function () {
  'use strict';

  /* ── State ── */
  let images = [];        // Array of { src, srcset, caption }
  let currentIndex = 0;
  let isOpen = false;
  let isZoomed = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let lastTapTime = 0;

  /* Report images for lightbox */
  let reportImages = [];

  /* ── DOM refs ── */
  let lightbox, backdrop, imgWrap, img, closeBtn, prevBtn, nextBtn, counterEl, captionEl;

  /* ============================================================
     INIT
  ============================================================ */

  /**
   * @param {Array} galleryImages — [{src, srcset}]
   * @param {Object} translations — full i18n object
   */
  function init(galleryImages, translations) {
    images = galleryImages || [];
    cacheDom();
    renderGalleryGrid(translations);
    bindLightboxEvents();
  }

  function cacheDom() {
    lightbox   = document.getElementById('lightbox');
    backdrop   = lightbox?.querySelector('.lightbox-backdrop');
    imgWrap    = document.getElementById('lightbox-image-wrap');
    img        = document.getElementById('lightbox-img');
    closeBtn   = document.getElementById('lightbox-close');
    prevBtn    = document.getElementById('lightbox-prev');
    nextBtn    = document.getElementById('lightbox-next');
    counterEl  = document.getElementById('lightbox-counter');
    captionEl  = document.getElementById('lightbox-caption');
  }

  /* ============================================================
     RENDER GALLERY GRID
  ============================================================ */

  function renderGalleryGrid(translations) {
    const grid = document.getElementById('gallery-grid');
    if (!grid || !images.length) return;

    const captions = translations?.gallery?.photos || [];

    grid.innerHTML = images.map((image, i) => {
      const caption = captions[i]?.caption || '';
      return `
        <div class="gallery-item" data-index="${i}" role="button" tabindex="0" aria-label="${window.escHtml ? window.escHtml(caption) : caption}">
          <img
            src="${image.src}"
            srcset="${image.srcset || ''}"
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 25vw"
            alt="${window.escHtml ? window.escHtml(caption) : caption}"
            loading="${i < 3 ? 'eager' : 'lazy'}"
          />
          <div class="gallery-item-overlay">
            <div class="gallery-item-zoom" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="#1A1A18" stroke-width="1.6"/>
                <path d="M12.5 12.5L16 16" stroke="#1A1A18" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          ${caption ? `<div class="gallery-item-caption">${window.escHtml ? window.escHtml(caption) : caption}</div>` : ''}
        </div>
      `;
    }).join('');

    /* Bind click/keyboard events */
    grid.querySelectorAll('.gallery-item').forEach((item) => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index, 10);
        openLightbox(idx);
        if (window.TelegramApp) TelegramApp.hapticLight();
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const idx = parseInt(item.dataset.index, 10);
          openLightbox(idx);
        }
      });
    });
  }

  /**
   * Update captions when language changes
   */
  function updateCaptions(translations) {
    const captions = translations?.gallery?.photos || [];
    document.querySelectorAll('.gallery-item').forEach((item, i) => {
      const captionEl = item.querySelector('.gallery-item-caption');
      const caption = captions[i]?.caption || '';
      if (captionEl) captionEl.textContent = caption;
    });
  }

  /* ============================================================
     REPORT IMAGES LIGHTBOX
  ============================================================ */

  /**
   * Open lightbox starting from a report card photo
   * @param {number} startIndex
   */
  function openReports(startIndex) {
    /* Collect all report images */
    reportImages = Array.from(document.querySelectorAll('.report-photo img')).map((el) => ({
      src: el.src,
      srcset: el.srcset || '',
      caption: el.closest('.report-card')?.querySelector('.report-caption')?.textContent || '',
    }));

    if (!reportImages.length) return;

    /* Temporarily swap image source to report images */
    const originalImages = images;
    images = reportImages;
    openLightbox(startIndex);

    /* Restore after close */
    lightbox.addEventListener('lightbox:closed', () => {
      images = originalImages;
    }, { once: true });
  }

  /* ============================================================
     LIGHTBOX OPEN / CLOSE
  ============================================================ */

  function openLightbox(index) {
    if (!lightbox) return;

    currentIndex = Math.max(0, Math.min(index, images.length - 1));
    isZoomed = false;

    lightbox.hidden = false;
    lightbox.classList.add('opening');

    /* Force reflow */
    void lightbox.offsetHeight;

    lightbox.classList.add('open');
    isOpen = true;

    document.body.style.overflow = 'hidden';

    loadImage(currentIndex);
    updateCounter();
    updateNavButtons();
  }

  function closeLightbox() {
    if (!lightbox || !isOpen) return;

    lightbox.classList.remove('open');
    isOpen = false;
    isZoomed = false;

    if (img) {
      img.classList.remove('zoomed');
      img.style.transform = '';
    }

    document.body.style.overflow = '';

    setTimeout(() => {
      lightbox.hidden = true;
      lightbox.classList.remove('opening');

      /* Dispatch event for report mode cleanup */
      lightbox.dispatchEvent(new CustomEvent('lightbox:closed'));
    }, 400);
  }

  function loadImage(index) {
    if (!img || !images[index]) return;

    /* Fade out current image */
    img.style.opacity = '0';
    img.style.transform = isZoomed ? '' : 'scale(0.96)';
    isZoomed = false;
    img.classList.remove('zoomed');

    const source = images[index];

    /* Create new image to preload */
    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = source.src;
      if (source.srcset) img.srcset = source.srcset;
      img.alt = source.caption || '';

      /* Fade in */
      requestAnimationFrame(() => {
        img.style.transition = 'opacity 0.25s ease, transform 0.3s ease';
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      });

      /* Update caption */
      if (captionEl) {
        captionEl.textContent = source.caption || '';
      }
    };

    tempImg.onerror = () => {
      img.src = source.src;
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    };

    tempImg.src = source.src;
  }

  function goTo(index) {
    if (!isOpen) return;
    currentIndex = ((index % images.length) + images.length) % images.length;
    loadImage(currentIndex);
    updateCounter();
    updateNavButtons();
    if (window.TelegramApp) TelegramApp.hapticLight();
  }

  function prev() {
    goTo(currentIndex - 1);
  }

  function next() {
    goTo(currentIndex + 1);
  }

  function updateCounter() {
    if (counterEl) {
      counterEl.textContent = `${currentIndex + 1} / ${images.length}`;
    }
  }

  function updateNavButtons() {
    if (prevBtn) prevBtn.style.display = images.length <= 1 ? 'none' : '';
    if (nextBtn) nextBtn.style.display = images.length <= 1 ? 'none' : '';
  }

  /* ============================================================
     ZOOM (double-tap / double-click)
  ============================================================ */

  function toggleZoom(e) {
    if (!img) return;
    isZoomed = !isZoomed;
    img.classList.toggle('zoomed', isZoomed);

    if (isZoomed) {
      /* Zoom toward click/tap point */
      const rect = img.getBoundingClientRect();
      const originX = ((e.clientX - rect.left) / rect.width) * 100;
      const originY = ((e.clientY - rect.top) / rect.height) * 100;
      img.style.transformOrigin = `${originX}% ${originY}%`;
    } else {
      img.style.transformOrigin = 'center';
    }

    if (window.TelegramApp) TelegramApp.hapticLight();
  }

  /* ============================================================
     EVENT BINDING
  ============================================================ */

  function bindLightboxEvents() {
    if (!lightbox) return;

    /* Close button */
    closeBtn?.addEventListener('click', closeLightbox);

    /* Backdrop click */
    backdrop?.addEventListener('click', closeLightbox);

    /* Navigation */
    prevBtn?.addEventListener('click', prev);
    nextBtn?.addEventListener('click', next);

    /* Keyboard */
    document.addEventListener('keydown', (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    /* Double-click zoom */
    imgWrap?.addEventListener('dblclick', (e) => {
      toggleZoom(e);
    });

    /* Touch events */
    imgWrap?.addEventListener('touchstart', onTouchStart, { passive: true });
    imgWrap?.addEventListener('touchend', onTouchEnd, { passive: true });

    /* Stop propagation on img to prevent backdrop close */
    imgWrap?.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  function onTouchStart(e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
  }

  function onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    const dt = Date.now() - touchStartTime;

    const now = Date.now();
    const isDoubleTap = now - lastTapTime < 300;
    lastTapTime = now;

    /* Double tap zoom */
    if (isDoubleTap && Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      toggleZoom({ clientX: touch.clientX, clientY: touch.clientY });
      return;
    }

    /* Swipe left/right for navigation */
    if (dt < 400 && Math.abs(dx) > 50 && Math.abs(dy) < 80) {
      if (dx < 0) {
        next();
      } else {
        prev();
      }
      return;
    }

    /* Swipe down to close */
    if (dt < 500 && dy > 90 && Math.abs(dx) < 60) {
      closeLightbox();
    }
  }

  /* ============================================================
     PUBLIC API
  ============================================================ */

  return {
    init,
    openLightbox,
    openReports,
    updateCaptions,
    close: closeLightbox,
  };
})();

window.GalleryModule = GalleryModule;