import { iconArrowLeft, iconArrowRight } from './icons.js';

function wrapIndex(index, total) {
  return (index + total) % total;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initGallery(root) {
  if (!root) return;

  const gallery = root.classList.contains('program-detail-gallery')
    ? root
    : root.querySelector('.program-detail-gallery');
  if (!gallery || gallery.dataset.galleryReady === '1') return;
  gallery.dataset.galleryReady = '1';

  const images = Array.from(gallery.querySelectorAll('[data-gallery-src]')).map((el) =>
    el.getAttribute('data-gallery-src'),
  );
  const stage = gallery.querySelector('.program-detail-gallery-stage');
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

  const updateChrome = () => {
    thumbs.forEach((thumb, index) => {
      thumb.classList.toggle('program-detail-gallery-thumb--active', index === activeIndex);
    });
    if (counter) counter.textContent = `${activeIndex + 1} / ${images.length}`;
  };

  const applyStageImage = () => {
    if (stageImage) {
      stageImage.src = images[activeIndex];
      const aboutTitle = gallery.closest('.about-gallery')?.querySelector('#about-gallery-title');
      const prefix =
        (aboutTitle?.textContent || gallery.getAttribute('data-gallery-alt') || '').trim();
      stageImage.alt = prefix ? `${prefix} ${activeIndex + 1}` : '';
    }
  };

  const preloadAdjacentFull = () => {
    if (images.length < 2) return;
    const nextSrc = images[wrapIndex(activeIndex + 1, images.length)];
    if (!nextSrc) return;
    const img = new Image();
    img.decoding = 'async';
    img.src = nextSrc;
  };

  const scheduleIdlePreload = () => {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => preloadAdjacentFull(), { timeout: 2500 });
      return;
    }
    window.setTimeout(preloadAdjacentFull, 700);
  };

  const render = () => {
    activeIndex = wrapIndex(activeIndex, images.length);
    gallery.setAttribute('data-gallery-index', String(activeIndex));
    updateChrome();

    if (!stageImage) {
      scheduleIdlePreload();
      return;
    }

    if (prefersReducedMotion()) {
      applyStageImage();
      scheduleIdlePreload();
      return;
    }

    stageImage.classList.add('is-gallery-fading');
    window.setTimeout(() => {
      applyStageImage();
      stageImage.classList.remove('is-gallery-fading');
      scheduleIdlePreload();
    }, 160);
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

  // Touch swipe on stage (does not block vertical scroll)
  if (stage) {
    let startX = 0;
    let startY = 0;
    let tracking = false;

    stage.addEventListener(
      'touchstart',
      (event) => {
        const touch = event.changedTouches[0];
        if (!touch) return;
        startX = touch.clientX;
        startY = touch.clientY;
        tracking = true;
      },
      { passive: true },
    );

    stage.addEventListener(
      'touchend',
      (event) => {
        if (!tracking) return;
        tracking = false;
        const touch = event.changedTouches[0];
        if (!touch) return;
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        if (Math.abs(dx) < 48 || Math.abs(dx) <= Math.abs(dy)) return;
        if (dx < 0) showNext();
        else showPrevious();
      },
      { passive: true },
    );
  }

  applyStageImage();
  updateChrome();
  scheduleIdlePreload();
}

export function initGalleries(root = document) {
  root.querySelectorAll('.program-detail-gallery').forEach((gallery) => initGallery(gallery));
}
