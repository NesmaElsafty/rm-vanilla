import { initTheme } from './theme.js';
import { initLanguage, applyI18n, getLocale } from './language.js';
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initForms, initWhatsAppWidget } from './forms.js';
import { initModals } from './modals.js';
import { initGalleries } from './galleries.js';
import { initDetailPage, refreshDetailPage, initPolicies, refreshPolicies } from './detail-pages.js';
import {
  initPrivateSessionDetails,
  refreshPrivateSessionDetails,
} from './private-sessions-details.js';
import {
  initRecordedSessionDetails,
  refreshRecordedSessionDetails,
} from './recorded-sessions-details.js';
import {
  initWorkshopDetails,
  refreshWorkshopDetails,
} from './workshops-details.js';
import {
  initProgramDetails,
  refreshProgramDetails,
} from './programs-details.js';
import {
  initProgramTransformationDetails,
  refreshProgramTransformationDetails,
} from './programs-transformation-details.js';
import {
  initProgramMethodologyDetails,
  refreshProgramMethodologyDetails,
} from './programs-methodology-details.js';
import {
  initProgramSpiritualDetails,
  refreshProgramSpiritualDetails,
} from './programs-spiritual-details.js';
import {
  initProgramPracticalDetails,
  refreshProgramPracticalDetails,
} from './programs-practical-details.js';
import { createTestimonialSlider, getHomepageTestimonials } from './sliders.js';
import { initIcons, getIcon } from './icons.js';
import { botanicalSVG, journeyCurveSVG } from './svg-decor.js';
import { getRecordedSessionCards, getRecordedSessionsCategory } from '../../data/recorded-sessions.js';
import { getRecordedSessionDetailPage } from '../../data/recorded-sessions-details.js';

let homepageTestimonials = null;

function initDecor(root = document) {
  root.querySelectorAll('[data-botanical]').forEach((el, index) => {
    const bold = el.getAttribute('data-botanical-bold') !== 'false';
    const animated = el.getAttribute('data-botanical-animated') !== 'false';
    el.classList.add('botanical-line-art');
    el.classList.toggle('botanical-line-art--bold', bold);
    el.classList.toggle('botanical-line-art--animated', animated);
    el.innerHTML = botanicalSVG({ id: el.id || `botanical-${index}`, bold, animated });
  });

  root.querySelectorAll('[data-journey-curve]').forEach((el, index) => {
    const animated = el.getAttribute('data-journey-curve') !== 'false';
    el.innerHTML = journeyCurveSVG({ id: el.id || `journey-curve-${index}`, animated });
  });
}

function setRecordedText(selector, value) {
  if (value == null) return;
  document.querySelectorAll(selector).forEach((el) => {
    el.textContent = value;
  });
}

function initRecordedLibrary() {
  const page = document.querySelector('[data-recorded-page]');
  const grid = document.querySelector('[data-recorded-grid], #recorded-sessions-grid');
  if (!page && !grid) return;

  const locale = getLocale();
  const category = getRecordedSessionsCategory(locale);
  const cards = getRecordedSessionCards(locale);
  const ctaIcon = getIcon('chevronForward', 'icon icon-xs');

  if (page && category) {
    const sections = [...(category.sections ?? [])].sort((a, b) => a.order - b.order);
    const intro = sections.find((section) => section.key === 'intro');
    const purpose = sections.find((section) => section.key === 'purpose');
    const list = sections.find((section) => section.key === 'sessions_list');
    const cta = sections.find((section) => section.key === 'final_cta');

    setRecordedText('[data-rs-tag]', category.hero?.eyebrow);
    setRecordedText('[data-rs-title]', category.page_title);
    setRecordedText('[data-rs-lead]', category.page_subtitle);
    setRecordedText('[data-rs-desc]', category.hero?.subheading);
    setRecordedText('[data-rs-primary]', category.hero?.primary_cta);
    setRecordedText('[data-rs-secondary]', category.hero?.secondary_cta);
    setRecordedText('[data-rs-intro-title]', intro?.heading);
    setRecordedText('[data-rs-intro-text]', intro?.subheading);
    setRecordedText('[data-rs-purpose-title]', purpose?.heading);
    setRecordedText('[data-rs-purpose-text]', purpose?.subheading);
    setRecordedText('[data-rs-list-title]', list?.heading);
    setRecordedText('[data-rs-list-text]', list?.subheading);
    setRecordedText('[data-rs-cta-title]', cta?.heading);
    setRecordedText('[data-rs-cta-text]', cta?.subheading);

    page.querySelectorAll('[data-icon="arrowForward"], [data-icon="arrowBack"]').forEach((el) => {
      el.innerHTML = getIcon(el.getAttribute('data-icon'), el.getAttribute('data-icon-class') || 'icon icon-sm');
    });
  }

  if (!grid || !cards?.length) return;
  grid.innerHTML = cards
    .map((card) => {
      const title = String(card.title ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      const description = String(card.description ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      const button = String(card.button_text ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      return `<a href="${getRecordedSessionDetailPage(card.slug)}?slug=${encodeURIComponent(card.slug)}" class="program-detail-related session-detail-related">
        <h3 class="program-detail-related-title">${title}</h3>
        <p class="program-detail-related-text">${description}</p>
        <span class="program-detail-related-cta"><span>${button}</span>${ctaIcon}</span>
      </a>`;
    })
    .join('');
}

function initHomepageTestimonials() {
  const host = document.getElementById('testimonials-slider');
  if (!host) return;
  homepageTestimonials?.destroy();
  const items = getHomepageTestimonials(getLocale());
  homepageTestimonials = createTestimonialSlider(host, items);
}

function onLocaleChange() {
  applyI18n();
  initIcons();
  initDecor();
  refreshDetailPage();
  refreshPrivateSessionDetails();
  refreshRecordedSessionDetails();
  refreshWorkshopDetails();
  refreshProgramDetails();
  refreshProgramTransformationDetails();
  refreshProgramMethodologyDetails();
  refreshProgramSpiritualDetails();
  refreshProgramPracticalDetails();
  refreshPolicies();
  initHomepageTestimonials();
  initRecordedLibrary();
  // forms refresh via forms.js locale listener only
}

export function boot() {
  try {
    initTheme();
  } catch (err) {
    console.error('[boot] initTheme failed', err);
  }
  try {
    initLanguage();
    applyI18n();
  } catch (err) {
    console.error('[boot] language/i18n failed', err);
  }
  try {
    initIcons();
  } catch (err) {
    console.error('[boot] initIcons failed', err);
  }
  try {
    // Start Hero entrance before heavier decor work so it begins immediately.
    initAnimations();
  } catch (err) {
    console.error('[boot] initAnimations failed', err);
    document.getElementById('hero')?.classList.add('hero-is-ready');
  }
  try {
    initDecor();
  } catch (err) {
    console.error('[boot] initDecor failed', err);
  }
  try {
    initNavigation();
  } catch (err) {
    console.error('[boot] initNavigation failed', err);
  }
  try {
    initForms();
    initWhatsAppWidget();
    initModals();

    if (document.querySelector('.program-detail-gallery')) initGalleries();
    if (document.querySelector('[data-detail-root]')) initDetailPage();
    if (document.querySelector('[data-private-session-root]')) initPrivateSessionDetails();
    if (document.querySelector('[data-recorded-session-root]')) initRecordedSessionDetails();
    if (document.querySelector('[data-workshop-rich-root]')) initWorkshopDetails();
    if (document.querySelector('[data-program-rich-root]')) initProgramDetails();
    if (document.querySelector('[data-program-transform-root]')) {
      initProgramTransformationDetails();
    }
    if (document.querySelector('[data-program-methodology-root]')) {
      initProgramMethodologyDetails();
    }
    if (document.querySelector('[data-program-spiritual-root]')) {
      initProgramSpiritualDetails();
    }
    if (document.querySelector('[data-program-practical-root]')) {
      initProgramPracticalDetails();
    }
    if (document.querySelector('[data-policies-root]')) initPolicies();
    if (document.getElementById('testimonials-slider')) initHomepageTestimonials();
    if (document.querySelector('[data-recorded-grid], #recorded-sessions-grid')) initRecordedLibrary();

    document.addEventListener('localechange', onLocaleChange);
  } catch (err) {
    console.error('[boot] secondary init failed', err);
  }
}

boot();
