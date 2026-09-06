import workshopsSeeder from './workshops-seeder.js';
import workshopsSeederEn from './workshops-seeder.en.js';

const IMAGE_BY_SLUG = {
  'you-first': 'assets/images/programs/program-confidence.png',
  'emotional-management-secret': 'assets/images/sessions/session-emotional-attachment.png',
  'feminine-code': 'assets/images/programs/program-ana-ontha.png',
};

const WORKSHOPS_ORDER = ['you-first', 'emotional-management-secret', 'feminine-code'];

const seederRecords = workshopsSeeder.workshops;
const homeCardsBySlug = Object.fromEntries(workshopsSeeder.home_cards.map((card) => [card.slug, card]));
const enWorkshopsBySlug = Object.fromEntries(workshopsSeederEn.workshops.map((record) => [record.slug, record]));
const enHomeCardsBySlug = Object.fromEntries(workshopsSeederEn.home_cards.map((card) => [card.slug, card]));

function sortBySlugOrder(items, order) {
  const rank = new Map(order.map((slug, index) => [slug, index]));
  return [...items].sort(
    (a, b) => (rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER),
  );
}

function buildWorkshop(record, locale) {
  const en = locale === 'en' ? enWorkshopsBySlug[record.slug] : undefined;
  const content = en ? { ...record, ...en, slug: record.slug } : record;
  const card = locale === 'en' ? enHomeCardsBySlug[record.slug] : homeCardsBySlug[record.slug];

  return {
    ...content,
    image: IMAGE_BY_SLUG[record.slug] ?? IMAGE_BY_SLUG['you-first'],
    button_text: card?.button_text ?? (locale === 'en' ? 'Learn More' : 'اعرف التفاصيل'),
  };
}

export function getWorkshops(locale = 'ar') {
  return sortBySlugOrder(
    seederRecords.map((record) => buildWorkshop(record, locale)),
    WORKSHOPS_ORDER,
  );
}

export function getWorkshopBySlug(slug, locale = 'ar') {
  const record = seederRecords.find((workshop) => workshop.slug === slug);
  if (!record) return undefined;
  return buildWorkshop(record, locale);
}

export function getWorkshopCards(locale = 'ar') {
  const cards = locale === 'en' ? enHomeCardsBySlug : homeCardsBySlug;

  return getWorkshops(locale).map((workshop) => {
    const card = cards[workshop.slug];
    return {
      slug: workshop.slug,
      title: card?.title ?? workshop.page_title,
      description: card?.description ?? workshop.page_subtitle,
      button_text: card?.button_text ?? workshop.button_text,
      image: workshop.image,
    };
  });
}

export function getWorkshopDuration(workshop, locale = 'ar') {
  if (workshop?.duration) return workshop.duration;

  const pageSubtitle = workshop?.page_subtitle ?? '';
  if (!pageSubtitle) return null;

  if (locale === 'en') {
    const hourMatch = pageSubtitle.match(/(\d[\d-]*\s*-?\s*hour)/i);
    if (hourMatch) return hourMatch[1].trim();
    const dayMatch = pageSubtitle.match(/(\d[\d-]*\s*-?\s*day)/i);
    if (dayMatch) return dayMatch[1].trim();
    return null;
  }

  const match = pageSubtitle.match(/في\s+(.+)$/);
  return match?.[1]?.trim() ?? null;
}
