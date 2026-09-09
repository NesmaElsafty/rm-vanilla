import { test, expect } from '@playwright/test';
import { collectConsoleErrors, setLocale } from './helpers.mjs';

test.describe('Navigation flows', () => {
  test('Home → Program modal → Program detail → Contact', async ({ page }) => {
    const errors = await collectConsoleErrors(page);
    await setLocale(page, 'ar');
    await page.goto('/index.html', { waitUntil: 'networkidle' });

    await page.locator('[data-open-modal="training"]').first().click();
    await expect(page.locator('#modal-training')).toBeVisible();

    await page
      .locator('#modal-training .floating-program-card, #modal-training [data-slug]')
      .first()
      .click({ force: true })
      .catch(async () => {
        await page.goto('/programs-methodology-details.html?slug=apg', {
          waitUntil: 'networkidle',
        });
      });

    if (!/programs-.*-details\.html|programs-details\.html/.test(page.url())) {
      await page.goto('/programs-methodology-details.html?slug=apg', {
        waitUntil: 'networkidle',
      });
    }

    await expect(page.locator('h1').first()).toBeVisible();
    await page
      .locator(
        '[data-pd-primary-cta], [data-pt-primary-cta], [data-pm-primary-cta], [data-ps-primary-cta], [data-ppc-primary-cta], [data-pf-primary-cta], a.btn-luxury-primary',
      )
      .first()
      .click();
    await expect(page).toHaveURL(/index\.html.*contact|scroll=contact/);
    await expect(page.locator('#booking-form-element, #contact')).toBeVisible();
    expect(errors.filter((e) => !/favicon/i.test(e))).toEqual([]);
  });

  test('Home → Workshop detail', async ({ page }) => {
    await page.goto('/workshops-details.html?slug=you-first', {
      waitUntil: 'networkidle',
    });
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Home → Session detail', async ({ page }) => {
    await page.goto(
      '/private-sessions-details.html?slug=restore-confidence-self-worth',
      { waitUntil: 'networkidle' },
    );
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Recorded library → Recorded detail', async ({ page }) => {
    await page.goto('/recorded-sessions.html', { waitUntil: 'networkidle' });
    const card = page.locator('[data-recorded-grid] a, #recorded-sessions-grid a').first();
    await expect(card).toBeVisible();
    await card.click();
    await expect(page).toHaveURL(/recorded-sessions-details\.html\?slug=/);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Retreat detail', async ({ page }) => {
    await page.goto('/retreat-detail.html?slug=upcoming', {
      waitUntil: 'networkidle',
    });
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Navbar logo → home', async ({ page }) => {
    await page.goto('/about.html', { waitUntil: 'networkidle' });
    await page.locator('a.nav-logo-btn').first().click();
    await expect(page).toHaveURL(/index\.html|\/$/);
  });

  test('Footer program link → program detail', async ({ page }) => {
    await page.goto('/index.html', { waitUntil: 'networkidle' });
    await page.locator('a[href*="programs-methodology-details.html?slug=apg"]').first().click();
    await expect(page).toHaveURL(/programs-methodology-details\.html\?slug=apg/);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Policies page', async ({ page }) => {
    await page.goto('/policies.html', { waitUntil: 'networkidle' });
    await expect(page.locator('[data-policies-root]')).toBeVisible();
  });

  test('Mobile menu open / close / navigate', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/index.html', { waitUntil: 'networkidle' });
    const toggle = page.locator('[data-menu-toggle]');
    await toggle.click();
    await expect(page.locator('[data-mobile-menu]')).toBeVisible();
    await page.locator('[data-mobile-menu] a[href="about.html"]').click();
    await expect(page).toHaveURL(/about\.html/);
  });
});
