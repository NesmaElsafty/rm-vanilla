import sessionsSeeder from './sessions-seeder.js';
import sessionsSeederEn from './sessions-seeder.en.js';
import { getProgramHeroImage } from '../assets/js/utils/program-hero-images.js';

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
    image: getProgramHeroImage(record.slug),
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
  const cards = locale === 'en' ? sessionsSeederEn.private_sessions_home_cards : homeCards;

  return cards.map((card) => ({
    slug: card.slug,
    title: card.title,
    description: card.description,
    button_text: card.button_text ?? resolveSessionButtonText(card.slug, locale),
    image: getProgramHeroImage(card.slug),
  }));
}
