import { test, expect } from '@playwright/test';
import { PAGES, collectConsoleErrors } from './helpers.mjs';

test.describe('Smoke — every page loads', () => {
  for (const pageInfo of PAGES) {
    test(`${pageInfo.name} loads without console errors`, async ({ page }) => {
      const errors = await collectConsoleErrors(page);
      const response = await page.goto(pageInfo.path, { waitUntil: 'networkidle' });
      expect(response?.ok(), `${pageInfo.path} should return OK`).toBeTruthy();
      await expect(page.locator('nav.nav-luxury')).toBeVisible();
      await expect(page.locator('footer.footer-luxury')).toBeVisible();
      const serious = errors.filter(
        (e) => !/favicon|net::ERR_FAILED|Download the React DevTools/i.test(e),
      );
      expect(serious, serious.join('\n')).toEqual([]);
    });
  }
});
