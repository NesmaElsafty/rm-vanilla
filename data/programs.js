import programsSeeder from './programs-seeder.js';
import programsSeederEn from './programs-seeder.en.js';

const IMAGE_BY_SLUG = {
  apg: 'assets/images/programs/program-self-leadership.webp',
  nlp: 'assets/images/programs/program-nlp.webp',
  'new-version-of-yourself': 'assets/images/programs/program-new-version.webp',
  'i-am-female': 'assets/images/programs/program-ana-ontha.webp',
  'ana-ontha': 'assets/images/programs/program-ana-ontha.webp',
  'self-confidence': 'assets/images/programs/program-confidence.webp',
  mottasel: 'assets/images/programs/program-mottasel.webp',
};

const BUTTON_TEXT_AR = {
  'i-am-female': 'اعرف التفاصيل',
  mottasel: 'اعرف التفاصيل',
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
