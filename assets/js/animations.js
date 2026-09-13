/**
 * Shared section reveals + optional stagger for dynamic pages.
 */

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isCoarsePointer() {
  return window.matchMedia('(max-width: 767px), (hover: none) and (pointer: coarse)').matches;
}

function revealAll(nodes) {
  nodes.forEach((el) => {
    el.classList.add('is-visible');
    el.style.transitionDelay = '';
  });
}

/** Containers whose direct children should stagger into view. */
const STAGGER_CONTAINER_SELECTORS = [
  '[data-reveal-stagger]',
  '.program-rich-curriculum__list',
  '.program-rich-patterns__list',
  '.program-rich-results__list',
  '.program-rich-faq__list',
  '.program-methodology-patterns',
  '.program-methodology-curriculum__list',
  '.program-transform-pillars__list',
  '.program-transform-flows',
  '.program-feminine-pillars__list',
  '.program-feminine-flows',
  '.program-spiritual-stages__list',
  '.program-practical-steps__list',
  '.workshop-rich-modules__list',
  '.workshop-rich-benefits__list',
  '.recorded-session-about__list',
  '.recorded-session-flows',
  '.recorded-session-fit__list',
  '.private-session-journey__list',
  '.private-session-pain__list',
  '.private-session-flows',
  '.retreat-rich-gallery__grid',
];

let revealObserver = null;
const observedNodes = new WeakSet();

function ensureObserver() {
  if (revealObserver || prefersReducedMotion()) return revealObserver;
  if (!('IntersectionObserver' in window)) return null;

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Tall sections (e.g. APG 14 patterns) can fail a high threshold and
        // remain opacity:0 while still occupying layout — looks like empty space.
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = el.getAttribute('data-reveal-delay');
        if (delay && !isCoarsePointer()) {
          el.style.transitionDelay = /^\d+$/.test(delay) ? `${delay}ms` : delay;
        }
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      });
    },
    {
      // Fire as soon as any meaningful slice enters the (slightly inset) viewport.
      threshold: 0.01,
      rootMargin: '0px 0px -4% 0px',
    },
  );
  return revealObserver;
}

function prepareStaggerContainers(scope) {
  if (isCoarsePointer()) return;
  scope.querySelectorAll(STAGGER_CONTAINER_SELECTORS.join(',')).forEach((container) => {
    const children = [...container.children].filter(
      (el) => el.nodeType === 1 && !el.hasAttribute('hidden'),
    );
    children.forEach((child, index) => {
      if (!child.hasAttribute('data-reveal')) {
        child.setAttribute('data-reveal', '');
      }
      if (!child.hasAttribute('data-reveal-delay')) {
        const delay = Math.min(index, 3) * 50;
        if (delay > 0) child.setAttribute('data-reveal-delay', String(delay));
      }
    });
  });
}

/**
 * Observe (or immediately show) reveal nodes. Safe to call after dynamic renders.
 * @param {ParentNode} [scope=document]
 */
export function refreshReveals(scope = document) {
  if (!scope?.querySelectorAll) return;

  prepareStaggerContainers(scope);

  const nodes = Array.from(scope.querySelectorAll('[data-reveal]')).filter(
    (el) => !el.classList.contains('is-visible'),
  );
  if (!nodes.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    revealAll(nodes);
    return;
  }

  const observer = ensureObserver();
  if (!observer) {
    revealAll(nodes);
    return;
  }

  nodes.forEach((el) => {
    if (observedNodes.has(el)) return;
    observedNodes.add(el);
    observer.observe(el);
  });
}

function initReveals() {
  refreshReveals(document);
}

function formatCounterValue(element, value) {
  const prefix = element.getAttribute('data-prefix') || '';
  const suffix = element.getAttribute('data-suffix') || '';
  return `${prefix}${value}${suffix}`;
}

function setCounterFinal(element) {
  const target = Number(element.getAttribute('data-count'));
  if (!Number.isFinite(target)) return;
  element.textContent = formatCounterValue(element, target);
}

function animateCounter(element, delay = 0) {
  const target = Number(element.getAttribute('data-count'));
  if (!Number.isFinite(target)) return;

  const duration = target >= 100 ? 1700 : 1350;
  const startAt = performance.now() + delay;

  const tick = (now) => {
    if (now < startAt) {
      requestAnimationFrame(tick);
      return;
    }
    const progress = Math.min(1, (now - startAt) / duration);
    const eased = 1 - (1 - progress) ** 3;
    element.textContent = formatCounterValue(element, Math.round(target * eased));
    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }
    element.textContent = formatCounterValue(element, target);
  };

  requestAnimationFrame(tick);
}

function initCounters() {
  const section = document.getElementById('stats');
  const counters = Array.from(
    (section || document).querySelectorAll('[data-counter]'),
  );
  if (!counters.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    counters.forEach(setCounterFinal);
    return;
  }

  let started = false;
  const run = () => {
    if (started) return;
    started = true;
    if (isCoarsePointer()) {
      counters.forEach(setCounterFinal);
      return;
    }
    counters.forEach((element, index) => {
      const target = Number(element.getAttribute('data-count'));
      if (!Number.isFinite(target)) return;
      element.textContent = formatCounterValue(element, 0);
      animateCounter(element, index * 80);
    });
  };

  const target = section || counters[0];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run();
        observer.disconnect();
      });
    },
    { threshold: 0.55, rootMargin: '0px 0px -10% 0px' },
  );

  observer.observe(target);
}

function initHeroEntrance() {
  const hero = document.getElementById('hero');
  if (!hero || hero.dataset.heroEntrance === 'done') return;

  hero.dataset.heroEntrance = 'done';
  document.documentElement.classList.add('js');

  if (prefersReducedMotion() || !hero.querySelector('[data-hero-reveal]')) {
    hero.classList.add('hero-is-ready');
    return;
  }

  requestAnimationFrame(() => {
    hero.classList.add('hero-is-ready');
  });
}

function setJourneyActive(stepEl, active) {
  stepEl.classList.toggle('journey-circle--active', active);
  const desc = stepEl.querySelector('[data-journey-desc], .journey-circle-desc');
  if (desc) {
    desc.setAttribute('aria-hidden', active ? 'false' : 'true');
    desc.style.opacity = active ? '1' : '0';
  }
}

function initJourneyCircles() {
  const steps = Array.from(document.querySelectorAll('[data-journey-step]'));
  if (!steps.length) return;

  let lockedId = null;

  const clearHover = () => {
    steps.forEach((step) => {
      if (step.getAttribute('data-journey-step') !== lockedId) {
        setJourneyActive(step, false);
      }
    });
  };

  steps.forEach((step) => {
    const id = step.getAttribute('data-journey-step');
    step.setAttribute('tabindex', step.getAttribute('tabindex') ?? '0');

    step.addEventListener('mouseenter', () => setJourneyActive(step, true));
    step.addEventListener('mouseleave', () => {
      if (lockedId !== id) setJourneyActive(step, false);
    });
    step.addEventListener('focus', () => setJourneyActive(step, true));
    step.addEventListener('blur', () => {
      if (lockedId !== id) setJourneyActive(step, false);
    });
    step.addEventListener('click', () => {
      if (lockedId === id) {
        lockedId = null;
        setJourneyActive(step, false);
        return;
      }
      lockedId = id;
      steps.forEach((other) => setJourneyActive(other, other === step));
    });
  });

  document.addEventListener('click', (event) => {
    if (steps.some((step) => step.contains(event.target))) return;
    lockedId = null;
    clearHover();
  });
}

export function initAnimations() {
  initHeroEntrance();
  initReveals();
  initCounters();
  initJourneyCircles();
}
