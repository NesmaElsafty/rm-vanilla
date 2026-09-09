/**
 * One-shot migration: normalize NLP + APG rich Program records to unified schema.
 * Run: node tools/normalize-programs-details.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProgramDetailBySlug } from '../data/programs-details.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function p(text) {
  return { type: 'paragraph', text };
}
function label(text) {
  return { type: 'label', text };
}
function highlight(text) {
  return { type: 'highlight', text };
}
function quote(text) {
  return { type: 'quote', text };
}
function bullets(items) {
  return { type: 'bullets', items: [...items] };
}

function parasToBlocks(lines) {
  return (Array.isArray(lines) ? lines : lines != null && lines !== '' ? [lines] : []).map((text) =>
    p(text),
  );
}

function normalizeFaqItem(item) {
  const answer_blocks = [];
  if (item.answer_intro || item.bullets?.length) {
    if (item.answer_intro) answer_blocks.push(p(item.answer_intro));
    if (item.bullets?.length) answer_blocks.push(bullets(item.bullets));
  } else if (Array.isArray(item.answer)) {
    answer_blocks.push(...parasToBlocks(item.answer));
  } else if (typeof item.answer === 'string') {
    const parts = item.answer.split(/\n+/).map((s) => s.trim()).filter(Boolean);
    if (parts.length > 1) answer_blocks.push(...parts.map((t) => p(t)));
    else answer_blocks.push(p(item.answer));
  }
  return { question: item.question, answer_blocks };
}

function normalizeModule(module) {
  if (module.content_blocks) {
    return {
      order: module.order,
      title: module.title || module.heading,
      ...(module.subtitle ? { subtitle: module.subtitle } : {}),
      content_blocks: module.content_blocks,
    };
  }
  if (module.blocks) {
    return {
      order: module.order,
      title: module.title || module.heading,
      ...(module.subtitle ? { subtitle: module.subtitle } : {}),
      content_blocks: module.blocks,
    };
  }
  const content_blocks = [];
  if (module.body) content_blocks.push(p(module.body));
  if (module.bullets?.length) content_blocks.push(bullets(module.bullets));
  if (module.closing) content_blocks.push(p(module.closing));
  return {
    order: module.order,
    title: module.heading || module.title,
    content_blocks,
  };
}

function normalizeImportance(importance) {
  if (importance.content_blocks) {
    return { heading: importance.heading, content_blocks: importance.content_blocks };
  }
  const content_blocks = [];
  content_blocks.push(...parasToBlocks(importance.paragraphs));

  if (importance.loop?.length) {
    for (const line of importance.loop) content_blocks.push(highlight(line));
  }
  if (importance.loop_question) content_blocks.push(label(importance.loop_question));

  if (importance.groups?.length) {
    for (const group of importance.groups) {
      if (group.heading) content_blocks.push(label(group.heading));
      if (group.bullets?.length) content_blocks.push(bullets(group.bullets));
    }
  }

  if (importance.bridge?.length) {
    // NLP: bridge[0]=paragraph, bridge[1]="يعلمك كيف:" as label when it reads as intro-to-bullets
    const bridge = importance.bridge;
    if (bridge.length === 2 && importance.bullets?.length) {
      content_blocks.push(p(bridge[0]));
      content_blocks.push(label(bridge[1]));
    } else {
      content_blocks.push(...parasToBlocks(bridge));
    }
  }

  if (importance.bullets?.length) content_blocks.push(bullets(importance.bullets));
  if (importance.simplified_label) content_blocks.push(label(importance.simplified_label));
  content_blocks.push(...parasToBlocks(importance.closing));

  return { heading: importance.heading, content_blocks };
}

function normalizeDifferentiator(diff) {
  if (diff.content_blocks) {
    return {
      heading: diff.heading,
      ...(diff.supporting_line ? { supporting_line: diff.supporting_line } : {}),
      ...(diff.subheading ? { subheading: diff.subheading } : {}),
      content_blocks: diff.content_blocks,
      ...(diff.secondary_block
        ? {
            secondary_block: {
              heading: diff.secondary_block.heading,
              content_blocks:
                diff.secondary_block.content_blocks || diff.secondary_block.blocks || [],
            },
          }
        : {}),
    };
  }

  // APG style
  if (diff.blocks) {
    return {
      heading: diff.heading,
      ...(diff.supporting_line ? { supporting_line: diff.supporting_line } : {}),
      ...(diff.subheading ? { subheading: diff.subheading } : {}),
      content_blocks: diff.blocks,
      ...(diff.secondary_block
        ? {
            secondary_block: {
              heading: diff.secondary_block.heading,
              content_blocks: diff.secondary_block.blocks || [],
            },
          }
        : {}),
    };
  }

  // NLP classic → content_blocks
  const content_blocks = [];
  if (diff.intro_before) content_blocks.push(p(diff.intro_before));
  const quotes = diff.quotes || [];
  quotes.forEach((q, i) => {
    content_blocks.push(quote(q));
    if (i < quotes.length - 1 && diff.quote_connector) {
      content_blocks.push(label(diff.quote_connector));
    }
  });
  content_blocks.push(...parasToBlocks(diff.intro_after));
  if (diff.supporting_heading) content_blocks.push(label(diff.supporting_heading));
  if (diff.bullets?.length) content_blocks.push(bullets(diff.bullets));

  return { heading: diff.heading, content_blocks };
}

function normalizeTrainer(trainer) {
  const content_blocks = [];
  content_blocks.push(...parasToBlocks(trainer.paragraphs));
  if (trainer.bullets?.length) content_blocks.push(bullets(trainer.bullets));
  content_blocks.push(...parasToBlocks(trainer.closing));
  return {
    heading: trainer.heading,
    ...(trainer.subheading ? { subheading: trainer.subheading } : {}),
    content_blocks,
  };
}

function normalizeWhy(why) {
  return {
    heading: why.heading,
    intro_blocks: parasToBlocks(why.intro),
    bullets: [...(why.bullets || [])],
    ...(why.simplified_label ? { simplified_label: why.simplified_label } : {}),
    closing_blocks: parasToBlocks(why.closing),
  };
}

function normalizeFinalCta(cta) {
  return {
    heading: cta.heading,
    ...(cta.supporting_line ? { supporting_line: cta.supporting_line } : {}),
    ...(cta.pre_bullets_label || cta.intro
      ? { pre_bullets_label: cta.pre_bullets_label || cta.intro }
      : {}),
    ...(cta.bullets?.length ? { bullets: [...cta.bullets] } : {}),
    closing_blocks: parasToBlocks(cta.closing),
    primary_cta: cta.primary_cta || cta.button,
    ...(cta.secondary_cta ? { secondary_cta: cta.secondary_cta } : {}),
  };
}

function normalizeProgram(program) {
  const heroBlocks = program.hero.description_blocks
    ? program.hero.description_blocks
    : program.hero.description_paragraphs
      ? parasToBlocks(program.hero.description_paragraphs)
      : parasToBlocks(program.hero.description);

  return {
    slug: program.slug,
    seo: { ...program.seo },
    hero: {
      eyebrow: program.hero.eyebrow,
      title: program.hero.title,
      supporting_line: program.hero.supporting_line,
      description_blocks: heroBlocks,
      primary_cta: program.hero.primary_cta,
      ...(program.hero.secondary_cta ? { secondary_cta: program.hero.secondary_cta } : {}),
    },
    pain: {
      heading: program.pain.heading,
      intro: program.pain.intro,
      bullets: [...program.pain.bullets],
      closing_blocks: parasToBlocks(program.pain.closing),
    },
    importance: normalizeImportance(program.importance),
    transformation: {
      heading: program.transformation.heading,
      intro: program.transformation.intro,
      flows: program.transformation.flows.map((f) => ({ from: f.from, to: f.to })),
      ...(program.transformation.simplified_label
        ? { simplified_label: program.transformation.simplified_label }
        : {}),
      closing_blocks: parasToBlocks(program.transformation.closing),
    },
    audience: {
      heading: program.audience.heading,
      intro: program.audience.intro,
      bullets: [...program.audience.bullets],
      not_for: {
        heading: program.audience.not_for.heading,
        intro: program.audience.not_for.intro,
        bullets: [...program.audience.not_for.bullets],
      },
    },
    curriculum: {
      heading: program.curriculum.heading,
      ...(program.curriculum.supporting_title
        ? { supporting_title: program.curriculum.supporting_title }
        : {}),
      ...(program.curriculum.intro?.length || program.curriculum.intro_blocks?.length
        ? {
            intro_blocks: program.curriculum.intro_blocks
              ? program.curriculum.intro_blocks
              : parasToBlocks(program.curriculum.intro),
          }
        : {}),
      modules: program.curriculum.modules.map(normalizeModule),
    },
    differentiator: normalizeDifferentiator(program.differentiator),
    results: {
      heading: program.results.heading,
      ...(program.results.intro ? { intro: program.results.intro } : {}),
      bullets: [...program.results.bullets],
    },
    why_choose: normalizeWhy(program.why_choose),
    trainer: normalizeTrainer(program.trainer),
    faq: {
      heading: program.faq.heading,
      items: program.faq.items.map(normalizeFaqItem),
    },
    gallery: { images: [...(program.gallery?.images || [])] },
    final_cta: normalizeFinalCta(program.final_cta),
    purchase: { ...program.purchase },
    display: { ...program.display },
  };
}

function serialize(value, indent = 0) {
  const pad = '  '.repeat(indent);
  const pad1 = '  '.repeat(indent + 1);
  if (value === null) return 'null';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    const items = value.map((v) => `${pad1}${serialize(v, indent + 1)}`);
    return `[\n${items.join(',\n')}\n${pad}]`;
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (!keys.length) return '{}';
    const items = keys.map((k) => `${pad1}${k}: ${serialize(value[k], indent + 1)}`);
    return `{\n${items.join(',\n')}\n${pad}}`;
  }
  return JSON.stringify(value);
}

function writeModule(filePath, header, exportsMap) {
  let out = `${header}\n\n`;
  for (const [name, value] of Object.entries(exportsMap)) {
    out += `export const ${name} = ${serialize(value, 0)};\n\n`;
  }
  fs.writeFileSync(filePath, out, 'utf8');
  console.log('wrote', filePath);
}

const nlpAr = normalizeProgram(getProgramDetailBySlug('nlp', 'ar'));
const nlpEn = normalizeProgram(getProgramDetailBySlug('nlp', 'en'));
const apgAr = normalizeProgram(getProgramDetailBySlug('apg', 'ar'));
const apgEn = normalizeProgram(getProgramDetailBySlug('apg', 'en'));

// Sanity checks
for (const [name, p] of [
  ['nlpAr', nlpAr],
  ['nlpEn', nlpEn],
  ['apgAr', apgAr],
  ['apgEn', apgEn],
]) {
  const keys = Object.keys(p).sort().join(',');
  console.log(name, keys);
  console.log('  modules', p.curriculum.modules.length, 'faq', p.faq.items.length);
  console.log('  importance blocks', p.importance.content_blocks.length);
  console.log('  diff blocks', p.differentiator.content_blocks.length);
}

writeModule(
  path.join(root, 'data', 'programs-details-nlp.js'),
  `/**
 * Rich Training Program records for slug \`nlp\`.
 * Arabic is owner source-of-truth — do not rewrite, shorten, or correct.
 * Uses the Master ProgramDetail schema (see data/programs-details.js).
 */`,
  { NLP_PROGRAM_AR: nlpAr, NLP_PROGRAM_EN: nlpEn },
);

writeModule(
  path.join(root, 'data', 'programs-details-apg.js'),
  `/**
 * Rich Training Program records for slug \`apg\` (APG | Accessing Personal Genius).
 * Arabic is owner source-of-truth — do not rewrite, shorten, or correct.
 * Uses the Master ProgramDetail schema (see data/programs-details.js).
 */`,
  { APG_PROGRAM_AR: apgAr, APG_PROGRAM_EN: apgEn },
);

console.log('done');
