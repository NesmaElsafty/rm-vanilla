import recordedSessionsSeeder from './recorded-sessions-seeder.js';
import recordedSessionsSeederEn from './recorded-sessions-seeder.en.js';

const IMAGE_BY_SLUG = {
  'surrender-facing-challenges': 'assets/images/sessions/session-return-to-god.png',
  'reconcile-with-yourself': 'assets/images/sessions/session-restore-confidence.png',
  forgiveness: 'assets/images/sessions/session-healing-roots.png',
  'future-self-meeting': 'assets/images/sessions/session-clarity-inner-doubt.png',
};

const DEFAULT_IMAGE = 'assets/images/session-detail-hero-portrait.png';

const landingPages = recordedSessionsSeeder.recorded_sessions_landing_pages;
const homeCards = recordedSessionsSeeder.recorded_sessions_home_cards;
const enLandingBySlug = Object.fromEntries(
  recordedSessionsSeederEn.recorded_sessions_landing_pages.map((record) => [record.slug, record]),
);
const enHomeCardsBySlug = Object.fromEntries(
  recordedSessionsSeederEn.recorded_sessions_home_cards.map((card) => [card.slug, card]),
);

function resolveButtonText(slug, locale) {
  if (locale === 'en') {
    return enHomeCardsBySlug[slug]?.button_text ?? 'Learn More';
  }
  return homeCards.find((item) => item.slug === slug)?.button_text ?? 'اعرفي التفاصيل';
}

function buildSession(record, locale) {
  const en = locale === 'en' ? enLandingBySlug[record.slug] : undefined;
  const content = en
    ? { ...record, ...en, slug: record.slug, type: record.type, category_slug: record.category_slug }
    : record;

  return {
    ...content,
    image: IMAGE_BY_SLUG[record.slug] ?? DEFAULT_IMAGE,
    button_text: resolveButtonText(record.slug, locale),
  };
}

export function getRecordedSessionsCategory(locale = 'ar') {
  if (locale === 'en') return recordedSessionsSeederEn.recorded_sessions_category;
  return recordedSessionsSeeder.recorded_sessions_category;
}

export function getRecordedSessions(locale = 'ar') {
  return landingPages.map((session) => buildSession(session, locale));
}

export function getRecordedSessionBySlug(slug, locale = 'ar') {
  const record = landingPages.find((session) => session.slug === slug);
  if (!record) return undefined;
  return buildSession(record, locale);
}

export function getRecordedSessionCards(locale = 'ar') {
  if (locale === 'en') return recordedSessionsSeederEn.recorded_sessions_home_cards;
  return homeCards;
}
