# Dr. Rana Mosaad — Vanilla frontend

Standalone HTML5 + CSS3 + Vanilla JavaScript marketing site. No build step, no npm frontend dependencies, no framework.

Ready to become Laravel Blade + Eloquent later (see `LARAVEL_MIGRATION.md`).

## How to run

Serve the folder over HTTP (ES modules do not load from `file://`):

```bash
cd ranamosaad-vanilla
python -m http.server 8080
```

Open `http://localhost:8080`. Any static server works (Live Server, `npx serve`, nginx, Laravel `public/`).

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| About | `about.html` |
| Policies | `policies.html` |
| Recorded sessions library | `recorded-sessions.html` |
| Program detail | `program-detail.html?slug=apg` |
| Workshop detail | `workshop-detail.html?slug=you-first` |
| Private session detail | `session-detail.html?slug=restore-confidence-self-worth` |
| Recorded session detail | `recorded-session-detail.html?slug=forgiveness` |
| Retreat detail | `retreat-detail.html?slug=upcoming` |

Homepage hashes: `#hero`, `#about`, `#programs`, `#testimonials`, `#final-cta`, `#contact`.  
Contact prefill: `index.html?scroll=contact&program=apg`.  
Policies highlight: `policies.html?highlight=cancellation-refund`.

## Project structure

```text
ranamosaad-vanilla/
├── *.html                 # Pages (real markup + detail shells)
├── assets/css|js|images/  # Styles, modules, media
├── data/                  # JS seeders + UI strings (see data/DATA.md)
├── CURRENT_AUDIT.md       # Project audit (source of truth for known issues)
├── LARAVEL_MIGRATION.md
├── qa/                    # Dev-only Playwright / screenshots — not deployed
└── README.md
```

## Data

All entity and UI copy lives in `data/*.js` (seeders + `content.js` + `policies.js`). There are no JSON duplicates. See `data/DATA.md`.

## Language & theme

- Default locale: Arabic (`lang="ar"` `dir="rtl"`); toggle stores `localStorage.rana-site-locale`
- Themes: `luxury-rose` (default) / `cream-elegance`; `localStorage.rana-site-theme`
- Inline boot script in each HTML applies theme before first paint

## Laravel readiness

HTML is semantic and form fields are POST-ready (`#booking-form-element`). Detail pages use HTML shells with `data-*` hooks; `detail-pages.js` fills slots until Blade owns rendering. Full mapping: `LARAVEL_MIGRATION.md`.

## Docs

- **`CURRENT_AUDIT.md`** — current quality / architecture audit for this repo only
- **`LARAVEL_MIGRATION.md`** — Blade / public / model migration plan
- **`qa/`** — local testing only; exclude from production deploys
