'use strict';

let galleryPhotos = [];
let lightboxIndex = 0;

window.renderGalleryGrid = function(photos) {
  if (!Array.isArray(photos)) return;
  galleryPhotos = photos;
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = photos.map((photo, i) => `
    <div class="gallery-item reveal-up" data-index="${i}">
      <img
        src="${photo.src}"
        alt="${photo.caption}"
        class="gallery-img"
        loading="lazy"
      />
      <div class="gallery-caption">${photo.caption}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(parseInt(item.dataset.index, 10));
    });
  });
};

function openLightbox(index) {
  lightboxIndex = index;
  const lb = document.getElementById('lightbox');
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateLightbox();
  TG.haptic('light');

  initLightboxSwipe();
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('active');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const photo = galleryPhotos[lightboxIndex];
  if (!photo) return;
  document.getElementById('lightbox-img').src = photo.src;
  document.getElementById('lightbox-img').alt = photo.caption;
  document.getElementById('lightbox-caption').textContent = photo.caption;
  document.getElementById('lightbox-counter').textContent =
    `${lightboxIndex + 1} / ${galleryPhotos.length}`;
}

function lightboxNext() {
  lightboxIndex = (lightboxIndex + 1) % galleryPhotos.length;
  updateLightbox();
}

function lightboxPrev() {
  lightboxIndex = (lightboxIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
  updateLightbox();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-next')?.addEventListener('click', () => { TG.haptic('light'); lightboxNext(); });
  document.getElementById('lightbox-prev')?.addEventListener('click', () => { TG.haptic('light'); lightboxPrev(); });

  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (!lb.classList.contains('active')) return;
    if (e.key === 'ArrowRight') lightboxNext();
    if (e.key === 'ArrowLeft') lightboxPrev();
    if (e.key === 'Escape') closeLightbox();
  });

  document.getElementById('lightbox')?.addEventListener('click', e => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
});

function initLightboxSwipe() {
  const wrap = document.getElementById('lightbox-img-wrap');
  if (!wrap || wrap._swipeInit) return;
  wrap._swipeInit = true;

  let startX = 0;
  wrap.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  wrap.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      TG.haptic('light');
      diff > 0 ? lightboxNext() : lightboxPrev();
    }
  });
}