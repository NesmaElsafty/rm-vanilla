# Data — single source of truth

All site copy and entity content live in JavaScript modules. There are **no JSON duplicates**.

| Module | Role |
| --- | --- |
| `programs.js` + `programs-seeder.js` (+ `.en.js`) | Training programs |
| `workshops.js` + `workshops-seeder.js` (+ `.en.js`) | Workshops |
| `sessions.js` + `sessions-seeder.js` (+ `.en.js`) | Private sessions |
| `recorded-sessions.js` + `recorded-sessions-seeder.js` (+ `.en.js`) | Recorded sessions |
| `retreats.js` | Retreats & events |
| `testimonials.js` | Testimonials |
| `content.js` | UI strings (nav, forms, detail chrome, i18n) |
| `policies.js` | Policy sections |

Loaders (`programs.js`, etc.) normalize seeders for the frontend. Bilingual seeders (`.en.js`) supply English entity fields. For Laravel, these become Eloquent models / `lang` files — see `../LARAVEL_MIGRATION.md`.
