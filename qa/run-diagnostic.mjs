import { chromium } from 'playwright';

const chrome =
  process.env.QA_CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:8765';

const pages = [
  '/index.html',
  '/about.html',
  '/policies.html',
  '/recorded-sessions.html',
  '/program-detail.html?slug=apg',
  '/workshop-detail.html?slug=you-first',
  '/session-detail.html?slug=restore-confidence-self-worth',
  '/recorded-session-detail.html?slug=forgiveness',
  '/retreat-detail.html?slug=upcoming',
  '/program-detail.html?slug=missing-slug',
];

const widths = [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920];

const browser = await chromium.launch({
  headless: true,
  executablePath: chrome,
});

const results = { pass: 0, fail: 0, issues: [] };

async function checkPage(path, width, locale = 'ar', theme = 'luxury-rose') {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  await page.addInitScript(
    ({ locale, theme }) => {
      localStorage.setItem('rana-site-locale', locale);
      localStorage.setItem('rana-site-theme', theme);
    },
    { locale, theme },
  );

  const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(350);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  const title = await page.locator('h1').first().textContent().catch(() => '');
  const lang = await page.getAttribute('html', 'lang');
  const dir = await page.getAttribute('html', 'dir');

  const okStatus = Boolean(response?.ok());
  const okOverflow = overflow <= 1;
  const okConsole = errors.filter((e) => !/favicon|Failed to load resource/i.test(e)).length === 0;

  if (!okStatus || !okOverflow || !okConsole) {
    results.fail += 1;
    results.issues.push({
      path,
      width,
      locale,
      theme,
      status: response?.status(),
      overflow,
      errors,
      title: title?.slice(0, 80),
      lang,
      dir,
    });
  } else {
    results.pass += 1;
  }

  await context.close();
}

console.log('QA diagnostic starting…');

for (const path of pages) {
  await checkPage(path, 1280);
  await checkPage(path, 375);
}

for (const width of widths) {
  await checkPage('/index.html', width);
  await checkPage('/about.html', width);
}

await checkPage('/index.html', 375, 'en', 'cream-elegance');
await checkPage('/program-detail.html?slug=apg', 375, 'en', 'luxury-rose');

// Prefill check
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${base}/index.html?scroll=contact&program=apg`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const category = await page.inputValue('#service_category');
  const sub = await page.inputValue('#sub_option');
  if (category !== 'training' || sub !== 'apg') {
    results.fail += 1;
    results.issues.push({ path: 'prefill', category, sub });
  } else {
    results.pass += 1;
  }
  await context.close();
}

// Footer link
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });
  await page.locator('a[href*="program-detail.html?slug=apg"]').first().click();
  await page.waitForURL(/program-detail\.html\?slug=apg/);
  const h1 = await page.locator('h1').first().textContent();
  if (!h1?.trim()) {
    results.fail += 1;
    results.issues.push({ path: 'footer-apg', h1 });
  } else {
    results.pass += 1;
  }
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
process.exit(results.fail ? 1 : 0);
