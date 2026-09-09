import fs from 'fs';
import path from 'path';

const root = 'd:/Projects/rana/ranamosaad-vanilla/assets/js';
const files = [
  'programs-details.js',
  'programs-methodology-details.js',
  'programs-transformation-details.js',
  'programs-spiritual-details.js',
  'programs-practical-details.js',
  'programs-feminine-details.js',
  'workshops-details.js',
];

const forceBlock =
  /root\.querySelectorAll\('\[data-reveal\]'\)\.forEach\(\(el\) => \{\s*el\.classList\.add\('is-visible'\);\s*\}\);/g;

for (const file of files) {
  const filePath = path.join(root, file);
  let source = fs.readFileSync(filePath, 'utf8');

  if (!source.includes("from './animations.js'")) {
    if (source.includes("from './language.js';")) {
      source = source.replace(
        "from './language.js';",
        "from './language.js';\nimport { refreshReveals } from './animations.js';",
      );
    } else {
      source = `import { refreshReveals } from './animations.js';\n${source}`;
    }
  }

  source = source.replace(forceBlock, 'refreshReveals(root);');
  fs.writeFileSync(filePath, source);
  console.log(file, source.includes('refreshReveals(root)'));
}
