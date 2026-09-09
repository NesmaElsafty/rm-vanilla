import { getLocale } from './language.js';
import { refreshReveals } from './animations.js';
import {
  getRecordedSessionDetailBySlug,
} from '../../data/recorded-sessions-details.js';
import { getProgramHeroImage } from './utils/program-hero-images.js';
import { iconCheckCircle } from './icons.js';

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

function purchaseHref(target) {
  return `index.html?scroll=contact&program=${encodeURIComponent(target)}`;
}

function updateDocumentMeta(session) {
  const siteName = 'Dr. Rana Mosaad';
  const title = session?.session_name
    ? `${session.session_name} | ${siteName}`
    : document.title;
  document.title = title;

  const description = Array.isArray(session?.description)
    ? session.description[session.description.length - 1] ||
      session.description.join(' ')
    : '';

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
  const slug = session?.slug || currentSlug();
  const canonicalPath = slug
    ? `recorded-sessions-details.html?slug=${encodeURIComponent(slug)}`
    : 'recorded-sessions-details.html';
  try {
    canonical.setAttribute('href', new URL(canonicalPath, location.href).href);
  } catch {
    canonical.setAttribute('href', canonicalPath);
  }
}

function renderTransformationTitle(title, locale = 'ar') {
  const source = String(title ?? '');
  const match =
    locale === 'en'
      ? source.match(/^(From)\s+(.+?)\s+(to)\s+(.+)$/i)
      : source.match(/^(من)\s+(.+?)\s+(إلى)\s+(.+)$/);

  if (!match) return escapeHtml(source);

  const [, fromWord, before, toWord, after] = match;
  return `<span class="recorded-session-hero__compose">
    <span class="recorded-session-hero__compose-from">${escapeHtml(fromWord)} ${escapeHtml(before)}</span>
    <span class="recorded-session-hero__compose-to">${escapeHtml(toWord)}</span>
    <span class="recorded-session-hero__compose-light">${escapeHtml(after)}</span>
  </span>`;
}

function renderFlowRow(bullet, flow, labels = {}) {
  const full = escapeHtml(bullet);
  const prefix = labels.prefix || 'من';
  const connector = labels.connector || 'إلى';
  if (!flow?.from || !flow?.to) {
    return `<li class="recorded-session-flow__item">
      <span class="recorded-session-flow__full">${full}</span>
    </li>`;
  }

  return `<li class="recorded-session-flow__item">
    <p class="recorded-session-flow__row">
      <span class="recorded-session-flow__before">
        <span class="recorded-session-flow__prefix">${escapeHtml(prefix)}</span>
        <span class="recorded-session-flow__from">${escapeHtml(flow.from)}</span>
      </span>
      <span class="recorded-session-flow__mid" aria-hidden="true">
        <span class="recorded-session-flow__wave"></span>
        <span class="recorded-session-flow__connector">${escapeHtml(connector)}</span>
      </span>
      <span class="recorded-session-flow__after">
        <span class="recorded-session-flow__to">${escapeHtml(flow.to)}</span>
      </span>
    </p>
  </li>`;
}

function renderFound(root, session, locale) {
  const display = session.display ?? {};
  const purchaseTarget = session.purchase?.target || session.slug;
  const buyUrl = purchaseHref(purchaseTarget);

  const found = root.querySelector('[data-rsd-found]');
  const missing = root.querySelector('[data-rsd-not-found]');
  if (found) found.hidden = false;
  if (missing) missing.hidden = true;

  const setText = (sel, value) => {
    const el = root.querySelector(sel);
    if (el) el.textContent = value ?? '';
  };

  setText(
    '[data-rsd-eyebrow]',
    display.eyebrow || display.format_label || (locale === 'en' ? 'Audio Session' : 'جلسة صوتية'),
  );
  setText('[data-rsd-session-name]', session.session_name);

  const titleEl = root.querySelector('[data-rsd-transformation-title]');
  if (titleEl) {
    titleEl.innerHTML = renderTransformationTitle(session.transformation_title, locale);
  }

  const heroImage = root.querySelector('[data-rsd-hero-image]');
  if (heroImage) {
    heroImage.setAttribute('src', getProgramHeroImage(session.slug));
    heroImage.setAttribute('alt', session.session_name || '');
  }

  const descEl = root.querySelector('[data-rsd-description]');
  if (descEl) {
    const paragraphs = session.description ?? [];
    descEl.innerHTML = paragraphs
      .map((p, i) => {
        const cls =
          i < 2
            ? 'recorded-session-hero__hook'
            : 'recorded-session-hero__body';
        return `<p class="${cls}">${escapeHtml(p)}</p>`;
      })
      .join('');
  }

  root.querySelectorAll('[data-rsd-primary-cta]').forEach((cta) => {
    cta.setAttribute('href', buyUrl);
    const label = cta.querySelector('[data-rsd-primary-cta-label]');
    if (label) label.textContent = session.primary_cta ?? '';
    else if (!cta.querySelector('span')) cta.textContent = session.primary_cta ?? '';
  });

  setText('[data-rsd-about-heading]', session.about?.heading);
  setText('[data-rsd-about-intro]', session.about?.intro);

  const aboutSection = root.querySelector('.recorded-session-about');
  const aboutSupporting = root.querySelector('[data-rsd-about-supporting]');
  const aboutList = root.querySelector('[data-rsd-about-list]');
  const aboutBullets = session.about?.bullets ?? [];
  const hasAboutBullets = aboutBullets.length > 0;
  const hasAboutSupporting = Boolean(session.about?.supporting);

  if (aboutSupporting) {
    aboutSupporting.textContent = session.about?.supporting ?? '';
    aboutSupporting.hidden = !hasAboutSupporting;
  }

  if (aboutList) {
    if (!hasAboutBullets) {
      aboutList.innerHTML = '';
      aboutList.hidden = true;
    } else {
      aboutList.hidden = false;
      aboutList.innerHTML = aboutBullets
        .map(
          (bullet) =>
            `<li class="recorded-session-about__item">
              <span class="recorded-session-about__mark" aria-hidden="true"></span>
              <span class="recorded-session-about__text">${escapeHtml(bullet)}</span>
            </li>`,
        )
        .join('');
    }
  }

  if (aboutSection) {
    aboutSection.classList.toggle(
      'recorded-session-about--intro-only',
      !hasAboutBullets,
    );
  }

  const transformSection = root.querySelector('.recorded-session-transformation');
  const hasTransformation = Boolean(
    session.transformation &&
      (session.transformation.heading ||
        session.transformation.intro?.length ||
        session.transformation.bullets?.length ||
        session.transformation.closing?.length),
  );

  if (transformSection) {
    transformSection.hidden = !hasTransformation;
    if (!hasTransformation) {
      transformSection.setAttribute('aria-hidden', 'true');
    } else {
      transformSection.removeAttribute('aria-hidden');
    }
  }

  const fitMarker = root.querySelector('.recorded-session-fit .recorded-session-marker');
  if (fitMarker) {
    fitMarker.textContent = hasTransformation ? '03' : '02';
  }

  if (hasTransformation) {
    setText('[data-rsd-transform-heading]', session.transformation?.heading);
    const transformIntro = root.querySelector('[data-rsd-transform-intro]');
    if (transformIntro) {
      const intro = session.transformation?.intro;
      const lines = Array.isArray(intro) ? intro : intro ? [intro] : [];
      transformIntro.innerHTML = lines
        .map((line, i) => {
          const cls =
            i === lines.length - 1
              ? 'recorded-session-transformation__bridge'
              : 'recorded-session-transformation__intro';
          return `<p class="${cls}">${escapeHtml(line)}</p>`;
        })
        .join('');
    }

    const flowList = root.querySelector('[data-rsd-transform-flow]');
    if (flowList) {
      const bullets = session.transformation?.bullets ?? [];
      const flows = display.transformation_flow ?? [];
      const flowLabels = {
        prefix: display.flow_prefix || (locale === 'en' ? 'From' : 'من'),
        connector: display.flow_connector || (locale === 'en' ? 'to' : 'إلى'),
      };
      if (!bullets.length) {
        flowList.innerHTML = '';
        flowList.hidden = true;
      } else {
        flowList.hidden = false;
        flowList.innerHTML = bullets
          .map((bullet, index) => renderFlowRow(bullet, flows[index], flowLabels))
          .join('');
      }
    }

    const transformClosing = root.querySelector('[data-rsd-transform-closing]');
    if (transformClosing) {
      const closing = session.transformation?.closing;
      const lines = Array.isArray(closing) ? closing : closing ? [closing] : [];
      transformClosing.innerHTML = lines
        .map((line) => `<p class="recorded-session-transformation__closing">${escapeHtml(line)}</p>`)
        .join('');
    }
  } else {
    const transformIntro = root.querySelector('[data-rsd-transform-intro]');
    const flowList = root.querySelector('[data-rsd-transform-flow]');
    const transformClosing = root.querySelector('[data-rsd-transform-closing]');
    if (transformIntro) transformIntro.innerHTML = '';
    if (flowList) {
      flowList.innerHTML = '';
      flowList.hidden = true;
    }
    if (transformClosing) transformClosing.innerHTML = '';
    setText('[data-rsd-transform-heading]', '');
  }

  setText('[data-rsd-fit-heading]', session.fit?.heading);
  const fitList = root.querySelector('[data-rsd-fit-list]');
  if (fitList) {
    const check = iconCheckCircle('icon icon-sm recorded-session-fit__icon');
    fitList.innerHTML = (session.fit?.bullets ?? [])
      .map(
        (bullet) =>
          `<li class="recorded-session-fit__item">
            <span class="recorded-session-fit__mark" aria-hidden="true">${check}</span>
            <span class="recorded-session-fit__text">${escapeHtml(bullet)}</span>
          </li>`,
      )
      .join('');
  }

  setText('[data-rsd-cta-heading]', session.final_cta?.heading);
  const ctaTextHost = root.querySelector('[data-rsd-cta-text]');
  if (ctaTextHost) {
    const raw = session.final_cta?.text;
    const paragraphs = Array.isArray(raw) ? raw : raw ? [raw] : [];
    ctaTextHost.innerHTML = paragraphs
      .map((p) => `<p class="recorded-session-final-cta__text">${escapeHtml(p)}</p>`)
      .join('');
  }
  const ctaBtn = root.querySelector('[data-rsd-cta-button]');
  if (ctaBtn) {
    ctaBtn.setAttribute('href', buyUrl);
    ctaBtn.textContent = session.final_cta?.button ?? '';
  }

  updateDocumentMeta(session);
}

function renderNotFound(root, locale) {
  const found = root.querySelector('[data-rsd-found]');
  const missing = root.querySelector('[data-rsd-not-found]');
  if (found) found.hidden = true;
  if (missing) missing.hidden = false;

  const title =
    locale === 'en' ? 'Session not found' : 'الجلسة غير موجودة';
  const body =
    locale === 'en'
      ? 'This recorded session page is unavailable or the link is incorrect.'
      : 'تعذر العثور على هذه الجلسة المسجلة. قد يكون الرابط غير صحيح.';
  const back =
    locale === 'en' ? 'Back to recorded sessions' : 'العودة إلى الجلسات المسجلة';

  const titleEl = root.querySelector('[data-rsd-404-title]');
  const bodyEl = root.querySelector('[data-rsd-404-body]');
  const backEl = root.querySelector('[data-rsd-404-back]');
  if (titleEl) titleEl.textContent = title;
  if (bodyEl) bodyEl.textContent = body;
  if (backEl) {
    backEl.setAttribute('href', 'recorded-sessions.html');
    const label = backEl.querySelector('[data-rsd-404-back-label]');
    if (label) label.textContent = back;
  }

  document.title =
    locale === 'en'
      ? 'Session not found | Dr. Rana Mosaad'
      : 'الجلسة غير موجودة | Dr. Rana Mosaad';
}

export function refreshRecordedSessionDetails() {
  const root = document.querySelector('[data-recorded-session-root]');
  if (!root) return;

  const locale = getLocale();
  const slug = currentSlug();
  const session = getRecordedSessionDetailBySlug(slug, locale);

  if (!session) {
    renderNotFound(root, locale);
    return;
  }

  renderFound(root, session, locale);
  refreshReveals(root);
}

export function initRecordedSessionDetails() {
  const root = document.querySelector('[data-recorded-session-root]');
  if (!root) return;
  refreshRecordedSessionDetails();
}
