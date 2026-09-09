/**
 * Transformation Journey Program Structure renderer.
 * Driven by structure_type data — never by slug-specific branches.
 * Data contract: programs-details-new-version.js
 */

import { getLocale } from './language.js';
import { refreshReveals } from './animations.js';
import {
  getProgramDetailBySlug,
  getProgramDetailPage,
} from '../../data/programs-details.js';
import { getProgramHeroImage } from './utils/program-hero-images.js';

const POPUP_SESSION_PREFIX = 'program-transform-continuation:';
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

function multilineHtml(text = '') {
  return escapeHtml(text).replace(/\n/g, '<br>');
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
    program?.seo?.description || program?.hero?.description || '';

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
    ? `programs-transformation-details.html?slug=${encodeURIComponent(slug)}`
    : 'programs-transformation-details.html';

  try {
    canonical.setAttribute('href', new URL(canonicalPath, location.href).href);
  } catch {
    canonical.setAttribute('href', canonicalPath);
  }
}

function renderHero(root, hero, slug) {
  setText(root, '[data-pt-title]', hero?.title);
  setText(root, '[data-pt-supporting]', hero?.supporting_line);
  setText(root, '[data-pt-description]', hero?.description);
  setText(root, '[data-pt-primary-cta-label]', hero?.primary_cta);
  setText(root, '[data-pt-secondary-cta-label]', hero?.secondary_cta);

  const primaryCta = root.querySelector('[data-pt-primary-cta]');
  if (primaryCta) primaryCta.setAttribute('href', contactHref(slug));

  const secondaryCta = root.querySelector('[data-pt-secondary-cta]');
  if (secondaryCta) {
    secondaryCta.hidden = !hero?.secondary_cta;
    secondaryCta.setAttribute('href', '#program-transform-pain');
  }

  const description = root.querySelector('[data-pt-description]');
  if (description) description.hidden = !hero?.description;

  const heroImage = root.querySelector('[data-pt-hero-image]');
  if (heroImage) {
    heroImage.src = getProgramHeroImage(slug);
    heroImage.alt = hero?.title || '';
  }

  const heroSection = root.querySelector('.program-transform-hero');
  if (heroSection) {
    heroSection.hidden = !hero?.title && !hero?.supporting_line && !hero?.description;
  }
}

function renderPain(root, pain) {
  const section = root.querySelector('.program-transform-pain');
  const hasContent =
    pain?.heading || pain?.intro || (pain?.bullets ?? []).length > 0;
  if (section) section.hidden = !hasContent;
  if (!hasContent) return;

  setText(root, '[data-pt-pain-heading]', pain?.heading);
  setText(root, '[data-pt-pain-lead]', pain?.lead);
  setText(root, '[data-pt-pain-intro]', pain?.intro);
  setHtml(root, '[data-pt-pain-bullets]', bulletListHtml(pain?.bullets));
}

function renderImportance(root, importance) {
  const section = root.querySelector('.program-transform-importance');
  const hasContent =
    importance?.heading ||
    (importance?.paragraphs ?? []).length > 0 ||
    (importance?.bullets ?? []).length > 0 ||
    importance?.closing;
  if (section) section.hidden = !hasContent;
  if (!hasContent) return;

  setText(root, '[data-pt-importance-heading]', importance?.heading);
  setHtml(
    root,
    '[data-pt-importance-paragraphs]',
    paragraphsHtml(importance?.paragraphs),
  );
  setHtml(
    root,
    '[data-pt-importance-bullets]',
    (importance?.bullets ?? [])
      .map(
        (item) =>
          `<li class="program-transform-pill-list__item">${escapeHtml(item)}</li>`,
      )
      .join(''),
  );
  setText(root, '[data-pt-importance-closing]', importance?.closing);
  const closingEl = root.querySelector('[data-pt-importance-closing]');
  if (closingEl) closingEl.hidden = !importance?.closing;
}

function renderTransformation(root, transformation, flowTo) {
  const section = root.querySelector('.program-transform-flows-section');
  const hasContent =
    transformation?.heading ||
    transformation?.intro ||
    (transformation?.flows ?? []).length > 0;
  if (section) section.hidden = !hasContent;
  if (!hasContent) return;

  setText(root, '[data-pt-transformation-heading]', transformation?.heading);
  const headingEl = root.querySelector('[data-pt-transformation-heading]');
  if (headingEl) headingEl.hidden = !transformation?.heading;

  setText(root, '[data-pt-transformation-intro]', transformation?.intro);
  setHtml(
    root,
    '[data-pt-transformation-flows]',
    (transformation?.flows ?? [])
      .map(
        (flow) => `<li class="program-transform-flows__item">
          <div class="program-transform-flows__row">
            <span class="program-transform-flows__from">${escapeHtml(flow.from)}</span>
            <span class="program-transform-flows__arrow" aria-hidden="true">
              <span class="program-transform-flows__connector">${escapeHtml(flowTo || '→')}</span>
            </span>
            <span class="program-transform-flows__to">${escapeHtml(flow.to)}</span>
          </div>
        </li>`,
      )
      .join(''),
  );
}

function renderAudience(root, audience) {
  const section = root.querySelector('.program-transform-audience');
  const hasContent =
    audience?.heading ||
    audience?.intro ||
    (audience?.bullets ?? []).length > 0 ||
    audience?.not_for?.heading ||
    audience?.not_for?.intro ||
    (audience?.not_for?.bullets ?? []).length > 0;
  if (section) section.hidden = !hasContent;
  if (!hasContent) return;

  setText(root, '[data-pt-audience-heading]', audience?.heading);
  setText(root, '[data-pt-audience-intro]', audience?.intro);
  setHtml(root, '[data-pt-audience-bullets]', bulletListHtml(audience?.bullets));

  const notFor = audience?.not_for;
  setText(root, '[data-pt-not-for-heading]', notFor?.heading);
  setText(root, '[data-pt-not-for-intro]', notFor?.intro);
  setHtml(root, '[data-pt-not-for-bullets]', bulletListHtml(notFor?.bullets));
}

function renderPillars(root, pillars) {
  const section = root.querySelector('.program-transform-pillars');
  const items = [...(pillars?.items ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  const hasContent = pillars?.heading || pillars?.intro || items.length > 0;
  if (section) section.hidden = !hasContent;
  if (!hasContent) return;

  setText(root, '[data-pt-pillars-heading]', pillars?.heading);
  setText(root, '[data-pt-pillars-intro]', pillars?.intro);
  setHtml(
    root,
    '[data-pt-pillars-items]',
    items
      .map(
        (item, index) => `<li class="program-transform-pillars__item">
          <span class="program-transform-pillars__num" aria-hidden="true">${padIndex(item.order ?? index + 1)}</span>
          <div class="program-transform-pillars__body">
            <h3 class="program-transform-pillars__title">${escapeHtml(item.title)}</h3>
            ${
              item.body
                ? `<p class="program-transform-pillars__text">${multilineHtml(item.body)}</p>`
                : ''
            }
          </div>
        </li>`,
      )
      .join(''),
  );
}

function renderDifferentiator(root, differentiator) {
  const section = root.querySelector('.program-transform-differentiator');
  const hasContent =
    differentiator?.heading ||
    (differentiator?.paragraphs ?? []).length > 0 ||
    (differentiator?.bullets ?? []).length > 0 ||
    differentiator?.subheading ||
    (differentiator?.features ?? []).length > 0;
  if (section) section.hidden = !hasContent;
  if (!hasContent) return;

  setText(root, '[data-pt-differentiator-heading]', differentiator?.heading);
  setHtml(
    root,
    '[data-pt-differentiator-paragraphs]',
    paragraphsHtml(differentiator?.paragraphs),
  );
  setHtml(
    root,
    '[data-pt-differentiator-bullets]',
    bulletListHtml(differentiator?.bullets),
  );
  setText(
    root,
    '[data-pt-differentiator-subheading]',
    differentiator?.subheading,
  );
  setHtml(
    root,
    '[data-pt-differentiator-features]',
    (differentiator?.features ?? [])
      .map(
        (item) =>
          `<li class="program-transform-feature-list__item">${escapeHtml(item)}</li>`,
      )
      .join(''),
  );
}

function renderTrainer(root, trainer) {
  const section = root.querySelector('.program-transform-trainer');
  const hasContent =
    trainer?.heading ||
    trainer?.subheading ||
    (trainer?.paragraphs ?? []).length > 0 ||
    (trainer?.bullets ?? []).length > 0 ||
    (Array.isArray(trainer?.closing)
      ? trainer.closing.length > 0
      : Boolean(trainer?.closing));
  if (section) section.hidden = !hasContent;
  if (!hasContent) return;

  setText(root, '[data-pt-trainer-heading]', trainer?.heading);
  setText(root, '[data-pt-trainer-subheading]', trainer?.subheading);
  setHtml(
    root,
    '[data-pt-trainer-paragraphs]',
    paragraphsHtml(trainer?.paragraphs),
  );
  setHtml(root, '[data-pt-trainer-bullets]', bulletListHtml(trainer?.bullets));
  setHtml(
    root,
    '[data-pt-trainer-closing]',
    paragraphsHtml(
      Array.isArray(trainer?.closing)
        ? trainer.closing
        : trainer?.closing
          ? [trainer.closing]
          : [],
    ),
  );
}

function renderDelivery(root, delivery) {
  const section = root.querySelector('.program-transform-delivery');
  const hasContent = delivery?.heading || (delivery?.bullets ?? []).length > 0;
  if (section) section.hidden = !hasContent;
  if (!hasContent) return;

  setText(root, '[data-pt-delivery-heading]', delivery?.heading);
  setHtml(
    root,
    '[data-pt-delivery-bullets]',
    (delivery?.bullets ?? [])
      .map(
        (item) =>
          `<li class="program-transform-delivery__item">${escapeHtml(item)}</li>`,
      )
      .join(''),
  );
}

function renderFinalCta(root, finalCta, slug) {
  const section = root.querySelector('.program-transform-final-cta');
  const hasContent =
    finalCta?.heading ||
    finalCta?.intro ||
    (finalCta?.bullets ?? []).length > 0 ||
    finalCta?.closing ||
    finalCta?.primary_cta;
  if (section) section.hidden = !hasContent;
  if (!hasContent) return;

  setText(root, '[data-pt-cta-heading]', finalCta?.heading);
  setText(root, '[data-pt-cta-intro]', finalCta?.intro);
  setHtml(root, '[data-pt-cta-bullets]', bulletListHtml(finalCta?.bullets));
  setText(root, '[data-pt-cta-closing]', finalCta?.closing);
  const introEl = root.querySelector('[data-pt-cta-intro]');
  const bulletsEl = root.querySelector('[data-pt-cta-bullets]');
  const closingEl = root.querySelector('[data-pt-cta-closing]');
  if (introEl) introEl.hidden = !finalCta?.intro;
  if (bulletsEl) bulletsEl.hidden = !(finalCta?.bullets ?? []).length;
  if (closingEl) closingEl.hidden = !finalCta?.closing;

  const button = root.querySelector('[data-pt-cta-button]');
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
  return document.querySelector('[data-pt-continuation-popup]');
}

function closeContinuationPopup() {
  const popup = getPopupRoot();
  if (!popup || popup.hidden) return;
  popup.hidden = true;
  unlockPopupBody();
  if (lastFocusBeforePopup && typeof lastFocusBeforePopup.focus === 'function') {
    lastFocusBeforePopup.focus();
  }
  lastFocusBeforePopup = null;
}

function openContinuationPopup(program) {
  const popupData = program?.continuation_popup;
  if (!popupData?.enabled) return;

  const slug = program?.slug || currentSlug();
  if (hasShownPopup(slug)) return;

  const popup = getPopupRoot();
  const dialog = popup?.querySelector('[data-pt-popup-dialog]');
  if (!popup || !dialog) return;

  setText(popup, '[data-pt-popup-title]', popupData.title);
  setText(popup, '[data-pt-popup-body]', popupData.body);
  setText(popup, '[data-pt-popup-primary-label]', popupData.primary_cta);
  setText(popup, '[data-pt-popup-secondary-label]', popupData.secondary_cta);

  const primary = popup.querySelector('[data-pt-popup-primary]');
  if (primary) primary.setAttribute('href', contactHref(slug));

  const title = popup.querySelector('[data-pt-popup-title]');
  const body = popup.querySelector('[data-pt-popup-body]');
  const actions = popup.querySelector('[data-pt-popup-actions]');
  const primaryBtn = popup.querySelector('[data-pt-popup-primary]');
  const secondaryBtn = popup.querySelector('[data-pt-popup-secondary]');

  if (title) title.hidden = !popupData.title;
  if (body) body.hidden = !popupData.body;
  if (dialog) {
    if (popupData.title) {
      dialog.removeAttribute('aria-label');
      dialog.setAttribute('aria-labelledby', 'program-transform-popup-title');
    } else {
      dialog.removeAttribute('aria-labelledby');
      dialog.setAttribute('aria-label', popupData.body || 'Notice');
    }
  }
  if (primaryBtn) primaryBtn.hidden = !popupData.primary_cta;
  if (secondaryBtn) secondaryBtn.hidden = !popupData.secondary_cta;
  if (actions) {
    actions.hidden = !popupData.primary_cta && !popupData.secondary_cta;
  }

  lastFocusBeforePopup = document.activeElement;
  markPopupShown(slug);
  popup.hidden = false;
  lockPopupBody();

  const focusTarget =
    popup.querySelector('[data-pt-popup-primary]') ||
    popup.querySelector('[data-pt-popup-secondary]') ||
    dialog;
  focusTarget?.focus?.();
}

function bindContinuationPopup(program) {
  const popupData = program?.continuation_popup;
  const popup = getPopupRoot();
  const triggerSection =
    document.querySelector('.program-transform-pain') ||
    document.querySelector('[data-pt-final-cta]');

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
      .querySelector('[data-pt-popup-backdrop]')
      ?.addEventListener('click', () => closeContinuationPopup());

    popup
      .querySelector('[data-pt-popup-secondary]')
      ?.addEventListener('click', () => closeContinuationPopup());

    popup
      .querySelector('[data-pt-popup-close]')
      ?.addEventListener('click', () => closeContinuationPopup());

    document.addEventListener('keydown', (event) => {
      const openPopup = getPopupRoot();
      if (!openPopup || openPopup.hidden) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closeContinuationPopup();
        return;
      }

      if (event.key !== 'Tab') return;
      const dialog = openPopup.querySelector('[data-pt-popup-dialog]');
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
      openContinuationPopup(program);
      popupObserver?.disconnect();
      popupObserver = null;
    },
    { threshold: 0.35 },
  );
  popupObserver.observe(triggerSection);
}

function renderPopupContent(program) {
  const popup = getPopupRoot();
  const popupData = program?.continuation_popup;
  if (!popup || !popupData) return;

  setText(popup, '[data-pt-popup-title]', popupData.title);
  setText(popup, '[data-pt-popup-body]', popupData.body);
  setText(popup, '[data-pt-popup-primary-label]', popupData.primary_cta);
  setText(popup, '[data-pt-popup-secondary-label]', popupData.secondary_cta);

  const primary = popup.querySelector('[data-pt-popup-primary]');
  if (primary) {
    primary.setAttribute(
      'href',
      contactHref(program?.slug || currentSlug()),
    );
  }

  const title = popup.querySelector('[data-pt-popup-title]');
  const body = popup.querySelector('[data-pt-popup-body]');
  const dialog = popup.querySelector('[data-pt-popup-dialog]');
  const actions = popup.querySelector('[data-pt-popup-actions]');
  const primaryBtn = popup.querySelector('[data-pt-popup-primary]');
  const secondaryBtn = popup.querySelector('[data-pt-popup-secondary]');
  if (title) title.hidden = !popupData.title;
  if (body) body.hidden = !popupData.body;
  if (dialog) {
    if (popupData.title) {
      dialog.removeAttribute('aria-label');
      dialog.setAttribute('aria-labelledby', 'program-transform-popup-title');
    } else {
      dialog.removeAttribute('aria-labelledby');
      dialog.setAttribute('aria-label', popupData.body || 'Notice');
    }
  }
  if (primaryBtn) primaryBtn.hidden = !popupData.primary_cta;
  if (secondaryBtn) secondaryBtn.hidden = !popupData.secondary_cta;
  if (actions) {
    actions.hidden = !popupData.primary_cta && !popupData.secondary_cta;
  }
}

function renderNotFound(root) {
  const found = root.querySelector('[data-pt-found]');
  const missing = root.querySelector('[data-pt-not-found]');
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

  setText(root, '[data-pt-404-title]', fallback.title);
  setText(root, '[data-pt-404-body]', fallback.body);
  setText(root, '[data-pt-404-back-label]', fallback.back);

  closeContinuationPopup();
  const popup = getPopupRoot();
  if (popup) popup.hidden = true;
}

function renderProgram(root, program) {
  const found = root.querySelector('[data-pt-found]');
  const missing = root.querySelector('[data-pt-not-found]');
  if (found) found.hidden = false;
  if (missing) missing.hidden = true;

  const slug = program.slug || currentSlug();

  renderHero(root, program.hero, slug);
  renderPain(root, program.pain);
  renderImportance(root, program.importance);
  renderTransformation(root, program.transformation, program.display?.flow_to);
  renderAudience(root, program.audience);
  renderPillars(root, program.pillars);
  renderDifferentiator(root, program.differentiator);
  renderTrainer(root, program.trainer);
  renderDelivery(root, program.delivery);
  renderFinalCta(root, program.final_cta, slug);
  renderPopupContent(program);
  bindContinuationPopup(program);
  updateDocumentMeta(program);

  refreshReveals(root);
}

function redirectIfWrongStructure(program) {
  if (!program?.structure_type) return false;
  if (program.structure_type === 'transformation-journey') return false;
  const page = getProgramDetailPage(program.slug);
  location.replace(`${page}?slug=${encodeURIComponent(program.slug)}`);
  return true;
}

export function refreshProgramTransformationDetails() {
  const root = document.querySelector('[data-program-transform-root]');
  if (!root) return;

  const locale = getLocale();
  const slug = currentSlug();
  const program = getProgramDetailBySlug(slug, locale);

  if (!program) {
    renderNotFound(root);
    return;
  }

  if (redirectIfWrongStructure(program)) return;

  if (slug && program.slug && slug !== program.slug) {
    const page = getProgramDetailPage(program.slug);
    location.replace(`${page}?slug=${encodeURIComponent(program.slug)}`);
    return;
  }

  renderProgram(root, program);
}

export function initProgramTransformationDetails() {
  refreshProgramTransformationDetails();
}
