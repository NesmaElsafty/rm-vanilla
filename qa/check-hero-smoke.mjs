/**
 * Lightweight HTTP smoke test for Hero decor + icons (no Playwright browsers).
 * Loads homepage HTML, fetches main.js graph, reports missing assets.
 */
import http from 'http';

const BASE = 'http://127.0.0.1:8080';

function get(path) {
  return new Promise((resolve, reject) => {
    http
      .get(BASE + path, (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }),
        );
      })
      .on('error', reject);
  });
}

const html = await get('/index.html');
if (html.status !== 200) throw new Error('index.html ' + html.status);

const checks = {
  hasBotanicalBetween: html.body.includes('hero-botanical-between') && html.body.includes('data-botanical'),
  hasVineBack: html.body.includes('portrait-vine--back'),
  hasVineFront: html.body.includes('portrait-vine--front'),
  hasPlaceholder: html.body.includes('hero-portrait-placeholder'),
  hasNoPortraitImg: !html.body.includes('dr_rana_portrait.png" alt='),
  hasMainModule: html.body.includes('assets/js/main.js'),
  hasLangIcon: html.body.includes('data-icon="languages"'),
  hasThemeIcon: html.body.includes('data-theme-icon'),
};

const assets = [
  '/assets/js/main.js',
  '/assets/js/svg-decor.js',
  '/assets/js/icons.js',
  '/assets/js/theme.js',
  '/assets/js/language.js',
  '/data/content.js',
  '/assets/css/main.css',
  '/assets/css/layout.css',
  '/assets/css/components.css',
];

const assetStatus = {};
for (const a of assets) {
  const res = await get(a);
  assetStatus[a] = res.status;
  if (res.status !== 200) throw new Error('asset fail ' + a);
}

const layout = await get('/assets/css/layout.css');
const components = await get('/assets/css/components.css');
const cssChecks = {
  heroPortraitOverflowVisible: /hero-portrait\s*\{[^}]*overflow:\s*visible/s.test(layout.body),
  portraitWithVinesOverflowVisible: /portrait-with-vines\s*\{[^}]*overflow:\s*visible/s.test(
    components.body,
  ),
  placeholderTransparent: /hero-portrait-placeholder\s*\{[^}]*background:\s*transparent/s.test(
    layout.body,
  ),
};

const main = await get('/assets/js/main.js');
const jsChecks = {
  initDecorInBoot: main.body.includes('initDecor()'),
  initIconsInBoot: main.body.includes('initIcons()'),
  decorOnLocaleChange: /onLocaleChange[\s\S]*initDecor\(\)/.test(main.body),
  bootTryCatch: main.body.includes('[boot] initDecor failed'),
};

console.log(JSON.stringify({ checks, assetStatus, cssChecks, jsChecks }, null, 2));

const failed = [
  ...Object.entries(checks).filter(([, v]) => !v).map(([k]) => k),
  ...Object.entries(cssChecks).filter(([, v]) => !v).map(([k]) => k),
  ...Object.entries(jsChecks).filter(([, v]) => !v).map(([k]) => k),
];
if (failed.length) {
  console.error('FAILED', failed);
  process.exit(1);
}
console.log('SMOKE OK');
