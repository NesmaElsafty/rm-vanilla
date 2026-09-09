/**
 * One-shot: migrate APG master-program shape → methodology-journey.
 * Run: node tools/migrate-apg-to-methodology.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { APG_PROGRAM_AR, APG_PROGRAM_EN } from '../data/programs-details-apg.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function migrate(program) {
  const {
    importance,
    transformation,
    why_choose,
    gallery,
    differentiator,
    curriculum,
    ...rest
  } = program;

  const { secondary_block, ...diffRest } = differentiator;

  return {
    ...rest,
    structure_type: 'methodology-journey',
    perspective: importance,
    promise: transformation,
    curriculum: {
      heading: curriculum.heading,
      supporting_title: curriculum.supporting_title,
      intro_blocks: curriculum.intro_blocks,
      modules: curriculum.modules,
      powerful_block: {
        heading: why_choose.heading,
        intro_blocks: why_choose.intro_blocks,
        bullets: why_choose.bullets,
        simplified_label: why_choose.simplified_label,
        closing_blocks: why_choose.closing_blocks,
      },
    },
    differentiator: diffRest,
    methodology_description: {
      heading: secondary_block.heading,
      content_blocks: secondary_block.content_blocks,
    },
  };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const ar = migrate(APG_PROGRAM_AR);
const en = migrate(APG_PROGRAM_EN);

assert(ar.structure_type === 'methodology-journey', 'structure');
assert(!('importance' in ar), 'no importance');
assert(!('transformation' in ar), 'no transformation');
assert(!('why_choose' in ar), 'no why_choose');
assert(!('gallery' in ar), 'no gallery');
assert(!ar.differentiator.secondary_block, 'no secondary');
assert(ar.curriculum.modules.length === 14, '14 modules');
assert(ar.curriculum.powerful_block.heading === 'What makes this powerful?', 'powerful');
assert(ar.methodology_description.heading.includes('Accessing Personal Genius'), 'what is');
assert(ar.perspective.heading.includes('لماذا لا يتغيّر'), 'perspective');
assert(ar.promise.flows.length === 6, 'flows');
assert(ar.faq.items.length === 4, 'faq');
assert(en.curriculum.modules.length === 14, 'en modules');
assert(
  en.methodology_description.content_blocks.length ===
    ar.methodology_description.content_blocks.length,
  'md blocks',
);
assert(
  ar.differentiator.content_blocks.some((b) => b.text?.includes('* حتى يصبح')),
  'star paragraph',
);
assert(ar.pain.bullets.length === 7, 'pain bullets');

const header = `/**
 * Rich Training Program records for slug \`apg\` (APG | Accessing Personal Genius).
 * structure_type: 'methodology-journey'
 * Arabic is owner source-of-truth — do not rewrite, shorten, or correct.
 */

`;

const out =
  header +
  `export const APG_PROGRAM_AR = ${JSON.stringify(ar, null, 2)};\n\n` +
  `export const APG_PROGRAM_EN = ${JSON.stringify(en, null, 2)};\n`;

const target = path.join(__dirname, '..', 'data', 'programs-details-apg.js');
fs.writeFileSync(target, out, 'utf8');
console.log('Migrated APG → methodology-journey');
console.log('AR keys:', Object.keys(ar).join(', '));
console.log('modules:', ar.curriculum.modules.length);
