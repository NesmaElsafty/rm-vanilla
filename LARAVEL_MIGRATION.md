# Laravel migration plan

This Vanilla site is structured to become server-rendered Blade with database content. `qa/` is development-only and must not be deployed.

## Page → Blade mapping

| Vanilla page | Blade view |
| --- | --- |
| `index.html` | `resources/views/pages/home.blade.php` |
| `about.html` | `resources/views/pages/about.blade.php` |
| `policies.html` | `resources/views/pages/policies.blade.php` |
| `recorded-sessions.html` | `resources/views/recorded-sessions/index.blade.php` |
| `program-detail.html?slug=` | `resources/views/programs/show.blade.php` |
| `workshop-detail.html?slug=` | `resources/views/workshops/show.blade.php` |
| `session-detail.html?slug=` | `resources/views/sessions/show.blade.php` |
| `recorded-session-detail.html?slug=` | `resources/views/recorded-sessions/show.blade.php` |
| `retreat-detail.html?slug=` | `resources/views/retreats/show.blade.php` |

Suggested tree:

```text
resources/views/
├── layouts/app.blade.php
├── components/          # see below
├── partials/            # hero, about, programs, testimonials, cta, contact, backdrop
├── pages/
├── programs/
├── workshops/
├── sessions/
├── recorded-sessions/
└── retreats/
```

Routes (route-model binding):

```text
/programs/{program:slug}
/workshops/{workshop:slug}
/sessions/{session:slug}
/recorded-sessions/{recordedSession:slug}
/retreats/{retreat:slug}
```

## Assets → public mapping

```text
assets/css/**     → public/css/     (or Vite concat only — not required)
assets/js/**      → public/js/
assets/images/**  → public/images/  (or Storage for admin-managed media)
```

Update paths in Blade (`asset('css/main.css')`, etc.). Seed current image files as initial media when moving to storage.

## Data → Models mapping

Only `.js` seeders remain (JSON duplicates removed). Runtime loaders + bilingual seeders map to Eloquent:

| Vanilla | Laravel |
| --- | --- |
| `data/programs.js` + `programs-seeder.js` (+ `.en.js`) | `App\Models\Program` |
| `data/workshops.js` + `workshops-seeder.js` (+ `.en.js`) | `App\Models\Workshop` |
| `data/sessions.js` + `sessions-seeder.js` (+ `.en.js`) | `App\Models\PrivateSession` |
| `data/recorded-sessions.js` + `recorded-sessions-seeder.js` (+ `.en.js`) | `App\Models\RecordedSession` |
| `data/retreats.js` | `App\Models\Retreat` |
| `data/testimonials.js` | `App\Models\Testimonial` |
| `data/content.js` | `lang/ar/*.php` + `lang/en/*.php` |
| `data/policies.js` | `PolicySection` model or lang files |

See `data/DATA.md` for the single source of truth layout.

## JavaScript after migration

### Keep (client-side enhancement)

- `theme.js` — theme tokens / toggle
- `language.js` — locale enhancement (or replace with `/locale/{locale}` session switch)
- `sliders.js` — floating modal carousels + testimonials
- `modals.js` — training / workshops / private / recorded dialogs
- `forms.js` — WhatsApp helper, success panel, client validation UX
- `galleries.js` — detail / about gallery controls
- `animations.js` — reveal-on-scroll
- `navigation.js` — mobile menu, scroll spy, hashes
- `icons.js` / `svg-decor.js` — inline SVG helpers if still needed

### Remove

- **`detail-pages.js` entity HTML generation** — once Blade renders the detail shells. Detail pages already have HTML shells with `data-*` hooks (`data-detail-root`, slots, gallery host). Blade should fill those (or equivalent markup) from the model; drop `URLSearchParams` slug rendering and `innerHTML` templates.

## Recommended Blade components

```text
x-navbar
x-footer
x-whatsapp-widget
x-program-card
x-featured-offer-card
x-detail-gallery
x-keynote-header
x-testimonial-card
```

Partials for homepage sections: backdrop, hero, about-blocks, featured-programs, testimonials, final-cta, contact.

## Forms → POST /contact

`#booking-form-element` is POST-ready:

```text
full_name, phone, email, service_category, sub_option, message
```

Laravel target:

```text
POST /contact
→ ContactController@store
→ validate → persist → optional WhatsApp/email notification
```

Add `@csrf`. Keep WhatsApp export as a secondary client action only.

## Localization & theme

- `data-i18n="nav.home"` → `{{ __('nav.home') }}`
- Set `html lang` / `dir` in `layouts/app.blade.php` (`ar` → `rtl`)
- `data-theme` + CSS variables can stay; cookie optional for cross-device theme

## SEO

Pass `title`, description, and OG fields from the controller/model into the layout. Detail pages should not rely on JS for primary meta.

## Deploy note

**Do not deploy `qa/`** (Playwright, screenshots) or `node_modules/`. Public document root should be Blade/`public` assets only.

## Suggested first steps

1. Copy CSS/JS/images into `public/`.
2. Create `layouts/app.blade.php` from shared chrome.
3. Convert `index.html` → `home.blade.php`.
4. Extract navbar/footer/WhatsApp components.
5. Replace `data/*.js` loops with Eloquent + `@foreach`.
6. Add show routes with model binding; Blade fills detail shells.
7. Wire contact form to `POST /contact`.
8. Move i18n into `lang/`.
