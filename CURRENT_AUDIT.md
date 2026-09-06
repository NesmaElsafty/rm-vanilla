# Current project audit — ranamosaad-vanilla

Audit date: 2026-09-06  
Post-fix status: 2026-09-06  
Scope: this repository only.

---

## Summary

Production hardening pass completed against this repo only. Major P0/P1 items addressed: mobile overflow root causes, detail HTML shells, form validation + WhatsApp submit path, CTA/footer slug links, data seeder dedupe, SEO/a11y polish, and reusable QA.

---

## Resolution status

| ID | Status | Notes |
| --- | --- | --- |
| P0-1 CTA prefill | Fixed | CTAs use `?program=<slug>` |
| P0-2 Fake submit | Fixed | Submit validates, opens WhatsApp, honest success copy |
| P0-3 Validation | Fixed | Field errors + required sub_option |
| P0-4 Empty detail shells | Fixed | Semantic HTML shells + JS populate |
| P0-5 Home overflow | Fixed | Glow/logo/vines/100vw/rings; diagnostic PASS at all widths |
| P1 Dual JSON seeders | Fixed | Removed `*-seeder*.json` |
| P1 Double refreshForms | Fixed | Single listener in forms.js |
| P2 Footer program links | Fixed | Point to `program-detail.html?slug=…` |
| P3 SEO meta | Improved | Canonical, og:type, dynamic detail title/description/image |
| P3 Skip link | Fixed | Added on all pages |
| P3 QA suite | Fixed | `qa/run-diagnostic.mjs`, `qa/run-flows.mjs`, Playwright specs |
| P4 Dead portal CSS | Remaining | Unused portal/journey blocks still in components.css |
| P1 Nav/footer duplication | Remaining | Acceptable until Blade components |

---

## Remaining known issues

1. **Dead CSS** — portal-dashboard / journey / light-portal rules still present (harmless).
2. **Chrome duplication** — navbar/footer/backdrop still copied across 9 HTML pages (Blade will fix).
3. **Recorded library** — static HTML still overwritten by JS for locale cards.
4. **Playwright bundled Chromium** — download may hang; use `npm test` (system Chrome scripts) as primary QA.
5. **Contact backend** — client WhatsApp delivery until Laravel `POST /contact`.
6. **Google Fonts** — several families still loaded; subsetting optional.
7. **Static OG image URLs** — relative on static pages; detail pages absolutize via JS.

---

## QA commands

```bash
python -m http.server 8765
npm test
```
