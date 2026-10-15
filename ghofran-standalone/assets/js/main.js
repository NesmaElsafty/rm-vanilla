import { siteConfig } from './config.js';

const DESKTOP_NAV = window.matchMedia('(min-width: 1100px)');

function initApplication() {
  const url = (siteConfig.applicationUrl || '').trim();
  const notice = document.querySelector('[data-apply-offline]');
  const links = document.querySelectorAll('[data-apply]');

  if (url) {
    links.forEach((link) => {
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
    if (notice) notice.hidden = true;
  }

  if (siteConfig.inquiryUrl) {
    const message = siteConfig.inquiryMessage || '';
    const href = message
      ? `${siteConfig.inquiryUrl}?text=${encodeURIComponent(message)}`
      : siteConfig.inquiryUrl;
    document.querySelectorAll('[data-inquiry]').forEach((inquiry) => {
      inquiry.href = href;
      inquiry.target = '_blank';
      inquiry.rel = 'noopener noreferrer';
    });
  }
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

initApplication();
initMenu();
initActiveNav();
initStickyCta();
