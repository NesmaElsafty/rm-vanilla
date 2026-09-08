import { createFloatingSlider } from './sliders.js';
import { getLocale } from './language.js';
import { getContent } from '../../data/content.js';
import { getProgramCards } from '../../data/programs.js';
import { getWorkshopCards } from '../../data/workshops.js';
import { getSessionCards } from '../../data/sessions.js';
import { getRecordedSessionCards } from '../../data/recorded-sessions.js';
import { iconX } from './icons.js';
import { getPrivateSessionDetailPage } from '../../data/private-sessions-details.js';

const MODAL_IDS = {
  training: 'modal-training',
  workshops: 'modal-workshops',
  private: 'modal-private',
  recorded: 'modal-recorded',
};

const DETAIL_PAGES = {
  training: 'program-detail.html',
  workshops: 'workshop-detail.html',
  private: 'session-detail.html',
  recorded: 'recorded-session-detail.html',
};

const sliders = new Map();
let openCount = 0;

function lockBody() {
  openCount += 1;
  document.body.style.overflow = 'hidden';
}

function unlockBody() {
  openCount = Math.max(0, openCount - 1);
  if (openCount === 0) document.body.style.overflow = '';
}

function sliderRoot(modal) {
  let root = modal.querySelector('[data-slider-root], [data-floating-slider]');
  if (root) return root;
  root = document.createElement('div');
  root.setAttribute('data-slider-root', '');
  const host = modal.querySelector('[role="dialog"]') || modal;
  host.appendChild(root);
  return root;
}

function ensureSlider(kind) {
  const modal = document.getElementById(MODAL_IDS[kind]);
  if (!modal) return;
  sliders.get(kind)?.destroy();

  const locale = getLocale();
  const copy = getContent(locale).programs ?? {};
  const root = sliderRoot(modal);

  const configs = {
    training: {
      items: getProgramCards(locale),
      textOnly: false,
      dotsLabel: copy.trainingModalTitle ?? '',
      page: DETAIL_PAGES.training,
    },
    workshops: {
      items: getWorkshopCards(locale),
      textOnly: false,
      dotsLabel: copy.workshopsModalTitle ?? '',
      page: DETAIL_PAGES.workshops,
    },
    private: {
      items: getSessionCards(locale),
      textOnly: true,
      dotsLabel: copy.privateModalTitle ?? '',
      page: getPrivateSessionDetailPage,
    },
    recorded: {
      items: getRecordedSessionCards(locale),
      textOnly: true,
      dotsLabel: copy.recordedModalTitle ?? '',
      page: DETAIL_PAGES.recorded,
    },
  };

  const config = configs[kind];
  sliders.set(
    kind,
    createFloatingSlider(root, config.items, {
      textOnly: config.textOnly,
      dotsLabel: config.dotsLabel,
      detailPage: config.page,
      autoplay: true,
      onSelect(slug) {
        closeModal(kind);
        const page =
          typeof config.page === 'function' ? config.page(slug) : config.page;
        location.href = `${page}?slug=${encodeURIComponent(slug)}`;
      },
    }),
  );
}

export function closeModal(kind) {
  const modal = document.getElementById(MODAL_IDS[kind] ?? kind);
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  modal.classList.remove('is-open');
  sliders.get(kind)?.pause?.();
  unlockBody();
}

export function closeAllModals() {
  Object.keys(MODAL_IDS).forEach((kind) => {
    const modal = document.getElementById(MODAL_IDS[kind]);
    if (modal && !modal.hidden) closeModal(kind);
  });
}

export function openModal(kind) {
  const modal = document.getElementById(MODAL_IDS[kind]);
  if (!modal) return;

  closeAllModals();
  modal.hidden = false;
  modal.classList.add('is-open');
  lockBody();
  ensureSlider(kind);
}

function bindModalChrome(kind) {
  const modal = document.getElementById(MODAL_IDS[kind]);
  if (!modal) return;

  modal.querySelectorAll('[data-close-modal], [data-modal-backdrop]').forEach((el) => {
    el.addEventListener('click', () => closeModal(kind));
  });

  const closeBtn = modal.querySelector('[data-close-modal]');
  if (closeBtn && !closeBtn.querySelector('svg')) closeBtn.innerHTML = iconX('icon icon-sm');
}

export function initModals() {
  Object.keys(MODAL_IDS).forEach(bindModalChrome);

  document.querySelectorAll('[data-open-modal]').forEach((el) => {
    el.addEventListener('click', (event) => {
      const kind = el.getAttribute('data-open-modal');
      if (!MODAL_IDS[kind]) return;
      event.preventDefault();
      openModal(kind);
    });
    el.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const kind = el.getAttribute('data-open-modal');
      if (!MODAL_IDS[kind]) return;
      event.preventDefault();
      openModal(kind);
    });
  });

  document.querySelectorAll('[data-retreat-link], [data-detail-slug]').forEach((el) => {
    el.addEventListener('click', (event) => {
      const nestedLink = event.target.closest('a[href]');
      if (nestedLink && nestedLink !== el) return;
      if (el.tagName === 'A' && el.getAttribute('href')) return;

      const slug = el.getAttribute('data-detail-slug') || el.getAttribute('data-retreat-link') || 'upcoming';
      event.preventDefault();
      location.href = `retreat-detail.html?slug=${encodeURIComponent(slug)}`;
    });
  });

  document.querySelectorAll('[data-view-all-recorded]').forEach((el) => {
    el.addEventListener('click', () => {
      closeAllModals();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const openKind = Object.keys(MODAL_IDS).find((kind) => {
      const modal = document.getElementById(MODAL_IDS[kind]);
      return modal && !modal.hidden;
    });
    if (openKind) closeModal(openKind);
  });

  document.addEventListener('localechange', () => {
    Object.keys(MODAL_IDS).forEach((kind) => {
      const modal = document.getElementById(MODAL_IDS[kind]);
      if (modal && !modal.hidden) ensureSlider(kind);
    });
  });
}
