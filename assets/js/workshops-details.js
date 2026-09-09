import { getLocale } from './language.js';
import { refreshReveals } from './animations.js';
import { getWorkshopBySlug } from '../../data/workshops.js';
import { getProgramHeroImage } from './utils/program-hero-images.js';

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

function sortByOrder(items = []) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function sectionByKey(workshop, key) {
  return (workshop?.sections ?? []).find((section) => section.key === key);
}

function padIndex(index) {
  return String(index).padStart(2, '0');
}

function updateDocumentMeta(workshop) {
  const siteName = 'Dr. Rana Mosaad';
  const title = workshop?.page_title
    ? `${workshop.page_title} | ${siteName}`
    : document.title;
  document.title = title;

  const description =
    workshop?.hero?.subheading ||
    workshop?.page_subtitle ||
    '';

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

  const slug = workshop?.slug || currentSlug();
  const canonicalPath = slug
    ? `workshops-details.html?slug=${encodeURIComponent(slug)}`
    : 'workshops-details.html';

  try {
    canonical.setAttribute('href', new URL(canonicalPath, location.href).href);
  } catch {
    canonical.setAttribute('href', canonicalPath);
  }
}

function setText(root, selector, value) {
  const el = root.querySelector(selector);
  if (!el) return;
  el.textContent = value ?? '';
}

function renderModules(listEl, modules) {
  if (!listEl) return;
  const items = sortByOrder(modules);
  if (!items.length) {
    listEl.innerHTML = '';
    listEl.hidden = true;
    return;
  }

  listEl.hidden = false;
  listEl.innerHTML = items
    .map(
      (module, index) => `<li class="workshop-rich-modules__item">
        <span class="workshop-rich-modules__num" aria-hidden="true">${padIndex(index + 1)}</span>
        <div class="workshop-rich-modules__body">
          <h3 class="workshop-rich-modules__title">${escapeHtml(module.heading)}</h3>
          <p class="workshop-rich-modules__text">${escapeHtml(module.subheading)}</p>
        </div>
      </li>`,
    )
    .join('');
}

function renderBenefits(listEl, benefits) {
  if (!listEl) return;
  const items = sortByOrder(benefits);
  if (!items.length) {
    listEl.innerHTML = '';
    listEl.hidden = true;
    return;
  }

  listEl.hidden = false;
  listEl.innerHTML = items
    .map(
      (benefit, index) => `<li class="workshop-rich-benefits__item">
        <span class="workshop-rich-benefits__mark" aria-hidden="true">${padIndex(index + 1)}</span>
        <div class="workshop-rich-benefits__body">
          <h3 class="workshop-rich-benefits__title">${escapeHtml(benefit.heading)}</h3>
          <p class="workshop-rich-benefits__text">${escapeHtml(benefit.subheading)}</p>
        </div>
      </li>`,
    )
    .join('');
}

function renderNotFound(root, locale) {
  const found = root.querySelector('[data-wd-found]');
  const missing = root.querySelector('[data-wd-not-found]');
  if (found) found.hidden = true;
  if (missing) missing.hidden = false;

  setText(
    root,
    '[data-wd-404-title]',
    locale === 'en' ? 'Workshop not found' : 'الورشة غير موجودة',
  );
  setText(
    root,
    '[data-wd-404-body]',
    locale === 'en'
      ? 'The workshop you are looking for is not available.'
      : 'الورشة التي تبحث عنها غير متاحة.',
  );
  setText(
    root,
    '[data-wd-404-back-label]',
    locale === 'en' ? 'Back to programs' : 'العودة إلى البرامج',
  );

  document.title =
    locale === 'en'
      ? 'Workshop not found | Dr. Rana Mosaad'
      : 'الورشة غير موجودة | Dr. Rana Mosaad';
}

function renderWorkshop(root, workshop, locale) {
  const found = root.querySelector('[data-wd-found]');
  const missing = root.querySelector('[data-wd-not-found]');
  if (found) found.hidden = false;
  if (missing) missing.hidden = true;

  updateDocumentMeta(workshop);

  const hero = workshop.hero ?? {};
  const opening = sectionByKey(workshop, 'opening_question');
  const about = sectionByKey(workshop, 'workshop_description');
  const concept = sectionByKey(workshop, 'concept');
  const learn = sectionByKey(workshop, 'learning_outcomes');
  const audience = sectionByKey(workshop, 'audience');
  const receive = sectionByKey(workshop, 'what_you_get');
  const next = sectionByKey(workshop, 'next_step');
  const finalCta = sectionByKey(workshop, 'final_cta');

  setText(root, '[data-wd-eyebrow]', hero.eyebrow);
  setText(root, '[data-wd-heading]', hero.heading || workshop.program_name);
  setText(root, '[data-wd-subtitle]', workshop.page_subtitle);
  setText(root, '[data-wd-lead]', hero.subheading);

  const durationEl = root.querySelector('[data-wd-duration]');
  if (durationEl) {
    const duration = workshop.duration;
    if (duration) {
      durationEl.hidden = false;
      durationEl.textContent = duration;
    } else {
      durationEl.hidden = true;
      durationEl.textContent = '';
    }
  }

  const heroImage = root.querySelector('[data-wd-hero-image]');
  if (heroImage) {
    heroImage.src = getProgramHeroImage(workshop.slug);
    heroImage.alt = hero.heading || workshop.program_name || '';
  }

  const primaryHref = contactHref(workshop.slug);
  const primaryCta = root.querySelector('[data-wd-primary-cta]');
  if (primaryCta) primaryCta.setAttribute('href', primaryHref);
  setText(root, '[data-wd-primary-cta-label]', hero.primary_cta);

  setText(root, '[data-wd-secondary-cta-label]', hero.secondary_cta);
  const secondaryCta = root.querySelector('[data-wd-secondary-cta]');
  if (secondaryCta) {
    secondaryCta.hidden = !hero.secondary_cta;
    secondaryCta.setAttribute('href', '#workshop-details');
  }

  setText(root, '[data-wd-opening-heading]', opening?.heading);
  setText(root, '[data-wd-opening-text]', opening?.subheading);

  setText(root, '[data-wd-about-heading]', about?.heading);
  setText(root, '[data-wd-about-text]', about?.subheading);

  setText(root, '[data-wd-concept-heading]', concept?.heading);
  setText(root, '[data-wd-concept-text]', concept?.subheading);

  setText(root, '[data-wd-learn-heading]', learn?.heading);
  setText(root, '[data-wd-learn-intro]', learn?.subheading);
  renderModules(root.querySelector('[data-wd-modules]'), workshop.modules);

  setText(root, '[data-wd-audience-heading]', audience?.heading);
  setText(root, '[data-wd-audience-text]', audience?.subheading);

  setText(root, '[data-wd-receive-heading]', receive?.heading);
  setText(root, '[data-wd-receive-intro]', receive?.subheading);
  renderBenefits(root.querySelector('[data-wd-benefits]'), workshop.benefits);

  setText(root, '[data-wd-next-heading]', next?.heading);
  setText(root, '[data-wd-next-text]', next?.subheading);

  setText(root, '[data-wd-cta-heading]', finalCta?.heading);
  setText(root, '[data-wd-cta-text]', finalCta?.subheading);

  const ctaButton = root.querySelector('[data-wd-cta-button]');
  if (ctaButton) {
    ctaButton.setAttribute('href', primaryHref);
    ctaButton.textContent = hero.primary_cta ?? '';
  }

  // Keep reveal observers working after locale refresh.
  refreshReveals(root);
}

export function refreshWorkshopDetails() {
  const root = document.querySelector('[data-workshop-rich-root]');
  if (!root) return;

  const locale = getLocale();
  const slug = currentSlug();
  const workshop = getWorkshopBySlug(slug, locale);

  if (!workshop) {
    renderNotFound(root, locale);
    return;
  }

  renderWorkshop(root, workshop, locale);
}

export function initWorkshopDetails() {
  refreshWorkshopDetails();
}
