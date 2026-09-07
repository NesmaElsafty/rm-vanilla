import { iconChevronLeft, iconChevronRight, iconQuote } from './icons.js';
import { getLocale } from './language.js';
import { getContent, getDir } from '../../data/content.js';
import {
  getHomepageTestimonials as loadHomepageTestimonials,
  getTestimonialsForSlug,
} from '../../data/testimonials.js';

export const AUTOPLAY_MS = 3200;

export function getTestimonialsForProgram(entity, locale = getLocale()) {
  const items = getTestimonialsForSlug(entity.slug, locale);
  return { items, isProgramSpecific: items.length > 0 };
}

export function getHomepageTestimonials(locale = getLocale()) {
  return loadHomepageTestimonials(locale);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Escapes quote text while preserving trusted gold emphasis spans from content data. */
function formatTestimonialQuote(value) {
  const source = String(value ?? '');
  const marker = /<span class="text-gold-gradient">([\s\S]*?)<\/span>/g;
  let result = '';
  let lastIndex = 0;
  let match;
  while ((match = marker.exec(source))) {
    result += escapeHtml(source.slice(lastIndex, match.index));
    result += `<span class="text-gold-gradient">${escapeHtml(match[1])}</span>`;
    lastIndex = match.index + match[0].length;
  }
  result += escapeHtml(source.slice(lastIndex));
  return result;
}

function isRtl() {
  return getDir(getLocale()) === 'rtl';
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function scrollToPhysical(container, index, smooth = true) {
  const card = container.children[index];
  if (!card) return;

  const containerRect = container.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  const delta = cardRect.left + cardRect.width / 2 - (containerRect.left + containerRect.width / 2);
  const previous = container.style.scrollBehavior;

  if (!smooth) container.style.scrollBehavior = 'auto';
  container.scrollBy({ left: delta, behavior: smooth ? 'smooth' : 'auto' });
  if (!smooth) {
    requestAnimationFrame(() => {
      container.style.scrollBehavior = previous;
    });
  }
}

function closestPhysicalIndex(container) {
  const cards = Array.from(container.children);
  if (!cards.length) return 0;
  const containerRect = container.getBoundingClientRect();
  const center = containerRect.left + containerRect.width / 2;
  let closest = 0;
  let minDistance = Number.POSITIVE_INFINITY;
  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const distance = Math.abs(rect.left + rect.width / 2 - center);
    if (distance < minDistance) {
      minDistance = distance;
      closest = index;
    }
  });
  return closest;
}

function cardMarkup(item, textOnly, isActive, ctaIcon, detailHref = '') {
  const visual = textOnly
    ? ''
    : `<div class="floating-program-card-visual">
        <div class="floating-program-card-image-ring" aria-hidden="true"></div>
        <img src="${escapeHtml(item.image ?? '')}" alt="" class="floating-program-card-image" loading="lazy" decoding="async"/>
      </div>`;

  const articleClass = textOnly
    ? `floating-program-card floating-program-card--text-only glass-slide glow-card session-detail-modal-card${isActive ? ' session-detail-modal-card--active' : ''}`
    : 'floating-program-card glass-slide glow-card';

  const href = detailHref
    ? `${detailHref}?slug=${encodeURIComponent(item.slug)}`
    : `#${encodeURIComponent(item.slug)}`;

  return `<article class="${articleClass}">
    <div class="floating-program-card-halo" aria-hidden="true"></div>
    ${visual}
    <div class="floating-program-card-content">
      <div class="gold-rule-short gold-rule-short--card"></div>
      <h4 class="floating-program-card-title keynote-headline">${escapeHtml(item.title)}</h4>
      <p class="floating-program-card-description keynote-body">${escapeHtml(item.description)}</p>
      <a href="${href}" data-slider-select="${escapeHtml(item.slug)}" class="btn-luxury-ghost floating-program-card-cta">
        <span>${escapeHtml(item.button_text)}</span>
        ${ctaIcon}
      </a>
    </div>
  </article>`;
}

export function createFloatingSlider(container, items, options = {}) {
  if (!container || !items?.length) return { destroy() {}, refresh() {} };

  const { onSelect, autoplay = true, textOnly = false, dotsLabel = '', detailPage = '' } = options;
  const count = items.length;
  const dir = getDir(getLocale());
  const rtl = dir === 'rtl';
  const prevIcon = rtl ? iconChevronRight('icon icon-sm') : iconChevronLeft('icon icon-sm');
  const nextIcon = rtl ? iconChevronLeft('icon icon-sm') : iconChevronRight('icon icon-sm');
  const ctaIcon = rtl ? iconChevronLeft('icon icon-xs') : iconChevronRight('icon icon-xs');
  const content = getContent(getLocale());

  let physicalIndex = count;
  let activeIndex = 0;
  let isPaused = false;
  let isNormalizing = false;
  let autoplayId = 0;
  let resumeTimer = 0;

  const looped = [0, 1, 2].flatMap((copy) =>
    items.map((item, idx) => ({ item, copy, idx })),
  );

  const slides = looped
    .map(({ item, copy, idx }, physical) => {
      const isActive = idx === activeIndex;
      return `<div class="floating-programs-slide${isActive ? ' floating-programs-slide--active' : ''}" style="--float-delay: ${(idx % count) * 0.55}s" data-slide-copy="${copy}" data-slide-index="${idx}">
        ${cardMarkup(item, textOnly, isActive, ctaIcon, detailPage)}
      </div>`;
    })
    .join('');

  const dots = items
    .map(
      (item, idx) =>
        `<button type="button" role="tab" aria-selected="${idx === 0 ? 'true' : 'false'}" aria-label="${escapeHtml(item.title)}" data-slider-dot="${idx}" class="floating-programs-dot${idx === 0 ? ' floating-programs-dot--active' : ''}"></button>`,
    )
    .join('');

  container.innerHTML = `<div class="floating-programs-scene" dir="${dir}">
    <div class="floating-programs-sacred-geometry" aria-hidden="true">
      <span class="floating-programs-ring floating-programs-ring--1"></span>
      <span class="floating-programs-ring floating-programs-ring--2"></span>
      <span class="floating-programs-ring floating-programs-ring--3"></span>
    </div>
    <div class="floating-programs-sparkles" aria-hidden="true">
      ${Array.from({ length: 12 }, (_, i) => `<span class="floating-programs-sparkle" style="--sparkle-i:${i}"></span>`).join('')}
    </div>
    <div class="floating-programs-slider-wrap">
      <div class="floating-programs-slider programs-slider">${slides}</div>
      <div class="floating-programs-nav">
        <button type="button" class="floating-programs-nav-btn" data-slider-prev aria-label="${escapeHtml(content.programs?.prevProgram ?? '')}">${prevIcon}</button>
        <div class="floating-programs-dots" role="tablist" aria-label="${escapeHtml(dotsLabel)}">${dots}</div>
        <button type="button" class="floating-programs-nav-btn" data-slider-next aria-label="${escapeHtml(content.programs?.nextProgram ?? '')}">${nextIcon}</button>
      </div>
    </div>
  </div>`;

  const scrollEl = container.querySelector('.floating-programs-slider');
  const wrapEl = container.querySelector('.floating-programs-slider-wrap');
  const prevBtn = container.querySelector('[data-slider-prev]');
  const nextBtn = container.querySelector('[data-slider-next]');

  const syncActive = () => {
    container.querySelectorAll('.floating-programs-slide').forEach((slide, idx) => {
      const logical = idx % count;
      slide.classList.toggle('floating-programs-slide--active', logical === activeIndex);
      slide.querySelector('.session-detail-modal-card')?.classList.toggle(
        'session-detail-modal-card--active',
        logical === activeIndex,
      );
    });
    container.querySelectorAll('[data-slider-dot]').forEach((dot) => {
      const idx = Number(dot.getAttribute('data-slider-dot'));
      const selected = idx === activeIndex;
      dot.classList.toggle('floating-programs-dot--active', selected);
      dot.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
  };

  const goPhysical = (index, smooth = true) => {
    scrollToPhysical(scrollEl, index, smooth);
    physicalIndex = index;
  };

  const normalizeLoop = () => {
    if (isNormalizing) return;
    if (physicalIndex < count) {
      isNormalizing = true;
      goPhysical(physicalIndex + count, false);
      isNormalizing = false;
    } else if (physicalIndex > count * 2 - 1) {
      isNormalizing = true;
      goPhysical(physicalIndex - count, false);
      isNormalizing = false;
    }
  };

  const syncFromScroll = () => {
    if (isNormalizing) return;
    physicalIndex = closestPhysicalIndex(scrollEl);
    activeIndex = physicalIndex % count;
    syncActive();
  };

  const next = () => {
    if (physicalIndex >= count * 2 - 1) goPhysical(physicalIndex - count, false);
    goPhysical(physicalIndex + 1, true);
    window.setTimeout(normalizeLoop, 500);
  };

  const prev = () => {
    if (physicalIndex <= count) goPhysical(physicalIndex + count - 1, false);
    goPhysical(physicalIndex - 1, true);
    window.setTimeout(normalizeLoop, 500);
  };

  const stopAutoplay = () => {
    if (autoplayId) window.clearInterval(autoplayId);
    autoplayId = 0;
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (!autoplay || isPaused || prefersReducedMotion()) return;
    autoplayId = window.setInterval(next, AUTOPLAY_MS);
  };

  const pause = () => {
    isPaused = true;
    stopAutoplay();
  };

  const resume = () => {
    isPaused = false;
    startAutoplay();
  };

  const onScroll = () => syncFromScroll();
  const onScrollEnd = () => normalizeLoop();
  const onResize = () => syncFromScroll();

  scrollEl.addEventListener('scroll', onScroll, { passive: true });
  scrollEl.addEventListener('scrollend', onScrollEnd);
  window.addEventListener('resize', onResize);

  wrapEl.addEventListener('mouseenter', pause);
  wrapEl.addEventListener('mouseleave', resume);
  wrapEl.addEventListener('focusin', pause);
  wrapEl.addEventListener('focusout', (event) => {
    if (!wrapEl.contains(event.relatedTarget)) resume();
  });
  wrapEl.addEventListener('touchstart', pause, { passive: true });
  wrapEl.addEventListener('touchend', () => {
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(resume, 3000);
  });

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  const onNavKey = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      rtl ? next() : prev();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      rtl ? prev() : next();
    }
  };
  prevBtn.addEventListener('keydown', onNavKey);
  nextBtn.addEventListener('keydown', onNavKey);

  container.querySelectorAll('[data-slider-dot]').forEach((dot) => {
    dot.addEventListener('click', () => goPhysical(count + Number(dot.getAttribute('data-slider-dot')), true));
  });

  container.querySelectorAll('[data-slider-select]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const slug = btn.getAttribute('data-slider-select');
      if (!slug) return;
      if (typeof onSelect === 'function') {
        event.preventDefault();
        onSelect(slug);
      }
    });
  });

  requestAnimationFrame(() => goPhysical(count, false));
  startAutoplay();

  return {
    destroy() {
      stopAutoplay();
      window.clearTimeout(resumeTimer);
      scrollEl.removeEventListener('scroll', onScroll);
      scrollEl.removeEventListener('scrollend', onScrollEnd);
      window.removeEventListener('resize', onResize);
    },
    refresh() {
      const nextRtl = isRtl();
      prevBtn.innerHTML = nextRtl ? iconChevronRight('icon icon-sm') : iconChevronLeft('icon icon-sm');
      nextBtn.innerHTML = nextRtl ? iconChevronLeft('icon icon-sm') : iconChevronRight('icon icon-sm');
      const nextContent = getContent(getLocale());
      prevBtn.setAttribute('aria-label', nextContent.programs?.prevProgram ?? '');
      nextBtn.setAttribute('aria-label', nextContent.programs?.nextProgram ?? '');
      container.querySelector('.floating-programs-scene')?.setAttribute('dir', getDir(getLocale()));
    },
    pause,
    resume,
  };
}

export function createTestimonialSlider(container, items) {
  if (!container) return { destroy() {}, refresh() {} };
  if (!items?.length) {
    container.innerHTML = '';
    return { destroy() {}, refresh() {} };
  }

  let activeIndex = 0;

  const render = () => {
    const rtl = isRtl();
    const prevIcon = rtl ? iconChevronRight('icon icon-sm') : iconChevronLeft('icon icon-sm');
    const nextIcon = rtl ? iconChevronLeft('icon icon-sm') : iconChevronRight('icon icon-sm');

    const slides = items
      .map((item, idx) => {
        const image = item.image
          ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async" class="testimonials-avatar"/>`
          : '';
        const badge = item.programTaken
          ? `<span class="testimonials-badge">${escapeHtml(item.programTaken)}</span>`
          : '';
        return `<blockquote class="testimonials-slide glass-slide${idx === activeIndex ? ' is-active' : ''}" data-testimonial-slide="${idx}">
          <div class="testimonials-quote-icon">${iconQuote('icon icon-lg')}</div>
          <p class="testimonials-quote">“${formatTestimonialQuote(item.content)}”</p>
          <div class="gold-rule"></div>
          <footer class="testimonials-footer">
            ${image}
            <div>
              <cite class="testimonials-name keynote-headline text-gold-gradient">${escapeHtml(item.name)}</cite>
              <span class="testimonials-role">${escapeHtml(item.role ?? '')}</span>
              ${badge}
            </div>
          </footer>
        </blockquote>`;
      })
      .join('');

    const dots = items
      .map(
        (_, idx) =>
          `<button type="button" data-testimonial-dot="${idx}" class="testimonials-dot${idx === activeIndex ? ' is-active' : ''}" aria-label="${idx + 1}"></button>`,
      )
      .join('');

    container.innerHTML = `<div class="testimonials-wrap" data-testimonial-root>
      <div class="testimonials-track">${slides}</div>
      <div class="testimonials-nav">
        <button type="button" data-testimonial-prev class="testimonials-nav-btn" aria-label="Previous">${prevIcon}</button>
        <div class="testimonials-dots">${dots}</div>
        <button type="button" data-testimonial-next class="testimonials-nav-btn" aria-label="Next">${nextIcon}</button>
      </div>
    </div>`;

    bind();
  };

  const show = (index) => {
    activeIndex = (index + items.length) % items.length;
    container.querySelectorAll('[data-testimonial-slide]').forEach((slide) => {
      slide.classList.toggle('is-active', Number(slide.getAttribute('data-testimonial-slide')) === activeIndex);
    });
    container.querySelectorAll('[data-testimonial-dot]').forEach((dot) => {
      const idx = Number(dot.getAttribute('data-testimonial-dot'));
      dot.classList.toggle('is-active', idx === activeIndex);
    });
  };

  const bind = () => {
    container.querySelector('[data-testimonial-prev]')?.addEventListener('click', () => show(activeIndex - 1));
    container.querySelector('[data-testimonial-next]')?.addEventListener('click', () => show(activeIndex + 1));
    container.querySelectorAll('[data-testimonial-dot]').forEach((dot) => {
      dot.addEventListener('click', () => show(Number(dot.getAttribute('data-testimonial-dot'))));
    });
  };

  render();

  return {
    destroy() {
      container.innerHTML = '';
    },
    refresh() {
      render();
    },
  };
}
