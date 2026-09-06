import programsSeeder from './programs-seeder.js';
import programsSeederEn from './programs-seeder.en.js';

const IMAGE_BY_SLUG = {
  apg: 'assets/images/programs/program-self-leadership.png',
  nlp: 'assets/images/programs/program-nlp.png',
  'new-version-of-yourself': 'assets/images/programs/program-new-version.png',
  'i-am-female': 'assets/images/programs/program-ana-ontha.png',
  'self-confidence': 'assets/images/programs/program-confidence.png',
  mottasel: 'assets/images/programs/program-mottasel.png',
};

const BUTTON_TEXT_AR = {
  'i-am-female': 'اعرفي التفاصيل',
  mottasel: 'اعرفي التفاصيل',
};

const FLOATING_PROGRAMS_ORDER = [
  'mottasel',
  'new-version-of-yourself',
  'i-am-female',
  'self-confidence',
  'apg',
  'nlp',
];

const seederRecords = programsSeeder;
const enProgramsBySlug = Object.fromEntries(programsSeederEn.map((record) => [record.slug, record]));

function resolveButtonText(slug, locale) {
  if (locale === 'en') return 'Learn More';
  return BUTTON_TEXT_AR[slug] ?? 'اعرف التفاصيل';
}

function sortBySlugOrder(items, order) {
  const rank = new Map(order.map((slug, index) => [slug, index]));
  return [...items].sort(
    (a, b) => (rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER),
  );
}

function buildProgram(record, locale) {
  const en = locale === 'en' ? enProgramsBySlug[record.slug] : undefined;
  const content = en ? { ...record, ...en, slug: record.slug } : record;

  return {
    ...content,
    image: IMAGE_BY_SLUG[record.slug] ?? IMAGE_BY_SLUG.apg,
    button_text: resolveButtonText(record.slug, locale),
  };
}

export function getPrograms(locale = 'ar') {
  return sortBySlugOrder(
    seederRecords.map((record) => buildProgram(record, locale)),
    FLOATING_PROGRAMS_ORDER,
  );
}

export function getProgramBySlug(slug, locale = 'ar') {
  const record = seederRecords.find((program) => program.slug === slug);
  if (!record) return undefined;
  return buildProgram(record, locale);
}

export function getProgramCards(locale = 'ar') {
  return getPrograms(locale).map((program) => ({
    slug: program.slug,
    title: program.page_title,
    description: program.page_subtitle,
    button_text: program.button_text,
    image: program.image,
  }));
}

/** Arabic: "في ٣ شهور" → "٣ شهور". English: "An 8-week journey..." → "8 weeks" */
export function getProgramDuration(pageSubtitle, locale = 'ar') {
  if (!pageSubtitle) return null;

  if (locale === 'en') {
    const inMatch = pageSubtitle.match(/\bin\s+(\d[\d\s-]*(?:weeks?|days?|months?))/i);
    if (inMatch) return inMatch[1].trim();
    const anMatch = pageSubtitle.match(/\b(?:an|a)\s+(\d[\d-]*(?:week|day|month)[\w-]*)/i);
    if (anMatch) return anMatch[1].trim();
    return null;
  }

  const match = pageSubtitle.match(/في\s+(.+)$/);
  return match?.[1]?.trim() ?? null;
}
