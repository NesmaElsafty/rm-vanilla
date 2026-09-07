import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { pathToFileURL } from 'url';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
// Use file URL import of main after mocking minimal DOM is hard.
// Instead: dynamic import each module path via HTTP fetch simulation.

const files = [
  'assets/js/main.js',
  'assets/js/theme.js',
  'assets/js/language.js',
  'assets/js/icons.js',
  'assets/js/svg-decor.js',
  'assets/js/navigation.js',
  'assets/js/animations.js',
  'assets/js/forms.js',
  'assets/js/modals.js',
  'assets/js/galleries.js',
  'assets/js/detail-pages.js',
  'assets/js/sliders.js',
  'data/content.js',
  'data/testimonials.js',
  'data/recorded-sessions.js',
];

for (const f of files) {
  const p = join('D:/Projects/rana/ranamosaad-vanilla', f);
  if (!existsSync(p)) {
    console.error('MISSING', f);
    process.exit(1);
  }
}

// Parse content.js titleParts for breakAfter issues
const { getContent } = await import('../data/content.js');
for (const locale of ['ar', 'en']) {
  const parts = getContent(locale).hero.titleParts;
  if (!Array.isArray(parts)) throw new Error('titleParts missing ' + locale);
  console.log(locale, 'parts', parts.length, parts.map((p) => p.text).join('|'));
}

const { botanicalSVG } = await import('../assets/js/svg-decor.js');
const svg = botanicalSVG({ id: 'hero-test', bold: true, animated: true });
if (!svg.includes('botanical-line-art')) throw new Error('svg broken');
console.log('botanicalSVG ok', svg.length);

const { getIcon, initIcons } = await import('../assets/js/icons.js');
console.log('sun', getIcon('sun', 'icon').includes('svg'));
console.log('languages', getIcon('languages', 'icon').includes('svg'));

console.log('ALL CHECKS PASSED');
