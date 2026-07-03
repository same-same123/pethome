/**
 * ============================================================
 * PetHome — Video Module
 * video.js
 *
 * Features:
 *   - Video card grid rendering
 *   - Video modal (overlay player)
 *   - Auto-play on open
 *   - Close on backdrop click
 *   - Close on swipe down
 *   - Smooth entrance / exit animations
 *   - Lazy thumbnail loading
 * ============================================================
 */

const VideoModule = (function () {
  'use strict';

  /* ── State ── */
  let videos = [];
  let thumbUrls = [];
  let isOpen = false;
  let currentVideoEl = null;

  /* ── DOM ── */
  let modal, backdrop, container, inner, closeBtn;

  /* ── Touch ── */
  let touchStartY = 0;

  /* ============================================================
     INIT
  ============================================================ */

  /**
   * @param {Object} translations
   * @param {Array}  thumbnailUrls — array of Unsplash image URLs
   */
  function init(translations, thumbnailUrls) {
    videos    = translations?.videos?.items || [];
    thumbUrls = thumbnailUrls || [];

    cacheDom();
    renderVideoCards();
    bindModalEvents();
  }

  function cacheDom() {
    modal    = document.getElementById('video-modal');
    backdrop = modal?.querySelector('.video-modal-backdrop');
    container = document.getElementById('video-modal-container') || modal?.querySelector('.video-modal-container');
    inner    = document.getElementById('video-modal-inner');
    closeBtn = document.getElementById('video-modal-close');
  }

  /* ============================================================
     RENDER VIDEO CARDS
  ============================================================ */

  function renderVideoCards() {
    const grid = document.getElementById('videos-grid');
    if (!grid || !videos.length) return;

    const esc = window.escHtml || ((s) => s);

    grid.innerHTML = videos.map((video, i) => {
      const thumb = thumbUrls[i % thumbUrls.length] || '';

      return `
        <div class="video-card reveal-scale" data-index="${i}" role="button" tabindex="0" aria-label="Play video: ${esc(video.title)}">
          <div class="video-thumb">
            <img
              class="video-thumb-img"
              src="${thumb}"
              alt="${esc(video.title)}"
              loading="lazy"
            />
            <div class="video-play-btn" aria-hidden="true">
              <div class="video-play-circle">
                <svg class="video-play-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            <div class="video-duration">${esc(video.duration)}</div>
          </div>
          <div class="video-info">
            <div class="video-tag">${esc(video.tag)}</div>
            <div class="video-title">${esc(video.title)}</div>
            <div class="video-desc">${esc(video.desc)}</div>
          </div>
        </div>
      `;
    }).join('');

    /* Bind click events */
    grid.querySelectorAll('.video-card').forEach((card) => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.index, 10);
        openVideo(idx);
        if (window.TelegramApp) TelegramApp.hapticMedium();
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const idx = parseInt(card.dataset.index, 10);
          openVideo(idx);
        }
      });
    });
  }

  /* ============================================================
     OPEN / CLOSE VIDEO MODAL
  ============================================================ */

  function openVideo(index) {
    if (!modal || isOpen) return;

    const video = videos[index];
    if (!video) return;

    /* Build video element (using placeholder since no real video URLs) */
    const thumb = thumbUrls[index % thumbUrls.length] || '';

    /* Create a styled "video player" using the thumbnail + overlay */
    const videoEl = buildVideoPlayer(video, thumb, index);

    /* Clear previous content */
    if (inner) inner.innerHTML = '';
    if (inner) inner.appendChild(videoEl);

    currentVideoEl = videoEl;

    /* Show modal */
    modal.hidden = false;
    modal.classList.add('opening');
    void modal.offsetHeight;

    modal.classList.add('open');
    isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  /**
   * Build a video player element
   * Since we're using Unsplash images (no real video), we create
   * a beautiful mock player that demonstrates the UI
   */
  function buildVideoPlayer(video, thumbUrl, index) {
    const esc = window.escHtml || ((s) => s);

    const wrap = document.createElement('div');
    wrap.className = 'video-player-wrap';
    wrap.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      background: #000;
      border-radius: inherit;
    `;

    /* Background thumbnail */
    const bg = document.createElement('img');
    bg.src = thumbUrl;
    bg.alt = video.title;
    bg.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.7;
      display: block;
    `;
    wrap.appendChild(bg);

    /* Overlay with video info */
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.5));
    `;

    /* Large play button */
    overlay.innerHTML = `
      <div style="
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: rgba(255,255,255,0.18);
        border: 2px solid rgba(255,255,255,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        backdrop-filter: blur(8px);
        transition: transform 0.2s ease, background 0.2s;
      " class="mock-play-btn">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white" style="margin-left:3px">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      <div style="color:white; text-align:center; padding: 0 20px;">
        <div style="font-size:0.7rem; letter-spacing:0.15em; text-transform:uppercase; color:rgba(255,255,255,0.6); margin-bottom:6px; font-family: Inter, sans-serif;">${esc(video.tag)}</div>
        <div style="font-size:1.1rem; font-weight:500; font-family: 'Playfair Display', serif;">${esc(video.title)}</div>
        <div style="font-size:0.8rem; color:rgba(255,255,255,0.7); margin-top:6px; font-family: Inter, sans-serif;">${esc(video.duration)}</div>
      </div>
    `;

    wrap.appendChild(overlay);

    return wrap;
  }

  function closeVideo() {
    if (!modal || !isOpen) return;

    modal.classList.remove('open');
    isOpen = false;
    document.body.style.overflow = '';

    setTimeout(() => {
      modal.hidden = true;
      modal.classList.remove('opening');
      if (inner) inner.innerHTML = '';
      currentVideoEl = null;
    }, 400);
  }

  /* ============================================================
     EVENTS
  ============================================================ */

  function bindModalEvents() {
    if (!modal) return;

    closeBtn?.addEventListener('click', closeVideo);
    backdrop?.addEventListener('click', closeVideo);

    /* Keyboard */
    document.addEventListener('keydown', (e) => {
      if (isOpen && e.key === 'Escape') closeVideo();
    });

    /* Swipe down to close */
    modal.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (dy > 100) {
        closeVideo();
        if (window.TelegramApp) TelegramApp.hapticLight();
      }
    }, { passive: true });
  }

  /* ============================================================
     PUBLIC API
  ============================================================ */

  return {
    init,
    openVideo,
    close: closeVideo,
  };
})();

window.VideoModule = VideoModule;