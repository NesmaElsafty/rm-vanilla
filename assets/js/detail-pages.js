import { getLocale } from './language.js';
import { getContent, getDir } from '../../data/content.js';
import { getProgramBySlug, getProgramCards, getProgramDuration } from '../../data/programs.js';
import { getWorkshopBySlug, getWorkshopCards, getWorkshopDuration } from '../../data/workshops.js';
import { getSessionBySlug, getSessionCards } from '../../data/sessions.js';
import { getRecordedSessionBySlug, getRecordedSessionCards } from '../../data/recorded-sessions.js';
import { getRetreatBySlug, RETREAT_SLUG } from '../../data/retreats.js';
import { createTestimonialSlider, getTestimonialsForProgram } from './sliders.js';
import { initGallery } from './galleries.js';
import { iconArrowLeft, iconArrowRight, iconChevronDown } from './icons.js';
import { policyTitle, policySections } from '../../data/policies.js';

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

const APG_MAIN = 'assets/images/gallery/apg/apg-main.png';
const APG_SUP = [1, 2, 3, 4, 5, 6].map((n) => `assets/images/gallery/apg/apg-sup-${n}.png`);

const TAB_MAP = {
  program: {
    story: ['pain', 'problem', 'importance', 'promise', 'transformation', 'intro', 'value_cards', 'description', 'differentiator', 'why_people_learn'],
    curriculum: ['curriculum', 'core_axes'],
    join: ['audience', 'not_for', 'expected_results', 'delivery_method', 'about_trainer'],
  },
  workshop: {
    story: ['opening_question', 'workshop_description', 'concept', 'next_step'],
    curriculum: ['learning_outcomes'],
    join: ['audience', 'what_you_get'],
  },
  session: {
    story: ['opening_description', 'pain', 'problem', 'importance', 'promise', 'transformation', 'intro'],
    process: ['session_process', 'journey_process', 'differentiator'],
    join: ['expected_result', 'audience', 'not_for', 'delivery_method', 'about_trainer'],
  },
  recorded: {
    story: ['opening_description', 'session_purpose', 'intro'],
    transformation: ['transformation'],
    focus: ['focus_points', 'audience'],
  },
};

const SKIP_KEYS = new Set(['popup', 'final_cta']);
const PROGRAM_SKIP = new Set(['popup', 'final_cta', 'faq']);
const RECORDED_SKIP = new Set(['popup', 'final_cta', 'faq', 'transformation', 'audience']);

const NOT_FOUND = {
  program: 'index.html#programs',
  workshop: 'index.html#programs',
  session: 'index.html#programs',
  recorded: 'recorded-sessions.html',
  retreat: 'index.html#programs',
};

let activeTab = 'story';
let testimonialSlider = null;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toDisplayNum(n, useArabic) {
  if (!useArabic) return String(n);
  return String(n)
    .split('')
    .map((d) => ARABIC_DIGITS[Number(d)] ?? d)
    .join('');
}

function currentSlug() {
  return new URLSearchParams(location.search).get('slug') || '';
}

function inferKind(root) {
  const explicit = root.getAttribute('data-detail-root') || root.getAttribute('data-detail-type');
  if (explicit && explicit !== 'true') return explicit;
  const page = (location.pathname.split('/').pop() || '').toLowerCase();
  if (page.includes('workshop')) return 'workshop';
  if (page.includes('retreat')) return 'retreat';
  if (page.includes('recorded')) return 'recorded';
  if (page.includes('session')) return 'session';
  return 'program';
}

function sortedSections(entity) {
  return [...(entity.sections ?? [])].sort((a, b) => a.order - b.order);
}

function groupSections(sections, tabKeys) {
  const buckets = Object.fromEntries(Object.keys(tabKeys).map((key) => [key, []]));
  const assigned = new Set();

  for (const [tabId, keys] of Object.entries(tabKeys)) {
    for (const section of sections) {
      if (keys.includes(section.key) && !assigned.has(section.key)) {
        buckets[tabId].push(section);
        assigned.add(section.key);
      }
    }
  }

  for (const section of sections) {
    if (!assigned.has(section.key) && buckets.story) buckets.story.push(section);
  }

  return buckets;
}

function compactCard(section, featured = false) {
  return `<article class="program-detail-compact-card${featured ? ' program-detail-compact-card--featured' : ''}">
    <h3 class="program-detail-compact-title">${escapeHtml(section.heading)}</h3>
    <p class="program-detail-compact-text">${escapeHtml(section.subheading)}</p>
  </article>`;
}

function modulesStrip(items, useArabic, childrenByParent = new Map()) {
  return `<div class="program-detail-modules-scroll" tabindex="0">${items
    .map((module) => {
      const children = childrenByParent.get(module.order) ?? [];
      const childList = children.length
        ? `<ul class="program-detail-module-chip-children">${children
            .map((child) => `<li>${escapeHtml(child.heading)}</li>`)
            .join('')}</ul>`
        : '';
      return `<article class="program-detail-module-chip glass-panel">
        <span class="program-detail-module-chip-num">${toDisplayNum(module.order, useArabic)}</span>
        <h4 class="program-detail-module-chip-title">${escapeHtml(module.heading)}</h4>
        <p class="program-detail-module-chip-text">${escapeHtml(module.subheading)}</p>
        ${childList}
      </article>`;
    })
    .join('')}</div>`;
}

function tabsMarkup(tabs, aria) {
  return `<div class="program-detail-tabs" role="tablist" aria-label="${escapeHtml(aria)}">${tabs
    .map(
      (tab) =>
        `<button type="button" role="tab" data-tab="${tab.id}" aria-selected="${tab.id === activeTab ? 'true' : 'false'}" class="program-detail-tab${tab.id === activeTab ? ' program-detail-tab--active' : ''}">${escapeHtml(tab.label)}</button>`,
    )
    .join('')}</div>`;
}

function relatedMarkup(title, items, page) {
  if (!items.length) return '';
  return `<section class="program-detail-related-section">
    <h2 class="keynote-headline program-detail-related-heading">${escapeHtml(title)}</h2>
    <div class="program-detail-related-grid">${items
      .map(
        (item) =>
          `<a href="${page}?slug=${encodeURIComponent(item.slug)}" class="program-detail-related">
            <h3 class="program-detail-related-title">${escapeHtml(item.title)}</h3>
            <p class="program-detail-related-text">${escapeHtml(item.description)}</p>
          </a>`,
      )
      .join('')}</div>
  </section>`;
}

function ctaBar(title, text, buttonLabel, programTitle) {
  return `<section class="program-detail-cta-bar">
    <div class="program-detail-cta-bar-inner glass-slide">
      <div class="program-detail-cta-bar-copy">
        <h2 class="program-detail-cta-bar-title">${escapeHtml(title)}</h2>
        <p class="program-detail-cta-bar-text">${escapeHtml(text)}</p>
      </div>
      <a href="index.html?scroll=contact&program=${encodeURIComponent(programTitle)}" class="btn-luxury-primary">${escapeHtml(buttonLabel)}</a>
    </div>
  </section>`;
}

function galleryMarkup(images, title, subtitle, altPrefix) {
  if (!images.length) return '';
  const thumbs = images.length > 1
    ? `<div class="program-detail-gallery-thumbs">${images
        .map(
          (src, index) =>
            `<button type="button" class="program-detail-gallery-thumb${index === 0 ? ' program-detail-gallery-thumb--active' : ''}" data-gallery-src="${escapeHtml(src)}" aria-label="Open image ${index + 1}">
              <img src="${escapeHtml(src)}" alt="${escapeHtml(altPrefix)} thumbnail ${index + 1}" loading="lazy" decoding="async" class="program-detail-gallery-thumb-image"/>
            </button>`,
        )
        .join('')}</div>`
    : '';

  const nav = images.length > 1
    ? `<button type="button" class="program-detail-gallery-nav program-detail-gallery-nav--prev" aria-label="Previous image">${iconArrowLeft('icon icon-sm')}</button>
       <button type="button" class="program-detail-gallery-nav program-detail-gallery-nav--next" aria-label="Next image">${iconArrowRight('icon icon-sm')}</button>`
    : '';

  return `<section class="program-detail-gallery" aria-label="${escapeHtml(title)}" data-gallery-alt="${escapeHtml(altPrefix)}">
    <div class="program-detail-gallery-head">
      <h2 class="program-detail-gallery-title">${escapeHtml(title)}</h2>
      <p class="program-detail-gallery-subtitle">${escapeHtml(subtitle)}</p>
    </div>
    <div class="program-detail-gallery-viewer glass-slide">
      <div class="program-detail-gallery-stage">
        ${nav}
        <figure class="program-detail-gallery-main">
          <img src="${escapeHtml(images[0])}" alt="${escapeHtml(altPrefix)} 1" loading="lazy" decoding="async" class="program-detail-gallery-main-image"/>
        </figure>
      </div>
      ${thumbs}
      <div class="program-detail-gallery-counter">1 / ${images.length}</div>
    </div>
  </section>`;
}

function backLink(href, label, rtl) {
  const icon = rtl ? iconArrowRight('icon icon-sm') : iconArrowLeft('icon icon-sm');
  return `<a href="${href}" class="detail-back program-detail-back">${icon}<span>${escapeHtml(label)}</span></a>`;
}

function bindTabs(root) {
  root.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeTab = btn.getAttribute('data-tab');
      root.querySelectorAll('[data-tab]').forEach((tab) => {
        const on = tab.getAttribute('data-tab') === activeTab;
        tab.classList.toggle('program-detail-tab--active', on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      root.querySelectorAll('[data-tab-panel]').forEach((panel) => {
        panel.hidden = panel.getAttribute('data-tab-panel') !== activeTab;
      });
    });
  });
}

function uniqueImages(list) {
  return list.filter((src, index, all) => src && all.indexOf(src) === index);
}

function notFoundCopy(locale) {
  if (locale === 'en') {
    return {
      title: 'Content not found',
      body: 'We could not find this page. The link may be incorrect, or the content may have been moved.',
      back: 'Go back',
    };
  }
  return {
    title: 'المحتوى غير موجود',
    body: 'تعذر العثور على هذه الصفحة. قد يكون الرابط غير صحيح أو تم نقل المحتوى.',
    back: 'العودة',
  };
}

function renderNotFound(root, kind) {
  const locale = getLocale();
  const rtl = getDir(locale) === 'rtl';
  const copy = notFoundCopy(locale);
  const href = NOT_FOUND[kind] ?? 'index.html#programs';
  root.innerHTML = `
    <section class="detail-not-found glass-slide" role="status">
      <h1 class="keynote-display detail-not-found-title">${escapeHtml(copy.title)}</h1>
      <p class="keynote-body detail-not-found-text">${escapeHtml(copy.body)}</p>
      ${backLink(href, copy.back, rtl)}
    </section>
  `;
}

function renderProgram(root) {
  const locale = getLocale();
  const rtl = getDir(locale) === 'rtl';
  const content = getContent(locale);
  const pd = content.programDetail;
  const program = getProgramBySlug(currentSlug(), locale);
  if (!program) return renderNotFound(root, 'program');

  const sections = sortedSections(program).filter((s) => !PROGRAM_SKIP.has(s.key));
  const buckets = groupSections(sections, TAB_MAP.program);
  const faq = program.sections.find((s) => s.key === 'faq');
  const finalCta = program.sections.find((s) => s.key === 'final_cta');
  const duration = getProgramDuration(program.page_subtitle, locale);
  const related = getProgramCards(locale).filter((item) => item.slug !== program.slug).slice(0, 3);
  const { items: testimonials } = getTestimonialsForProgram(program, locale);
  const galleryFromTestimonials = uniqueImages(testimonials.map((item) => item.image)).slice(0, 6);
  const sup = program.slug === 'apg' ? APG_SUP : galleryFromTestimonials;
  const main = program.slug === 'apg' ? APG_MAIN : program.image;
  const galleryImages = uniqueImages([main, ...sup]);
  const childrenByParent = new Map();
  (program.sub_modules ?? []).forEach((child) => {
    const list = childrenByParent.get(child.parent_order) ?? [];
    list.push(child);
    childrenByParent.set(child.parent_order, list.sort((a, b) => a.order - b.order));
  });

  if (!['story', 'curriculum', 'join'].includes(activeTab)) activeTab = 'story';

  const story = buckets.story ?? [];
  root.innerHTML = `
    ${backLink('index.html#programs', pd.backToPrograms, rtl)}
    <section class="program-detail-hero program-detail-hero--compact glass-slide">
      <div class="program-detail-hero-grid">
        <div class="program-detail-hero-visual">
          <div class="program-detail-image-ring" aria-hidden="true"></div>
          <img src="${escapeHtml(program.image)}" alt="" class="program-detail-image" decoding="async"/>
        </div>
        <div class="program-detail-hero-content">
          <span class="keynote-label program-detail-hero-badge">
            <span class="program-detail-hero-badge-text">${escapeHtml(program.hero.eyebrow)}</span>
            ${duration ? `<span class="program-detail-hero-badge-sep" aria-hidden="true">·</span><span class="program-detail-hero-badge-duration">${escapeHtml(duration)}</span>` : ''}
          </span>
          <h1 class="keynote-display program-detail-hero-title">${escapeHtml(program.page_title)}</h1>
          <p class="text-gold-gradient program-detail-hero-subtitle">${escapeHtml(program.page_subtitle)}</p>
          <p class="keynote-body program-detail-hero-lead">${escapeHtml(program.hero.subheading)}</p>
          <a href="index.html?scroll=contact&program=${encodeURIComponent(program.page_title)}" class="btn-luxury-primary btn-luxury-primary--compact">${escapeHtml(program.hero.primary_cta)}</a>
        </div>
      </div>
    </section>
    <div class="program-detail-tabs-shell glass-slide">
      ${tabsMarkup(
        [
          { id: 'story', label: pd.tabsStory },
          { id: 'curriculum', label: pd.tabsCurriculum },
          { id: 'join', label: pd.tabsJoin },
        ],
        pd.sectionsAria,
      )}
      <div class="program-detail-tab-panel">
        <div data-tab-panel="story" class="program-detail-tab-content" ${activeTab === 'story' ? '' : 'hidden'}>
          ${story[0] ? compactCard(story[0], true) : ''}
          ${story.slice(1).length ? `<div class="program-detail-compact-grid">${story.slice(1).map((s) => compactCard(s)).join('')}</div>` : ''}
        </div>
        <div data-tab-panel="curriculum" class="program-detail-tab-content" ${activeTab === 'curriculum' ? '' : 'hidden'}>
          ${(buckets.curriculum ?? []).map((s) => compactCard(s, true)).join('')}
          ${program.modules?.length ? modulesStrip(program.modules, rtl, childrenByParent) : ''}
        </div>
        <div data-tab-panel="join" class="program-detail-tab-content" ${activeTab === 'join' ? '' : 'hidden'}>
          <div class="program-detail-compact-grid">${(buckets.join ?? []).map((s) => compactCard(s)).join('')}</div>
          ${faq ? `<details class="program-detail-faq"><summary class="program-detail-faq-summary">${escapeHtml(faq.heading)}</summary><p class="program-detail-faq-text">${escapeHtml(faq.subheading)}</p></details>` : ''}
        </div>
      </div>
    </div>
    <div data-detail-testimonials></div>
    ${galleryMarkup(galleryImages, pd.galleryTitle, pd.gallerySubtitle, program.page_title)}
    ${ctaBar(finalCta?.heading ?? pd.readyNextStep, finalCta?.subheading ?? program.hero.subheading, program.hero.primary_cta, program.page_title)}
    ${relatedMarkup(pd.relatedPrograms, related, 'program-detail.html')}
  `;

  mountExtras(root, testimonials);
}

function renderWorkshop(root) {
  const locale = getLocale();
  const rtl = getDir(locale) === 'rtl';
  const content = getContent(locale);
  const pd = content.programDetail;
  const wd = content.workshopDetail;
  const workshop = getWorkshopBySlug(currentSlug(), locale);
  if (!workshop) return renderNotFound(root, 'workshop');

  const sections = sortedSections(workshop).filter((s) => !PROGRAM_SKIP.has(s.key));
  const buckets = groupSections(sections, TAB_MAP.workshop);
  const faq = workshop.sections.find((s) => s.key === 'faq');
  const finalCta = workshop.sections.find((s) => s.key === 'final_cta');
  const duration = getWorkshopDuration(workshop, locale);
  const related = getWorkshopCards(locale).filter((item) => item.slug !== workshop.slug).slice(0, 3);
  const { items: testimonials } = getTestimonialsForProgram(workshop, locale);
  const story = buckets.story ?? [];
  if (!['story', 'curriculum', 'join'].includes(activeTab)) activeTab = 'story';

  root.innerHTML = `
    ${backLink('index.html#programs', wd.backToWorkshops, rtl)}
    <section class="program-detail-hero program-detail-hero--compact glass-slide">
      <div class="program-detail-hero-grid">
        <div class="program-detail-hero-visual">
          <div class="program-detail-image-ring" aria-hidden="true"></div>
          <img src="${escapeHtml(workshop.image)}" alt="" class="program-detail-image" decoding="async"/>
        </div>
        <div class="program-detail-hero-content">
          <span class="keynote-label program-detail-hero-badge">
            <span class="program-detail-hero-badge-text">${escapeHtml(workshop.hero.eyebrow)}</span>
            ${duration ? `<span class="program-detail-hero-badge-sep" aria-hidden="true">·</span><span class="program-detail-hero-badge-duration">${escapeHtml(duration)}</span>` : ''}
          </span>
          <h1 class="keynote-display program-detail-hero-title">${escapeHtml(workshop.page_title)}</h1>
          <p class="text-gold-gradient program-detail-hero-subtitle">${escapeHtml(workshop.page_subtitle)}</p>
          <p class="keynote-body program-detail-hero-lead">${escapeHtml(workshop.hero.subheading)}</p>
          <a href="index.html?scroll=contact&program=${encodeURIComponent(workshop.page_title)}" class="btn-luxury-primary btn-luxury-primary--compact">${escapeHtml(workshop.hero.primary_cta)}</a>
        </div>
      </div>
    </section>
    <div class="program-detail-tabs-shell glass-slide">
      ${tabsMarkup(
        [
          { id: 'story', label: pd.tabsStory },
          { id: 'curriculum', label: pd.tabsCurriculum },
          { id: 'join', label: pd.tabsJoin },
        ],
        pd.sectionsAria,
      )}
      <div class="program-detail-tab-panel">
        <div data-tab-panel="story" class="program-detail-tab-content" ${activeTab === 'story' ? '' : 'hidden'}>
          ${story[0] ? compactCard(story[0], true) : ''}
          ${story.slice(1).length ? `<div class="program-detail-compact-grid">${story.slice(1).map((s) => compactCard(s)).join('')}</div>` : ''}
        </div>
        <div data-tab-panel="curriculum" class="program-detail-tab-content" ${activeTab === 'curriculum' ? '' : 'hidden'}>
          ${(buckets.curriculum ?? []).map((s) => compactCard(s, true)).join('')}
          ${workshop.modules?.length ? modulesStrip(workshop.modules, rtl) : ''}
          ${workshop.benefits?.length ? `<h3 class="program-detail-compact-title">${escapeHtml(wd.benefitsTitle)}</h3>${modulesStrip(workshop.benefits, rtl)}` : ''}
        </div>
        <div data-tab-panel="join" class="program-detail-tab-content" ${activeTab === 'join' ? '' : 'hidden'}>
          <div class="program-detail-compact-grid">${(buckets.join ?? []).map((s) => compactCard(s)).join('')}</div>
          ${faq ? `<details class="program-detail-faq"><summary class="program-detail-faq-summary">${escapeHtml(faq.heading)}</summary><p class="program-detail-faq-text">${escapeHtml(faq.subheading)}</p></details>` : ''}
        </div>
      </div>
    </div>
    <div data-detail-testimonials></div>
    ${ctaBar(finalCta?.heading ?? pd.readyNextStep, finalCta?.subheading ?? workshop.hero.subheading, workshop.hero.primary_cta, workshop.page_title)}
    ${relatedMarkup(wd.relatedWorkshops, related, 'workshop-detail.html')}
  `;

  mountExtras(root, testimonials);
}

function renderSession(root) {
  const locale = getLocale();
  const rtl = getDir(locale) === 'rtl';
  const content = getContent(locale);
  const pd = content.programDetail;
  const session = getSessionBySlug(currentSlug(), locale);
  if (!session) return renderNotFound(root, 'session');

  const sections = sortedSections(session).filter((s) => !SKIP_KEYS.has(s.key) && s.key !== 'faq');
  const buckets = groupSections(sections, TAB_MAP.session);
  const finalCta = session.sections.find((s) => s.key === 'final_cta');
  const related = getSessionCards(locale).filter((item) => item.slug !== session.slug).slice(0, 3);
  const { items: testimonials } = getTestimonialsForProgram(session, locale);
  const story = buckets.story ?? [];
  if (!['story', 'process', 'join'].includes(activeTab)) activeTab = 'story';

  root.innerHTML = `
    ${backLink('index.html#programs', pd.backToSessions, rtl)}
    <section class="session-hero glass-slide">
      <div class="session-hero__mesh" aria-hidden="true"></div>
      <div class="session-hero__layout">
        <div class="session-hero__media">
          <div class="session-hero__photo-card">
            <div class="session-hero__photo-shine" aria-hidden="true"></div>
            <img src="${escapeHtml(session.image)}" alt="${escapeHtml(session.page_title)}" class="session-hero__photo" decoding="async"/>
            <span class="session-hero__photo-badge">${escapeHtml(session.hero.eyebrow)}</span>
          </div>
        </div>
        <div class="session-hero__content">
          <span class="session-hero__tag">${escapeHtml(session.hero.eyebrow)}</span>
          <h1 class="session-hero__title">${escapeHtml(session.page_title)}</h1>
          <p class="session-hero__lead">${escapeHtml(session.page_subtitle)}</p>
          <p class="session-hero__desc">${escapeHtml(session.hero.subheading)}</p>
        </div>
      </div>
    </section>
    <div id="session-detail-content" class="program-detail-tabs-shell glass-slide session-detail-tabs glow-card">
      ${tabsMarkup(
        [
          { id: 'story', label: pd.tabsSessionStory },
          { id: 'process', label: pd.tabsProcess },
          { id: 'join', label: pd.tabsBooking },
        ],
        pd.sessionSectionsAria,
      )}
      <div class="program-detail-tab-panel">
        <div data-tab-panel="story" class="program-detail-tab-content" ${activeTab === 'story' ? '' : 'hidden'}>
          ${story[0] ? compactCard(story[0], true) : ''}
          ${story.slice(1).length ? `<div class="program-detail-compact-grid">${story.slice(1).map((s) => compactCard(s)).join('')}</div>` : ''}
        </div>
        <div data-tab-panel="process" class="program-detail-tab-content" ${activeTab === 'process' ? '' : 'hidden'}>
          ${(buckets.process ?? []).map((s) => compactCard(s, true)).join('')}
          ${session.focus_points?.length ? modulesStrip(session.focus_points, rtl) : ''}
        </div>
        <div data-tab-panel="join" class="program-detail-tab-content" ${activeTab === 'join' ? '' : 'hidden'}>
          <div class="program-detail-compact-grid">${(buckets.join ?? []).map((s) => compactCard(s)).join('')}</div>
        </div>
      </div>
    </div>
    <div data-detail-testimonials></div>
    ${ctaBar(finalCta?.heading ?? pd.readyNextStep, finalCta?.subheading ?? session.hero.subheading, session.hero.primary_cta, session.page_title)}
    ${relatedMarkup(pd.relatedSessions, related, 'session-detail.html')}
  `;

  mountExtras(root, testimonials);
}

function renderRecorded(root) {
  const locale = getLocale();
  const rtl = getDir(locale) === 'rtl';
  const content = getContent(locale);
  const rs = content.recordedSessionDetail;
  const session = getRecordedSessionBySlug(currentSlug(), locale);
  if (!session) return renderNotFound(root, 'recorded');

  const sections = sortedSections(session).filter((s) => !RECORDED_SKIP.has(s.key));
  const buckets = groupSections(sections, TAB_MAP.recorded);
  const finalCta = session.sections.find((s) => s.key === 'final_cta');
  const transformation = session.sections.find((s) => s.key === 'transformation');
  const related = getRecordedSessionCards(locale).filter((item) => item.slug !== session.slug).slice(0, 3);
  const story = buckets.story ?? [];
  if (!['story', 'transformation', 'focus'].includes(activeTab)) activeTab = 'story';

  const transformCards = (session.transformation_points ?? [])
    .sort((a, b) => a.order - b.order)
    .map(
      (point) => `<article class="rs-transformation-card glass-panel">
        <div class="rs-transformation-flow">
          <span class="rs-transformation-from">${escapeHtml(point.from)}</span>
          ${iconArrowRight(`rs-transformation-arrow icon icon-sm${rtl ? ' rs-transformation-arrow--rtl' : ''}`)}
          <span class="rs-transformation-to">${escapeHtml(point.to)}</span>
        </div>
      </article>`,
    )
    .join('');

  root.innerHTML = `
    ${backLink('recorded-sessions.html', rs.backToLibrary, rtl)}
    <section class="session-hero glass-slide">
      <div class="session-hero__mesh" aria-hidden="true"></div>
      <div class="session-hero__layout">
        <div class="session-hero__media">
          <div class="session-hero__photo-card">
            <div class="session-hero__photo-shine" aria-hidden="true"></div>
            <img src="${escapeHtml(session.image)}" alt="${escapeHtml(session.page_title)}" class="session-hero__photo" decoding="async"/>
            <span class="session-hero__photo-badge">${escapeHtml(session.hero.eyebrow)}</span>
          </div>
        </div>
        <div class="session-hero__content">
          <span class="session-hero__tag">${escapeHtml(session.hero.eyebrow)}</span>
          <h1 class="session-hero__title">${escapeHtml(session.page_title)}</h1>
          <p class="session-hero__lead">${escapeHtml(session.page_subtitle)}</p>
          <p class="session-hero__desc">${escapeHtml(session.hero.subheading)}</p>
          <div class="session-hero__actions">
            <a href="index.html?scroll=contact&program=${encodeURIComponent(session.page_title)}" class="btn-luxury-primary">${escapeHtml(session.hero.primary_cta)}</a>
          </div>
        </div>
      </div>
    </section>
    <div id="rs-detail-content" class="program-detail-tabs-shell glass-slide session-detail-tabs glow-card">
      ${tabsMarkup(
        [
          { id: 'story', label: rs.tabsStory },
          { id: 'transformation', label: rs.tabsTransformation },
          { id: 'focus', label: rs.tabsFocus },
        ],
        rs.sectionsAria,
      )}
      <div class="program-detail-tab-panel">
        <div data-tab-panel="story" class="program-detail-tab-content" ${activeTab === 'story' ? '' : 'hidden'}>
          ${story[0] ? compactCard(story[0], true) : ''}
          ${story.slice(1).length ? `<div class="program-detail-compact-grid">${story.slice(1).map((s) => compactCard(s)).join('')}</div>` : ''}
        </div>
        <div data-tab-panel="transformation" class="program-detail-tab-content" ${activeTab === 'transformation' ? '' : 'hidden'}>
          ${transformation ? compactCard(transformation, true) : ''}
          ${transformCards ? `<div class="rs-transformation-grid">${transformCards}</div>` : ''}
        </div>
        <div data-tab-panel="focus" class="program-detail-tab-content" ${activeTab === 'focus' ? '' : 'hidden'}>
          ${session.focus_points?.length ? modulesStrip(session.focus_points, rtl) : ''}
          <div class="program-detail-compact-grid">${(buckets.focus ?? []).map((s) => compactCard(s)).join('')}</div>
        </div>
      </div>
    </div>
    ${ctaBar(finalCta?.heading ?? rs.readyNextStep, finalCta?.subheading ?? session.hero.subheading, session.hero.primary_cta, session.page_title)}
    ${relatedMarkup(rs.relatedSessions, related, 'recorded-session-detail.html')}
  `;

  mountExtras(root, []);
}

function renderRetreat(root) {
  const locale = getLocale();
  const rtl = getDir(locale) === 'rtl';
  const content = getContent(locale);
  const rd = content.retreatDetail;
  const slug = currentSlug() || RETREAT_SLUG;
  const retreat = getRetreatBySlug(slug, locale);
  if (!retreat) return renderNotFound(root, 'retreat');

  const titleHtml = (rd.titleParts ?? [])
    .map((part) => (part.gold ? `<span class="text-gold-gradient">${escapeHtml(part.text)}</span>` : escapeHtml(part.text)))
    .join('');

  root.innerHTML = `
    ${backLink('index.html#programs', rd.backToHome, rtl)}
    <section class="program-detail-hero program-detail-hero--compact retreat-detail-hero glass-slide">
      <div class="program-detail-hero-grid retreat-detail-hero-grid">
        <span class="keynote-label program-detail-hero-badge retreat-detail-hero-eyebrow">
          <span class="program-detail-hero-badge-text">${escapeHtml(rd.eyebrow)}</span>
        </span>
        <div class="program-detail-hero-visual program-detail-hero-visual--photo">
          <div class="program-detail-image-ring" aria-hidden="true"></div>
          <img src="${escapeHtml(retreat.hero)}" alt="" class="program-detail-image" decoding="async"/>
        </div>
        <div class="program-detail-hero-content retreat-detail-hero-content">
          <h1 class="keynote-display program-detail-hero-title retreat-detail-hero-title">${titleHtml}</h1>
          <p class="keynote-body program-detail-hero-lead">${escapeHtml(rd.heroSubtitle)}</p>
          <a href="index.html?scroll=contact&program=${encodeURIComponent(rd.eyebrow)}" class="btn-luxury-primary btn-luxury-primary--compact">${escapeHtml(rd.primaryCta)}</a>
        </div>
      </div>
    </section>
    ${galleryMarkup(retreat.gallery, rd.galleryTitle, rd.gallerySubtitle, rd.eyebrow)}
    ${ctaBar(rd.pageTitle, rd.heroSubtitle, rd.primaryCta, rd.eyebrow)}
  `;

  mountExtras(root, []);
}

function mountExtras(root, testimonials) {
  bindTabs(root);
  const gallery = root.querySelector('.program-detail-gallery');
  if (gallery) initGallery(gallery);

  const host = root.querySelector('[data-detail-testimonials]');
  testimonialSlider?.destroy();
  testimonialSlider = null;
  if (host && testimonials?.length) {
    testimonialSlider = createTestimonialSlider(host, testimonials);
  }
}

export function refreshDetailPage() {
  const root = document.querySelector('[data-detail-root]');
  if (!root) return;
  const kind = inferKind(root);
  const renderers = {
    program: renderProgram,
    workshop: renderWorkshop,
    session: renderSession,
    recorded: renderRecorded,
    retreat: renderRetreat,
  };
  (renderers[kind] ?? renderProgram)(root);
}

export function initDetailPage() {
  const root = document.querySelector('[data-detail-root]');
  if (!root) return;
  window.scrollTo(0, 0);
  activeTab = 'story';
  refreshDetailPage();
}

function renderPolicyBlock(block, locale) {
  if (block.type === 'ul') {
    const items = block.items?.[locale] ?? block.items?.ar ?? [];
    const listItems = items.map((item) => '<li>' + escapeHtml(item) + '</li>').join('');
    return `<ul class="${escapeHtml(block.className || 'policy-list')}">${listItems}</ul>`;
  }
  const html = block.html?.[locale] ?? block.html?.ar ?? '';
  return `<p>${html}</p>`;
}

export function refreshPolicies({ scrollToHighlight = false } = {}) {
  const root = document.querySelector('[data-policies-root]');
  if (!root) return;

  const locale = getLocale();
  const title = policyTitle[locale] ?? policyTitle.ar;
  const highlight = new URLSearchParams(location.search).get('highlight');

  const sections = policySections
    .map((section) => {
      const open = highlight === section.id ? ' open' : '';
      const body = (section.blocks ?? []).map((block) => renderPolicyBlock(block, locale)).join('');
      return `<details class="policy-item glass-slide" data-policy-id="${escapeHtml(section.id)}" id="${escapeHtml(section.id)}"${open}>
        <summary class="text-gold-gradient">
          <span>${escapeHtml(section.title[locale] ?? section.title.ar)}</span>
          ${iconChevronDown('policy-chevron icon icon-sm text-gold-gradient')}
        </summary>
        <div class="policy-body">${body}</div>
      </details>`;
    })
    .join('');

  const heading = root.querySelector('[data-policies-title]');
  if (heading) heading.textContent = title;

  const list = root.querySelector('[data-policies-list]') || root;
  if (list === root && !root.querySelector('[data-policies-list]')) {
    root.innerHTML = `<h1 class="keynote-display text-gold-gradient policies-title" data-policies-title>${escapeHtml(title)}</h1>
      <div class="gold-rule-short"></div>
      <div class="policies-list" data-policies-list>${sections}</div>`;
  } else {
    list.innerHTML = sections;
  }

  if (scrollToHighlight && highlight) {
    const node = root.querySelector(`[data-policy-id="${CSS.escape(highlight)}"]`);
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function initPolicies() {
  if (!document.querySelector('[data-policies-root]')) return;
  window.scrollTo(0, 0);
  refreshPolicies({ scrollToHighlight: true });
}
