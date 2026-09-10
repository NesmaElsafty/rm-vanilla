import { getContent, resolveLocale, getDir } from '../../data/content.js';
import { normalizeWesternDigits } from './utils/western-digits.js';

const STORAGE_KEY = 'rana-site-locale';

function readStoredLocale() {
  try {
    return resolveLocale(localStorage.getItem(STORAGE_KEY));
  } catch {
    return resolveLocale(null);
  }
}

export function getLocale() {
  const stored = readStoredLocale();
  if (stored) return stored;
  return resolveLocale(document.documentElement.lang);
}

export function applyLocale(locale) {
  const resolved = resolveLocale(locale);
  const content = getContent(resolved);
  const dir = getDir(resolved);
  const root = document.documentElement;
  root.lang = resolved;
  root.dir = dir;
  document.querySelectorAll('nav[dir], [data-sync-dir]').forEach((el) => {
    el.setAttribute('dir', dir);
  });
  // Detail pages set entity titles via detail-pages.js; do not overwrite them.
  const onDetail = Boolean(document.querySelector('[data-detail-root]'))
    || Boolean(document.querySelector('[data-private-session-root]'))
    || Boolean(document.querySelector('[data-recorded-session-root]'))
    || Boolean(document.querySelector('[data-workshop-rich-root]'))
    || Boolean(document.querySelector('[data-program-rich-root]'))
    || Boolean(document.querySelector('[data-program-transform-root]'))
    || Boolean(document.querySelector('[data-program-methodology-root]'))
    || Boolean(document.querySelector('[data-program-spiritual-root]'))
    || Boolean(document.querySelector('[data-program-practical-root]'))
    || Boolean(document.querySelector('[data-program-feminine-root]'))
    || /-detail\.html?/i.test(location.pathname)
    || /private-sessions-details\.html/i.test(location.pathname)
    || /recorded-sessions-details\.html/i.test(location.pathname)
    || /workshops-details\.html/i.test(location.pathname)
    || /programs-details\.html/i.test(location.pathname)
    || /programs-transformation-details\.html/i.test(location.pathname)
    || /programs-methodology-details\.html/i.test(location.pathname)
    || /programs-spiritual-details\.html/i.test(location.pathname)
    || /programs-practical-details\.html/i.test(location.pathname)
    || /programs-feminine-details\.html/i.test(location.pathname);
  const notFoundShowing = Boolean(
    document.querySelector('[data-detail-not-found]:not([hidden])')
      || document.querySelector('[data-pd-not-found]:not([hidden])')
      || document.querySelector('[data-pt-not-found]:not([hidden])')
      || document.querySelector('[data-pm-not-found]:not([hidden])')
      || document.querySelector('[data-ps-not-found]:not([hidden])')
      || document.querySelector('[data-ppc-not-found]:not([hidden])')
      || document.querySelector('[data-pf-not-found]:not([hidden])')
      || document.querySelector('[data-wd-not-found]:not([hidden])'),
  );
  if (content?.meta?.title && (!onDetail || notFoundShowing)) {
    document.title = content.meta.title;
  }
}

function persistLocale(locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* ignore quota / private mode */
  }
}

export function setLocale(locale) {
  const resolved = resolveLocale(locale);
  persistLocale(resolved);
  applyLocale(resolved);
  document.dispatchEvent(new CustomEvent('localechange', { detail: { locale: resolved } }));
}

export function toggleLocale() {
  setLocale(getLocale() === 'ar' ? 'en' : 'ar');
}

function lookup(path, locale = getLocale()) {
  const content = getContent(locale);
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), content);
}

export function t(path, locale = getLocale()) {
  const value = lookup(path, locale);
  return value == null ? path : value;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setText(el, value) {
  if (value == null || typeof value === 'object') return;
  el.textContent = normalizeWesternDigits(String(value));
}

function syncLocaleControls(locale) {
  document.querySelectorAll('[data-locale-set]').forEach((btn) => {
    const value = btn.getAttribute('data-locale-set');
    const active = value === locale;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  const content = getContent(locale);
  document.querySelectorAll('[data-i18n-aria="language.selector"]').forEach((el) => {
    if (content?.language?.selector) el.setAttribute('aria-label', content.language.selector);
  });

  // Legacy single-toggle controls (if any remain on a page).
  const next = locale === 'ar' ? 'en' : 'ar';
  document.querySelectorAll('[data-locale-next]').forEach((el) => {
    el.textContent = next === 'en' ? content.language.en : content.language.ar;
  });
  document.querySelectorAll('[data-locale-short]').forEach((el) => {
    el.textContent = next === 'en' ? 'EN' : 'AR';
  });
  document.querySelectorAll('[data-locale-toggle]').forEach((btn) => {
    btn.setAttribute('aria-label', content.language.switchTo);
    btn.setAttribute('title', content.language.switchTo);
  });
}

export function applyI18n(root = document) {
  const locale = getLocale();
  syncLocaleControls(locale);

  root.querySelectorAll('[data-i18n]').forEach((el) => {
    setText(el, lookup(el.getAttribute('data-i18n'), locale));
  });

  root.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const value = lookup(el.getAttribute('data-i18n-html'), locale);
    if (typeof value === 'string') el.innerHTML = normalizeWesternDigits(value);
  });

  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const value = lookup(el.getAttribute('data-i18n-placeholder'), locale);
    if (value != null && typeof value !== 'object') {
      el.setAttribute('placeholder', normalizeWesternDigits(String(value)));
    }
  });

  root.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const value = lookup(el.getAttribute('data-i18n-aria'), locale);
    if (value != null && typeof value !== 'object') {
      el.setAttribute('aria-label', normalizeWesternDigits(String(value)));
    }
  });

  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const value = lookup(el.getAttribute('data-i18n-title'), locale);
    if (value != null && typeof value !== 'object') {
      el.setAttribute('title', normalizeWesternDigits(String(value)));
    }
  });

  root.querySelectorAll('[data-i18n-gold-parts]').forEach((el) => {
    const parts = lookup(el.getAttribute('data-i18n-gold-parts'), locale);
    if (!Array.isArray(parts)) return;
    el.innerHTML = parts
      .map((part) => {
        const text = escapeHtml(normalizeWesternDigits(part?.text ?? ''));
        const marked = part?.gold ? `<span class="text-gold-gradient">${text}</span>` : text;
        return part?.breakAfter ? `${marked}<br>` : marked;
      })
      .join('');
  });
}

export function initLanguage() {
  const locale = readStoredLocale();
  persistLocale(locale);
  applyLocale(locale);

  document.querySelectorAll('[data-locale-set]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.getAttribute('data-locale-set');
      if (next === 'ar' || next === 'en') setLocale(next);
    });
  });

  document.querySelectorAll('[data-locale-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => toggleLocale());
  });
}
