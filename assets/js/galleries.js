import { iconArrowLeft, iconArrowRight } from './icons.js';

function wrapIndex(index, total) {
  return (index + total) % total;
}

export function initGallery(root) {
  if (!root) return;

  const gallery = root.classList.contains('program-detail-gallery')
    ? root
    : root.querySelector('.program-detail-gallery');
  if (!gallery) return;

  const images = Array.from(gallery.querySelectorAll('[data-gallery-src]')).map((el) =>
    el.getAttribute('data-gallery-src'),
  );
  const stageImage = gallery.querySelector('.program-detail-gallery-main-image');
  const thumbs = Array.from(gallery.querySelectorAll('.program-detail-gallery-thumb'));
  const counter = gallery.querySelector('.program-detail-gallery-counter');
  const prevBtn = gallery.querySelector('.program-detail-gallery-nav--prev');
  const nextBtn = gallery.querySelector('.program-detail-gallery-nav--next');

  if (!images.length && stageImage?.src) images.push(stageImage.getAttribute('src'));
  if (!images.length) return;

  let activeIndex = Number(gallery.getAttribute('data-gallery-index') || 0);

  if (prevBtn && !prevBtn.querySelector('svg')) prevBtn.innerHTML = iconArrowLeft('icon icon-sm');
  if (nextBtn && !nextBtn.querySelector('svg')) nextBtn.innerHTML = iconArrowRight('icon icon-sm');

  const render = () => {
    activeIndex = wrapIndex(activeIndex, images.length);
    gallery.setAttribute('data-gallery-index', String(activeIndex));
    if (stageImage) {
      stageImage.src = images[activeIndex];
      const prefix = gallery.getAttribute('data-gallery-alt') || '';
      stageImage.alt = prefix ? `${prefix} ${activeIndex + 1}` : '';
    }
    thumbs.forEach((thumb, index) => {
      thumb.classList.toggle('program-detail-gallery-thumb--active', index === activeIndex);
    });
    if (counter) counter.textContent = `${activeIndex + 1} / ${images.length}`;
  };

  const showPrevious = () => {
    activeIndex = wrapIndex(activeIndex - 1, images.length);
    render();
  };

  const showNext = () => {
    activeIndex = wrapIndex(activeIndex + 1, images.length);
    render();
  };

  prevBtn?.addEventListener('click', showPrevious);
  nextBtn?.addEventListener('click', showNext);

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      activeIndex = index;
      render();
    });
  });

  if (!gallery.hasAttribute('tabindex')) gallery.setAttribute('tabindex', '0');
  gallery.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrevious();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNext();
    }
  });

  render();
}

export function initGalleries(root = document) {
  root.querySelectorAll('.program-detail-gallery').forEach((gallery) => initGallery(gallery));
}
