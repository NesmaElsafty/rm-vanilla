export const RETREAT_SLUG = 'upcoming';

export const RETREAT_HERO_IMAGE = 'assets/images/gallery/retreat/retreat-hero.png';

export const RETREAT_GALLERY_IMAGES = [
  'assets/images/gallery/retreat/retreat-1.png',
  'assets/images/gallery/retreat/retreat-2.png',
  'assets/images/gallery/retreat/retreat-3.png',
  'assets/images/gallery/retreat/retreat-4.png',
  'assets/images/gallery/retreat/retreat-5.png',
  'assets/images/gallery/retreat/retreat-6.png',
  'assets/images/gallery/retreat/retreat-7.png',
  'assets/images/gallery/retreat/retreat-8.png',
];

function buildRetreat() {
  return {
    slug: RETREAT_SLUG,
    image: RETREAT_HERO_IMAGE,
    hero: RETREAT_HERO_IMAGE,
    gallery: [...RETREAT_GALLERY_IMAGES],
  };
}

export function getRetreats(_locale = 'ar') {
  return [buildRetreat()];
}

export function getRetreatBySlug(slug, _locale = 'ar') {
  if (slug !== RETREAT_SLUG) return undefined;
  return buildRetreat();
}

export function getRetreatCards(_locale = 'ar') {
  return getRetreats().map((retreat) => ({
    slug: retreat.slug,
    title: retreat.slug,
    description: '',
    button_text: '',
    image: retreat.image,
  }));
}

export function getRetreatGalleryImages() {
  return [...RETREAT_GALLERY_IMAGES];
}
