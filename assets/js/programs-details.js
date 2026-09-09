import { getLocale } from './language.js';
import { refreshReveals } from './animations.js';
import { getContent } from '../../data/content.js';
import {
  getProgramDetailBySlug,
  getProgramDetailPage,
} from '../../data/programs-details.js';
import { getProgramBySlug } from '../../data/programs.js';
import { getProgramHeroImage } from './utils/program-hero-images.js';
import { createTestimonialSlider, getTestimonialsForProgram } from './sliders.js';
import { initGallery } from './galleries.js';
import { iconArrowLeft, iconArrowRight } from './icons.js';

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

function setHidden(root, selector, hidden) {
  const el = root.querySelector(selector);
  if (!el) return;
  el.hidden = Boolean(hidden);
}

function paragraphTextHtml(text = '') {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

/** ONE content-block renderer used by every editorial section. */
function renderContentBlocks(blocks = []) {
  const list = blocks ?? [];
  let html = '';
  let i = 0;

  while (i < list.length) {
    const block = list[i];
    if (!block?.type) {
      i += 1;
      continue;
    }

    if (block.type === 'highlight') {
      const group = [];
      while (i < list.length && list[i]?.type === 'highlight') {
        group.push(list[i]);
        i += 1;
      }

      if (group.length > 1) {
        html += `<div class="program-rich-highlight-strip">${group
          .map(
            (item, index) =>
              `${index > 0 ? '<span class="program-rich-highlight-strip__arrow" aria-hidden="true">→</span>' : ''}<p class="program-rich-block program-rich-block--highlight">${escapeHtml(item.text)}</p>`,
          )
          .join('')}</div>`;
      } else {
        html += `<p class="program-rich-block program-rich-block--highlight">${escapeHtml(group[0].text)}</p>`;
      }
      continue;
    }

    if (block.type === 'paragraph') {
      html += `<p class="program-rich-block program-rich-block--paragraph">${paragraphTextHtml(block.text)}</p>`;
    } else if (block.type === 'label') {
      html += `<p class="program-rich-block program-rich-block--label">${escapeHtml(block.text)}</p>`;
    } else if (block.type === 'quote') {
      html += `<blockquote class="program-rich-block program-rich-block--quote">${escapeHtml(block.text)}</blockquote>`;
    } else if (block.type === 'bullets') {
      html += `<ul class="program-rich-bullet-list">${(block.items ?? [])
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join('')}</ul>`;
    }

    i += 1;
  }

  return html;
}

function galleryLabels(locale = getLocale()) {
  const g = getContent(locale)?.gallery || {};
  const fill = (template, vars) =>
    String(template || '')
      .replace(/\{n\}/g, String(vars.n ?? ''))
      .replace(/\{prefix\}/g, String(vars.prefix ?? ''));

  const isAr = locale === 'ar';
  return {
    openImage: (n) =>
      fill(g.openImage, { n }) || (isAr ? `فتح الصورة ${n}` : `Open image ${n}`),
    previousImage: g.previousImage || (isAr ? 'الصورة السابقة' : 'Previous image'),
    nextImage: g.nextImage || (isAr ? 'الصورة التالية' : 'Next image'),
    thumbnailAlt: (prefix, n) =>
      fill(g.thumbnailAlt, { prefix, n }) ||
      (isAr ? `${prefix} صورة مصغرة ${n}` : `${prefix} thumbnail ${n}`),
    mainAlt: (prefix, n) =>
      fill(g.mainAlt, { prefix, n }) || `${prefix} ${n}`.trim(),
  };
}

function galleryMarkup(images, title, subtitle, altPrefix, locale) {
  if (!images.length) return '';
  const labels = galleryLabels(locale);
  const thumbs =
    images.length > 1
      ? `<div class="program-detail-gallery-thumbs">${images
          .map(
            (src, index) =>
              `<button type="button" class="program-detail-gallery-thumb${index === 0 ? ' program-detail-gallery-thumb--active' : ''}" data-gallery-src="${escapeHtml(src)}" aria-label="${escapeHtml(labels.openImage(index + 1))}">
              <img src="${escapeHtml(src)}" alt="${escapeHtml(labels.thumbnailAlt(altPrefix, index + 1))}" loading="lazy" decoding="async" class="program-detail-gallery-thumb-image"/>
            </button>`,
          )
          .join('')}</div>`
      : '';

  const nav =
    images.length > 1
      ? `<button type="button" class="program-detail-gallery-nav program-detail-gallery-nav--prev" aria-label="${escapeHtml(labels.previousImage)}">${iconArrowLeft('icon icon-sm')}</button>
       <button type="button" class="program-detail-gallery-nav program-detail-gallery-nav--next" aria-label="${escapeHtml(labels.nextImage)}">${iconArrowRight('icon icon-sm')}</button>`
      : '';

  return `<section class="program-detail-gallery program-rich-gallery" aria-label="${escapeHtml(title)}" data-gallery-alt="${escapeHtml(altPrefix)}" data-reveal>
    <div class="program-detail-gallery-head">
      <h2 class="program-detail-gallery-title">${escapeHtml(title)}</h2>
      <p class="program-detail-gallery-subtitle">${escapeHtml(subtitle)}</p>
    </div>
    <div class="program-detail-gallery-viewer glass-slide">
      <div class="program-detail-gallery-stage">
        ${nav}
        <figure class="program-detail-gallery-main">
          <img src="${escapeHtml(images[0])}" alt="${escapeHtml(labels.mainAlt(altPrefix, 1))}" loading="lazy" decoding="async" class="program-detail-gallery-main-image"/>
        </figure>
      </div>
      ${thumbs}
      <div class="program-detail-gallery-counter">1 / ${images.length}</div>
    </div>
  </section>`;
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
    ? `programs-details.html?slug=${encodeURIComponent(slug)}`
    : 'programs-details.html';

  try {
    canonical.setAttribute('href', new URL(canonicalPath, location.href).href);
  } catch {
    canonical.setAttribute('href', canonicalPath);
  }
}

function renderHero(root, hero, slug) {
  setText(root, '[data-pd-eyebrow]', hero?.eyebrow);
  setText(root, '[data-pd-title]', hero?.title);
  setText(root, '[data-pd-supporting]', hero?.supporting_line);
  setHtml(
    root,
    '[data-pd-description]',
    renderContentBlocks(hero?.description_blocks),
  );

  setText(root, '[data-pd-primary-cta-label]', hero?.primary_cta);
  setText(root, '[data-pd-secondary-cta-label]', hero?.secondary_cta);

  const primaryCta = root.querySelector('[data-pd-primary-cta]');
  if (primaryCta) primaryCta.setAttribute('href', contactHref(slug));

  const secondaryCta = root.querySelector('[data-pd-secondary-cta]');
  if (secondaryCta) {
    secondaryCta.hidden = !hero?.secondary_cta;
    secondaryCta.setAttribute('href', '#program-pain');
  }

  const heroImage = root.querySelector('[data-pd-hero-image]');
  if (heroImage) {
    heroImage.src = getProgramHeroImage(slug);
    heroImage.alt = hero?.title || hero?.eyebrow || '';
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
  setHtml(
    root,
    '[data-pd-pain-closing]',
    renderContentBlocks(pain?.closing_blocks),
  );
}

function renderImportance(root, importance) {
  setText(root, '[data-pd-importance-heading]', importance?.heading);
  setHtml(
    root,
    '[data-pd-importance-body]',
    renderContentBlocks(importance?.content_blocks),
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
  setHidden(
    root,
    '[data-pd-transformation-simplified]',
    !transformation?.simplified_label,
  );
  setHtml(
    root,
    '[data-pd-transformation-closing]',
    renderContentBlocks(transformation?.closing_blocks),
  );
}

function renderAudience(root, audience) {
  setText(root, '[data-pd-audience-heading]', audience?.heading);
  setText(root, '[data-pd-audience-intro]', audience?.intro);
  setHtml(
    root,
    '[data-pd-audience-bullets]',
    (audience?.bullets ?? [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join(''),
  );
  setText(root, '[data-pd-not-for-heading]', audience?.not_for?.heading);
  setText(root, '[data-pd-not-for-intro]', audience?.not_for?.intro);
  setHtml(
    root,
    '[data-pd-not-for-bullets]',
    (audience?.not_for?.bullets ?? [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join(''),
  );
}

function renderCurriculum(root, curriculum) {
  setText(root, '[data-pd-curriculum-heading]', curriculum?.heading);
  setText(root, '[data-pd-curriculum-supporting]', curriculum?.supporting_title);
  setHidden(root, '[data-pd-curriculum-supporting]', !curriculum?.supporting_title);

  const introBlocks = curriculum?.intro_blocks ?? [];
  setHtml(root, '[data-pd-curriculum-intro]', renderContentBlocks(introBlocks));
  setHidden(root, '[data-pd-curriculum-intro]', !introBlocks.length);

  const modules = [...(curriculum?.modules ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  setHtml(
    root,
    '[data-pd-curriculum-modules]',
    modules
      .map((module, index) => {
        const subtitle = module.subtitle
          ? `<p class="program-rich-modules__subtitle">${escapeHtml(module.subtitle)}</p>`
          : '';
        return `<li class="program-rich-modules__item">
          <span class="program-rich-modules__num" aria-hidden="true">${padIndex(module.order ?? index + 1)}</span>
          <div class="program-rich-modules__body">
            <h3 class="program-rich-modules__title">${escapeHtml(module.title)}</h3>
            ${subtitle}
            ${renderContentBlocks(module.content_blocks)}
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
    '[data-pd-differentiator-supporting-line]',
    differentiator?.supporting_line,
  );
  setHidden(
    root,
    '[data-pd-differentiator-supporting-line]',
    !differentiator?.supporting_line,
  );
  setText(root, '[data-pd-differentiator-subheading]', differentiator?.subheading);
  setHidden(root, '[data-pd-differentiator-subheading]', !differentiator?.subheading);
  setHtml(
    root,
    '[data-pd-differentiator-body]',
    renderContentBlocks(differentiator?.content_blocks),
  );

  const secondary = differentiator?.secondary_block;
  const secondaryHost = root.querySelector('[data-pd-differentiator-secondary]');
  if (secondaryHost) {
    if (secondary) {
      secondaryHost.hidden = false;
      setText(
        root,
        '[data-pd-differentiator-secondary-heading]',
        secondary.heading,
      );
      setHtml(
        root,
        '[data-pd-differentiator-secondary-body]',
        renderContentBlocks(secondary.content_blocks),
      );
    } else {
      secondaryHost.hidden = true;
      setHtml(root, '[data-pd-differentiator-secondary-body]', '');
    }
  }
}

function renderResults(root, results) {
  setText(root, '[data-pd-results-heading]', results?.heading);
  setText(root, '[data-pd-results-intro]', results?.intro);
  setHidden(root, '[data-pd-results-intro]', !results?.intro);
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

function renderWhyChoose(root, why) {
  setText(root, '[data-pd-why-heading]', why?.heading);
  setHtml(root, '[data-pd-why-intro]', renderContentBlocks(why?.intro_blocks));
  setHtml(
    root,
    '[data-pd-why-bullets]',
    (why?.bullets ?? [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join(''),
  );
  setText(root, '[data-pd-why-simplified]', why?.simplified_label);
  setHidden(root, '[data-pd-why-simplified]', !why?.simplified_label);
  setHtml(
    root,
    '[data-pd-why-closing]',
    renderContentBlocks(why?.closing_blocks),
  );
}

function renderTrainer(root, trainer) {
  setText(root, '[data-pd-trainer-heading]', trainer?.heading);
  setText(root, '[data-pd-trainer-subheading]', trainer?.subheading);
  setHidden(root, '[data-pd-trainer-subheading]', !trainer?.subheading);
  setHtml(
    root,
    '[data-pd-trainer-body]',
    renderContentBlocks(trainer?.content_blocks),
  );
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
            <div class="program-rich-faq__answer">${renderContentBlocks(item.answer_blocks)}</div>
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
  const href = contactHref(slug);
  setText(root, '[data-pd-cta-heading]', finalCta?.heading);
  setText(root, '[data-pd-cta-supporting]', finalCta?.supporting_line);
  setHidden(root, '[data-pd-cta-supporting]', !finalCta?.supporting_line);

  setText(root, '[data-pd-cta-intro]', finalCta?.pre_bullets_label);
  setHidden(root, '[data-pd-cta-intro]', !finalCta?.pre_bullets_label);

  const bullets = finalCta?.bullets ?? [];
  setHtml(
    root,
    '[data-pd-cta-bullets]',
    bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join(''),
  );
  setHidden(root, '[data-pd-cta-bullets]', !bullets.length);

  setHtml(
    root,
    '[data-pd-cta-closing]',
    renderContentBlocks(finalCta?.closing_blocks),
  );

  const button = root.querySelector('[data-pd-cta-button]');
  if (button) {
    button.setAttribute('href', href);
    button.textContent = finalCta?.primary_cta ?? '';
  }

  const secondary = root.querySelector('[data-pd-cta-secondary]');
  if (secondary) {
    const secondaryLabel = finalCta?.secondary_cta || '';
    secondary.hidden = !secondaryLabel;
    secondary.setAttribute('href', href);
    secondary.textContent = secondaryLabel;
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

function renderGallery(root, program, locale) {
  const section = root.querySelector('[data-pd-gallery-section]');
  const host = root.querySelector('[data-pd-gallery]');
  if (!section || !host) return;

  const images = (program.gallery?.images ?? []).filter(Boolean);
  if (!images.length) {
    section.hidden = true;
    host.innerHTML = '';
    return;
  }

  const content = getContent(locale);
  const pd = content.programDetail ?? {};
  const altPrefix = program.hero?.eyebrow || program.slug;

  section.hidden = false;
  host.innerHTML = galleryMarkup(
    images,
    pd.galleryTitle || '',
    pd.gallerySubtitle || '',
    altPrefix,
    locale,
  );

  const gallery = host.querySelector('.program-detail-gallery');
  if (gallery) {
    delete gallery.dataset.galleryReady;
    initGallery(gallery);
  }
}

function renderNotFound(root) {
  const found = root.querySelector('[data-pd-found]');
  const missing = root.querySelector('[data-pd-not-found]');
  if (found) found.hidden = true;
  if (missing) missing.hidden = false;

  const locale = getLocale();
  setText(
    root,
    '[data-pd-404-title]',
    locale === 'en' ? 'Program not found' : 'البرنامج غير موجود',
  );
  setText(
    root,
    '[data-pd-404-body]',
    locale === 'en'
      ? 'The program you are looking for is not available.'
      : 'البرنامج الذي تبحث عنه غير متاح.',
  );
  setText(
    root,
    '[data-pd-404-back-label]',
    locale === 'en' ? 'Back to programs' : 'العودة إلى البرامج',
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

  const slug = program.purchase?.target || program.slug;

  renderHero(root, program.hero, slug);
  renderPain(root, program.pain);
  renderImportance(root, program.importance);
  renderTransformation(root, program.transformation, program.display?.flow_to);
  renderAudience(root, program.audience);
  renderCurriculum(root, program.curriculum);
  renderDifferentiator(root, program.differentiator);
  renderResults(root, program.results);
  renderWhyChoose(root, program.why_choose);
  renderTrainer(root, program.trainer);
  renderFaq(root, program.faq);
  renderTestimonials(root, program.slug, locale);
  renderGallery(root, program, locale);
  renderFinalCta(root, program.final_cta, slug);

  updateDocumentMeta(program);

  refreshReveals(root);
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

  // Route non-master rich Programs to their structure page (central registry).
  if (program.structure_type && program.structure_type !== 'master-program') {
    const page = getProgramDetailPage(program.slug);
    location.replace(`${page}?slug=${encodeURIComponent(program.slug)}`);
    return;
  }

  renderProgram(root, program, locale);
}

export function initProgramDetails() {
  refreshProgramDetails();
}
