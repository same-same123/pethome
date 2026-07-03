'use strict';

let sliderIndex = 0;
let sliderItems = [];
let sliderTimer = null;

window.renderReviewsSlider = function(items) {
  if (!Array.isArray(items)) return;
  sliderItems = items;

  const track = document.getElementById('reviews-track');
  const dotsEl = document.getElementById('reviews-dots');
  if (!track || !dotsEl) return;

  track.innerHTML = items.map(r => `
    <div class="review-card">
      <div class="review-header">
        <div class="review-avatar">${r.avatar}</div>
        <div class="review-meta">
          <div class="review-name">${r.name}</div>
          <div class="review-pet">${r.pet}</div>
        </div>
        <div class="review-stars">${'⭐'.repeat(r.stars || 5)}</div>
      </div>
      <p class="review-text">${r.text}</p>
      <div class="review-date">${r.date}</div>
    </div>
  `).join('');

  dotsEl.innerHTML = items.map((_, i) =>
    `<button class="slider-dot${i === 0 ? ' active' : ''}" data-index="${i}"></button>`
  ).join('');

  dotsEl.querySelectorAll('.slider-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      TG.haptic('light');
      goToSlide(parseInt(dot.dataset.index, 10));
    });
  });

  initSliderSwipe(track);
  startAutoplay();
};

function goToSlide(index) {
  sliderIndex = (index + sliderItems.length) % sliderItems.length;
  const track = document.getElementById('reviews-track');
  if (track) track.style.transform = `translateX(-${sliderIndex * 100}%)`;

  document.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === sliderIndex);
  });
}

function startAutoplay() {
  if (sliderTimer) clearInterval(sliderTimer);
  sliderTimer = setInterval(() => {
    goToSlide(sliderIndex + 1);
  }, 4000);
}

function initSliderSwipe(track) {
  if (!track || track._swipeInit) return;
  track._swipeInit = true;

  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      TG.haptic('light');
      clearInterval(sliderTimer);
      diff > 0 ? goToSlide(sliderIndex + 1) : goToSlide(sliderIndex - 1);
      startAutoplay();
    }
  });
}