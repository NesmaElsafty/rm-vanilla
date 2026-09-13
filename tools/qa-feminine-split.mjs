import fs from 'fs';
import {
  getProgramDetailBySlug,
  getProgramDetailPage,
  usesRichProgramTemplate,
  PROGRAM_STRUCTURE_PAGES,
} from '../data/programs-details.js';
import { getProgramHeroImage } from '../assets/js/utils/program-hero-images.js';

const ar = getProgramDetailBySlug('ana-ontha', 'ar');
const checks = {
  structure: ar.structure_type === 'feminine-healing-journey',
  title: ar.hero.title === 'أنا انثي',
  supporting: ar.hero.supporting_line.includes('فطرتك الأنثوية'),
  noPopup: !ar.popup,
  pain7: ar.pain.bullets.length === 7,
  flows7: ar.transformation.flows.length === 7,
  pillars5: ar.pillars.items.length === 5,
  examples: (ar.pillars.items[0].examples || []).length > 0,
  features7: ar.differentiator.features.length === 7,
  noDelivery: !ar.delivery,
  noContinuation: !ar.continuation_popup,
};

console.log('AR content', Object.values(checks).every(Boolean), checks);
console.log('routing', {
  ana: getProgramDetailPage('ana-ontha'),
  alias: getProgramDetailPage('i-am-female'),
  nv: getProgramDetailPage('new-version-of-yourself'),
  richAlias: usesRichProgramTemplate('i-am-female'),
  map: PROGRAM_STRUCTURE_PAGES['feminine-healing-journey'],
});
console.log('hero', getProgramHeroImage('ana-ontha'));

const tjs = fs.readFileSync(
  new URL('../assets/js/programs-transformation-details.js', import.meta.url),
  'utf8',
);
const forbidden = [
  'working_on_label',
  'working_on_items',
  'examples_label',
  'result_label',
  'program?.popup',
  'section_label',
  'action_intro',
  'action_items',
];
console.log(
  'transform forbidden hits',
  forbidden.filter((f) => tjs.includes(f)),
);

const fjs = fs.readFileSync(
  new URL('../assets/js/programs-feminine-details.js', import.meta.url),
  'utf8',
);
console.log('feminine slug branch', /slug === ['"]ana-ontha['"]/.test(fjs));

const css = fs.readFileSync(
  new URL('../assets/css/pages.css', import.meta.url),
  'utf8',
);
console.log('css', {
  feminineResult: css.includes('.program-feminine-pillars__result'),
  transformResult: css.includes('.program-transform-pillars__result'),
  femininePage: css.includes('.program-feminine-page'),
});
