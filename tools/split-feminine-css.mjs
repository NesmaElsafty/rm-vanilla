import fs from 'fs';

const cssPath = 'd:/Projects/rana/ranamosaad-vanilla/assets/css/pages.css';
let css = fs.readFileSync(cssPath, 'utf8');

const start = css.indexOf('.program-transform-page {');
const end = css.indexOf('Methodology Journey Program Structure');
if (start < 0 || end < 0) {
  throw new Error(`markers not found start=${start} end=${end}`);
}

// Back up to the start of the comment block
const commentStart = css.lastIndexOf('/* ===', end);
const blockEnd = commentStart > start ? commentStart : end;

const transformBlock = css.slice(start, blockEnd);

function removeRule(source, className) {
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\r?\\n\\.${escaped} \\{[\\s\\S]*?\\r?\\n\\}\\r?\\n`, 'g');
  return source.replace(re, '\n');
}

let cleanTransform = transformBlock;
for (const name of [
  'program-transform-section-label',
  'program-transform-pillars__label',
  'program-transform-pillars__examples',
  'program-transform-pillars__examples li',
  'program-transform-pillars__examples li::before',
  'program-transform-pillars__result',
  'program-transform-pillars__result-label',
  'program-transform-pillars__result-text',
]) {
  cleanTransform = removeRule(cleanTransform, name);
}

let feminine = transformBlock
  .replace(/program-transform/g, 'program-feminine')
  .replace(/--pt-/g, '--pf-');

feminine = feminine.replace(
  /grid-template-columns: repeat\(2, minmax\(0, 1fr\);\r?\n  gap: 1\.1rem;\r?\n\}/,
  (match) => {
    // Only for pillars list - check context by replacing specifically
    return match;
  },
);

// Targeted pillars list replacement
feminine = feminine.replace(
  /(\.program-feminine-pillars__list \{\r?\n  list-style: none;\r?\n  margin: 0;\r?\n  padding: 0;\r?\n  display: grid;\r?\n  )grid-template-columns: repeat\(2, minmax\(0, 1fr\);\r?\n  gap: 1\.1rem;/,
  '$1grid-template-columns: 1fr;\n  gap: 1.25rem;\n  max-width: 52rem;',
);

feminine = feminine.replace(
  /(\.program-feminine-pillars__item \{\r?\n  display: grid;\r?\n  grid-template-columns: auto minmax\(0, 1fr\);\r?\n  gap: )1rem;\r?\n  padding: 1\.35rem 1\.4rem;\r?\n  border-radius: 1\.2rem;\r?\n  border: 1px solid var\(--pf-line\);\r?\n  background: var\(--pf-panel\);\r?\n  min-height: 11rem;/,
  '$11.15rem;\n  padding: 1.55rem 1.55rem;\n  border-radius: 1.2rem;\n  border: 1px solid var(--pf-line);\n  background: var(--pf-panel);\n  min-height: 0;',
);

feminine = feminine.replace(
  /(\.program-feminine-importance__inner \{\r?\n  max-width: 46rem;\r?\n\})/,
  `$1

.program-feminine-importance__action-intro {
  margin-top: 1.35rem;
}

.program-feminine-importance__action-items {
  margin-top: 0.85rem;
  padding: 1.1rem 1.2rem;
  border-radius: 1rem;
  border: 1px solid var(--pf-line);
  background: linear-gradient(
    135deg,
    rgba(185, 143, 162, 0.1),
    transparent 60%
  );
}`,
);

const header = `/* =============================================================================
   Feminine Healing Journey Program Structure
   Namespace: .program-feminine-*
   ============================================================================= */

`;

const insertion = `${cleanTransform}\n${header}${feminine}\n`;
css = css.slice(0, start) + insertion + css.slice(blockEnd);
fs.writeFileSync(cssPath, css);

// Verify removals
const stillHas = [
  'program-transform-section-label',
  'program-transform-pillars__examples',
  'program-transform-pillars__result',
].filter((n) => css.includes(`.${n}`));
console.log('Still in transform CSS:', stillHas);
console.log('Has feminine page:', css.includes('.program-feminine-page'));
console.log('Has feminine pillars examples:', css.includes('.program-feminine-pillars__examples'));
