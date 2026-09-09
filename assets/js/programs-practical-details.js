/**
 * Practical Course Program Structure renderer.
 * Driven by structure_type data — never by slug-specific branches.
 */

import { getLocale } from './language.js';
import {
  getProgramDetailBySlug,
  getProgramDetailPage,
} from '../../data/programs-details.js';
import { getProgramHeroImage } from './utils/program-hero-images.js';
import { escapeHtml } from './utils/content-blocks.js';

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

function setHidden(root, selector, hidden) {
  const el = root.querySelector(selector);
  if (!el) return;
  el.hidden = Boolean(hidden);
}

function paragraphsHtml(paragraphs = []) {
  return (paragraphs ?? [])
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join('');
}

function bulletListHtml(items = []) {
  return (items ?? [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');
}

function updateDocumentMeta(program) {
  const title = program?.seo?.title || document.title;
  document.title = title;

  const description =
    program?.seo?.description ||
    program?.hero?.description_paragraphs?.[0] ||
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

  const slug = program?.slug || currentSlug();
  const canonicalPath = slug
    ? `programs-practical-details.html?slug=${encodeURIComponent(slug)}`
    : 'programs-practical-details.html';

  try {
    canonical.setAttribute('href', new URL(canonicalPath, location.href).href);
  } catch {
    canonical.setAttribute('href', canonicalPath);
  }
}

function renderHero(root, hero, slug) {
  setText(root, '[data-ppc-title]', hero?.title);
  setText(root, '[data-ppc-supporting]', hero?.supporting_line);
  setHtml(
    root,
    '[data-ppc-description]',
    paragraphsHtml(hero?.description_paragraphs),
  );
  setText(root, '[data-ppc-primary-cta-label]', hero?.primary_cta);

  const primaryCta = root.querySelector('[data-ppc-primary-cta]');
  if (primaryCta) primaryCta.setAttribute('href', contactHref(slug));

  const heroImage = root.querySelector('[data-ppc-hero-image]');
  if (heroImage) {
    heroImage.src = getProgramHeroImage(slug);
    heroImage.alt = hero?.title || '';
  }
}

function renderPain(root, pain) {
  setText(root, '[data-ppc-pain-heading]', pain?.heading);
  setText(root, '[data-ppc-pain-intro]', pain?.intro);
  setHtml(
    root,
    '[data-ppc-pain-bullets]',
    (pain?.bullets ?? [])
      .map(
        (item, index) =>
          `<li class="program-practical-pain__item">
            <span class="program-practical-pain__num" aria-hidden="true">${padIndex(index + 1)}</span>
            <span>${escapeHtml(item)}</span>
          </li>`,
      )
      .join(''),
  );
  setHtml(
    root,
    '[data-ppc-pain-closing]',
    paragraphsHtml(pain?.closing_paragraphs),
  );
}

function renderImportance(root, importance) {
  setText(root, '[data-ppc-importance-heading]', importance?.heading);
  setText(root, '[data-ppc-importance-opening]', importance?.opening);
  setHtml(
    root,
    '[data-ppc-importance-misconceptions]',
    bulletListHtml(importance?.misconception_bullets),
  );
  setText(root, '[data-ppc-importance-bridge]', importance?.bridge);
  setText(root, '[data-ppc-importance-truth-label]', importance?.truth_label);
  setHtml(
    root,
    '[data-ppc-importance-truth]',
    bulletListHtml(importance?.truth_bullets),
  );
  setHtml(
    root,
    '[data-ppc-importance-closing]',
    paragraphsHtml(importance?.closing_paragraphs),
  );
}

function renderTransformation(root, transformation, flowTo) {
  setText(root, '[data-ppc-transformation-intro]', transformation?.intro);
  setHtml(
    root,
    '[data-ppc-transformation-flows]',
    (transformation?.flows ?? [])
      .map(
        (flow) => `<li class="program-practical-flows__item">
          <div class="program-practical-flows__row">
            <span class="program-practical-flows__from">${escapeHtml(flow.from)}</span>
            <span class="program-practical-flows__arrow" aria-hidden="true">
              <span>${escapeHtml(flowTo || '→')}</span>
            </span>
            <span class="program-practical-flows__to">${escapeHtml(flow.to)}</span>
          </div>
        </li>`,
      )
      .join(''),
  );
  setText(root, '[data-ppc-transformation-closing]', transformation?.closing);
}

function renderCurriculum(root, curriculum, display) {
  setText(root, '[data-ppc-curriculum-heading]', curriculum?.heading);
  const steps = [...(curriculum?.steps ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  setHtml(
    root,
    '[data-ppc-curriculum-steps]',
    steps
      .map((step, index) => {
        const opening = [
          step.opening,
          step.opening_secondary,
        ]
          .filter(Boolean)
          .map((text) => `<p class="program-practical-step__opening">${escapeHtml(text)}</p>`)
          .join('');

        const intro = step.intro
          ? `<p class="program-practical-step__intro">${escapeHtml(step.intro)}</p>`
          : '';

        const bullets =
          (step.bullets ?? []).length > 0
            ? `<ul class="program-practical-bullet-list">${bulletListHtml(step.bullets)}</ul>`
            : '';

        const secondaryIntro = step.secondary_intro
          ? `<p class="program-practical-step__intro">${escapeHtml(step.secondary_intro)}</p>`
          : '';

        const secondaryBullets =
          (step.secondary_bullets ?? []).length > 0
            ? `<ul class="program-practical-bullet-list">${bulletListHtml(step.secondary_bullets)}</ul>`
            : '';

        const resultLabel = step.result_label || display?.result_label || '';
        const result = step.result
          ? `<div class="program-practical-result">
              ${resultLabel ? `<p class="program-practical-result__label">${escapeHtml(resultLabel)}</p>` : ''}
              <p class="program-practical-result__text">${escapeHtml(step.result)}</p>
            </div>`
          : '';

        return `<li class="program-practical-step">
          <span class="program-practical-step__num" aria-hidden="true">${padIndex(step.order ?? index + 1)}</span>
          <div class="program-practical-step__body">
            <h3 class="program-practical-step__title">${escapeHtml(step.title)}</h3>
            ${opening}
            ${intro}
            ${bullets}
            ${secondaryIntro}
            ${secondaryBullets}
            ${result}
          </div>
        </li>`;
      })
      .join(''),
  );
}

function renderAudience(root, audience) {
  setText(root, '[data-ppc-audience-heading]', audience?.heading);
  setText(root, '[data-ppc-audience-intro]', audience?.intro);
  setHtml(
    root,
    '[data-ppc-audience-bullets]',
    bulletListHtml(audience?.bullets),
  );

  const notFor = audience?.not_for;
  setHidden(root, '[data-ppc-not-for-heading]', true);
  setText(root, '[data-ppc-not-for-intro]', notFor?.intro);
  setHtml(
    root,
    '[data-ppc-not-for-bullets]',
    bulletListHtml(notFor?.bullets),
  );
}

function renderResults(root, results) {
  setText(root, '[data-ppc-results-heading]', results?.heading);
  setText(root, '[data-ppc-results-intro]', results?.intro);
  setHtml(
    root,
    '[data-ppc-results-bullets]',
    (results?.bullets ?? [])
      .map(
        (item, index) =>
          `<li class="program-practical-results__item">
            <span class="program-practical-results__mark" aria-hidden="true">${padIndex(index + 1)}</span>
            <span>${escapeHtml(item)}</span>
          </li>`,
      )
      .join(''),
  );
}

function renderDelivery(root, delivery) {
  setText(root, '[data-ppc-delivery-heading]', delivery?.heading);
  setHtml(
    root,
    '[data-ppc-delivery-items]',
    (delivery?.items ?? [])
      .map(
        (item) =>
          `<li class="program-practical-delivery__item">
            <span class="program-practical-delivery__icon" aria-hidden="true"></span>
            <span>${escapeHtml(item)}</span>
          </li>`,
      )
      .join(''),
  );
}

function renderTrainer(root, trainer) {
  setText(root, '[data-ppc-trainer-heading]', trainer?.heading);
  setText(root, '[data-ppc-trainer-subheading]', trainer?.subheading);
  setHtml(
    root,
    '[data-ppc-trainer-paragraphs]',
    paragraphsHtml(trainer?.paragraphs),
  );
}

function renderFaq(root, faq) {
  setText(root, '[data-ppc-faq-heading]', faq?.heading);
  const items = faq?.items ?? [];
  setHtml(
    root,
    '[data-ppc-faq-items]',
    items
      .map((item, index) => {
        const id = `ppc-faq-panel-${index}`;
        const buttonId = `ppc-faq-button-${index}`;
        const expanded = index === 0;
        return `<div class="program-practical-faq__item${expanded ? ' is-open' : ''}">
          <h3 class="program-practical-faq__question">
            <button
              type="button"
              class="program-practical-faq__button"
              id="${buttonId}"
              aria-expanded="${expanded ? 'true' : 'false'}"
              aria-controls="${id}"
            >
              <span class="program-practical-faq__question-text">${escapeHtml(item.question)}</span>
              <span class="program-practical-faq__icon" aria-hidden="true"></span>
            </button>
          </h3>
          <div
            class="program-practical-faq__panel"
            id="${id}"
            role="region"
            aria-labelledby="${buttonId}"
            ${expanded ? '' : 'hidden'}
          >
            <p class="program-practical-faq__answer">${escapeHtml(item.answer)}</p>
          </div>
        </div>`;
      })
      .join(''),
  );

  const list = root.querySelector('[data-ppc-faq-items]');
  if (!list || list.dataset.faqBound === '1') return;
  list.dataset.faqBound = '1';
  list.addEventListener('click', (event) => {
    const button = event.target.closest('.program-practical-faq__button');
    if (!button || !list.contains(button)) return;
    const item = button.closest('.program-practical-faq__item');
    const panel = item?.querySelector('.program-practical-faq__panel');
    if (!item || !panel) return;
    const willOpen = button.getAttribute('aria-expanded') !== 'true';

    list.querySelectorAll('.program-practical-faq__item').forEach((other) => {
      const otherBtn = other.querySelector('.program-practical-faq__button');
      const otherPanel = other.querySelector('.program-practical-faq__panel');
      other.classList.remove('is-open');
      otherBtn?.setAttribute('aria-expanded', 'false');
      if (otherPanel) otherPanel.hidden = true;
    });

    if (willOpen) {
      item.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
    }
  });
}

function renderFinalCta(root, finalCta, slug) {
  setText(root, '[data-ppc-cta-heading]', finalCta?.heading);
  setText(root, '[data-ppc-cta-intro]', finalCta?.intro);
  setHtml(root, '[data-ppc-cta-bullets]', bulletListHtml(finalCta?.bullets));
  setText(root, '[data-ppc-cta-closing]', finalCta?.closing);

  const button = root.querySelector('[data-ppc-cta-button]');
  if (button) {
    button.textContent = finalCta?.primary_cta ?? '';
    button.setAttribute('href', contactHref(slug));
  }
}

function renderClosingCta(root, closingCta, slug) {
  const section = root.querySelector('[data-ppc-closing-cta]');
  if (!section) return;

  if (!closingCta?.heading && !closingCta?.primary_cta) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  setText(root, '[data-ppc-closing-heading]', closingCta?.heading);

  const button = root.querySelector('[data-ppc-closing-button]');
  if (button) {
    button.textContent = closingCta?.primary_cta ?? '';
    button.setAttribute('href', contactHref(slug));
  }
}

function renderNotFound(root) {
  const found = root.querySelector('[data-ppc-found]');
  const missing = root.querySelector('[data-ppc-not-found]');
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

  setText(root, '[data-ppc-404-title]', fallback.title);
  setText(root, '[data-ppc-404-body]', fallback.body);
  setText(root, '[data-ppc-404-back-label]', fallback.back);
}

function renderProgram(root, program) {
  const found = root.querySelector('[data-ppc-found]');
  const missing = root.querySelector('[data-ppc-not-found]');
  if (found) found.hidden = false;
  if (missing) missing.hidden = true;

  const slug = program.purchase?.target || program.slug;

  renderHero(root, program.hero, slug);
  renderPain(root, program.pain);
  renderImportance(root, program.importance);
  renderTransformation(
    root,
    program.transformation,
    program.display?.flow_to,
  );
  renderCurriculum(root, program.curriculum, program.display);
  renderAudience(root, program.audience);
  renderResults(root, program.results);
  renderDelivery(root, program.delivery);
  renderTrainer(root, program.trainer);
  renderFaq(root, program.faq);
  renderFinalCta(root, program.final_cta, slug);
  renderClosingCta(root, program.closing_cta, slug);
  updateDocumentMeta(program);

  root.querySelectorAll('[data-reveal]').forEach((el) => {
    el.classList.add('is-visible');
  });
}

function redirectIfWrongStructure(program) {
  if (!program?.structure_type) return false;
  if (program.structure_type === 'practical-course') return false;
  const page = getProgramDetailPage(program.slug);
  location.replace(`${page}?slug=${encodeURIComponent(program.slug)}`);
  return true;
}

export function refreshProgramPracticalDetails() {
  const root = document.querySelector('[data-program-practical-root]');
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

export function initProgramPracticalDetails() {
  refreshProgramPracticalDetails();
}
