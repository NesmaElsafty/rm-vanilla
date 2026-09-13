import { iconChevronLeft, iconChevronRight, iconQuote } from './icons.js';
import { cardImageMarkup } from './utils/images.js';
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

function isCoarsePointer() {
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
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

function cardMarkup(item, textOnly, isActive, ctaIcon, detailHref = '') {
  const visual = textOnly
    ? ''
    : `<div class="floating-program-card-visual">
        <div class="floating-program-card-image-ring" aria-hidden="true"></div>
        ${cardImageMarkup(item.image)}
      </div>`;

  const articleClass = textOnly
    ? `floating-program-card floating-program-card--text-only glass-slide glow-card session-detail-modal-card${isActive ? ' session-detail-modal-card--active' : ''}`
    : 'floating-program-card glass-slide glow-card';

  const href = detailHref
    ? `${typeof detailHref === 'function' ? detailHref(item.slug) : detailHref}?slug=${encodeURIComponent(item.slug)}`
    : `#${encodeURIComponent(item.slug)}`;

  return `<article class="${articleClass}">
    <div class="floating-program-card-halo" aria-hidden="true"></div>
    ${visual}
    <div class="floating-program-card-content">
      <div class="gold-rule-short gold-rule-short--card"></div>
      <h4 class="floating-program-card-title keynote-headline">${escapeHtml(item.title)}</h4>
      <p class="floating-program-card-description keynote-body">${escapeHtml(item.description)}</p>
      <a href="${href}" data-slider-select="${escapeHtml(item.slug)}" class="btn-luxury-primary floating-program-card-cta">
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
  const finite = isCoarsePointer();
  const copies = finite ? 1 : 3;
  const allowAutoplay = Boolean(autoplay) && !finite && !prefersReducedMotion();

  let physicalIndex = finite ? 0 : count;
  let activeIndex = 0;
  let isPaused = false;
  let isNormalizing = false;
  let isAnimating = false;
  let isUserInteracting = false;
  let isPointerDown = false;
  let isVisible = true;
  let autoplayId = 0;
  let resumeTimer = 0;
  let settleTimer = 0;
  let revealTimer = 0;
  let scrollRaf = 0;
  let resizeRaf = 0;
  let slideCenters = [];
  let viewportWidth = 0;
  let geometryDirty = false;

  const looped = Array.from({ length: copies }, (_, copy) =>
    items.map((item, idx) => ({ item, copy, idx })),
  ).flat();

  const slides = looped
    .map(({ item, copy, idx }) => {
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

  container.innerHTML = `<div class="floating-programs-scene is-pending" dir="${dir}" aria-busy="true">
    <div class="floating-programs-slider-wrap">
      <div class="floating-programs-slider programs-slider">${slides}</div>
      <div class="floating-programs-nav">
        <button type="button" class="floating-programs-nav-btn" data-slider-prev aria-label="${escapeHtml(content.programs?.prevProgram ?? '')}">${prevIcon}</button>
        <div class="floating-programs-dots" role="tablist" aria-label="${escapeHtml(dotsLabel)}">${dots}</div>
        <button type="button" class="floating-programs-nav-btn" data-slider-next aria-label="${escapeHtml(content.programs?.nextProgram ?? '')}">${nextIcon}</button>
      </div>
    </div>
  </div>`;

  const sceneEl = container.querySelector('.floating-programs-scene');
  const scrollEl = container.querySelector('.floating-programs-slider');
  const wrapEl = container.querySelector('.floating-programs-slider-wrap');
  const prevBtn = container.querySelector('[data-slider-prev]');
  const nextBtn = container.querySelector('[data-slider-next]');
  const slideEls = Array.from(scrollEl.children);
  const dotEls = Array.from(container.querySelectorAll('[data-slider-dot]'));
  const textCardEls = slideEls.map((slide) => slide.querySelector('.session-detail-modal-card'));
  const selectBtns = Array.from(container.querySelectorAll('[data-slider-select]'));

  const cacheGeometry = () => {
    const containerRect = scrollEl.getBoundingClientRect();
    const scrollLeft = scrollEl.scrollLeft;
    viewportWidth = scrollEl.clientWidth;
    slideCenters = slideEls.map((slide) => {
      const rect = slide.getBoundingClientRect();
      return rect.left + rect.width / 2 - containerRect.left + scrollLeft;
    });
  };

  const closestCachedIndex = () => {
    if (!slideCenters.length) return physicalIndex;
    const viewCenter = scrollEl.scrollLeft + viewportWidth / 2;
    let closest = 0;
    let minDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < slideCenters.length; i += 1) {
      const distance = Math.abs(slideCenters[i] - viewCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closest = i;
      }
    }
    return closest;
  };

  const applyScroll = (dest, smooth) => {
    if (!smooth) {
      const previous = scrollEl.style.scrollBehavior;
      scrollEl.style.scrollBehavior = 'auto';
      scrollEl.scrollLeft = dest;
      scrollEl.style.scrollBehavior = previous;
      isAnimating = false;
      return;
    }
    isAnimating = true;
    scrollEl.scrollTo({ left: dest, behavior: 'smooth' });
  };

  const goPhysical = (index, smooth = true) => {
    if (index < 0 || index >= slideEls.length) return;
    physicalIndex = index;
    if (!slideCenters.length) {
      scrollToPhysical(scrollEl, index, smooth);
      if (smooth) isAnimating = true;
      return;
    }
    applyScroll(slideCenters[index] - viewportWidth / 2, smooth);
  };

  const syncActive = (nextIndex) => {
    if (nextIndex === activeIndex) return;
    const previous = activeIndex;
    activeIndex = nextIndex;

    for (let i = 0; i < slideEls.length; i += 1) {
      const logical = Number(slideEls[i].dataset.slideIndex);
      if (logical === previous) {
        slideEls[i].classList.remove('floating-programs-slide--active');
        textCardEls[i]?.classList.remove('session-detail-modal-card--active');
      } else if (logical === activeIndex) {
        slideEls[i].classList.add('floating-programs-slide--active');
        textCardEls[i]?.classList.add('session-detail-modal-card--active');
      }
    }

    if (dotEls[previous]) {
      dotEls[previous].classList.remove('floating-programs-dot--active');
      dotEls[previous].setAttribute('aria-selected', 'false');
    }
    if (dotEls[activeIndex]) {
      dotEls[activeIndex].classList.add('floating-programs-dot--active');
      dotEls[activeIndex].setAttribute('aria-selected', 'true');
    }
  };

  const logicalFromPhysical = (index) => (finite ? index : index % count);

  const syncFromScroll = () => {
    if (isNormalizing) return;
    physicalIndex = closestCachedIndex();
    syncActive(logicalFromPhysical(physicalIndex));
  };

  const normalizeLoop = () => {
    if (finite || isNormalizing || isAnimating || isPointerDown) return;
    const idx = closestCachedIndex();
    physicalIndex = idx;
    if (idx < count) {
      isNormalizing = true;
      goPhysical(idx + count, false);
      isNormalizing = false;
    } else if (idx > count * 2 - 1) {
      isNormalizing = true;
      goPhysical(idx - count, false);
      isNormalizing = false;
    }
  };

  const canNavigate = () => !isNormalizing && !isAnimating;

  const next = () => {
    if (!canNavigate()) return;
    if (finite) {
      if (physicalIndex >= count - 1) return;
      goPhysical(physicalIndex + 1, true);
      return;
    }
    if (physicalIndex >= count * 2 - 1) {
      isNormalizing = true;
      goPhysical((physicalIndex % count) + count, false);
      isNormalizing = false;
    }
    goPhysical(physicalIndex + 1, true);
  };

  const prev = () => {
    if (!canNavigate()) return;
    if (finite) {
      if (physicalIndex <= 0) return;
      goPhysical(physicalIndex - 1, true);
      return;
    }
    if (physicalIndex <= count) {
      isNormalizing = true;
      goPhysical((physicalIndex % count) + count * 2, false);
      isNormalizing = false;
    }
    goPhysical(physicalIndex - 1, true);
  };

  const stopAutoplay = () => {
    if (autoplayId) window.clearInterval(autoplayId);
    autoplayId = 0;
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (
      !allowAutoplay ||
      isPaused ||
      isUserInteracting ||
      isNormalizing ||
      !isVisible ||
      document.visibilityState !== 'visible'
    ) {
      return;
    }
    autoplayId = window.setInterval(() => {
      if (isUserInteracting || isNormalizing || isAnimating || !isVisible) return;
      next();
    }, AUTOPLAY_MS);
  };

  const pause = () => {
    isPaused = true;
    stopAutoplay();
  };

  const resume = () => {
    isPaused = false;
    startAutoplay();
  };

  const scheduleResume = () => {
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      isUserInteracting = false;
      resume();
    }, 3000);
  };

  const settle = () => {
    isAnimating = false;
    if (geometryDirty && !isPointerDown) {
      geometryDirty = false;
      recacheAndMaybeAlign();
    }
    if (!isPointerDown) normalizeLoop();
  };

  const scheduleSettle = () => {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(settle, 160);
  };

  const onScroll = () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      syncFromScroll();
      scheduleSettle();
    });
  };

  const onScrollEnd = () => {
    window.clearTimeout(settleTimer);
    settle();
  };

  const recacheAndMaybeAlign = () => {
    cacheGeometry();
    if (finite) return;
    goPhysical(count + activeIndex, false);
  };

  const onResize = () => {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = 0;
      if (isPointerDown || isUserInteracting || isAnimating || isNormalizing) {
        geometryDirty = true;
        return;
      }
      recacheAndMaybeAlign();
    });
  };

  const onPointerDown = (event) => {
    if (event.target.closest('.floating-programs-nav, a, button')) return;
    isPointerDown = true;
    isUserInteracting = true;
    isAnimating = false;
    pause();
  };

  const onPointerUp = () => {
    isPointerDown = false;
    scheduleSettle();
    scheduleResume();
  };

  const onFocusOut = (event) => {
    if (!wrapEl.contains(event.relatedTarget)) resume();
  };

  const onVisibility = () => {
    if (document.visibilityState !== 'visible') {
      stopAutoplay();
      return;
    }
    if (!isPaused && !isUserInteracting && isVisible) startAutoplay();
  };

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

  const onDotClick = (event) => {
    const idx = Number(event.currentTarget.getAttribute('data-slider-dot'));
    if (!Number.isFinite(idx) || !canNavigate()) return;
    pause();
    goPhysical(finite ? idx : count + idx, true);
    scheduleResume();
  };

  const onSelectClick = (event) => {
    const slug = event.currentTarget.getAttribute('data-slider-select');
    if (!slug) return;
    if (typeof onSelect === 'function') {
      event.preventDefault();
      onSelect(slug);
    }
  };

  scrollEl.addEventListener('scroll', onScroll, { passive: true });
  scrollEl.addEventListener('scrollend', onScrollEnd);
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);

  wrapEl.addEventListener('mouseenter', pause);
  wrapEl.addEventListener('mouseleave', resume);
  wrapEl.addEventListener('focusin', pause);
  wrapEl.addEventListener('focusout', onFocusOut);
  if ('PointerEvent' in window) {
    wrapEl.addEventListener('pointerdown', onPointerDown, { passive: true });
    wrapEl.addEventListener('pointerup', onPointerUp, { passive: true });
    wrapEl.addEventListener('pointercancel', onPointerUp, { passive: true });
  } else {
    wrapEl.addEventListener('touchstart', onPointerDown, { passive: true });
    wrapEl.addEventListener('touchend', onPointerUp, { passive: true });
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('keydown', onNavKey);
  nextBtn.addEventListener('keydown', onNavKey);
  dotEls.forEach((dot) => dot.addEventListener('click', onDotClick));
  selectBtns.forEach((btn) => btn.addEventListener('click', onSelectClick));

  const resizeObserver =
    typeof ResizeObserver === 'function'
      ? new ResizeObserver(() => onResize())
      : null;
  resizeObserver?.observe(scrollEl);

  const intersectionObserver =
    typeof IntersectionObserver === 'function'
      ? new IntersectionObserver(
          (entries) => {
            isVisible = entries.some((entry) => entry.isIntersecting);
            if (!isVisible) {
              stopAutoplay();
              return;
            }
            if (!isPaused && !isUserInteracting) startAutoplay();
          },
          { threshold: 0.2 },
        )
      : null;
  intersectionObserver?.observe(scrollEl);

  const revealSlider = () => {
    sceneEl.classList.remove('is-pending');
    sceneEl.classList.add('is-ready');
    sceneEl.setAttribute('aria-busy', 'false');
  };

  requestAnimationFrame(() => {
    cacheGeometry();
    goPhysical(finite ? 0 : count, false);
    requestAnimationFrame(() => {
      cacheGeometry();
      goPhysical(finite ? 0 : count, false);
      revealSlider();
      startAutoplay();
    });
  });
  revealTimer = window.setTimeout(revealSlider, 180);

  return {
    destroy() {
      stopAutoplay();
      window.clearTimeout(resumeTimer);
      window.clearTimeout(settleTimer);
      window.clearTimeout(revealTimer);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      scrollEl.removeEventListener('scroll', onScroll);
      scrollEl.removeEventListener('scrollend', onScrollEnd);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      wrapEl.removeEventListener('mouseenter', pause);
      wrapEl.removeEventListener('mouseleave', resume);
      wrapEl.removeEventListener('focusin', pause);
      wrapEl.removeEventListener('focusout', onFocusOut);
      wrapEl.removeEventListener('pointerdown', onPointerDown);
      wrapEl.removeEventListener('pointerup', onPointerUp);
      wrapEl.removeEventListener('pointercancel', onPointerUp);
      wrapEl.removeEventListener('touchstart', onPointerDown);
      wrapEl.removeEventListener('touchend', onPointerUp);
      prevBtn.removeEventListener('click', prev);
      nextBtn.removeEventListener('click', next);
      prevBtn.removeEventListener('keydown', onNavKey);
      nextBtn.removeEventListener('keydown', onNavKey);
      dotEls.forEach((dot) => dot.removeEventListener('click', onDotClick));
      selectBtns.forEach((btn) => btn.removeEventListener('click', onSelectClick));
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      container.innerHTML = '';
    },
    refresh() {
      const nextRtl = isRtl();
      prevBtn.innerHTML = nextRtl ? iconChevronRight('icon icon-sm') : iconChevronLeft('icon icon-sm');
      nextBtn.innerHTML = nextRtl ? iconChevronLeft('icon icon-sm') : iconChevronRight('icon icon-sm');
      const nextContent = getContent(getLocale());
      prevBtn.setAttribute('aria-label', nextContent.programs?.prevProgram ?? '');
      nextBtn.setAttribute('aria-label', nextContent.programs?.nextProgram ?? '');
      sceneEl.setAttribute('dir', getDir(getLocale()));
      cacheGeometry();
      goPhysical(finite ? activeIndex : count + activeIndex, false);
    },
    pause,
    resume,
  };
}

const TESTIMONIAL_EXCERPT_CHARS = 170;

function stripHtml(value) {
  return String(value ?? '').replace(/<[^>]*>/g, '');
}

function truncatePlain(text, maxChars) {
  const source = String(text ?? '').trim();
  if (source.length <= maxChars) return { text: source, truncated: false };
  const slice = source.slice(0, maxChars);
  const soft = slice.replace(/\s+\S*$/, '');
  const excerpt = (soft.length > maxChars * 0.55 ? soft : slice).trimEnd();
  return { text: `${excerpt}…`, truncated: true };
}

function formatProgramsMeta(programTaken, copy) {
  if (!programTaken) return '';
  const parts = String(programTaken)
    .split(/[،,]/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (!parts.length) return '';

  if (parts.length <= 2) {
    return `<div class="testimonials-programs">${parts
      .map((part) => `<span class="testimonials-badge">${escapeHtml(part)}</span>`)
      .join('')}</div>`;
  }

  const shown = 2;
  const more = parts.length - shown;
  const word = shown === 1 ? copy.programsWordOne : copy.programsWord;
  return `<div class="testimonials-programs testimonials-programs--compact" title="${escapeHtml(programTaken)}">
    <span class="testimonials-programs-summary">${shown} ${escapeHtml(word)}</span>
    <span class="testimonials-programs-more">+${more}</span>
  </div>`;
}

function storyAriaLabel(copy, current, total, name) {
  return String(copy.storyOf ?? 'Story {current} of {total} — {name}')
    .replace('{current}', String(current))
    .replace('{total}', String(total))
    .replace('{name}', name ?? '');
}

export function createTestimonialSlider(container, items) {
  if (!container) return { destroy() {}, refresh() {} };
  if (!items?.length) {
    container.innerHTML = '';
    return { destroy() {}, refresh() {} };
  }

  let activeIndex = 0;
  let modalOpen = false;
  let wrapEl = null;
  let onKeyDown = null;
  let onPointerDown = null;
  let onPointerUp = null;
  let pointerStartX = null;
  let pointerStartY = null;
  let pointerId = null;

  const getCopy = () => getContent(getLocale()).testimonials ?? {};

  const closeModal = () => {
    const modal = container.querySelector('[data-testimonial-modal]');
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    modalOpen = false;
    document.body.classList.remove('testimonials-modal-open');
  };

  const openModal = (index) => {
    const item = items[index];
    const modal = container.querySelector('[data-testimonial-modal]');
    const body = container.querySelector('[data-testimonial-modal-body]');
    const nameEl = container.querySelector('[data-testimonial-modal-name]');
    const roleEl = container.querySelector('[data-testimonial-modal-role]');
    if (!item || !modal || !body) return;

    body.innerHTML = `<p class="testimonials-quote testimonials-quote--full">“${formatTestimonialQuote(item.content)}”</p>`;
    if (nameEl) nameEl.textContent = item.name ?? '';
    if (roleEl) roleEl.textContent = item.role ?? '';
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    modalOpen = true;
    document.body.classList.add('testimonials-modal-open');
    modal.querySelector('[data-testimonial-modal-close]')?.focus();
  };

  const syncActive = () => {
    const copy = getCopy();
    container.querySelectorAll('[data-testimonial-slide]').forEach((slide) => {
      const idx = Number(slide.getAttribute('data-testimonial-slide'));
      const active = idx === activeIndex;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      if (active) slide.removeAttribute('inert');
      else slide.setAttribute('inert', '');
    });
    container.querySelectorAll('[data-testimonial-dot]').forEach((dot) => {
      const idx = Number(dot.getAttribute('data-testimonial-dot'));
      const active = idx === activeIndex;
      const name = items[idx]?.name ?? '';
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
      dot.setAttribute('aria-label', storyAriaLabel(copy, idx + 1, items.length, name));
    });
  };

  const show = (index) => {
    if (modalOpen) closeModal();
    activeIndex = (index + items.length) % items.length;
    syncActive();
  };

  const unbind = () => {
    if (wrapEl && onKeyDown) wrapEl.removeEventListener('keydown', onKeyDown);
    if (wrapEl && onPointerDown) wrapEl.removeEventListener('pointerdown', onPointerDown);
    if (wrapEl && onPointerUp) {
      wrapEl.removeEventListener('pointerup', onPointerUp);
      wrapEl.removeEventListener('pointercancel', onPointerUp);
    }
    wrapEl = null;
    onKeyDown = null;
    onPointerDown = null;
    onPointerUp = null;
    pointerStartX = null;
    pointerStartY = null;
    pointerId = null;
  };

  const bind = () => {
    unbind();
    wrapEl = container.querySelector('[data-testimonial-root]');
    if (!wrapEl) return;

    container.querySelector('[data-testimonial-prev]')?.addEventListener('click', () => show(activeIndex - 1));
    container.querySelector('[data-testimonial-next]')?.addEventListener('click', () => show(activeIndex + 1));
    container.querySelectorAll('[data-testimonial-dot]').forEach((dot) => {
      dot.addEventListener('click', () => show(Number(dot.getAttribute('data-testimonial-dot'))));
    });
    container.querySelectorAll('[data-testimonial-read-full]').forEach((btn) => {
      btn.addEventListener('click', () => openModal(Number(btn.getAttribute('data-testimonial-read-full'))));
    });
    container.querySelector('[data-testimonial-modal-close]')?.addEventListener('click', closeModal);
    container.querySelector('[data-testimonial-modal-backdrop]')?.addEventListener('click', closeModal);

    onKeyDown = (event) => {
      if (modalOpen) {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeModal();
        }
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        show(isRtl() ? activeIndex + 1 : activeIndex - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        show(isRtl() ? activeIndex - 1 : activeIndex + 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        show(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        show(items.length - 1);
      }
    };
    wrapEl.addEventListener('keydown', onKeyDown);

    const applySwipe = (dx, dy) => {
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
      const goNext = dx < 0;
      if (isRtl()) {
        show(goNext ? activeIndex - 1 : activeIndex + 1);
      } else {
        show(goNext ? activeIndex + 1 : activeIndex - 1);
      }
    };

    onPointerDown = (event) => {
      if (modalOpen) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (event.target.closest('button, a')) return;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      pointerId = event.pointerId;
      try {
        wrapEl.setPointerCapture(event.pointerId);
      } catch {
        /* ignore */
      }
    };
    onPointerUp = (event) => {
      if (modalOpen || pointerStartX == null || pointerStartY == null) return;
      if (pointerId != null && event.pointerId !== pointerId) return;
      const dx = event.clientX - pointerStartX;
      const dy = event.clientY - pointerStartY;
      pointerStartX = null;
      pointerStartY = null;
      pointerId = null;
      applySwipe(dx, dy);
    };
    wrapEl.addEventListener('pointerdown', onPointerDown);
    wrapEl.addEventListener('pointerup', onPointerUp);
    wrapEl.addEventListener('pointercancel', onPointerUp);
  };

  const render = () => {
    const copy = getCopy();
    const rtl = isRtl();
    const prevIcon = rtl ? iconChevronRight('icon icon-sm') : iconChevronLeft('icon icon-sm');
    const nextIcon = rtl ? iconChevronLeft('icon icon-sm') : iconChevronRight('icon icon-sm');
    const prevLabel = copy.prev ?? 'Previous story';
    const nextLabel = copy.next ?? 'Next story';

    const slides = items
      .map((item, idx) => {
        const plain = stripHtml(item.content);
        const { text: excerpt, truncated } = truncatePlain(plain, TESTIMONIAL_EXCERPT_CHARS);
        const programs = formatProgramsMeta(item.programTaken, copy);
        const readFull = truncated
          ? `<button type="button" class="testimonials-read-full" data-testimonial-read-full="${idx}">${escapeHtml(copy.readFull ?? 'Read full story')}</button>`
          : '';
        const quoteHtml = truncated
          ? escapeHtml(excerpt)
          : formatTestimonialQuote(item.content);

        return `<blockquote class="testimonials-slide glass-slide${idx === activeIndex ? ' is-active' : ''}" data-testimonial-slide="${idx}" aria-hidden="${idx === activeIndex ? 'false' : 'true'}"${idx === activeIndex ? '' : ' inert'}>
          <span class="testimonials-quote-icon" aria-hidden="true">${iconQuote('icon icon-lg')}</span>
          <p class="testimonials-quote">“${quoteHtml}”</p>
          ${readFull}
          <div class="gold-rule testimonials-rule" aria-hidden="true"></div>
          <footer class="testimonials-footer">
            <div class="testimonials-person">
              <cite class="testimonials-name keynote-headline text-gold-gradient">${escapeHtml(item.name)}</cite>
              <span class="testimonials-role">${escapeHtml(item.role ?? '')}</span>
              ${programs}
            </div>
          </footer>
        </blockquote>`;
      })
      .join('');

    const dots = items
      .map((item, idx) => {
        const label = storyAriaLabel(copy, idx + 1, items.length, item.name);
        return `<button type="button" data-testimonial-dot="${idx}" class="testimonials-dot${idx === activeIndex ? ' is-active' : ''}" aria-label="${escapeHtml(label)}" aria-current="${idx === activeIndex ? 'true' : 'false'}"></button>`;
      })
      .join('');

    container.innerHTML = `<div class="testimonials-wrap" data-testimonial-root tabindex="0" role="region" aria-roledescription="carousel" aria-label="${escapeHtml(copy.title ?? 'Testimonials')}">
      <div class="testimonials-track">${slides}</div>
      <div class="testimonials-nav">
        <button type="button" data-testimonial-prev class="testimonials-nav-btn" aria-label="${escapeHtml(prevLabel)}">${prevIcon}</button>
        <div class="testimonials-dots" role="tablist" aria-label="${escapeHtml(copy.title ?? 'Testimonials')}">${dots}</div>
        <button type="button" data-testimonial-next class="testimonials-nav-btn" aria-label="${escapeHtml(nextLabel)}">${nextIcon}</button>
      </div>
      <div class="testimonials-modal" data-testimonial-modal hidden aria-hidden="true" role="dialog" aria-modal="true" aria-label="${escapeHtml(copy.readFull ?? 'Full story')}">
        <button type="button" class="testimonials-modal-backdrop" data-testimonial-modal-backdrop tabindex="-1" aria-label="${escapeHtml(copy.closeStory ?? 'Close')}"></button>
        <div class="testimonials-modal-dialog glass-slide">
          <button type="button" class="testimonials-modal-close" data-testimonial-modal-close aria-label="${escapeHtml(copy.closeStory ?? 'Close')}">×</button>
          <div data-testimonial-modal-body></div>
          <footer class="testimonials-modal-footer">
            <cite class="testimonials-name keynote-headline text-gold-gradient" data-testimonial-modal-name></cite>
            <span class="testimonials-role" data-testimonial-modal-role></span>
          </footer>
        </div>
      </div>
    </div>`;

    bind();
    syncActive();
  };

  render();

  return {
    destroy() {
      closeModal();
      unbind();
      container.innerHTML = '';
    },
    refresh() {
      closeModal();
      render();
    },
  };
}
