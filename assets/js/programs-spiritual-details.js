/**
 * Spiritual Journey Program Structure renderer.
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

function multilineHtml(text = '') {
  return escapeHtml(text).replace(/\n/g, '<br>');
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
    ? `programs-spiritual-details.html?slug=${encodeURIComponent(slug)}`
    : 'programs-spiritual-details.html';

  try {
    canonical.setAttribute('href', new URL(canonicalPath, location.href).href);
  } catch {
    canonical.setAttribute('href', canonicalPath);
  }
}

function renderHero(root, hero, slug) {
  setText(root, '[data-ps-eyebrow]', hero?.eyebrow);
  setHtml(root, '[data-ps-title]', multilineHtml(hero?.title));
  setText(root, '[data-ps-supporting]', hero?.supporting_line);
  setText(root, '[data-ps-description]', hero?.description);
  setHtml(
    root,
    '[data-ps-supporting-lines]',
    (hero?.supporting_lines ?? [])
      .map(
        (line) =>
          `<li class="program-spiritual-hero__line">${escapeHtml(line)}</li>`,
      )
      .join(''),
  );
  setText(root, '[data-ps-method]', hero?.method);
  setHidden(root, '[data-ps-method]', !hero?.method);
  setText(root, '[data-ps-primary-cta-label]', hero?.primary_cta);
  setText(root, '[data-ps-secondary-cta-label]', hero?.secondary_cta);

  const primaryCta = root.querySelector('[data-ps-primary-cta]');
  if (primaryCta) primaryCta.setAttribute('href', contactHref(slug));

  const secondaryCta = root.querySelector('[data-ps-secondary-cta]');
  if (secondaryCta) {
    secondaryCta.hidden = !hero?.secondary_cta;
    secondaryCta.setAttribute('href', '#program-spiritual-summary');
  }

  const heroImage = root.querySelector('[data-ps-hero-image]');
  if (heroImage) {
    heroImage.src = getProgramHeroImage(slug);
    heroImage.alt = hero?.eyebrow || hero?.title || '';
  }
}

function renderJourneySummary(root, summary) {
  setText(root, '[data-ps-summary-brand]', summary?.brand);
  setText(root, '[data-ps-summary-duration]', summary?.duration_line);
  setText(root, '[data-ps-summary-stages]', summary?.stages_line);
  setHtml(
    root,
    '[data-ps-summary-pairs]',
    (summary?.value_pairs ?? [])
      .map(
        (pair) => `<li class="program-spiritual-summary__pair">
          <h3 class="program-spiritual-summary__pair-title">${escapeHtml(pair.title)}</h3>
          <p class="program-spiritual-summary__pair-body">${escapeHtml(pair.body)}</p>
        </li>`,
      )
      .join(''),
  );
}

function renderPain(root, pain) {
  setText(root, '[data-ps-pain-heading]', pain?.heading);
  setText(root, '[data-ps-pain-supporting]', pain?.supporting);
  setText(root, '[data-ps-pain-intro]', pain?.intro);
  setHtml(
    root,
    '[data-ps-pain-blocks]',
    (pain?.recognition_blocks ?? [])
      .map(
        (block, index) => `<li class="program-spiritual-pain__block">
          <span class="program-spiritual-pain__num" aria-hidden="true">${padIndex(block.order ?? index + 1)}</span>
          <div class="program-spiritual-pain__copy">
            <p class="program-spiritual-pain__know">${escapeHtml(block.knowledge_statement)}</p>
            <p class="program-spiritual-pain__reality">${escapeHtml(block.inner_reality)}</p>
          </div>
        </li>`,
      )
      .join(''),
  );
}

function renderTransformation(root, transformation, flowTo) {
  setHtml(
    root,
    '[data-ps-transformation-opening]',
    paragraphsHtml(transformation?.opening_paragraphs),
  );
  setText(root, '[data-ps-transformation-intro]', transformation?.intro);
  setHtml(
    root,
    '[data-ps-transformation-flows]',
    (transformation?.flows ?? [])
      .map(
        (flow) => `<li class="program-spiritual-flows__item">
          <div class="program-spiritual-flows__row">
            <span class="program-spiritual-flows__from">${escapeHtml(flow.from)}</span>
            <span class="program-spiritual-flows__arrow" aria-hidden="true">
              <span class="program-spiritual-flows__connector">${escapeHtml(flowTo || '→')}</span>
            </span>
            <span class="program-spiritual-flows__to">${escapeHtml(flow.to)}</span>
          </div>
        </li>`,
      )
      .join(''),
  );
}

function renderAudience(root, audience) {
  setText(root, '[data-ps-audience-heading]', audience?.heading);
  setText(root, '[data-ps-audience-intro]', audience?.intro);
  setHtml(
    root,
    '[data-ps-audience-items]',
    (audience?.items ?? [])
      .map(
        (item, index) => `<li class="program-spiritual-audience__item">
          <span class="program-spiritual-audience__num" aria-hidden="true">${padIndex(item.order ?? index + 1)}</span>
          <div>
            <h3 class="program-spiritual-audience__title">${escapeHtml(item.title)}</h3>
            <p class="program-spiritual-audience__body">${escapeHtml(item.body)}</p>
          </div>
        </li>`,
      )
      .join(''),
  );
}

function renderTopic(topic, fallbackResultLabel) {
  const title = topic?.title
    ? `<h4 class="program-spiritual-topic__title">${escapeHtml(topic.title)}</h4>`
    : '';
  const intro = topic?.intro
    ? `<p class="program-spiritual-topic__intro">${multilineHtml(topic.intro)}</p>`
    : '';
  const bullets =
    (topic?.bullets ?? []).length > 0
      ? `<ul class="program-spiritual-bullet-list">${bulletListHtml(topic.bullets)}</ul>`
      : '';
  const resultLabel = topic?.result_label || fallbackResultLabel || '';
  const result = topic?.result
    ? `<div class="program-spiritual-result">
        ${resultLabel ? `<p class="program-spiritual-result__label">${escapeHtml(resultLabel)}</p>` : ''}
        <p class="program-spiritual-result__text">${escapeHtml(topic.result)}</p>
      </div>`
    : '';

  return `<article class="program-spiritual-topic">
    ${title}
    ${intro}
    ${bullets}
    ${result}
  </article>`;
}

function renderJourney(root, journey, display) {
  setText(root, '[data-ps-journey-heading]', journey?.heading);
  setText(root, '[data-ps-journey-intro]', journey?.intro);

  const stages = [...(journey?.stages ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  setHtml(
    root,
    '[data-ps-journey-stages]',
    stages
      .map((stage, index) => {
        const topicsHtml = (stage.topics ?? [])
          .map((topic) => renderTopic(topic, display?.result_label))
          .join('');

        return `<li class="program-spiritual-stage">
          <div class="program-spiritual-stage__rail" aria-hidden="true">
            <span class="program-spiritual-stage__dot"></span>
            <span class="program-spiritual-stage__line"></span>
          </div>
          <div class="program-spiritual-stage__body">
            <p class="program-spiritual-stage__label">${escapeHtml(stage.label)}</p>
            <h3 class="program-spiritual-stage__month">${escapeHtml(stage.month_title)}</h3>
            ${stage.intro ? `<p class="program-spiritual-stage__intro">${escapeHtml(stage.intro)}</p>` : ''}
            <div class="program-spiritual-stage__topics">${topicsHtml}</div>
          </div>
        </li>`;
      })
      .join(''),
  );
}

function renderDifferentiator(root, differentiator) {
  setText(root, '[data-ps-differentiator-heading]', differentiator?.heading);
  setText(root, '[data-ps-differentiator-intro]', differentiator?.intro);
  setHtml(
    root,
    '[data-ps-differentiator-items]',
    (differentiator?.items ?? [])
      .map(
        (item, index) => `<li class="program-spiritual-diff__item">
          <span class="program-spiritual-diff__num" aria-hidden="true">${padIndex(item.order ?? index + 1)}</span>
          <div>
            <h3 class="program-spiritual-diff__title">${escapeHtml(item.title)}</h3>
            <p class="program-spiritual-diff__body">${escapeHtml(item.body)}</p>
          </div>
        </li>`,
      )
      .join(''),
  );
}

function renderTrainer(root, trainer) {
  setText(root, '[data-ps-trainer-heading]', trainer?.heading);
  setText(root, '[data-ps-trainer-subheading]', trainer?.subheading);
  setHtml(
    root,
    '[data-ps-trainer-paragraphs]',
    paragraphsHtml(trainer?.paragraphs),
  );
  setHtml(
    root,
    '[data-ps-trainer-bullets]',
    bulletListHtml(trainer?.bullets),
  );
}

function renderFaq(root, faq) {
  setText(root, '[data-ps-faq-heading]', faq?.heading);
  setText(root, '[data-ps-faq-supporting]', faq?.supporting);
  setHidden(root, '[data-ps-faq-supporting]', !faq?.supporting);

  const items = faq?.items ?? [];
  setHtml(
    root,
    '[data-ps-faq-items]',
    items
      .map((item, index) => {
        const id = `ps-faq-panel-${index}`;
        const buttonId = `ps-faq-button-${index}`;
        const expanded = index === 0;
        return `<div class="program-spiritual-faq__item${expanded ? ' is-open' : ''}">
          <h3 class="program-spiritual-faq__question">
            <button
              type="button"
              class="program-spiritual-faq__button"
              id="${buttonId}"
              aria-expanded="${expanded ? 'true' : 'false'}"
              aria-controls="${id}"
            >
              <span class="program-spiritual-faq__question-text">${escapeHtml(item.question)}</span>
              <span class="program-spiritual-faq__icon" aria-hidden="true"></span>
            </button>
          </h3>
          <div
            class="program-spiritual-faq__panel"
            id="${id}"
            role="region"
            aria-labelledby="${buttonId}"
            ${expanded ? '' : 'hidden'}
          >
            <p class="program-spiritual-faq__answer">${escapeHtml(item.answer)}</p>
          </div>
        </div>`;
      })
      .join(''),
  );

  const list = root.querySelector('[data-ps-faq-items]');
  if (!list || list.dataset.faqBound === '1') return;
  list.dataset.faqBound = '1';
  list.addEventListener('click', (event) => {
    const button = event.target.closest('.program-spiritual-faq__button');
    if (!button || !list.contains(button)) return;
    const item = button.closest('.program-spiritual-faq__item');
    const panel = item?.querySelector('.program-spiritual-faq__panel');
    if (!item || !panel) return;
    const willOpen = button.getAttribute('aria-expanded') !== 'true';

    list.querySelectorAll('.program-spiritual-faq__item').forEach((other) => {
      const otherBtn = other.querySelector('.program-spiritual-faq__button');
      const otherPanel = other.querySelector('.program-spiritual-faq__panel');
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
  setText(root, '[data-ps-cta-eyebrow]', finalCta?.eyebrow);
  setHidden(root, '[data-ps-cta-eyebrow]', !finalCta?.eyebrow);
  setText(root, '[data-ps-cta-heading]', finalCta?.heading);
  setText(root, '[data-ps-cta-supporting]', finalCta?.supporting);
  setText(root, '[data-ps-cta-body]', finalCta?.body);

  const primary = root.querySelector('[data-ps-cta-button]');
  if (primary) {
    primary.textContent = finalCta?.primary_cta ?? '';
    primary.setAttribute('href', contactHref(slug));
  }

  const secondary = root.querySelector('[data-ps-cta-secondary]');
  if (secondary) {
    secondary.hidden = !finalCta?.secondary_cta;
    secondary.textContent = finalCta?.secondary_cta ?? '';
    secondary.setAttribute('href', '#main-content');
  }
}

function renderNotFound(root) {
  const found = root.querySelector('[data-ps-found]');
  const missing = root.querySelector('[data-ps-not-found]');
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

  setText(root, '[data-ps-404-title]', fallback.title);
  setText(root, '[data-ps-404-body]', fallback.body);
  setText(root, '[data-ps-404-back-label]', fallback.back);
}

function renderProgram(root, program) {
  const found = root.querySelector('[data-ps-found]');
  const missing = root.querySelector('[data-ps-not-found]');
  if (found) found.hidden = false;
  if (missing) missing.hidden = true;

  const slug = program.purchase?.target || program.slug;

  renderHero(root, program.hero, slug);
  renderJourneySummary(root, program.journey_summary);
  renderPain(root, program.pain);
  renderTransformation(
    root,
    program.transformation,
    program.display?.flow_to,
  );
  renderAudience(root, program.audience);
  renderJourney(root, program.journey, program.display);
  renderDifferentiator(root, program.differentiator);
  renderTrainer(root, program.trainer);
  renderFaq(root, program.faq);
  renderFinalCta(root, program.final_cta, slug);
  updateDocumentMeta(program);

  root.querySelectorAll('[data-reveal]').forEach((el) => {
    el.classList.add('is-visible');
  });
}

function redirectIfWrongStructure(program) {
  if (!program?.structure_type) return false;
  if (program.structure_type === 'spiritual-journey') return false;
  const page = getProgramDetailPage(program.slug);
  location.replace(`${page}?slug=${encodeURIComponent(program.slug)}`);
  return true;
}

export function refreshProgramSpiritualDetails() {
  const root = document.querySelector('[data-program-spiritual-root]');
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

export function initProgramSpiritualDetails() {
  refreshProgramSpiritualDetails();
}
