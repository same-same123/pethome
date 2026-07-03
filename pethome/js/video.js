'use strict';

window.renderVideoGrid = function(videos) {
  if (!Array.isArray(videos)) return;
  const grid = document.getElementById('video-grid');
  if (!grid) return;

  grid.innerHTML = videos.map((v, i) => `
    <div class="video-card reveal-up" data-index="${i}">
      <div class="video-thumb-wrap">
        <img class="video-thumb" src="${v.thumb}" alt="${v.title}" loading="lazy" />
        <div class="video-play-btn">▶</div>
        <div class="video-duration">${v.duration || ''}</div>
      </div>
      <div class="video-card-body">
        <div class="video-card-title">${v.title}</div>
        <div class="video-card-desc">${v.desc}</div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.video-card').forEach((card, i) => {
    card.addEventListener('click', () => {
      TG.haptic('medium');
      openVideoModal(videos[i]);
    });
  });
};

function openVideoModal(video) {
  const modal = document.getElementById('video-modal');
  const player = document.getElementById('video-modal-player');
  const title = document.getElementById('video-modal-title');
  if (!modal || !player) return;

  player.innerHTML = video.src
    ? `<video controls autoplay playsinline style="width:100%;border-radius:12px">
         <source src="${video.src}" type="video/mp4" />
       </video>`
    : `<div class="video-placeholder">📹<br>${video.title}</div>`;

  if (title) title.textContent = video.title;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  initModalSwipe();
}

function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  const player = document.getElementById('video-modal-player');
  if (modal) modal.classList.remove('active');
  if (player) player.innerHTML = '';
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('video-modal-close')?.addEventListener('click', closeVideoModal);
  document.getElementById('video-modal-backdrop')?.addEventListener('click', closeVideoModal);
});

function initModalSwipe() {
  const inner = document.querySelector('.video-modal-inner');
  if (!inner || inner._swipeInit) return;
  inner._swipeInit = true;

  let startY = 0;
  inner.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
  inner.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientY - startY;
    if (diff > 80) {
      TG.haptic('light');
      closeVideoModal();
    }
  });
}