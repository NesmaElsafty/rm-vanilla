# Dr. Rana Mosaad — Vanilla frontend

Standalone HTML5 + CSS3 + Vanilla JavaScript rebuild of the existing React marketing site. No build step, no npm frontend dependencies, no React/Tailwind/Vite.

This project is independent of `../ranamosaad`. It can run after the React project is removed.

## How to run

Serve the folder over HTTP (ES modules do not load reliably from `file://`).

```bash
cd ranamosaad-vanilla
python -m http.server 8080
```

Then open `http://localhost:8080`.

Any static server works (VS Code Live Server, `npx serve`, Laravel `public/`, nginx, etc.).

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

Homepage section hashes: `#hero`, `#about`, `#programs`, `#testimonials`, `#final-cta`, `#contact`.

Contact prefill: `index.html?scroll=contact&program=apg`

Policies highlight: `policies.html?highlight=cancellation-refund`

## Project structure

```text
ranamosaad-vanilla/
├── index.html
├── about.html
├── policies.html
├── recorded-sessions.html
├── program-detail.html
├── workshop-detail.html
├── session-detail.html
├── recorded-session-detail.html
├── retreat-detail.html
├── assets/
│   ├── images/
│   ├── css/
│   │   ├── main.css
│   │   ├── variables.css
│   │   ├── reset.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── pages.css
│   │   ├── animations.css
│   │   └── responsive.css
│   └── js/
│       ├── main.js
│       ├── theme.js
│       ├── language.js
│       ├── navigation.js
│       ├── sliders.js
│       ├── forms.js
│       ├── galleries.js
│       ├── animations.js
│       ├── modals.js
│       ├── detail-pages.js
│       ├── icons.js
│       └── svg-decor.js
├── data/
├── REFERENCE_AUDIT.md
├── LARAVEL_MIGRATION.md
└── README.md
```

## Language

- Default: Arabic (`lang="ar"` `dir="rtl"`)
- Toggle stores `localStorage.rana-site-locale` (`ar` | `en`)
- `data-i18n` attributes update static copy
- Entity content (programs, workshops, sessions, testimonials) is bilingual in `data/`

## Theme

- Default: `luxury-rose` (dark)
- Alternate: `cream-elegance` (light)
- Stored as `localStorage.rana-site-theme`
- Applied before first paint via an inline boot script in each HTML file

## Sliders

`assets/js/sliders.js` recreates the floating modal carousel:

- Previous / next
- Dots
- Touch / native horizontal scroll
- Mouse pause on hover
- RTL-aware chevrons
- Keyboard arrows on nav buttons
- Optional autoplay (3.2s), skipped when `prefers-reduced-motion`
- Infinite loop via triplicated slides

The homepage testimonial block is a one-at-a-time slider (not the floating card carousel).

## JavaScript modules

| File | Responsibility |
| --- | --- |
| `main.js` | Boot order and localechange refresh |
| `theme.js` | Theme tokens + toggle |
| `language.js` | Locale, `dir`, i18n text |
| `navigation.js` | Navbar, mobile menu, scroll spy, hashes |
| `modals.js` | Training / workshops / private / recorded dialogs |
| `sliders.js` | Floating cards + testimonials |
| `forms.js` | Contact form + WhatsApp widget |
| `galleries.js` | Detail / about galleries |
| `animations.js` | Reveal-on-scroll |
| `detail-pages.js` | Slug templates + policies |
| `icons.js` | Inline SVG icons |
| `svg-decor.js` | Botanical vines + journey curve |

JavaScript enhances HTML. Homepage structure, about, policies chrome, nav, footer, and contact form exist as real markup.

## Mock dynamic data

Temporary stand-ins for future database entities:

- `data/programs.js`
- `data/workshops.js`
- `data/sessions.js`
- `data/recorded-sessions.js`
- `data/retreats.js`
- `data/testimonials.js`

UI strings live in `data/content.js`. Policy sections live in `data/policies.js`.

## Images

Local copies under `assets/images/` (logo, portraits, programs, sessions, testimonials, about/APG/retreat galleries). Nothing links back to the React project.

## Visual comparison

The React app at `../ranamosaad` is the visual source of truth. Compare side by side:

1. React: `npm run dev` in `ranamosaad` (usually `http://localhost:3000`).
2. Vanilla: `python -m http.server 8080` in this folder (`http://localhost:8080`).
3. Use the same viewport, language, and theme.

Check at least: 375, 390, 430, 768, 1024, 1280, 1440, and 1920px. Switch Arabic/English and luxury-rose / cream-elegance on every page.
