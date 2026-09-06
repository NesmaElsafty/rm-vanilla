# Reference audit

The React project at `../ranamosaad` is a **read-only visual and behavioral reference**. This file maps that reference to the standalone Vanilla implementation and the future Laravel Blade layout.

## Routes → pages

| React route | Vanilla page | Future Laravel |
| --- | --- | --- |
| `/` | `index.html` | `resources/views/pages/home.blade.php` |
| `/about` | `about.html` | `resources/views/pages/about.blade.php` |
| `/policies` | `policies.html` | `resources/views/pages/policies.blade.php` |
| `/recorded-sessions` | `recorded-sessions.html` | `resources/views/recorded-sessions/index.blade.php` |
| `/programs/:slug` | `program-detail.html?slug=` | `resources/views/programs/show.blade.php` |
| `/workshops/:slug` | `workshop-detail.html?slug=` | `resources/views/workshops/show.blade.php` |
| `/sessions/:slug` | `session-detail.html?slug=` | `resources/views/sessions/show.blade.php` |
| `/recorded-sessions/:slug` | `recorded-session-detail.html?slug=` | `resources/views/recorded-sessions/show.blade.php` |
| `/retreats/:slug` | `retreat-detail.html?slug=` | `resources/views/retreats/show.blade.php` |

## Shared chrome

| React reference | Vanilla | Future Laravel |
| --- | --- | --- |
| `src/components/Navbar.tsx` | Shared navbar in each HTML file | `resources/views/components/navbar.blade.php` |
| `src/components/Footer.tsx` | Shared footer in each HTML file | `resources/views/components/footer.blade.php` |
| `src/components/LuxuryBackdrop.tsx` | `.luxury-backdrop` layers | `resources/views/partials/backdrop.blade.php` |
| `src/components/WhatsAppButton.tsx` | `#whatsapp-floating-component` | `resources/views/components/whatsapp-widget.blade.php` |
| `src/components/BrandLogo.tsx` | `assets/images/rana-logo.png` | Blade image component |
| `src/components/LanguageSwitcher.tsx` | `[data-locale-toggle]` + `assets/js/language.js` | Locale middleware + Blade switcher |
| `src/components/ThemeSwitcher.tsx` | `[data-theme-toggle]` + `assets/js/theme.js` | Optional cookie/session theme |

## Homepage sections

| React reference | Vanilla | Future Laravel |
| --- | --- | --- |
| `src/pages/HomePage.tsx` | `index.html` | `pages/home.blade.php` |
| `src/components/Hero.tsx` | `#hero` | `@include('partials.hero')` |
| `src/components/About.tsx` | `#about` | `@include('partials.about-blocks')` |
| `src/components/Programs.tsx` | `#programs` + modal markup | `@include('partials.featured-programs')` |
| `src/components/Testimonials.tsx` | `#testimonials` + `#testimonials-slider` | `@include('partials.testimonials')` |
| `src/components/FinalCTA.tsx` | `#final-cta` | `@include('partials.final-cta')` |
| `src/components/Contact.tsx` | `#contact` + `#booking-form-element` | `@include('partials.contact')` |
| `src/components/FloatingProgramsSlider.tsx` | `#modal-training` + `sliders.js` | Modal + `@foreach` cards |
| `src/components/FloatingWorkshopsSlider.tsx` | `#modal-workshops` | Same pattern |
| `src/components/PrivateSessionsSlider.tsx` | `#modal-private` | Same pattern |
| `src/components/RecordedSessionsSlider.tsx` | `#modal-recorded` | Same pattern |
| `src/components/BotanicalLineArt.tsx` | `[data-botanical]` + `svg-decor.js` | SVG partial |
| `src/components/PortraitVineWrap.tsx` | `.portrait-vine` wrappers | Portrait partial |
| `src/components/AgentCountries.tsx` | Country chips in contact | Contact partial |

`PortalDashboard.tsx` and `TransformationJourney.tsx` are not rendered on the current homepage, so they were not rebuilt as homepage sections.

## Detail and static pages

| React reference | Vanilla | Future Laravel |
| --- | --- | --- |
| `src/pages/AboutPage.tsx` | `about.html` | `pages/about.blade.php` |
| `src/pages/PoliciesPage.tsx` | `policies.html` + `data/policies.js` | `pages/policies.blade.php` |
| `src/pages/RecordedSessionsPage.tsx` | `recorded-sessions.html` | `recorded-sessions/index.blade.php` |
| `src/pages/ProgramDetailPage.tsx` | `program-detail.html` + `detail-pages.js` | `programs/show.blade.php` |
| `src/pages/WorkshopDetailPage.tsx` | `workshop-detail.html` | `workshops/show.blade.php` |
| `src/pages/SessionDetailPage.tsx` | `session-detail.html` | `sessions/show.blade.php` |
| `src/pages/RSDetailsPage.tsx` | `recorded-session-detail.html` | `recorded-sessions/show.blade.php` |
| `src/pages/RetreatDetailPage.tsx` | `retreat-detail.html` | `retreats/show.blade.php` |
| `src/components/DetailGallery.tsx` | `.program-detail-gallery` + `galleries.js` | Gallery Blade component |

## Content sources

| React reference | Vanilla | Future Laravel |
| --- | --- | --- |
| `src/i18n/ar.ts` + `en.ts` | `data/content.js` | Laravel lang files / `__()` |
| `src/data/programs-seeder*.json` | `data/programs.js` | `Program` model |
| `src/data/workshops-seeder*.json` | `data/workshops.js` | `Workshop` model |
| `src/data/sessions-seeder*.json` | `data/sessions.js` | `Session` model |
| `src/data/recorded-sessions-seeder*.json` | `data/recorded-sessions.js` | `RecordedSession` model |
| `src/data/retreats.ts` | `data/retreats.js` | `Retreat` model |
| `src/i18n` testimonials + `testimonial-links.ts` | `data/testimonials.js` | `Testimonial` model |
| Policies hardcoded in `PoliciesPage.tsx` | `data/policies.js` | Policy sections table or lang files |

## Design system

| React reference | Vanilla |
| --- | --- |
| `src/index.css` | `assets/css/*.css` |
| `src/themes/luxury-rose.ts` | `:root` + `theme.js` |
| `src/themes/cream-elegance.ts` | `[data-theme="cream-elegance"]` + `theme.js` |
| `src/context/ThemeContext.tsx` | `assets/js/theme.js` (`rana-site-theme`) |
| `src/context/LanguageContext.tsx` | `assets/js/language.js` (`rana-site-locale`) |
| Tailwind layout classes | Semantic classes in `layout.css` |
| Lucide React | Inline SVG via `assets/js/icons.js` |
| Motion / Framer Motion | CSS keyframes + `IntersectionObserver` in `animations.js` |
| Swiper (not used) | Custom slider in `sliders.js` |

## Interactions

| Behavior | Vanilla module |
| --- | --- |
| Mobile menu, scroll spy, hash scroll | `navigation.js` |
| Language + `dir`/`lang` | `language.js` |
| Theme + CSS variables | `theme.js` |
| Program/workshop/session/recorded modals | `modals.js` |
| Infinite floating slider | `sliders.js` |
| Contact form + WhatsApp export | `forms.js` |
| Galleries | `galleries.js` |
| Detail tabs / related / FAQ | `detail-pages.js` |
| Reveal-on-scroll | `animations.js` |

## Assets

All required images were copied into `assets/images/` (portraits, logo, programs, sessions, testimonials, galleries). The Vanilla site does not reference the React project at runtime.
