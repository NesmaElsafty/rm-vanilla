import { test, expect } from '@playwright/test';
import { PAGES, VIEWPORTS, measureOverflow, setLocale, setTheme } from './helpers.mjs';

test.describe('Overflow — no page-level horizontal scroll', () => {
  for (const width of VIEWPORTS) {
    for (const pageInfo of PAGES) {
      test(`${pageInfo.name} @${width}px ar/luxury`, async ({ page }) => {
        await setLocale(page, 'ar');
        await setTheme(page, 'luxury-rose');
        await page.setViewportSize({ width, height: 900 });
        await page.goto(pageInfo.path, { waitUntil: 'networkidle' });
        await page.waitForTimeout(400);
        const m = await measureOverflow(page);
        expect(m.overflow, `${pageInfo.path} overflow ${m.overflow}px at ${width}`).toBeLessThanOrEqual(1);
      });
    }
  }
});
