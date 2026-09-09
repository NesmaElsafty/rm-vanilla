/**
 * Rich Training Programs — registry + structure routing.
 *
 * Homepage cards / seeders remain in data/programs.js.
 * Rich Programs declare structure_type; getProgramDetailPage() resolves the page.
 *
 * Arabic is owner source-of-truth — do not rewrite, shorten, or correct.
 *
 * =============================================================================
 * structure_type → page
 * =============================================================================
 *
 *   master-program             → programs-details.html
 *   methodology-journey        → programs-methodology-details.html
 *   transformation-journey     → programs-transformation-details.html
 *   spiritual-journey          → programs-spiritual-details.html
 *   practical-course           → programs-practical-details.html
 *   feminine-healing-journey   → programs-feminine-details.html
 *
 * Future Laravel/Admin: client picks a Program Structure; fields follow that type.
 *
 * =============================================================================
 * Master ProgramDetail schema (structure_type: 'master-program')
 * =============================================================================
 * See data/programs-details-nlp.js
 *
 * =============================================================================
 * Methodology Journey schema (structure_type: 'methodology-journey')
 * =============================================================================
 *
 * ProgramDetail {
 *   slug, structure_type,
 *   seo, hero, pain,
 *   perspective: { heading, content_blocks },
 *   promise: { heading, intro, flows, simplified_label?, closing_blocks? },
 *   audience,
 *   curriculum: {
 *     heading, supporting_title?, intro_blocks?,
 *     modules: [{ order, title, subtitle?, content_blocks }],
 *     powerful_block?: {
 *       heading, intro_blocks?, bullets?, simplified_label?, closing_blocks?
 *     }
 *   },
 *   differentiator: {
 *     heading, supporting_line?, subheading?, content_blocks
 *   },
 *   methodology_description: { heading, content_blocks },
 *   trainer: { heading, content_blocks },
 *   results: { heading, intro?, bullets },
 *   faq: { heading, items: [{ question, answer_blocks }] },
 *   final_cta, purchase, display
 * }
 *
 * =============================================================================
 * Transformation Journey schema (structure_type: 'transformation-journey')
 * =============================================================================
 * See data/programs-details-new-version.js
 *
 * =============================================================================
 * Spiritual Journey schema (structure_type: 'spiritual-journey')
 * =============================================================================
 * See data/programs-details-mottasel.js
 *
 * =============================================================================
 * Practical Course schema (structure_type: 'practical-course')
 * =============================================================================
 * See data/programs-details-self-confidence.js
 *
 * =============================================================================
 * Feminine Healing Journey schema (structure_type: 'feminine-healing-journey')
 * =============================================================================
 * See data/programs-details-ana-ontha.js
 *
 * Styling / rendering depend on structure_type — never on slug.
 */

import { NLP_PROGRAM_AR, NLP_PROGRAM_EN } from './programs-details-nlp.js';
import { APG_PROGRAM_AR, APG_PROGRAM_EN } from './programs-details-apg.js';
import {
  NEW_VERSION_PROGRAM_AR,
  NEW_VERSION_PROGRAM_EN,
} from './programs-details-new-version.js';
import {
  MOTTASEL_PROGRAM_AR,
  MOTTASEL_PROGRAM_EN,
} from './programs-details-mottasel.js';
import {
  SELF_CONFIDENCE_PROGRAM_AR,
  SELF_CONFIDENCE_PROGRAM_EN,
} from './programs-details-self-confidence.js';
import {
  ANA_ONTHA_PROGRAM_AR,
  ANA_ONTHA_PROGRAM_EN,
} from './programs-details-ana-ontha.js';

/** Maps structure_type → HTML template. Extend when adding new structures. */
export const PROGRAM_STRUCTURE_PAGES = {
  'master-program': 'programs-details.html',
  'methodology-journey': 'programs-methodology-details.html',
  'transformation-journey': 'programs-transformation-details.html',
  'spiritual-journey': 'programs-spiritual-details.html',
  'practical-course': 'programs-practical-details.html',
  'feminine-healing-journey': 'programs-feminine-details.html',
};

const STRUCTURE_MASTER = 'master-program';

function withStructureType(record, structure_type) {
  if (record?.structure_type) return record;
  return { ...record, structure_type };
}

const PROGRAMS_DETAILS_AR = [
  withStructureType(NLP_PROGRAM_AR, STRUCTURE_MASTER),
  APG_PROGRAM_AR,
  NEW_VERSION_PROGRAM_AR,
  ANA_ONTHA_PROGRAM_AR,
  MOTTASEL_PROGRAM_AR,
  SELF_CONFIDENCE_PROGRAM_AR,
];

const PROGRAMS_DETAILS_EN = [
  withStructureType(NLP_PROGRAM_EN, STRUCTURE_MASTER),
  APG_PROGRAM_EN,
  NEW_VERSION_PROGRAM_EN,
  ANA_ONTHA_PROGRAM_EN,
  MOTTASEL_PROGRAM_EN,
  SELF_CONFIDENCE_PROGRAM_EN,
];

const bySlug = {
  ar: Object.fromEntries(PROGRAMS_DETAILS_AR.map((item) => [item.slug, item])),
  en: Object.fromEntries(PROGRAMS_DETAILS_EN.map((item) => [item.slug, item])),
};

/** Legacy slug redirects for backward URL compatibility. */
const PROGRAM_SLUG_ALIASES = {
  'i-am-female': 'ana-ontha',
};

/** Slugs registered in any rich Program structure. */
export const PROGRAM_NEW_TEMPLATE_SLUGS = new Set(
  PROGRAMS_DETAILS_AR.map((item) => item.slug),
);

export function usesRichProgramTemplate(slug) {
  const mapped = PROGRAM_SLUG_ALIASES[slug] || slug;
  return PROGRAM_NEW_TEMPLATE_SLUGS.has(mapped);
}

/** Alias kept for call-site clarity. */
export function usesProgramNewTemplate(slug) {
  return usesRichProgramTemplate(slug);
}

export function getProgramStructureType(slug) {
  return getProgramDetailBySlug(slug, 'ar')?.structure_type;
}

export function getProgramDetailPage(slug) {
  const structureType = getProgramStructureType(slug);
  if (!structureType) return 'index.html#programs';
  return PROGRAM_STRUCTURE_PAGES[structureType] || 'index.html#programs';
}

export function getProgramDetailBySlug(slug, locale = 'ar') {
  if (!slug) return undefined;
  const resolved = locale === 'en' ? 'en' : 'ar';
  const mappedSlug = PROGRAM_SLUG_ALIASES[slug] || slug;
  return bySlug[resolved][mappedSlug] ?? bySlug.ar[mappedSlug];
}

export function getProgramDetails(locale = 'ar') {
  const resolved = locale === 'en' ? 'en' : 'ar';
  return PROGRAMS_DETAILS_AR.map((arRecord) => {
    const enRecord = bySlug.en[arRecord.slug];
    if (resolved === 'en' && enRecord) return enRecord;
    return arRecord;
  });
}
