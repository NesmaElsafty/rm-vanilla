/**
 * Methodology Journey Program Structure renderer.
 * Driven by structure_type data — never by slug-specific branches.
 */

import { getLocale } from './language.js';
import {
  getProgramDetailBySlug,
  getProgramDetailPage,
} from '../../data/programs-details.js';
import { getProgramHeroImage } from './utils/program-hero-images.js';
import {
  escapeHtml,
  renderContentBlocks,
} from './utils/content-blocks.js';

const BLOCK = 'program-methodology-block';

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

function blocks(list) {
  return renderContentBlocks(list, BLOCK);
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
    program?.hero?.description_blocks?.[0]?.text ||
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
    ? `programs-methodology-details.html?slug=${encodeURIComponent(slug)}`
    : 'programs-methodology-details.html';

  try {
    canonical.setAttribute('href', new URL(canonicalPath, location.href).href);
  } catch {
    canonical.setAttribute('href', canonicalPath);
  }
}

function renderHero(root, hero, slug) {
  setText(root, '[data-pm-eyebrow]', hero?.eyebrow);
  setText(root, '[data-pm-title]', hero?.title);
  setText(root, '[data-pm-supporting]', hero?.supporting_line);
  setHtml(root, '[data-pm-description]', blocks(hero?.description_blocks));
  setText(root, '[data-pm-primary-cta-label]', hero?.primary_cta);
  setText(root, '[data-pm-secondary-cta-label]', hero?.secondary_cta);

  const primaryCta = root.querySelector('[data-pm-primary-cta]');
  if (primaryCta) primaryCta.setAttribute('href', contactHref(slug));

  const secondaryCta = root.querySelector('[data-pm-secondary-cta]');
  if (secondaryCta) {
    secondaryCta.hidden = !hero?.secondary_cta;
    secondaryCta.setAttribute('href', '#program-methodology-pain');
  }

  const heroImage = root.querySelector('[data-pm-hero-image]');
  if (heroImage) {
    heroImage.src = getProgramHeroImage(slug);
    heroImage.alt = hero?.title || hero?.eyebrow || '';
  }
}

function renderPain(root, pain) {
  setText(root, '[data-pm-pain-heading]', pain?.heading);
  setText(root, '[data-pm-pain-intro]', pain?.intro);
  setHtml(
    root,
    '[data-pm-pain-bullets]',
    (pain?.bullets ?? [])
      .map(
        (item, index) =>
          `<li class="program-methodology-pain__item">
            <span class="program-methodology-pain__num" aria-hidden="true">${padIndex(index + 1)}</span>
            <span class="program-methodology-pain__text">${escapeHtml(item)}</span>
          </li>`,
      )
      .join(''),
  );
  setHtml(root, '[data-pm-pain-closing]', blocks(pain?.closing_blocks));
}

function renderPerspective(root, perspective) {
  setText(root, '[data-pm-perspective-heading]', perspective?.heading);
  setHtml(root, '[data-pm-perspective-body]', blocks(perspective?.content_blocks));
}

function renderPromise(root, promise, flowTo) {
  setText(root, '[data-pm-promise-heading]', promise?.heading);
  setText(root, '[data-pm-promise-intro]', promise?.intro);
  setHtml(
    root,
    '[data-pm-promise-flows]',
    (promise?.flows ?? [])
      .map(
        (flow) => `<li class="program-methodology-flows__item">
          <div class="program-methodology-flows__row">
            <span class="program-methodology-flows__from">${escapeHtml(flow.from)}</span>
            <span class="program-methodology-flows__arrow" aria-hidden="true">
              <span class="program-methodology-flows__connector">${escapeHtml(flowTo || '→')}</span>
            </span>
            <span class="program-methodology-flows__to">${escapeHtml(flow.to)}</span>
          </div>
        </li>`,
      )
      .join(''),
  );
  setText(root, '[data-pm-promise-simplified]', promise?.simplified_label);
  setHidden(root, '[data-pm-promise-simplified]', !promise?.simplified_label);
  setHtml(root, '[data-pm-promise-closing]', blocks(promise?.closing_blocks));
}

function renderAudience(root, audience) {
  setText(root, '[data-pm-audience-heading]', audience?.heading);
  setText(root, '[data-pm-audience-intro]', audience?.intro);
  setHtml(root, '[data-pm-audience-bullets]', bulletListHtml(audience?.bullets));

  const notFor = audience?.not_for;
  setText(root, '[data-pm-not-for-heading]', notFor?.heading);
  setText(root, '[data-pm-not-for-intro]', notFor?.intro);
  setHtml(root, '[data-pm-not-for-bullets]', bulletListHtml(notFor?.bullets));
}

function renderCurriculum(root, curriculum) {
  setText(root, '[data-pm-curriculum-heading]', curriculum?.heading);
  setText(root, '[data-pm-curriculum-supporting]', curriculum?.supporting_title);
  setHidden(
    root,
    '[data-pm-curriculum-supporting]',
    !curriculum?.supporting_title,
  );
  setHtml(root, '[data-pm-curriculum-intro]', blocks(curriculum?.intro_blocks));

  const modules = [...(curriculum?.modules ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  setHtml(
    root,
    '[data-pm-curriculum-modules]',
    modules
      .map((module, index) => {
        const subtitle = module.subtitle
          ? `<p class="program-methodology-pattern__subtitle">${escapeHtml(module.subtitle)}</p>`
          : '';
        return `<li class="program-methodology-pattern">
          <span class="program-methodology-pattern__num" aria-hidden="true">${padIndex(module.order ?? index + 1)}</span>
          <div class="program-methodology-pattern__body">
            <h3 class="program-methodology-pattern__title">${escapeHtml(module.title)}</h3>
            ${subtitle}
            <div class="program-methodology-pattern__content">${blocks(module.content_blocks)}</div>
          </div>
        </li>`;
      })
      .join(''),
  );

  const powerful = curriculum?.powerful_block;
  const powerfulRoot = root.querySelector('[data-pm-curriculum-powerful]');
  if (!powerfulRoot) return;

  if (!powerful?.heading && !(powerful?.intro_blocks ?? []).length) {
    powerfulRoot.hidden = true;
    return;
  }

  powerfulRoot.hidden = false;
  setText(root, '[data-pm-powerful-heading]', powerful.heading);
  setHtml(root, '[data-pm-powerful-intro]', blocks(powerful.intro_blocks));
  setHtml(root, '[data-pm-powerful-bullets]', bulletListHtml(powerful.bullets));
  setText(root, '[data-pm-powerful-simplified]', powerful.simplified_label);
  setHidden(root, '[data-pm-powerful-simplified]', !powerful.simplified_label);
  setHtml(root, '[data-pm-powerful-closing]', blocks(powerful.closing_blocks));
}

function renderDifferentiator(root, differentiator) {
  setText(root, '[data-pm-differentiator-heading]', differentiator?.heading);
  setText(
    root,
    '[data-pm-differentiator-supporting]',
    differentiator?.supporting_line,
  );
  setHidden(
    root,
    '[data-pm-differentiator-supporting]',
    !differentiator?.supporting_line,
  );
  setText(
    root,
    '[data-pm-differentiator-subheading]',
    differentiator?.subheading,
  );
  setHidden(
    root,
    '[data-pm-differentiator-subheading]',
    !differentiator?.subheading,
  );
  setHtml(
    root,
    '[data-pm-differentiator-body]',
    blocks(differentiator?.content_blocks),
  );
}

function renderMethodologyDescription(root, description) {
  const section = root.querySelector('[data-pm-methodology-description]');
  if (!section) return;

  if (!description?.heading && !(description?.content_blocks ?? []).length) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  setText(root, '[data-pm-what-heading]', description.heading);
  setHtml(root, '[data-pm-what-body]', blocks(description.content_blocks));
}

function renderTrainer(root, trainer) {
  setText(root, '[data-pm-trainer-heading]', trainer?.heading);
  setHtml(root, '[data-pm-trainer-body]', blocks(trainer?.content_blocks));
}

function renderResults(root, results) {
  setText(root, '[data-pm-results-heading]', results?.heading);
  setText(root, '[data-pm-results-intro]', results?.intro);
  setHtml(
    root,
    '[data-pm-results-bullets]',
    (results?.bullets ?? [])
      .map(
        (item, index) =>
          `<li class="program-methodology-results__item">
            <span class="program-methodology-results__mark" aria-hidden="true">${padIndex(index + 1)}</span>
            <span>${escapeHtml(item)}</span>
          </li>`,
      )
      .join(''),
  );
}

function renderFaq(root, faq) {
  setText(root, '[data-pm-faq-heading]', faq?.heading);
  const items = faq?.items ?? [];
  setHtml(
    root,
    '[data-pm-faq-items]',
    items
      .map((item, index) => {
        const id = `pm-faq-panel-${index}`;
        const buttonId = `pm-faq-button-${index}`;
        const expanded = index === 0;
        return `<div class="program-methodology-faq__item${expanded ? ' is-open' : ''}">
          <h3 class="program-methodology-faq__question">
            <button
              type="button"
              class="program-methodology-faq__button"
              id="${buttonId}"
              aria-expanded="${expanded ? 'true' : 'false'}"
              aria-controls="${id}"
            >
              <span class="program-methodology-faq__question-text">${escapeHtml(item.question)}</span>
              <span class="program-methodology-faq__icon" aria-hidden="true"></span>
            </button>
          </h3>
          <div
            class="program-methodology-faq__panel"
            id="${id}"
            role="region"
            aria-labelledby="${buttonId}"
            ${expanded ? '' : 'hidden'}
          >
            <div class="program-methodology-faq__answer">${blocks(item.answer_blocks)}</div>
          </div>
        </div>`;
      })
      .join(''),
  );

  const list = root.querySelector('[data-pm-faq-items]');
  if (!list || list.dataset.faqBound === '1') return;
  list.dataset.faqBound = '1';
  list.addEventListener('click', (event) => {
    const button = event.target.closest('.program-methodology-faq__button');
    if (!button || !list.contains(button)) return;
    const item = button.closest('.program-methodology-faq__item');
    const panel = item?.querySelector('.program-methodology-faq__panel');
    if (!item || !panel) return;
    const willOpen = button.getAttribute('aria-expanded') !== 'true';

    list.querySelectorAll('.program-methodology-faq__item').forEach((other) => {
      const otherBtn = other.querySelector('.program-methodology-faq__button');
      const otherPanel = other.querySelector('.program-methodology-faq__panel');
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
  setText(root, '[data-pm-cta-heading]', finalCta?.heading);
  setText(root, '[data-pm-cta-supporting]', finalCta?.supporting_line);
  setHidden(root, '[data-pm-cta-supporting]', !finalCta?.supporting_line);
  setText(root, '[data-pm-cta-intro]', finalCta?.pre_bullets_label);
  setHtml(root, '[data-pm-cta-bullets]', bulletListHtml(finalCta?.bullets));
  setHtml(root, '[data-pm-cta-closing]', blocks(finalCta?.closing_blocks));

  const primary = root.querySelector('[data-pm-cta-button]');
  if (primary) {
    primary.textContent = finalCta?.primary_cta ?? '';
    primary.setAttribute('href', contactHref(slug));
  }

  const secondary = root.querySelector('[data-pm-cta-secondary]');
  if (secondary) {
    secondary.hidden = !finalCta?.secondary_cta;
    secondary.textContent = finalCta?.secondary_cta ?? '';
    secondary.setAttribute('href', contactHref(slug));
  }
}

function renderNotFound(root) {
  const found = root.querySelector('[data-pm-found]');
  const missing = root.querySelector('[data-pm-not-found]');
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

  setText(root, '[data-pm-404-title]', fallback.title);
  setText(root, '[data-pm-404-body]', fallback.body);
  setText(root, '[data-pm-404-back-label]', fallback.back);
}

function renderProgram(root, program) {
  const found = root.querySelector('[data-pm-found]');
  const missing = root.querySelector('[data-pm-not-found]');
  if (found) found.hidden = false;
  if (missing) missing.hidden = true;

  const slug = program.purchase?.target || program.slug;

  renderHero(root, program.hero, slug);
  renderPain(root, program.pain);
  renderPerspective(root, program.perspective);
  renderPromise(root, program.promise, program.display?.flow_to);
  renderAudience(root, program.audience);
  renderCurriculum(root, program.curriculum);
  renderDifferentiator(root, program.differentiator);
  renderMethodologyDescription(root, program.methodology_description);
  renderTrainer(root, program.trainer);
  renderResults(root, program.results);
  renderFaq(root, program.faq);
  renderFinalCta(root, program.final_cta, slug);
  updateDocumentMeta(program);

  root.querySelectorAll('[data-reveal]').forEach((el) => {
    el.classList.add('is-visible');
  });
}

function redirectIfWrongStructure(program) {
  if (!program?.structure_type) return false;
  if (program.structure_type === 'methodology-journey') return false;
  const page = getProgramDetailPage(program.slug);
  const target = `${page}?slug=${encodeURIComponent(program.slug)}`;
  location.replace(target);
  return true;
}

export function refreshProgramMethodologyDetails() {
  const root = document.querySelector('[data-program-methodology-root]');
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

export function initProgramMethodologyDetails() {
  refreshProgramMethodologyDetails();
}
