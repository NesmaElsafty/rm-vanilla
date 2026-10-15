import { siteConfig } from './config.js';

const DESKTOP_NAV = window.matchMedia('(min-width: 1100px)');

function inquiryHref() {
  const base = (siteConfig.inquiryUrl || '').trim();
  if (!base) return '#apply';
  const message = siteConfig.inquiryMessage || '';
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

function verifiedApplicationUrl() {
  const url = (siteConfig.applicationUrl || '').trim();
  if (!/^https:\/\/\S+$/i.test(url)) return '';
  if (/paste_google_form_url_here/i.test(url)) return '';
  return url;
}

function initCtas() {
  const url = verifiedApplicationUrl();
  const ctas = document.querySelectorAll('[data-cta]');
  const inquiryPanels = document.querySelectorAll('[data-inquiry-panel]');
  const applyPanels = document.querySelectorAll('[data-apply-panel]');
  const inquiryNotes = document.querySelectorAll('[data-note="inquiry"]');
  const applyNotes = document.querySelectorAll('[data-note="apply"]');

  if (url) {
    ctas.forEach((link) => {
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const slot = link.getAttribute('data-cta');
      link.textContent = slot === 'hero' ? siteConfig.heroApplyLabel : siteConfig.applyLabel;
    });
    inquiryPanels.forEach((panel) => {
      panel.hidden = true;
    });
    applyPanels.forEach((panel) => {
      panel.hidden = false;
    });
    inquiryNotes.forEach((note) => {
      note.hidden = true;
    });
    applyNotes.forEach((note) => {
      note.hidden = false;
    });
    return;
  }

  const href = inquiryHref();
  ctas.forEach((link) => {
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = siteConfig.inquiryLabel;
  });
}

function initMenu() {
  const fold = document.querySelector('[data-menu]');
  const summary = fold?.querySelector('summary');
  if (!fold || !summary) return;

  const close = (restore = false) => {
    if (!fold.open) return;
    fold.open = false;
    if (restore) summary.focus();
  };

  fold.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => close(false));
  });

  fold.addEventListener('toggle', () => {
    document.body.classList.toggle('menu-open', fold.open);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && fold.open) close(true);
  });

  DESKTOP_NAV.addEventListener('change', (event) => {
    if (event.matches) close(false);
  });
}

function initActiveNav() {
  const links = Array.from(document.querySelectorAll('[data-nav]'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const setCurrent = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setCurrent(visible.target.id);
    },
    { rootMargin: '-20% 0px -55% 0px', threshold: [0.15, 0.4] },
  );

  sections.forEach((section) => observer.observe(section));
}

function initStickyCta() {
  const sticky = document.querySelector('[data-sticky]');
  const hero = document.getElementById('hero');
  const apply = document.getElementById('apply');
  const footer = document.getElementById('site-footer');
  if (!sticky || !hero || !apply || !('IntersectionObserver' in window)) return;

  const mobile = window.matchMedia('(max-width: 767px)');
  const seen = { hero: true, apply: false, 'site-footer': false };

  const update = () => {
    const show = mobile.matches && !seen.hero && !seen.apply && !seen['site-footer'];
    sticky.hidden = !show;
    document.body.classList.toggle('has-sticky', show);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        seen[entry.target.id] = entry.isIntersecting;
      });
      update();
    },
    { threshold: 0.08 },
  );

  observer.observe(hero);
  observer.observe(apply);
  if (footer) observer.observe(footer);
  mobile.addEventListener('change', update);
  update();
}

function initHeaderHeight() {
  const header = document.querySelector('.header');
  if (!header) return;

  const sync = () => {
    document.documentElement.style.setProperty('--actual-header-height', `${header.offsetHeight}px`);
  };

  sync();

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(sync);
    observer.observe(header);
    return;
  }

  window.addEventListener('resize', sync);
}

initCtas();
initMenu();
initActiveNav();
initStickyCta();
initHeaderHeight();
