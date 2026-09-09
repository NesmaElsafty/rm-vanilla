import { getLocale } from './language.js';
import { getContent } from '../../data/content.js';
import { getProgramDetailBySlug } from '../../data/programs-details.js';
import { getProgramBySlug } from '../../data/programs.js';
import { getProgramHeroImage } from './utils/program-hero-images.js';
import { createTestimonialSlider, getTestimonialsForProgram } from './sliders.js';

let testimonialSlider = null;

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

function paragraphsHtml(lines = []) {
  return (lines ?? [])
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('');
}

function bulletsHtml(items = [], itemClass = '') {
  const cls = itemClass ? ` class="${itemClass}"` : '';
  return (items ?? [])
    .map((item) => `<li${cls}>${escapeHtml(item)}</li>`)
    .join('');
}

function bodyWithBreaks(text = '') {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

function updateDocumentMeta(program) {
  const title = program?.seo?.title || document.title;
  document.title = title;

  const description = program?.seo?.description || program?.hero?.description || '';

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
    ? `programs-details.html?slug=${encodeURIComponent(slug)}`
    : 'programs-details.html';

  try {
    canonical.setAttribute('href', new URL(canonicalPath, location.href).href);
  } catch {
    canonical.setAttribute('href', canonicalPath);
  }
}

function renderPain(root, pain) {
  setText(root, '[data-pd-pain-heading]', pain?.heading);
  setText(root, '[data-pd-pain-intro]', pain?.intro);
  setHtml(
    root,
    '[data-pd-pain-bullets]',
    (pain?.bullets ?? [])
      .map(
        (item, index) =>
          `<li class="program-rich-pain__item">
            <span class="program-rich-pain__num" aria-hidden="true">${padIndex(index + 1)}</span>
            <span class="program-rich-pain__text">${escapeHtml(item)}</span>
          </li>`,
      )
      .join(''),
  );
  setHtml(root, '[data-pd-pain-closing]', paragraphsHtml(pain?.closing));
}

function renderImportance(root, importance) {
  setText(root, '[data-pd-importance-heading]', importance?.heading);
  setHtml(
    root,
    '[data-pd-importance-paragraphs]',
    paragraphsHtml(importance?.paragraphs),
  );
  setHtml(
    root,
    '[data-pd-importance-loop]',
    (importance?.loop ?? [])
      .map(
        (line, index) =>
          `<p class="program-rich-importance__loop-step" data-step="${index + 1}">${escapeHtml(line)}</p>`,
      )
      .join('<span class="program-rich-importance__loop-arrow" aria-hidden="true">→</span>'),
  );
  setText(root, '[data-pd-importance-loop-question]', importance?.loop_question);
  setHtml(
    root,
    '[data-pd-importance-bridge]',
    paragraphsHtml(importance?.bridge),
  );
  setHtml(
    root,
    '[data-pd-importance-bullets]',
    bulletsHtml(importance?.bullets),
  );
  setText(root, '[data-pd-importance-simplified]', importance?.simplified_label);
  setHtml(
    root,
    '[data-pd-importance-closing]',
    paragraphsHtml(importance?.closing),
  );
}

function renderTransformation(root, transformation, flowTo) {
  setText(root, '[data-pd-transformation-heading]', transformation?.heading);
  setText(root, '[data-pd-transformation-intro]', transformation?.intro);
  setHtml(
    root,
    '[data-pd-transformation-flows]',
    (transformation?.flows ?? [])
      .map(
        (flow, index) =>
          `<li class="program-rich-flows__item">
            <span class="program-rich-flows__num" aria-hidden="true">${padIndex(index + 1)}</span>
            <div class="program-rich-flows__row">
              <span class="program-rich-flows__from">${escapeHtml(flow.from)}</span>
              <span class="program-rich-flows__arrow" aria-hidden="true">
                <span class="program-rich-flows__connector">${escapeHtml(flowTo || '→')}</span>
              </span>
              <span class="program-rich-flows__to">${escapeHtml(flow.to)}</span>
            </div>
          </li>`,
      )
      .join(''),
  );
  setText(
    root,
    '[data-pd-transformation-simplified]',
    transformation?.simplified_label,
  );
  setHtml(
    root,
    '[data-pd-transformation-closing]',
    paragraphsHtml(transformation?.closing),
  );
}

function renderAudience(root, audience) {
  setText(root, '[data-pd-audience-heading]', audience?.heading);
  setText(root, '[data-pd-audience-intro]', audience?.intro);
  setHtml(root, '[data-pd-audience-bullets]', bulletsHtml(audience?.bullets));
  setText(root, '[data-pd-not-for-heading]', audience?.not_for?.heading);
  setText(root, '[data-pd-not-for-intro]', audience?.not_for?.intro);
  setHtml(
    root,
    '[data-pd-not-for-bullets]',
    bulletsHtml(audience?.not_for?.bullets),
  );
}

function renderCurriculum(root, curriculum) {
  setText(root, '[data-pd-curriculum-heading]', curriculum?.heading);
  const modules = [...(curriculum?.modules ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  setHtml(
    root,
    '[data-pd-curriculum-modules]',
    modules
      .map((module, index) => {
        const bullets = module.bullets?.length
          ? `<ul class="program-rich-modules__bullets">${bulletsHtml(module.bullets)}</ul>`
          : '';
        const closing = module.closing
          ? `<p class="program-rich-modules__closing">${escapeHtml(module.closing)}</p>`
          : '';
        return `<li class="program-rich-modules__item">
          <span class="program-rich-modules__num" aria-hidden="true">${padIndex(module.order ?? index + 1)}</span>
          <div class="program-rich-modules__body">
            <h3 class="program-rich-modules__title">${escapeHtml(module.heading)}</h3>
            <p class="program-rich-modules__text">${bodyWithBreaks(module.body)}</p>
            ${bullets}
            ${closing}
          </div>
        </li>`;
      })
      .join(''),
  );
}

function renderDifferentiator(root, differentiator) {
  setText(root, '[data-pd-differentiator-heading]', differentiator?.heading);
  setText(
    root,
    '[data-pd-differentiator-intro-before]',
    differentiator?.intro_before,
  );
  const quotes = differentiator?.quotes ?? [];
  const connector = differentiator?.quote_connector ?? '';
  setHtml(
    root,
    '[data-pd-differentiator-quotes]',
    quotes
      .map((quote, index) => {
        const connectorHtml =
          index < quotes.length - 1
            ? `<span class="program-rich-differentiator__or">${escapeHtml(connector)}</span>`
            : '';
        return `<blockquote class="program-rich-differentiator__quote">${escapeHtml(quote)}</blockquote>${connectorHtml}`;
      })
      .join(''),
  );
  setHtml(
    root,
    '[data-pd-differentiator-intro-after]',
    paragraphsHtml(differentiator?.intro_after),
  );
  setText(
    root,
    '[data-pd-differentiator-supporting]',
    differentiator?.supporting_heading,
  );
  setHtml(
    root,
    '[data-pd-differentiator-bullets]',
    bulletsHtml(differentiator?.bullets),
  );
}

function renderResults(root, results) {
  setText(root, '[data-pd-results-heading]', results?.heading);
  setText(root, '[data-pd-results-intro]', results?.intro);
  setHtml(
    root,
    '[data-pd-results-bullets]',
    (results?.bullets ?? [])
      .map(
        (item, index) =>
          `<li class="program-rich-results__item">
            <span class="program-rich-results__mark" aria-hidden="true">${padIndex(index + 1)}</span>
            <span>${escapeHtml(item)}</span>
          </li>`,
      )
      .join(''),
  );
}

function renderWhy(root, why) {
  setText(root, '[data-pd-why-heading]', why?.heading);
  setText(root, '[data-pd-why-intro]', why?.intro);
  setHtml(root, '[data-pd-why-bullets]', bulletsHtml(why?.bullets));
  setHtml(root, '[data-pd-why-closing]', paragraphsHtml(why?.closing));
}

function renderTrainer(root, trainer) {
  setText(root, '[data-pd-trainer-heading]', trainer?.heading);
  setText(root, '[data-pd-trainer-subheading]', trainer?.subheading);
  setHtml(
    root,
    '[data-pd-trainer-paragraphs]',
    paragraphsHtml(trainer?.paragraphs),
  );
  setHtml(root, '[data-pd-trainer-bullets]', bulletsHtml(trainer?.bullets));
  setHtml(root, '[data-pd-trainer-closing]', paragraphsHtml(trainer?.closing));
}

function renderFaq(root, faq) {
  setText(root, '[data-pd-faq-heading]', faq?.heading);
  const items = faq?.items ?? [];
  setHtml(
    root,
    '[data-pd-faq-items]',
    items
      .map((item, index) => {
        const panelId = `program-faq-panel-${index}`;
        const buttonId = `program-faq-button-${index}`;
        const expanded = index === 0;
        let answerHtml = '';
        if (item.answer_intro || item.bullets?.length) {
          answerHtml = `<p>${escapeHtml(item.answer_intro ?? '')}</p>
            <ul class="program-rich-faq__answer-list">${bulletsHtml(item.bullets)}</ul>`;
        } else {
          answerHtml = `<p>${escapeHtml(item.answer ?? '')}</p>`;
        }
        return `<div class="program-rich-faq__item${expanded ? ' is-open' : ''}">
          <h3 class="program-rich-faq__question">
            <button
              type="button"
              class="program-rich-faq__button"
              id="${buttonId}"
              aria-expanded="${expanded ? 'true' : 'false'}"
              aria-controls="${panelId}"
              data-pd-faq-toggle
            >
              <span class="program-rich-faq__question-text">${escapeHtml(item.question)}</span>
              <span class="program-rich-faq__icon" aria-hidden="true"></span>
            </button>
          </h3>
          <div
            class="program-rich-faq__panel"
            id="${panelId}"
            role="region"
            aria-labelledby="${buttonId}"
            ${expanded ? '' : 'hidden'}
          >
            <div class="program-rich-faq__answer">${answerHtml}</div>
          </div>
        </div>`;
      })
      .join(''),
  );
  bindFaq(root);
}

function bindFaq(root) {
  const list = root.querySelector('[data-pd-faq-items]');
  if (!list || list.dataset.faqReady === '1') return;
  list.dataset.faqReady = '1';

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-pd-faq-toggle]');
    if (!button || !list.contains(button)) return;
    const item = button.closest('.program-rich-faq__item');
    const panel = item?.querySelector('.program-rich-faq__panel');
    if (!item || !panel) return;

    const willOpen = button.getAttribute('aria-expanded') !== 'true';
    list.querySelectorAll('.program-rich-faq__item').forEach((other) => {
      const otherBtn = other.querySelector('[data-pd-faq-toggle]');
      const otherPanel = other.querySelector('.program-rich-faq__panel');
      const isCurrent = other === item && willOpen;
      other.classList.toggle('is-open', isCurrent);
      otherBtn?.setAttribute('aria-expanded', isCurrent ? 'true' : 'false');
      if (otherPanel) otherPanel.hidden = !isCurrent;
    });
  });
}

function renderFinalCta(root, finalCta, slug) {
  setText(root, '[data-pd-cta-heading]', finalCta?.heading);
  setText(root, '[data-pd-cta-intro]', finalCta?.intro);
  setHtml(root, '[data-pd-cta-bullets]', bulletsHtml(finalCta?.bullets));
  setText(root, '[data-pd-cta-closing]', finalCta?.closing);
  const button = root.querySelector('[data-pd-cta-button]');
  if (button) {
    button.setAttribute('href', contactHref(slug));
    button.textContent = finalCta?.button ?? '';
  }
}

function renderTestimonials(root, slug, locale) {
  const section = root.querySelector('[data-pd-testimonials-section]');
  const host = root.querySelector('[data-pd-testimonials]');
  const legacy = getProgramBySlug(slug, locale) || { slug };
  const { items } = getTestimonialsForProgram(legacy, locale);
  const copy = getContent(locale)?.testimonials ?? {};

  testimonialSlider?.destroy();
  testimonialSlider = null;

  if (!section || !host) return;

  if (!items.length) {
    section.hidden = true;
    host.innerHTML = '';
    return;
  }

  section.hidden = false;
  setText(
    root,
    '[data-pd-testimonials-heading]',
    copy.programSpecific || copy.titleEmbedded || copy.title,
  );
  testimonialSlider = createTestimonialSlider(host, items);
}

function renderNotFound(root, program) {
  const found = root.querySelector('[data-pd-found]');
  const missing = root.querySelector('[data-pd-not-found]');
  if (found) found.hidden = true;
  if (missing) missing.hidden = false;

  const display = program?.display;
  const locale = getLocale();
  setText(
    root,
    '[data-pd-404-title]',
    display?.not_found_title ||
      (locale === 'en' ? 'Program not found' : 'البرنامج غير موجود'),
  );
  setText(
    root,
    '[data-pd-404-body]',
    display?.not_found_body ||
      (locale === 'en'
        ? 'The program you are looking for is not available.'
        : 'البرنامج الذي تبحث عنه غير متاح.'),
  );
  setText(
    root,
    '[data-pd-404-back-label]',
    display?.not_found_back ||
      (locale === 'en' ? 'Back to programs' : 'العودة إلى البرامج'),
  );

  document.title =
    locale === 'en'
      ? 'Program not found | Dr. Rana Mosaad'
      : 'البرنامج غير موجود | Dr. Rana Mosaad';
}

function renderProgram(root, program, locale) {
  const found = root.querySelector('[data-pd-found]');
  const missing = root.querySelector('[data-pd-not-found]');
  if (found) found.hidden = false;
  if (missing) missing.hidden = true;

  const hero = program.hero ?? {};
  const slug = program.purchase?.target || program.slug;
  const primaryHref = contactHref(slug);

  setText(root, '[data-pd-eyebrow]', hero.eyebrow);
  setText(root, '[data-pd-title]', hero.title);
  setText(root, '[data-pd-supporting]', hero.supporting_line);
  setText(root, '[data-pd-description]', hero.description);
  setText(root, '[data-pd-primary-cta-label]', hero.primary_cta);
  setText(root, '[data-pd-secondary-cta-label]', hero.secondary_cta);

  const primaryCta = root.querySelector('[data-pd-primary-cta]');
  if (primaryCta) primaryCta.setAttribute('href', primaryHref);

  const secondaryCta = root.querySelector('[data-pd-secondary-cta]');
  if (secondaryCta) {
    secondaryCta.hidden = !hero.secondary_cta;
    secondaryCta.setAttribute('href', '#program-pain');
  }

  const heroImage = root.querySelector('[data-pd-hero-image]');
  if (heroImage) {
    heroImage.src = getProgramHeroImage(program.slug);
    heroImage.alt = hero.title || hero.eyebrow || '';
  }

  renderPain(root, program.pain);
  renderImportance(root, program.importance);
  renderTransformation(root, program.transformation, program.display?.flow_to);
  renderAudience(root, program.audience);
  renderCurriculum(root, program.curriculum);
  renderDifferentiator(root, program.differentiator);
  renderResults(root, program.results);
  renderWhy(root, program.why_choose);
  renderTrainer(root, program.trainer);
  renderFaq(root, program.faq);
  renderTestimonials(root, program.slug, locale);
  renderFinalCta(root, program.final_cta, slug);

  updateDocumentMeta(program);

  root.querySelectorAll('[data-reveal]').forEach((el) => {
    el.classList.add('is-visible');
  });
}

export function refreshProgramDetails() {
  const root = document.querySelector('[data-program-rich-root]');
  if (!root) return;

  const locale = getLocale();
  const slug = currentSlug();
  const program = getProgramDetailBySlug(slug, locale);

  if (!program) {
    renderNotFound(root);
    return;
  }

  renderProgram(root, program, locale);
}

export function initProgramDetails() {
  refreshProgramDetails();
}
