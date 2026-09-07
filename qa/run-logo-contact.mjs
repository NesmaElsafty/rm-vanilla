import { chromium } from 'playwright';

const chrome =
  process.env.QA_CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:8765';

const viewports = [
  { width: 1366, height: 768, name: '1366x768' },
  { width: 1440, height: 900, name: '1440x900' },
  { width: 1920, height: 1080, name: '1920x1080' },
  { width: 1024, height: 768, name: '1024x768' },
  { width: 768, height: 1024, name: '768x1024' },
  { width: 390, height: 844, name: '390x844' },
];

const browser = await chromium.launch({ headless: true, executablePath: chrome });
const issues = [];
let pass = 0;

function ok(label, condition, detail) {
  if (condition) {
    pass += 1;
    console.log(`PASS  ${label}`);
  } else {
    issues.push({ label, detail });
    console.log(`FAIL  ${label}`, detail || '');
  }
}

async function check(locale, theme) {
  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.addInitScript(
      ({ locale, theme }) => {
        localStorage.setItem('rana-site-locale', locale);
        localStorage.setItem('rana-site-theme', theme);
      },
      { locale, theme },
    );

    await page.goto(`${base}/index.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);

    const lang = await page.getAttribute('html', 'lang');
    const dir = await page.getAttribute('html', 'dir');
    ok(`${vp.name} ${locale} lang/dir`, lang === locale && dir === (locale === 'ar' ? 'rtl' : 'ltr'), {
      lang,
      dir,
    });

    const logo = await page.evaluate(() => {
      const btn = document.querySelector('.nav-logo-btn');
      const img = document.querySelector('.nav-logo-btn img');
      if (!btn || !img) return null;
      const bs = getComputedStyle(btn);
      const is = getComputedStyle(img);
      const br = btn.getBoundingClientRect();
      const ir = img.getBoundingClientRect();
      return {
        overflow: bs.overflow,
        transform: is.transform,
        imgHeight: is.height,
        objectFit: is.objectFit,
        btnW: br.width,
        btnH: br.height,
        imgW: ir.width,
        imgH: ir.height,
        clippedX: ir.left < br.left - 1 || ir.right > br.right + 1,
        clippedY: ir.top < br.top - 1 || ir.bottom > br.bottom + 1,
      };
    });

    ok(
      `${vp.name} ${locale} logo visible/uncropped`,
      logo &&
        logo.overflow === 'visible' &&
        (logo.transform === 'none' || logo.transform === 'matrix(1, 0, 0, 1, 0, 0)') &&
        !logo.clippedX &&
        !logo.clippedY &&
        logo.imgW > 20 &&
        logo.imgH > 20,
      logo,
    );

    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);

    const contact = await page.evaluate(() => {
      const grid = document.querySelector('.contact-grid');
      const info = document.querySelector('.contact-info');
      const form = document.querySelector('.contact-form-panel');
      const section = document.querySelector('#contact.slide-section');
      const ta = document.querySelector('textarea.contact-field');
      if (!grid || !info || !form || !section) return null;
      const gs = getComputedStyle(grid);
      const cols = gs.gridTemplateColumns.split(' ').filter(Boolean);
      const infoSpan = getComputedStyle(info).gridColumnStart;
      const formSpan = getComputedStyle(form).gridColumnStart;
      // Prefer measured widths via grid column end - start
      const infoCol = getComputedStyle(info).gridColumn;
      const formCol = getComputedStyle(form).gridColumn;
      const ir = info.getBoundingClientRect();
      const fr = form.getBoundingClientRect();
      const sr = section.getBoundingClientRect();
      const padTop = parseFloat(getComputedStyle(section).paddingTop);
      const padBottom = parseFloat(getComputedStyle(section).paddingBottom);
      return {
        colCount: cols.length,
        infoCol,
        formCol,
        infoW: ir.width,
        formW: fr.width,
        ratio: fr.width / Math.max(ir.width, 1),
        sectionPad: padTop + padBottom,
        textareaMin: getComputedStyle(ta).minHeight,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    const desktop = vp.width >= 1024;
    if (desktop) {
      ok(
        `${vp.name} ${locale} contact grid 5/7`,
        contact &&
          contact.colCount === 12 &&
          contact.formW > contact.infoW &&
          contact.ratio > 1.1 &&
          contact.ratio < 1.8,
        contact,
      );
    } else {
      ok(
        `${vp.name} ${locale} contact stacked readable`,
        contact && contact.infoW > 200 && contact.formW > 200,
        contact,
      );
    }

    ok(
      `${vp.name} ${locale} contact height/textarea`,
      contact && contact.sectionPad <= 220 && parseFloat(contact.textareaMin) <= 96,
      contact,
    );

    ok(`${vp.name} ${locale} no overflow`, contact && contact.overflow <= 1, contact);

    await context.close();
  }
}

console.log('Logo + contact regression QA…');
await check('ar', 'luxury-rose');
await check('en', 'cream-elegance');
await browser.close();
console.log(JSON.stringify({ pass, fail: issues.length, issues }, null, 2));
process.exit(issues.length ? 1 : 0);
