import { chromium } from 'playwright';

const chrome =
  process.env.QA_CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:8765';

const browser = await chromium.launch({ headless: true, executablePath: chrome });
const issues = [];
let pass = 0;

async function withPage(fn, viewport = { width: 1280, height: 900 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  try {
    await fn(page, errors);
  } finally {
    await context.close();
  }
  return errors;
}

function ok(label, condition, detail) {
  if (condition) {
    pass += 1;
    console.log(`PASS  ${label}`);
  } else {
    issues.push({ label, detail });
    console.log(`FAIL  ${label}`, detail || '');
  }
}

console.log('Flow QA…');

await withPage(async (page, errors) => {
  await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });
  await page.locator('[data-open-modal="training"]').first().click();
  await page.waitForSelector('#modal-training:not([hidden])');
  ok('open training modal', await page.locator('#modal-training').isVisible());
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  ok('escape closes modal', await page.locator('#modal-training').isHidden());
  ok('no console errors home', errors.length === 0, errors);
});

await withPage(async (page) => {
  await page.goto(`${base}/program-detail.html?slug=apg`, { waitUntil: 'networkidle' });
  const found = await page.locator('[data-detail-found]:not([hidden])').isVisible();
  const title = (await page.locator('[data-detail-title]').textContent())?.trim();
  ok('program apg found', found && Boolean(title), { title });
  await page.locator('[data-detail-hero-cta]').click();
  await page.waitForURL(/scroll=contact|program=apg/);
  await page.waitForTimeout(400);
  const cat = await page.inputValue('#service_category');
  const sub = await page.inputValue('#sub_option');
  ok('CTA prefill apg', cat === 'training' && sub === 'apg', { cat, sub });
});

await withPage(async (page) => {
  await page.goto(`${base}/program-detail.html?slug=nope`, { waitUntil: 'networkidle' });
  ok('invalid slug 404', await page.locator('[data-detail-not-found]:not([hidden])').isVisible());
});

await withPage(async (page) => {
  await page.goto(`${base}/workshop-detail.html?slug=you-first`, { waitUntil: 'networkidle' });
  ok('workshop detail', await page.locator('[data-detail-found]:not([hidden]) h1').isVisible());
});

await withPage(async (page) => {
  await page.goto(`${base}/session-detail.html?slug=restore-confidence-self-worth`, { waitUntil: 'networkidle' });
  ok('session detail', await page.locator('[data-detail-found]:not([hidden]) h1').isVisible());
});

await withPage(async (page) => {
  await page.goto(`${base}/recorded-sessions.html`, { waitUntil: 'networkidle' });
  await page.locator('[data-recorded-grid] a, #recorded-sessions-grid a').first().click();
  await page.waitForURL(/recorded-session-detail\.html\?slug=/);
  ok('recorded library → detail', await page.locator('h1').first().isVisible());
});

await withPage(async (page) => {
  await page.goto(`${base}/retreat-detail.html?slug=upcoming`, { waitUntil: 'networkidle' });
  ok('retreat detail', await page.locator('[data-detail-found]:not([hidden]) h1').isVisible());
});

await withPage(async (page) => {
  await page.goto(`${base}/about.html`, { waitUntil: 'networkidle' });
  await page.locator('a.nav-logo-btn').first().click();
  await page.waitForURL(/index\.html|\/$/);
  ok('logo → home', /index\.html|\/(\?|$)/.test(page.url()));
});

await withPage(async (page) => {
  await page.goto(`${base}/policies.html`, { waitUntil: 'networkidle' });
  ok('policies', await page.locator('[data-policies-root]').isVisible());
});

await withPage(
  async (page) => {
    await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });
    await page.locator('[data-menu-toggle]').click();
    const open = await page.locator('[data-mobile-menu]').isVisible();
    ok('mobile menu opens', open);
    await page.locator('[data-mobile-menu] a[href="about.html"]').click();
    await page.waitForURL(/about\.html/);
    ok('mobile menu → about', page.url().includes('about.html'));
  },
  { width: 375, height: 800 },
);

await withPage(async (page) => {
  await page.addInitScript(() => localStorage.setItem('rana-site-locale', 'ar'));
  await page.goto(`${base}/program-detail.html?slug=apg`, { waitUntil: 'networkidle' });
  await page.locator('[data-locale-toggle]').first().click();
  await page.waitForTimeout(300);
  const lang = await page.getAttribute('html', 'lang');
  const dir = await page.getAttribute('html', 'dir');
  ok('locale switch keeps slug', page.url().includes('slug=apg') && lang === 'en' && dir === 'ltr', {
    lang,
    dir,
    url: page.url(),
  });
});

await withPage(async (page) => {
  await page.addInitScript(() => localStorage.setItem('rana-site-theme', 'luxury-rose'));
  await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });
  await page.locator('[data-theme-toggle]').first().click();
  await page.waitForTimeout(200);
  const theme = await page.getAttribute('html', 'data-theme');
  const stored = await page.evaluate(() => localStorage.getItem('rana-site-theme'));
  ok('theme toggle', theme === 'cream-elegance' && stored === 'cream-elegance', { theme, stored });
});

await withPage(async (page) => {
  await page.goto(`${base}/index.html#contact`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page.locator('#submit-form-btn').click();
  await page.waitForTimeout(200);
  const errorText = (await page.locator('#full_name-error').textContent())?.trim();
  const ariaInvalid = await page.getAttribute('#full_name', 'aria-invalid');
  ok('form validation shows errors', Boolean(errorText) && ariaInvalid === 'true', { errorText, ariaInvalid });
  ok('form does not fake-success empty', await page.locator('#contact-success-panel').isHidden());
});

await browser.close();
console.log(JSON.stringify({ pass, fail: issues.length, issues }, null, 2));
process.exit(issues.length ? 1 : 0);
