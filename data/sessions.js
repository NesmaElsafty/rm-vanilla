import sessionsSeeder from './sessions-seeder.js';
import sessionsSeederEn from './sessions-seeder.en.js';

const IMAGE_BY_SLUG = {
  'restore-confidence-self-worth': 'assets/images/sessions/session-restore-confidence.png',
  'emotional-need-attachment-release': 'assets/images/sessions/session-emotional-attachment.png',
  'private-journey-1-to-1': 'assets/images/sessions/session-private-journey.png',
  'return-to-god-inner-peace': 'assets/images/sessions/session-return-to-god.png',
  'clarity-inner-doubt-release': 'assets/images/sessions/session-clarity-inner-doubt.png',
  'healing-roots-old-wounds': 'assets/images/sessions/session-healing-roots.png',
};

const DEFAULT_SESSION_IMAGE = 'assets/images/session-detail-hero-portrait.png';

const landingPages = sessionsSeeder.private_sessions_landing_pages;
const homeCards = sessionsSeeder.private_sessions_home_cards;
const enLandingBySlug = Object.fromEntries(
  sessionsSeederEn.private_sessions_landing_pages.map((record) => [record.slug, record]),
);
const enHomeCardsBySlug = Object.fromEntries(
  sessionsSeederEn.private_sessions_home_cards.map((card) => [card.slug, card]),
);

function resolveSessionButtonText(slug, locale) {
  if (locale === 'en') {
    return enHomeCardsBySlug[slug]?.button_text ?? 'Learn More';
  }
  const card = homeCards.find((item) => item.slug === slug);
  return card?.button_text ?? 'اعرف التفاصيل';
}

function buildSession(record, locale) {
  const en = locale === 'en' ? enLandingBySlug[record.slug] : undefined;
  const content = en ? { ...record, ...en, slug: record.slug, type: record.type } : record;

  return {
    ...content,
    image: IMAGE_BY_SLUG[record.slug] ?? DEFAULT_SESSION_IMAGE,
    button_text: resolveSessionButtonText(record.slug, locale),
  };
}

export function getSessions(locale = 'ar') {
  return landingPages.map((session) => buildSession(session, locale));
}

export function getSessionBySlug(slug, locale = 'ar') {
  const record = landingPages.find((session) => session.slug === slug);
  if (!record) return undefined;
  return buildSession(record, locale);
}

export function getSessionCards(locale = 'ar') {
  if (locale === 'en') return sessionsSeederEn.private_sessions_home_cards;
  return homeCards;
}
