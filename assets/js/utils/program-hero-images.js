/**
 * Deterministic detail-page Hero images from the Programs visual pool.
 * Same slug → same image (AR/EN, refresh, theme). No Math.random().
 */

export const PROGRAM_HERO_IMAGES = [
  'assets/images/programs/program-ana-ontha.png',
  'assets/images/programs/program-confidence.png',
  'assets/images/programs/program-mottasel.png',
  'assets/images/programs/program-new-version.png',
  'assets/images/programs/program-nlp.png',
  'assets/images/programs/program-self-leadership.png',
];

/** Prefer exact brand art for known program slugs when available. */
const HERO_BY_SLUG = {
  'ana-ontha': 'assets/images/programs/program-ana-ontha.png',
  'i-am-female': 'assets/images/programs/program-ana-ontha.png',
  'new-version-of-yourself': 'assets/images/programs/program-new-version.png',
  'self-confidence': 'assets/images/programs/program-confidence.png',
  mottasel: 'assets/images/programs/program-mottasel.png',
  nlp: 'assets/images/programs/program-nlp.png',
  apg: 'assets/images/programs/program-self-leadership.png',
};

const FALLBACK_PROGRAM_HERO = 'assets/images/programs/program-new-version.png';

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
