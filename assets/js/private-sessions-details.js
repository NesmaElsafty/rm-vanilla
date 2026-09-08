import { getLocale } from './language.js';
import {
  getPrivateSessionDetailBySlug,
} from '../../data/private-sessions-details.js';
import {
  iconChevronDown,
  iconArrowLeft,
  iconArrowRight,
  iconCheckCircle,
} from './icons.js';
import { getProgramHeroImage } from './utils/program-hero-images.js';

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

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

function toDisplayNum(n, useArabic) {
  const raw = String(n).padStart(2, '0');
  if (!useArabic) return raw;
  return raw
    .split('')
    .map((d) => ARABIC_DIGITS[Number(d)] ?? d)
    .join('');
}

function bookingHref(target) {
  return `index.html?scroll=contact&session=${encodeURIComponent(target)}`;
}

function emphasizeText(text, phrases = []) {
  let html = escapeHtml(text);
  const ordered = [...phrases]
    .filter(Boolean)
    .sort((a, b) => String(b).length - String(a).length);
  ordered.forEach((phrase) => {
    const needle = escapeHtml(phrase);
    if (!needle || !html.includes(needle)) return;
    html = html.replace(
      needle,
      `<span class="private-session-em">${needle}</span>`,
    );
  });
  return html;
}

function updateDocumentMeta(session) {
  const siteName = 'Dr. Rana Mosaad';
  const title = session?.session_name
    ? `${session.session_name} | ${siteName}`
    : document.title;
  document.title = title;

  const description = Array.isArray(session?.description)
    ? session.description.join(' ')
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
    ? `private-sessions-details.html?slug=${encodeURIComponent(slug)}`
    : 'private-sessions-details.html';
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
  // Exact wording preserved; only visual line breaks/styling.
  return `<span class="private-session-hero__compose">
    <span class="private-session-hero__compose-from">${escapeHtml(fromWord)} ${escapeHtml(before)}</span>
    <span class="private-session-hero__compose-to">${escapeHtml(toWord)}</span>
    <span class="private-session-hero__compose-clarity">${escapeHtml(after)}</span>
  </span>`;
}

function renderJourneyIntro(intro, emphasis = []) {
  return emphasizeText(intro, emphasis);
}

function renderFlowRow(bullet, flow, labels = {}) {
  const full = escapeHtml(bullet);
  const prefix = labels.prefix || 'من';
  const connector = labels.connector || 'إلى';
  if (!flow?.from || !flow?.to) {
    return `<li class="private-session-flow__item">
      <span class="private-session-flow__full">${full}</span>
    </li>`;
  }

  return `<li class="private-session-flow__item">
    <p class="private-session-flow__row">
      <span class="private-session-flow__before">
        <span class="private-session-flow__prefix">${escapeHtml(prefix)}</span>
        <span class="private-session-flow__from">${escapeHtml(flow.from)}</span>
      </span>
      <span class="private-session-flow__mid">
        <span class="private-session-flow__connector">${escapeHtml(connector)}</span>
        <span class="private-session-flow__line" aria-hidden="true"></span>
      </span>
      <span class="private-session-flow__after">
        <span class="private-session-flow__to">${escapeHtml(flow.to)}</span>
      </span>
    </p>
  </li>`;
}

function renderFound(root, session, locale) {
  const rtl = locale !== 'en';
  const display = session.display ?? {};
  const bookingTarget = session.booking?.target || session.slug;
  const bookUrl = bookingHref(bookingTarget);

  const found = root.querySelector('[data-ps-found]');
  const missing = root.querySelector('[data-ps-not-found]');
  if (found) found.hidden = false;
  if (missing) missing.hidden = true;

  const setText = (sel, value) => {
    const el = root.querySelector(sel);
    if (el) el.textContent = value ?? '';
  };

  setText(
    '[data-ps-eyebrow]',
    display.eyebrow || (locale === 'en' ? 'Private Session' : 'جلسة خاصة'),
  );
  setText('[data-ps-session-name]', session.session_name);

  const titleEl = root.querySelector('[data-ps-transformation-title]');
  if (titleEl) {
    titleEl.innerHTML = renderTransformationTitle(session.transformation_title, locale);
  }

  const heroImage = root.querySelector('[data-ps-hero-image]');
  if (heroImage) {
    heroImage.setAttribute('src', getProgramHeroImage(session.slug));
    heroImage.setAttribute('alt', session.session_name || '');
  }

  const descEl = root.querySelector('[data-ps-description]');
  if (descEl) {
    const paragraphs = session.description ?? [];
    descEl.innerHTML = paragraphs
      .map((p, i) => {
        const cls =
          i === 0
            ? 'private-session-hero__question'
            : 'private-session-hero__body';
        return `<p class="${cls}">${escapeHtml(p)}</p>`;
      })
      .join('');
  }

  const detailsBtn = root.querySelector('[data-ps-details-btn]');
  if (detailsBtn) {
    detailsBtn.setAttribute('href', '#journey');
    const label = detailsBtn.querySelector('[data-ps-details-label]');
    if (label) label.textContent = session.details_button ?? '';
    const iconHost = detailsBtn.querySelector('[data-ps-details-icon]');
    if (iconHost) iconHost.innerHTML = iconChevronDown('icon icon-sm');
  }

  setText('[data-ps-journey-heading]', session.journey?.heading);
  const sessionCount = Number(session.journey?.session_count) || 4;
  setText('[data-ps-journey-badge-num]', toDisplayNum(sessionCount, rtl));
  const badgePhrase =
    (display.journey_intro_emphasis && display.journey_intro_emphasis[0]) ||
    (locale === 'en'
      ? `${sessionCount} private one-on-one sessions`
      : `${sessionCount} جلسات فردية خاصه`);
  const badgeLabel =
    session.journey?.badge_label ||
    String(badgePhrase).replace(/^\d+\s*/, '');
  setText('[data-ps-journey-badge-label]', badgeLabel);

  const journeyIntro = root.querySelector('[data-ps-journey-intro]');
  if (journeyIntro) {
    journeyIntro.innerHTML = renderJourneyIntro(
      session.journey?.intro,
      display.journey_intro_emphasis,
    );
  }
  setText('[data-ps-journey-supporting]', session.journey?.supporting);

  const journeyList = root.querySelector('[data-ps-journey-list]');
  if (journeyList) {
    const bullets = session.journey?.bullets ?? [];
    journeyList.innerHTML = bullets
      .map((bullet, index) => {
        const num = toDisplayNum(index + 1, rtl);
        return `<li class="private-session-journey__item">
          <span class="private-session-journey__num">${num}</span>
          <span class="private-session-journey__connector" aria-hidden="true"></span>
          <p class="private-session-journey__text">${escapeHtml(bullet)}</p>
        </li>`;
      })
      .join('');
  }

  setText('[data-ps-pain-heading]', session.pain?.heading);
  setText('[data-ps-pain-intro]', session.pain?.intro);
  const painList = root.querySelector('[data-ps-pain-list]');
  if (painList) {
    painList.innerHTML = (session.pain?.bullets ?? [])
      .map(
        (bullet) =>
          `<li class="private-session-pain__item">
            <span class="private-session-pain__mark" aria-hidden="true"></span>
            <span class="private-session-pain__text">${escapeHtml(bullet)}</span>
          </li>`,
      )
      .join('');
  }
  const painClosing = root.querySelector('[data-ps-pain-closing]');
  if (painClosing) {
    const closing = String(session.pain?.closing ?? '');
    painClosing.innerHTML = closing
      .split('\n')
      .map((line) => `<span class="private-session-pain__closing-line">${escapeHtml(line)}</span>`)
      .join('');
  }

  setText('[data-ps-transform-heading]', session.transformation?.heading);
  const transformSection = root.querySelector('.private-session-transformation');
  const transformBullets = session.transformation?.bullets ?? [];
  const hasFlowRows = transformBullets.length > 0;
  if (transformSection) {
    transformSection.classList.toggle(
      'private-session-transformation--text-only',
      !hasFlowRows,
    );
  }

  const transformIntro = root.querySelector('[data-ps-transform-intro]');
  if (transformIntro) {
    const intro = session.transformation?.intro;
    const lines = Array.isArray(intro) ? intro : intro ? [intro] : [];
    transformIntro.innerHTML = lines
      .map((line, i) => {
        let cls = 'private-session-transformation__intro';
        if (hasFlowRows && i > 0) {
          cls = 'private-session-transformation__bridge';
        }
        return `<p class="${cls}">${escapeHtml(line)}</p>`;
      })
      .join('');
  }

  const flowList = root.querySelector('[data-ps-transform-flow]');
  if (flowList) {
    if (!hasFlowRows) {
      flowList.innerHTML = '';
      flowList.hidden = true;
    } else {
      flowList.hidden = false;
      const flows = display.transformation_flow ?? [];
      const flowLabels = {
        prefix: display.flow_prefix || (locale === 'en' ? 'From' : 'من'),
        connector: display.flow_connector || (locale === 'en' ? 'to' : 'إلى'),
      };
      flowList.innerHTML = transformBullets
        .map((bullet, index) => renderFlowRow(bullet, flows[index], flowLabels))
        .join('');
    }
  }

  const transformClosing = root.querySelector('[data-ps-transform-closing]');
  if (transformClosing) {
    const closing = session.transformation?.closing;
    const lines = Array.isArray(closing) ? closing : closing ? [closing] : [];
    transformClosing.innerHTML = lines
      .map((line, index) => {
        const outcomeClass =
          !hasFlowRows && index === lines.length - 1
            ? ' private-session-transformation__closing--outcome'
            : '';
        return `<p class="private-session-transformation__closing${outcomeClass}">${escapeHtml(line)}</p>`;
      })
      .join('');
  }

  setText('[data-ps-fit-heading]', session.fit?.heading);
  const fitList = root.querySelector('[data-ps-fit-list]');
  if (fitList) {
    const check = iconCheckCircle('icon icon-sm private-session-fit__icon');
    fitList.innerHTML = (session.fit?.bullets ?? [])
      .map(
        (bullet) =>
          `<li class="private-session-fit__item">
            <span class="private-session-fit__mark" aria-hidden="true">${check}</span>
            <span class="private-session-fit__text">${escapeHtml(bullet)}</span>
          </li>`,
      )
      .join('');
  }

  setText('[data-ps-cta-heading]', session.final_cta?.heading);
  const ctaTextHost = root.querySelector('[data-ps-cta-text]');
  if (ctaTextHost) {
    const raw = session.final_cta?.text;
    const paragraphs = Array.isArray(raw) ? raw : raw ? [raw] : [];
    ctaTextHost.innerHTML = paragraphs
      .map((p) => `<p class="private-session-final-cta__text">${escapeHtml(p)}</p>`)
      .join('');
  }
  const ctaBtn = root.querySelector('[data-ps-cta-button]');
  if (ctaBtn) {
    ctaBtn.setAttribute('href', bookUrl);
    ctaBtn.textContent = session.final_cta?.button ?? '';
  }

  updateDocumentMeta(session);
}

function renderNotFound(root, locale) {
  const found = root.querySelector('[data-ps-found]');
  const missing = root.querySelector('[data-ps-not-found]');
  if (found) found.hidden = true;
  if (missing) missing.hidden = false;

  const title =
    locale === 'en' ? 'Session not found' : 'الجلسة غير موجودة';
  const body =
    locale === 'en'
      ? 'This private session page is unavailable or the link is incorrect.'
      : 'تعذر العثور على هذه الجلسة الخاصة. قد يكون الرابط غير صحيح.';
  const back =
    locale === 'en' ? 'Back to programs' : 'العودة إلى البرامج';

  const titleEl = root.querySelector('[data-ps-404-title]');
  const bodyEl = root.querySelector('[data-ps-404-body]');
  const backEl = root.querySelector('[data-ps-404-back]');
  if (titleEl) titleEl.textContent = title;
  if (bodyEl) bodyEl.textContent = body;
  if (backEl) {
    backEl.setAttribute('href', 'index.html#programs');
    const label = backEl.querySelector('[data-ps-404-back-label]');
    if (label) label.textContent = back;
    const icon = backEl.querySelector('[data-ps-404-back-icon]');
    if (icon) {
      icon.innerHTML =
        locale === 'en'
          ? iconArrowLeft('icon icon-sm')
          : iconArrowRight('icon icon-sm');
    }
  }

  document.title =
    locale === 'en'
      ? 'Session not found | Dr. Rana Mosaad'
      : 'الجلسة غير موجودة | Dr. Rana Mosaad';
}

function bindSmoothJourneyAnchor(root) {
  root.querySelectorAll('a[href="#journey"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.getElementById('journey');
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `${location.pathname}${location.search}#journey`);
    });
  });
}

export function refreshPrivateSessionDetails() {
  const root = document.querySelector('[data-private-session-root]');
  if (!root) return;

  const locale = getLocale();
  const slug = currentSlug();
  const session = getPrivateSessionDetailBySlug(slug, locale);

  if (!session) {
    renderNotFound(root, locale);
    return;
  }

  renderFound(root, session, locale);
}

export function initPrivateSessionDetails() {
  const root = document.querySelector('[data-private-session-root]');
  if (!root) return;

  refreshPrivateSessionDetails();
  bindSmoothJourneyAnchor(root);
}
