import { getLocale } from './language.js';
import { getContent } from '../../data/content.js';
import { getProgramDetailBySlug } from '../../data/programs-details.js';
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

function asLines(value) {
  if (value == null || value === '') return [];
  return Array.isArray(value) ? value.filter((line) => line != null && line !== '') : [value];
}

function paragraphsHtml(lines = []) {
  return asLines(lines)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('');
}

function bulletsHtml(items = []) {
  return (items ?? [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');
}

function bodyWithBreaks(text = '') {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

function answerHtml(item) {
  if (item?.answer_intro || item?.bullets?.length) {
    return `${paragraphsHtml(item.answer_intro)}
      <ul class="program-rich-faq__answer-list">${bulletsHtml(item.bullets)}</ul>`;
  }
  if (Array.isArray(item?.answer)) {
    return paragraphsHtml(item.answer);
  }
  const text = String(item?.answer ?? '');
  if (text.includes('\n')) {
    return paragraphsHtml(text.split(/\n+/).map((part) => part.trim()).filter(Boolean));
  }
  return `<p>${escapeHtml(text)}</p>`;
}

function contentBlocksHtml(blocks = []) {
  return (blocks ?? [])
    .map((block) => {
      if (!block || !block.type) return '';
      if (block.type === 'paragraph') {
        return `<p class="program-rich-block-paragraph">${escapeHtml(block.text ?? '')}</p>`;
      }
      if (block.type === 'label') {
        return `<p class="program-rich-block-label">${escapeHtml(block.text ?? '')}</p>`;
      }
      if (block.type === 'highlight') {
        return `<p class="program-rich-block-highlight">${escapeHtml(block.text ?? '')}</p>`;
      }
      if (block.type === 'bullets') {
        return `<ul class="program-rich-bullet-list">${bulletsHtml(block.items)}</ul>`;
      }
      return '';
    })
    .join('');
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
    program?.hero?.description_paragraphs?.[0] ||
    program?.hero?.description ||
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
  const primaryHref = contactHref(slug);
  setText(root, '[data-pd-eyebrow]', hero?.eyebrow);
  setText(root, '[data-pd-title]', hero?.title);
  setText(root, '[data-pd-supporting]', hero?.supporting_line);

  const descriptionLines = hero?.description_paragraphs?.length
    ? hero.description_paragraphs
    : asLines(hero?.description);
  setHtml(root, '[data-pd-description]', paragraphsHtml(descriptionLines));

  setText(root, '[data-pd-primary-cta-label]', hero?.primary_cta);
  setText(root, '[data-pd-secondary-cta-label]', hero?.secondary_cta);

  const primaryCta = root.querySelector('[data-pd-primary-cta]');
  if (primaryCta) primaryCta.setAttribute('href', primaryHref);

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
  setHtml(root, '[data-pd-pain-closing]', paragraphsHtml(pain?.closing));
}

function renderImportance(root, importance) {
  setText(root, '[data-pd-importance-heading]', importance?.heading);
  setHtml(
    root,
    '[data-pd-importance-paragraphs]',
    paragraphsHtml(importance?.paragraphs),
  );

  const loop = importance?.loop ?? [];
  const loopEl = root.querySelector('[data-pd-importance-loop]');
  if (loopEl) {
    loopEl.hidden = !loop.length;
    loopEl.innerHTML = loop.length
      ? loop
          .map(
            (line, index) =>
              `<p class="program-rich-importance__loop-step" data-step="${index + 1}">${escapeHtml(line)}</p>`,
          )
          .join(
            '<span class="program-rich-importance__loop-arrow" aria-hidden="true">→</span>',
          )
      : '';
  }

  const loopQuestion = importance?.loop_question || '';
  setText(root, '[data-pd-importance-loop-question]', loopQuestion);
  setHidden(root, '[data-pd-importance-loop-question]', !loopQuestion);

  setHtml(
    root,
    '[data-pd-importance-groups]',
    (importance?.groups ?? [])
      .map(
        (group) => `<div class="program-rich-importance__group">
          <h3 class="program-rich-subheading">${escapeHtml(group.heading ?? '')}</h3>
          <ul class="program-rich-bullet-list">${bulletsHtml(group.bullets)}</ul>
        </div>`,
      )
      .join(''),
  );
  setHidden(root, '[data-pd-importance-groups]', !(importance?.groups ?? []).length);

  setHtml(
    root,
    '[data-pd-importance-bridge]',
    paragraphsHtml(importance?.bridge),
  );

  const bullets = importance?.bullets ?? [];
  setHtml(root, '[data-pd-importance-bullets]', bulletsHtml(bullets));
  setHidden(root, '[data-pd-importance-bullets]', !bullets.length);

  setText(root, '[data-pd-importance-simplified]', importance?.simplified_label);
  setHidden(root, '[data-pd-importance-simplified]', !importance?.simplified_label);
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

function renderModuleBody(module) {
  if (module.blocks?.length) {
    return contentBlocksHtml(module.blocks);
  }

  const bullets = module.bullets?.length
    ? `<ul class="program-rich-modules__bullets">${bulletsHtml(module.bullets)}</ul>`
    : '';
  const closing = module.closing
    ? `<p class="program-rich-modules__closing">${escapeHtml(module.closing)}</p>`
    : '';
  const body = module.body
    ? `<p class="program-rich-modules__text">${bodyWithBreaks(module.body)}</p>`
    : '';
  return `${body}${bullets}${closing}`;
}

function renderCurriculum(root, curriculum) {
  setText(root, '[data-pd-curriculum-heading]', curriculum?.heading);
  setText(root, '[data-pd-curriculum-supporting]', curriculum?.supporting_title);
  setHidden(root, '[data-pd-curriculum-supporting]', !curriculum?.supporting_title);
  setHtml(
    root,
    '[data-pd-curriculum-intro]',
    paragraphsHtml(curriculum?.intro),
  );
  setHidden(root, '[data-pd-curriculum-intro]', !asLines(curriculum?.intro).length);

  const modules = [...(curriculum?.modules ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  setHtml(
    root,
    '[data-pd-curriculum-modules]',
    modules
      .map((module, index) => {
        const title = module.heading || module.title || '';
        const subtitle = module.subtitle
          ? `<p class="program-rich-modules__subtitle">${escapeHtml(module.subtitle)}</p>`
          : '';
        return `<li class="program-rich-modules__item">
          <span class="program-rich-modules__num" aria-hidden="true">${padIndex(module.order ?? index + 1)}</span>
          <div class="program-rich-modules__body">
            <h3 class="program-rich-modules__title">${escapeHtml(title)}</h3>
            ${subtitle}
            ${renderModuleBody(module)}
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

  if (differentiator?.blocks?.length) {
    setHtml(
      root,
      '[data-pd-differentiator-body]',
      contentBlocksHtml(differentiator.blocks),
    );
    setHidden(root, '[data-pd-differentiator-classic]', true);
    setHidden(root, '[data-pd-differentiator-body]', false);
  } else {
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
    setHidden(
      root,
      '[data-pd-differentiator-supporting]',
      !differentiator?.supporting_heading,
    );
    setHtml(
      root,
      '[data-pd-differentiator-bullets]',
      bulletsHtml(differentiator?.bullets),
    );
    setHidden(root, '[data-pd-differentiator-classic]', false);
    setHtml(root, '[data-pd-differentiator-body]', '');
    setHidden(root, '[data-pd-differentiator-body]', true);
  }

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
        contentBlocksHtml(secondary.blocks),
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
  setHtml(root, '[data-pd-why-intro]', paragraphsHtml(why?.intro));
  setHtml(root, '[data-pd-why-bullets]', bulletsHtml(why?.bullets));
  setText(root, '[data-pd-why-simplified]', why?.simplified_label);
  setHidden(root, '[data-pd-why-simplified]', !why?.simplified_label);
  setHtml(root, '[data-pd-why-closing]', paragraphsHtml(why?.closing));
}

function renderTrainer(root, trainer) {
  setText(root, '[data-pd-trainer-heading]', trainer?.heading);
  setText(root, '[data-pd-trainer-subheading]', trainer?.subheading);
  setHidden(root, '[data-pd-trainer-subheading]', !trainer?.subheading);
  setHtml(
    root,
    '[data-pd-trainer-paragraphs]',
    paragraphsHtml(trainer?.paragraphs),
  );
  setHtml(root, '[data-pd-trainer-bullets]', bulletsHtml(trainer?.bullets));
  setHidden(root, '[data-pd-trainer-bullets]', !(trainer?.bullets ?? []).length);
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
            <div class="program-rich-faq__answer">${answerHtml(item)}</div>
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

  const preLabel = finalCta?.pre_bullets_label || finalCta?.intro || '';
  setText(root, '[data-pd-cta-intro]', preLabel);
  setHidden(root, '[data-pd-cta-intro]', !preLabel);

  setHtml(root, '[data-pd-cta-bullets]', bulletsHtml(finalCta?.bullets));
  setHtml(root, '[data-pd-cta-closing]', paragraphsHtml(finalCta?.closing));

  const buttonLabel = finalCta?.button || finalCta?.primary_cta || '';
  const button = root.querySelector('[data-pd-cta-button]');
  if (button) {
    button.setAttribute('href', href);
    button.textContent = buttonLabel;
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
  renderWhy(root, program.why_choose);
  renderTrainer(root, program.trainer);
  renderFaq(root, program.faq);
  renderTestimonials(root, program.slug, locale);
  renderGallery(root, program, locale);
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
