/**
 * Rich Training Programs — Master schema registry.
 *
 * Legacy data/programs.js + seeders remain for program-detail.html.
 * Only migrated slugs use programs-details.html via getProgramDetailPage().
 *
 * Arabic is owner source-of-truth — do not rewrite, shorten, or correct.
 *
 * =============================================================================
 * Master ProgramDetail schema (ALL rich Programs share this shape)
 * =============================================================================
 *
 * ProgramDetail {
 *   slug: string
 *   seo: { title, description }
 *   hero: {
 *     eyebrow, title, supporting_line,
 *     description_blocks: ContentBlock[],
 *     primary_cta, secondary_cta?
 *   }
 *   pain: {
 *     heading, intro, bullets: string[],
 *     closing_blocks: ContentBlock[]
 *   }
 *   importance: {
 *     heading,
 *     content_blocks: ContentBlock[]
 *   }
 *   transformation: {
 *     heading, intro,
 *     flows: [{ from, to }],
 *     simplified_label?,
 *     closing_blocks: ContentBlock[]
 *   }
 *   audience: {
 *     heading, intro, bullets: string[],
 *     not_for: { heading, intro, bullets: string[] }
 *   }
 *   curriculum: {
 *     heading, supporting_title?,
 *     intro_blocks?: ContentBlock[],
 *     modules: [{
 *       order, title, subtitle?,
 *       content_blocks: ContentBlock[]
 *     }]
 *   }
 *   differentiator: {
 *     heading, supporting_line?, subheading?,
 *     content_blocks: ContentBlock[],
 *     secondary_block?: { heading, content_blocks: ContentBlock[] }
 *   }
 *   results: { heading, intro?, bullets: string[] }
 *   why_choose: {
 *     heading,
 *     intro_blocks: ContentBlock[],
 *     bullets: string[],
 *     simplified_label?,
 *     closing_blocks: ContentBlock[]
 *   }
 *   trainer: {
 *     heading, subheading?,
 *     content_blocks: ContentBlock[]
 *   }
 *   faq: {
 *     heading,
 *     items: [{ question, answer_blocks: ContentBlock[] }]
 *   }
 *   gallery: { images: string[] }   // empty → section hidden
 *   final_cta: {
 *     heading, supporting_line?, pre_bullets_label?,
 *     bullets?: string[],
 *     closing_blocks?: ContentBlock[],
 *     primary_cta, secondary_cta?
 *   }
 *   purchase: { target: string }
 *   display: { flow_to, not_found_title, not_found_body, not_found_back }
 * }
 *
 * ContentBlock {
 *   type: 'paragraph' | 'label' | 'highlight' | 'quote' | 'bullets'
 *   text?: string          // paragraph | label | highlight | quote
 *   items?: string[]       // bullets
 * }
 *
 * Styling depends on block.type / component / theme / viewport — never on slug.
 */

import { NLP_PROGRAM_AR, NLP_PROGRAM_EN } from './programs-details-nlp.js';
import { APG_PROGRAM_AR, APG_PROGRAM_EN } from './programs-details-apg.js';

const PROGRAMS_DETAILS_AR = [NLP_PROGRAM_AR, APG_PROGRAM_AR];
const PROGRAMS_DETAILS_EN = [NLP_PROGRAM_EN, APG_PROGRAM_EN];

const bySlug = {
  ar: Object.fromEntries(PROGRAMS_DETAILS_AR.map((item) => [item.slug, item])),
  en: Object.fromEntries(PROGRAMS_DETAILS_EN.map((item) => [item.slug, item])),
};

/** Slugs that use the new rich programs-details template. */
export const PROGRAM_NEW_TEMPLATE_SLUGS = new Set(
  PROGRAMS_DETAILS_AR.map((item) => item.slug),
);

export function usesRichProgramTemplate(slug) {
  return PROGRAM_NEW_TEMPLATE_SLUGS.has(slug);
}

/** Alias kept for call-site clarity. */
export function usesProgramNewTemplate(slug) {
  return usesRichProgramTemplate(slug);
}

export function getProgramDetailPage(slug) {
  return usesRichProgramTemplate(slug)
    ? 'programs-details.html'
    : 'program-detail.html';
}

export function getProgramDetailBySlug(slug, locale = 'ar') {
  if (!slug) return undefined;
  const resolved = locale === 'en' ? 'en' : 'ar';
  return bySlug[resolved][slug] ?? bySlug.ar[slug];
}

export function getProgramDetails(locale = 'ar') {
  const resolved = locale === 'en' ? 'en' : 'ar';
  return PROGRAMS_DETAILS_AR.map((arRecord) => {
    const enRecord = bySlug.en[arRecord.slug];
    if (resolved === 'en' && enRecord) return enRecord;
    return arRecord;
  });
}
