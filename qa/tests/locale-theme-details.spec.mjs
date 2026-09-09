import { test, expect } from '@playwright/test';
import { setLocale, setTheme, DETAIL_SLUGS } from './helpers.mjs';
import { getProgramDetailPage } from '../../data/programs-details.js';

test.describe('Locale & theme', () => {
  test('Arabic RTL', async ({ page }) => {
    await setLocale(page, 'ar');
    await page.goto('/index.html', { waitUntil: 'networkidle' });
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('English LTR', async ({ page }) => {
    await setLocale(page, 'en');
    await page.goto('/index.html', { waitUntil: 'networkidle' });
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });

  test('Language switch preserves detail slug', async ({ page }) => {
    await setLocale(page, 'ar');
    await page.goto('/programs-methodology-details.html?slug=apg', {
      waitUntil: 'networkidle',
    });
    await page.locator('[data-locale-set="en"]').first().click();
    await expect(page).toHaveURL(/programs-methodology-details\.html\?slug=apg/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Themes persist', async ({ page }) => {
    await setTheme(page, 'cream-elegance');
    await page.goto('/index.html', { waitUntil: 'networkidle' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'cream-elegance');
    await page.locator('[data-theme-toggle]').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'luxury-rose');
    const stored = await page.evaluate(() => localStorage.getItem('rana-site-theme'));
    expect(stored).toBe('luxury-rose');
  });
});

test.describe('Detail slugs', () => {
  for (const slug of DETAIL_SLUGS.program) {
    test(`program ${slug}`, async ({ page }) => {
      const pageName = getProgramDetailPage(slug);
      await page.goto(`/${pageName}?slug=${slug}`, { waitUntil: 'networkidle' });
      await expect(page.locator('h1').first()).toBeVisible();
      await expect(page.locator('h1').first()).not.toHaveText('');
    });
  }

  test('invalid program slug shows 404 state', async ({ page }) => {
    await page.goto('/programs-details.html?slug=does-not-exist', {
      waitUntil: 'networkidle',
    });
    await expect(
      page.locator('[data-pd-not-found]:not([hidden]), [data-detail-not-found]:not([hidden])').first(),
    ).toBeVisible();
  });

  test('workshop slug', async ({ page }) => {
    await page.goto('/workshops-details.html?slug=you-first', {
      waitUntil: 'networkidle',
    });
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('session slug', async ({ page }) => {
    await page.goto(
      '/private-sessions-details.html?slug=restore-confidence-self-worth',
      { waitUntil: 'networkidle' },
    );
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('recorded slug', async ({ page }) => {
    await page.goto('/recorded-sessions-details.html?slug=forgiveness', {
      waitUntil: 'networkidle',
    });
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('retreat slug', async ({ page }) => {
    await page.goto('/retreat-detail.html?slug=upcoming', {
      waitUntil: 'networkidle',
    });
    await expect(page.locator('h1').first()).toBeVisible();
  });
});

test.describe('Forms', () => {
  test('Contact form validates required fields', async ({ page }) => {
    await page.goto('/index.html#contact', { waitUntil: 'networkidle' });
    await page.locator('#submit-form-btn').click();
    await expect(page.locator('#full_name-error')).toBeVisible();
  });
});
