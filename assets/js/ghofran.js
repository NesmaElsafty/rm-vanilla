import { ghofranApplication } from '../../data/ghofran.js';
import { initIcons } from './icons.js';
import { initTheme } from './theme.js';

const DESKTOP_NAV = window.matchMedia('(min-width: 1180px)');

function initApplication() {
  const url = (ghofranApplication.applicationUrl || '').trim();
  const notice = document.querySelector('[data-ghofran-offline]');
  const links = document.querySelectorAll('[data-ghofran-apply]');

  if (url) {
    links.forEach((link) => {
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
    if (notice) notice.hidden = true;
  }

  const inquiry = document.querySelector('[data-ghofran-inquiry]');
  if (inquiry && ghofranApplication.inquiryUrl) {
    const message = ghofranApplication.inquiryMessage || '';
    const base = ghofranApplication.inquiryUrl;
    inquiry.href = message ? `${base}?text=${encodeURIComponent(message)}` : base;
    inquiry.target = '_blank';
    inquiry.rel = 'noopener noreferrer';
  }
}

function initMenu() {
  const toggle = document.querySelector('[data-ghofran-menu-toggle]');
  const menu = document.querySelector('[data-ghofran-menu]');
  if (!toggle || !menu) return;

  const close = () => {
    menu.hidden = true;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('ghofran-menu-open');
  };

  const open = () => {
    if (DESKTOP_NAV.matches) return;
    menu.hidden = false;
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('ghofran-menu-open');
    const first = menu.querySelector('a');
    first?.focus();
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (expanded) close();
    else open();
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });

  DESKTOP_NAV.addEventListener('change', (event) => {
    if (event.matches) close();
  });
}

function initActiveNav() {
  const links = Array.from(document.querySelectorAll('[data-ghofran-nav]'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length) return;

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
    { rootMargin: '-30% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] },
  );

  sections.forEach((section) => observer.observe(section));
}

function initStickyCta() {
  const sticky = document.querySelector('[data-ghofran-sticky]');
  const hero = document.getElementById('hero');
  const apply = document.getElementById('apply');
  const footer = document.getElementById('site-footer');
  if (!sticky || !hero || !apply) return;

  const mobile = window.matchMedia('(max-width: 767px)');
  const seen = { hero: true, apply: false, footer: false };

  const update = () => {
    const show = mobile.matches && !seen.hero && !seen.apply && !seen.footer;
    sticky.hidden = !show;
    document.body.classList.toggle('has-sticky-cta', show);
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

initIcons();
initTheme();
initApplication();
initMenu();
initActiveNav();
initStickyCta();
