export const PROGRAM_HERO_IMAGES = [
  'assets/images/programs/program-ana-ontha.webp',
  'assets/images/programs/program-confidence.webp',
  'assets/images/programs/program-mottasel.webp',
  'assets/images/programs/program-new-version.webp',
  'assets/images/programs/program-nlp.webp',
  'assets/images/programs/program-self-leadership.webp',
];

/** Prefer exact brand art for known program slugs when available. */
const HERO_BY_SLUG = {
  'ana-ontha': 'assets/images/programs/program-ana-ontha.webp',
  'i-am-female': 'assets/images/programs/program-ana-ontha.webp',
  'new-version-of-yourself': 'assets/images/programs/program-new-version.webp',
  'self-confidence': 'assets/images/programs/program-confidence.webp',
  mottasel: 'assets/images/programs/program-mottasel.webp',
  nlp: 'assets/images/programs/program-nlp.webp',
  apg: 'assets/images/programs/program-self-leadership.webp',
};

const FALLBACK_PROGRAM_HERO = 'assets/images/programs/program-new-version.webp';

function hashString(value) {
  let hash = 0;
  const source = String(value ?? '');
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash << 5) - hash + source.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function asWebp(path) {
  return String(path ?? '').replace(/\.(png|jpe?g)$/i, '.webp');
}

/**
 * @param {string} [slug]
 * @returns {string} path under assets/images/programs/
 */
export function getProgramHeroImage(slug = '') {
  const key = String(slug ?? '').trim();
  if (!key || !PROGRAM_HERO_IMAGES.length) {
    return asWebp(PROGRAM_HERO_IMAGES[0] || FALLBACK_PROGRAM_HERO);
  }
  if (HERO_BY_SLUG[key]) return asWebp(HERO_BY_SLUG[key]);
  const index = hashString(key) % PROGRAM_HERO_IMAGES.length;
  return asWebp(PROGRAM_HERO_IMAGES[index] || FALLBACK_PROGRAM_HERO);
}

/** Alias kept for call-site clarity; identical to getProgramHeroImage. */
export function getRandomProgramHeroImage(slug = '') {
  return getProgramHeroImage(slug);
}
