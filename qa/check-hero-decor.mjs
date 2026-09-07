import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`PAGE: ${e.message}\n${e.stack}`));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`CONSOLE: ${msg.text()}`);
});
page.on('requestfailed', (r) =>
  errors.push(`FAIL: ${r.url()} ${r.failure()?.errorText || ''}`),
);

await page.goto('http://127.0.0.1:8080/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

const data = await page.evaluate(() => ({
  botanicalHosts: document.querySelectorAll('[data-botanical]').length,
  botanicalSvgs: document.querySelectorAll('[data-botanical] svg').length,
  iconHosts: document.querySelectorAll('[data-icon]').length,
  iconSvgs: document.querySelectorAll('[data-icon] svg').length,
  placeholder: Boolean(document.querySelector('.hero-portrait-placeholder')),
  heroBetweenHtml: document.querySelector('.hero-botanical-between')?.innerHTML?.slice(0, 80) || '',
  vineFrontHtml: document.querySelector('.portrait-vine--front')?.innerHTML?.slice(0, 80) || '',
}));

console.log(JSON.stringify({ data, errors }, null, 2));
await browser.close();
