function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function revealAll(nodes) {
  nodes.forEach((el) => el.classList.add('is-visible'));
}

function initReveals() {
  const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!nodes.length) return;

  if (prefersReducedMotion()) {
    revealAll(nodes);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = el.getAttribute('data-reveal-delay');
        if (delay) el.style.transitionDelay = /^\d+$/.test(delay) ? `${delay}ms` : delay;
        el.classList.add('is-visible');
        observer.unobserve(el);
      });
    },
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
  );

  nodes.forEach((el) => observer.observe(el));
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

  const duration = target >= 100 ? 1600 : 1100;
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
  const counters = Array.from(document.querySelectorAll('[data-counter]'));
  if (!counters.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    counters.forEach(setCounterFinal);
    return;
  }

  counters.forEach((element) => {
    element.textContent = formatCounterValue(element, 0);
  });

  let started = false;
  const run = (host) => {
    if (started) return;
    started = true;
    const items = host
      ? Array.from(host.querySelectorAll('[data-counter]'))
      : counters;
    items.forEach((element, index) => animateCounter(element, index * 90));
  };

  const row = document.querySelector('#stats .home-stats-row');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        observer.disconnect();
      });
    },
    { threshold: 0.35, rootMargin: '0px 0px -4% 0px' },
  );

  if (row) observer.observe(row);
  else counters.forEach((element) => observer.observe(element));
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

  // Double rAF so the browser paints the initial hidden state before revealing.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hero.classList.add('hero-is-ready');
    });
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
