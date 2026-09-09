/**
 * Feminine Healing Journey Program Structure renderer.
 * Driven by structure_type data — never by slug-specific branches.
 */

import { getLocale } from './language.js';
import { refreshReveals } from './animations.js';
import {
  getProgramDetailBySlug,
  getProgramDetailPage,
} from '../../data/programs-details.js';
import { getProgramHeroImage } from './utils/program-hero-images.js';

const POPUP_SESSION_PREFIX = 'program-feminine-popup:';
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

let popupBound = false;
let popupObserver = null;
let lastFocusBeforePopup = null;
let popupBodyLocked = false;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function currentSlug() {
  return new URLSearchParams(location.search).get('slug') || '';
}

function contactHref(slug) {
  return `index.html?scroll=contact&program=${encodeURIComponent(slug)}`;
}

function padIndex(index) {
  return String(index).padStart(2, '0');
}

function setText(root, selector, value) {
  const el = root.querySelector(selector);
  if (!el) return;
  el.textContent = value ?? '';
}

function setHtml(root, selector, value) {
  const el = root.querySelector(selector);
  if (!el) return;
  el.innerHTML = value ?? '';
}

function bulletListHtml(items = []) {
  return (items ?? [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');
}

function paragraphsHtml(paragraphs = []) {
  return (paragraphs ?? [])
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join('');
}

function updateDocumentMeta(program) {
  const title = program?.seo?.title || document.title;
  document.title = title;

  const description =
    program?.seo?.description || program?.hero?.supporting_line || '';

  const setMeta = (selector, attr, value) => {
    if (!value) return;
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };

  setMeta('meta[name="description"]', 'content', description);
  setMeta('meta[property="og:title"]', 'content', title);
  setMeta('meta[property="og:description"]', 'content', description);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }

  const slug = program?.slug || currentSlug();
  const canonicalPath = slug
    ? `programs-feminine-details.html?slug=${encodeURIComponent(slug)}`
    : 'programs-feminine-details.html';

  try {
    canonical.setAttribute('href', new URL(canonicalPath, location.href).href);
  } catch {
    canonical.setAttribute('href', canonicalPath);
  }
}

function renderHero(root, hero, slug) {
  setText(root, '[data-pf-title]', hero?.title);
  setText(root, '[data-pf-supporting]', hero?.supporting_line);
  setText(root, '[data-pf-primary-cta-label]', hero?.primary_cta);

  const primaryCta = root.querySelector('[data-pf-primary-cta]');
  if (primaryCta) primaryCta.setAttribute('href', contactHref(slug));

  const heroImage = root.querySelector('[data-pf-hero-image]');
  if (heroImage) {
    heroImage.src = getProgramHeroImage(slug);
    heroImage.alt = hero?.title || '';
  }
}

function renderPain(root, pain) {
  setText(root, '[data-pf-pain-heading]', pain?.heading);
  setText(root, '[data-pf-pain-intro]', pain?.intro);
  setHtml(root, '[data-pf-pain-bullets]', bulletListHtml(pain?.bullets));
}

function renderImportance(root, importance) {
  setText(root, '[data-pf-importance-label]', importance?.section_label);
  setText(root, '[data-pf-importance-heading]', importance?.heading);
  setHtml(
    root,
    '[data-pf-importance-paragraphs]',
    paragraphsHtml(importance?.paragraphs),
  );
  setHtml(
    root,
    '[data-pf-importance-bullets]',
    (importance?.bullets ?? [])
      .map(
        (item) =>
          `<li class="program-feminine-pill-list__item">${escapeHtml(item)}</li>`,
      )
      .join(''),
  );
  setHtml(
    root,
    '[data-pf-importance-action-intro]',
    paragraphsHtml(importance?.action_intro),
  );
  setHtml(
    root,
    '[data-pf-importance-action-items]',
    bulletListHtml(importance?.action_items),
  );
}

function renderTransformation(root, transformation, flowTo) {
  setText(root, '[data-pf-transformation-heading]', transformation?.heading);
  setText(root, '[data-pf-transformation-intro]', transformation?.intro);
  setHtml(
    root,
    '[data-pf-transformation-flows]',
    (transformation?.flows ?? [])
      .map(
        (flow) => `<li class="program-feminine-flows__item">
          <div class="program-feminine-flows__row">
            <span class="program-feminine-flows__from">${escapeHtml(flow.from)}</span>
            <span class="program-feminine-flows__arrow" aria-hidden="true">
              <span class="program-feminine-flows__connector">${escapeHtml(flowTo || '→')}</span>
            </span>
            <span class="program-feminine-flows__to">${escapeHtml(flow.to)}</span>
          </div>
        </li>`,
      )
      .join(''),
  );
}

function renderAudience(root, audience) {
  setText(root, '[data-pf-audience-heading]', audience?.heading);
  setText(root, '[data-pf-audience-intro]', audience?.intro);
  setHtml(root, '[data-pf-audience-bullets]', bulletListHtml(audience?.bullets));

  const notFor = audience?.not_for;
  setText(root, '[data-pf-not-for-heading]', notFor?.heading);
  setText(root, '[data-pf-not-for-intro]', notFor?.intro);
  setHtml(root, '[data-pf-not-for-bullets]', bulletListHtml(notFor?.bullets));
}

function renderPillars(root, pillars) {
  setText(root, '[data-pf-pillars-heading]', pillars?.heading);
  const items = [...(pillars?.items ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  setHtml(
    root,
    '[data-pf-pillars-items]',
    items
      .map((item, index) => {
        const examples =
          item.examples_label || (item.examples ?? []).length
            ? `<div class="program-feminine-pillars__examples-block">
                ${
                  item.examples_label
                    ? `<p class="program-feminine-pillars__label">${escapeHtml(item.examples_label)}</p>`
                    : ''
                }
                ${
                  (item.examples ?? []).length
                    ? `<ul class="program-feminine-pillars__examples">${bulletListHtml(item.examples)}</ul>`
                    : ''
                }
              </div>`
            : '';

        return `<li class="program-feminine-pillars__item">
          <span class="program-feminine-pillars__num" aria-hidden="true">${padIndex(item.order ?? index + 1)}</span>
          <div class="program-feminine-pillars__body">
            <h3 class="program-feminine-pillars__title">${escapeHtml(item.title)}</h3>
            ${
              item.working_on_label
                ? `<p class="program-feminine-pillars__label">${escapeHtml(item.working_on_label)}</p>`
                : ''
            }
            ${
              (item.working_on_items ?? []).length
                ? `<ul class="program-feminine-bullet-list">${bulletListHtml(item.working_on_items)}</ul>`
                : ''
            }
            ${examples}
            ${
              item.result
                ? `<div class="program-feminine-pillars__result">
                    ${
                      item.result_label
                        ? `<p class="program-feminine-pillars__result-label">${escapeHtml(item.result_label)}</p>`
                        : ''
                    }
                    <p class="program-feminine-pillars__result-text">${escapeHtml(item.result)}</p>
                  </div>`
                : ''
            }
          </div>
        </li>`;
      })
      .join(''),
  );
}

function renderDifferentiator(root, differentiator) {
  setText(root, '[data-pf-differentiator-heading]', differentiator?.heading);
  setHtml(
    root,
    '[data-pf-differentiator-paragraphs]',
    paragraphsHtml(differentiator?.paragraphs),
  );
  setText(root, '[data-pf-differentiator-subheading]', differentiator?.subheading);
  setHtml(
    root,
    '[data-pf-differentiator-features]',
    (differentiator?.features ?? [])
      .map(
        (item) =>
          `<li class="program-feminine-feature-list__item">${escapeHtml(item)}</li>`,
      )
      .join(''),
  );
}

function renderTrainer(root, trainer) {
  setText(root, '[data-pf-trainer-heading]', trainer?.heading);
  setText(root, '[data-pf-trainer-subheading]', trainer?.subheading);
  setHtml(
    root,
    '[data-pf-trainer-paragraphs]',
    paragraphsHtml(trainer?.paragraphs),
  );
}

function renderFinalCta(root, finalCta, slug) {
  setText(root, '[data-pf-cta-heading]', finalCta?.heading);
  const button = root.querySelector('[data-pf-cta-button]');
  if (button) {
    button.textContent = finalCta?.primary_cta ?? '';
    button.setAttribute('href', contactHref(slug));
  }
}

function popupSessionKey(slug) {
  return `${POPUP_SESSION_PREFIX}${slug || 'program'}`;
}

function hasShownPopup(slug) {
  try {
    return sessionStorage.getItem(popupSessionKey(slug)) === '1';
  } catch {
    return false;
  }
}

function markPopupShown(slug) {
  try {
    sessionStorage.setItem(popupSessionKey(slug), '1');
  } catch {
    /* ignore */
  }
}

function lockPopupBody() {
  if (popupBodyLocked) return;
  popupBodyLocked = true;
  document.body.style.overflow = 'hidden';
}

function unlockPopupBody() {
  if (!popupBodyLocked) return;
  popupBodyLocked = false;
  document.body.style.overflow = '';
}

function getPopupRoot() {
  return document.querySelector('[data-pf-popup]');
}

function closePopup() {
  const popup = getPopupRoot();
  if (!popup || popup.hidden) return;
  popup.hidden = true;
  unlockPopupBody();
  if (lastFocusBeforePopup && typeof lastFocusBeforePopup.focus === 'function') {
    lastFocusBeforePopup.focus();
  }
  lastFocusBeforePopup = null;
}

function openPopup(program) {
  const popupData = program?.popup;
  if (!popupData?.enabled) return;

  const slug = program?.slug || currentSlug();
  if (hasShownPopup(slug)) return;

  const popup = getPopupRoot();
  const dialog = popup?.querySelector('[data-pf-popup-dialog]');
  if (!popup || !dialog) return;

  setText(popup, '[data-pf-popup-message]', popupData.message);
  lastFocusBeforePopup = document.activeElement;
  markPopupShown(slug);
  popup.hidden = false;
  lockPopupBody();

  const closeBtn = popup.querySelector('[data-pf-popup-close]');
  (closeBtn || dialog).focus?.();
}

function bindPopup(program) {
  const popupData = program?.popup;
  const popup = getPopupRoot();
  const triggerSection =
    document.querySelector('.program-feminine-pain') ||
    document.querySelector('[data-pf-final-cta]');

  if (popupObserver) {
    popupObserver.disconnect();
    popupObserver = null;
  }

  if (!popupData?.enabled || !popup || !triggerSection) {
    if (popup) popup.hidden = true;
    return;
  }

  if (!popupBound) {
    popupBound = true;

    popup
      .querySelector('[data-pf-popup-backdrop]')
      ?.addEventListener('click', () => closePopup());
    popup
      .querySelector('[data-pf-popup-close]')
      ?.addEventListener('click', () => closePopup());

    document.addEventListener('keydown', (event) => {
      const openPopupEl = getPopupRoot();
      if (!openPopupEl || openPopupEl.hidden) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closePopup();
        return;
      }

      if (event.key !== 'Tab') return;
      const dialog = openPopupEl.querySelector('[data-pf-popup-dialog]');
      if (!dialog) return;
      const nodes = [...dialog.querySelectorAll(FOCUSABLE)].filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  const slug = program?.slug || currentSlug();
  if (hasShownPopup(slug)) return;

  popupObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting) return;
      openPopup(program);
      popupObserver?.disconnect();
      popupObserver = null;
    },
    { threshold: 0.35 },
  );
  popupObserver.observe(triggerSection);
}

function renderPopupContent(program) {
  const popup = getPopupRoot();
  const popupData = program?.popup;
  if (!popup || !popupData) return;
  setText(popup, '[data-pf-popup-message]', popupData.message);
}

function renderNotFound(root) {
  const found = root.querySelector('[data-pf-found]');
  const missing = root.querySelector('[data-pf-not-found]');
  if (found) found.hidden = true;
  if (missing) missing.hidden = false;

  const locale = getLocale();
  const fallback =
    locale === 'en'
      ? {
          title: 'Program not found',
          body: 'The program you are looking for is not available.',
          back: 'Back to programs',
        }
      : {
          title: 'البرنامج غير موجود',
          body: 'البرنامج الذي تبحث عنه غير متاح.',
          back: 'العودة إلى البرامج',
        };

  setText(root, '[data-pf-404-title]', fallback.title);
  setText(root, '[data-pf-404-body]', fallback.body);
  setText(root, '[data-pf-404-back-label]', fallback.back);
  closePopup();
}

function renderProgram(root, program) {
  const found = root.querySelector('[data-pf-found]');
  const missing = root.querySelector('[data-pf-not-found]');
  if (found) found.hidden = false;
  if (missing) missing.hidden = true;

  const slug = program.purchase?.target || program.slug;

  renderHero(root, program.hero, slug);
  renderPain(root, program.pain);
  renderImportance(root, program.importance);
  renderTransformation(root, program.transformation, program.display?.flow_to);
  renderAudience(root, program.audience);
  renderPillars(root, program.pillars);
  renderDifferentiator(root, program.differentiator);
  renderTrainer(root, program.trainer);
  renderFinalCta(root, program.final_cta, slug);
  renderPopupContent(program);
  bindPopup(program);
  updateDocumentMeta(program);

  refreshReveals(root);
}

function redirectIfWrongStructure(program) {
  if (!program?.structure_type) return false;
  if (program.structure_type === 'feminine-healing-journey') return false;
  const page = getProgramDetailPage(program.slug);
  location.replace(`${page}?slug=${encodeURIComponent(program.slug)}`);
  return true;
}

export function refreshProgramFeminineDetails() {
  const root = document.querySelector('[data-program-feminine-root]');
  if (!root) return;

  const locale = getLocale();
  const slug = currentSlug();
  const program = getProgramDetailBySlug(slug, locale);

  if (!program) {
    renderNotFound(root);
    return;
  }

  if (redirectIfWrongStructure(program)) return;

  renderProgram(root, program);
}

export function initProgramFeminineDetails() {
  refreshProgramFeminineDetails();
}
