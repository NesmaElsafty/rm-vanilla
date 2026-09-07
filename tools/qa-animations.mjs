/**
 * QA: Stats counter + Hero entrance timing
 * Run: npx playwright test tools/qa-animations.spec.mjs
 * Or: node tools/qa-animations.mjs (standalone with playwright)
 */
import { chromium, devices } from 'playwright';

const BASE = process.env.QA_BASE || 'http://127.0.0.1:8080/';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function testCounter(page) {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);

  const counter = page.locator('#stats [data-counter][data-count="1400"]');
  await assert(await counter.count() === 1, '1400 counter missing');

  // Before trigger, final fallback should still be present (or 0 if already triggered)
  const beforeScroll = (await counter.textContent())?.trim();
  console.log('counter before scroll:', beforeScroll);

  await page.locator('#stats').scrollIntoViewIfNeeded();
  // Center stats in viewport
  await page.evaluate(() => {
    const el = document.getElementById('stats');
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top - (window.innerHeight / 2) + (el.offsetHeight / 2);
    window.scrollTo({ top: Math.max(0, y), behavior: 'instant' });
  });

  await page.waitForTimeout(80);
  const t0 = (await counter.textContent())?.trim();
  console.log('counter at trigger ~80ms:', t0);

  await page.waitForTimeout(400);
  const t1 = (await counter.textContent())?.trim();
  console.log('counter at ~480ms:', t1);

  assert(t1 !== '1400+', `expected intermediate value, got ${t1}`);
  assert(/^\d+\+$/.test(t1), `unexpected format ${t1}`);
  const n1 = Number(t1.replace('+', ''));
  assert(n1 > 0 && n1 < 1400, `expected in-progress count, got ${t1}`);

  await page.waitForTimeout(2000);
  const final = (await counter.textContent())?.trim();
  console.log('counter final:', final);
  assert(final === '1400+', `final should be 1400+, got ${final}`);

  // All finals
  const values = await page.locator('#stats [data-counter]').allTextContents();
  assert(values.map((v) => v.trim()).join(',') === '6+,1400+,10+,30+,10+', `finals ${values}`);

  // No restart
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(200);
  await page.locator('#stats').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const again = (await counter.textContent())?.trim();
  assert(again === '1400+', `should not restart, got ${again}`);

  console.log('PASS counter');
}

async function testHeroSpeed(page) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });

  const timing = await page.evaluate(async () => {
    const hero = document.getElementById('hero');
    const start = performance.now();
    // Wait until hero-is-ready
    await new Promise((resolve) => {
      if (hero.classList.contains('hero-is-ready')) return resolve();
      const mo = new MutationObserver(() => {
        if (hero.classList.contains('hero-is-ready')) {
          mo.disconnect();
          resolve();
        }
      });
      mo.observe(hero, { attributes: true, attributeFilter: ['class'] });
      setTimeout(resolve, 3000);
    });
    const readyAt = performance.now() - start;

    const portrait = hero.querySelector('[data-hero-reveal="portrait"]');
    const style = getComputedStyle(portrait);
    return {
      readyAt,
      opacity: Number(style.opacity),
      delay: style.transitionDelay,
      duration: style.transitionDuration,
    };
  });

  console.log('hero timing:', timing);
  assert(timing.readyAt < 500, `hero-is-ready too late: ${timing.readyAt}ms`);
  console.log('PASS hero speed');
}

async function testNav(page) {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const labels = await page.locator('.nav-links .nav-link').allTextContents();
  const cleaned = labels.map((t) => t.trim());
  console.log('nav labels ar:', cleaned);
  assert(cleaned.includes('الفلسفه'), 'missing philosophy');
  assert(cleaned[0] === 'الرئيسية', 'home first');
  assert(cleaned.includes('عن رنا'), 'about');

  await page.locator('[data-locale-set="en"]').click();
  await page.waitForTimeout(200);
  const en = (await page.locator('.nav-links .nav-link').allTextContents()).map((t) => t.trim());
  console.log('nav labels en:', en);
  assert(en.join('|') === 'Home|About Rana|Philosophy|Programs|Testimonials|Contact', `en order ${en}`);

  const enPressed = await page.locator('[data-locale-set="en"]').getAttribute('aria-pressed');
  assert(enPressed === 'true', 'EN should be pressed');
  console.log('PASS nav');
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();
  page.on('pageerror', (err) => {
    console.error('PAGE ERROR', err);
    throw err;
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.error('CONSOLE ERROR', msg.text());
  });

  try {
    await testHeroSpeed(page);
    await testCounter(page);
    await testNav(page);
    console.log('ALL QA PASSED');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('QA FAILED', err);
  process.exit(1);
});
