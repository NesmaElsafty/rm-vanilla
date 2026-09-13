/**
 * Lightweight page loader. Reveal after boot + critical above-the-fold image,
 * with a hard timeout so visitors are never trapped.
 */

const MAX_LOADER_MS = 2800;
const FAST_REVEAL_MS = 80;
const FADE_MS = 260;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function decodeCriticalImage(img) {
  if (!img) return Promise.resolve();

  if (typeof img.decode === 'function') {
    return img.decode().catch(() => {});
  }

  if (img.complete) return Promise.resolve();

  return new Promise((resolve) => {
    img.addEventListener('load', () => resolve(), { once: true });
    img.addEventListener('error', () => resolve(), { once: true });
  });
}

function findCriticalImage() {
  const selector = document.body.getAttribute('data-critical-image');
  if (selector) {
    return document.querySelector(selector);
  }
  return document.querySelector('#hero img, [data-critical-hero]');
}

export function initPageLoader() {
  const html = document.documentElement;
  const loader = document.getElementById('page-loader');

  if (!html.classList.contains('page-loading') && !loader) {
    html.classList.add('page-is-ready');
    return;
  }

  if (prefersReducedMotion()) {
    html.classList.add('page-loading-reduce');
  }

  let revealed = false;
  const started = performance.now();

  const reveal = () => {
    if (revealed) return;
    revealed = true;
    html.classList.add('page-is-ready');
    html.classList.remove('page-loading');
    if (!loader) return;
    const instant = prefersReducedMotion() || performance.now() - started < FAST_REVEAL_MS;
    const delay = instant ? 0 : FADE_MS;
    window.setTimeout(() => {
      loader.remove();
    }, delay);
  };

  const imageReady = decodeCriticalImage(findCriticalImage());
  Promise.race([
    imageReady,
    new Promise((resolve) => {
      window.setTimeout(resolve, MAX_LOADER_MS);
    }),
  ]).then(reveal);

  window.setTimeout(reveal, MAX_LOADER_MS);
}
