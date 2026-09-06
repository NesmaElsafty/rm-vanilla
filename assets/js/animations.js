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
  initReveals();
  initJourneyCircles();
}
