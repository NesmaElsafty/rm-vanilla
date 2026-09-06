# Laravel migration plan

This Vanilla project is structured so it can become server-rendered Blade with database content.

## Page mapping

```text
index.html
→ resources/views/pages/home.blade.php

about.html
→ resources/views/pages/about.blade.php

policies.html
→ resources/views/pages/policies.blade.php

recorded-sessions.html
→ resources/views/recorded-sessions/index.blade.php

program-detail.html?slug=example
→ resources/views/programs/show.blade.php

workshop-detail.html?slug=example
→ resources/views/workshops/show.blade.php

session-detail.html?slug=example
→ resources/views/sessions/show.blade.php

recorded-session-detail.html?slug=example
→ resources/views/recorded-sessions/show.blade.php

retreat-detail.html?slug=upcoming
→ resources/views/retreats/show.blade.php
```

Suggested layout:

```text
resources/views/
├── layouts/app.blade.php
├── components/
│   ├── navbar.blade.php
│   ├── footer.blade.php
│   ├── whatsapp-widget.blade.php
│   ├── program-card.blade.php
│   └── testimonial-card.blade.php
├── partials/
│   ├── backdrop.blade.php
│   ├── hero.blade.php
│   ├── about-blocks.blade.php
│   ├── featured-programs.blade.php
│   ├── testimonials.blade.php
│   ├── final-cta.blade.php
│   └── contact.blade.php
├── pages/
├── programs/
├── workshops/
├── sessions/
├── recorded-sessions/
└── retreats/
```

## Reusable UI mapping

```text
Navbar
→ resources/views/components/navbar.blade.php

Footer
→ resources/views/components/footer.blade.php

WhatsApp button
→ resources/views/components/whatsapp-widget.blade.php

Program / workshop / session card
→ resources/views/components/program-card.blade.php

Featured homepage cards
→ resources/views/components/featured-offer-card.blade.php

Detail gallery
→ resources/views/components/detail-gallery.blade.php

Section heading
→ resources/views/components/keynote-header.blade.php
```

CSS in `assets/css/` can move to `public/css/` (or Vite only for concatenation — not required). JS modules can move to `public/js/`.

## Data flow

```text
Temporary JS mock data
        ↓
Laravel Model
        ↓
Controller
        ↓
Blade view
```

Examples:

```text
data/programs.js          → App\Models\Program
data/workshops.js         → App\Models\Workshop
data/sessions.js          → App\Models\PrivateSession
data/recorded-sessions.js → App\Models\RecordedSession
data/retreats.js          → App\Models\Retreat
data/testimonials.js      → App\Models\Testimonial
data/content.js           → lang/ar/*.php + lang/en/*.php
data/policies.js          → PolicySection model or lang files
```

Homepage featured cards stay Blade markup:

```blade
@foreach($featuredOffers as $offer)
  <article class="program-card glass-slide glow-card">
    ...
  </article>
@endforeach
```

Detail pages should stop using `URLSearchParams`. Render the selected entity in Blade instead of `detail-pages.js` HTML generation.

## Routing

```text
program-detail.html?slug=example
→ /programs/{program:slug}

workshop-detail.html?slug=example
→ /workshops/{workshop:slug}

session-detail.html?slug=example
→ /sessions/{session:slug}

recorded-session-detail.html?slug=example
→ /recorded-sessions/{recordedSession:slug}

retreat-detail.html?slug=upcoming
→ /retreats/{retreat:slug}
```

Use Laravel route model binding. Keep normal `<a href="{{ route('programs.show', $program) }}">` links.

Homepage section links become `/#programs` or named routes with fragments.

## Localization

```text
data-i18n="nav.home"
→ {{ __('nav.home') }}
```

Keep `html lang` and `dir` on the document from the active locale (`ar` → `rtl`, `en` → `ltr`). Laravel can set this in `layouts/app.blade.php`.

`localStorage` language switching can remain as a progressive enhancement, or be replaced by `/locale/{locale}` that sets the session locale and reloads.

## Theme

`data-theme` + CSS variables can stay. Persist via cookie if the theme should survive across devices; otherwise keep `localStorage` (`rana-site-theme`).

## Images

Move `assets/images/` to `public/images/` or Laravel storage.

```text
assets/images/programs/program-apg.png
→ /images/programs/program-apg.png
or Storage::url($program->image)
```

Admin-managed images should use the storage disk; seed the current files as initial media.

## Forms

`#booking-form-element` is already a semantic POST-ready form:

```html
name="full_name"
name="phone"
name="email"
name="service_category"
name="sub_option"
name="message"
```

Laravel target:

```text
POST /contact
→ ContactController@store
→ validation
→ persist submission
→ optional WhatsApp/email notification
```

Keep the WhatsApp export link as a secondary action. Do not treat client-side `preventDefault()` as the final backend.

Add `@csrf` when the form posts to Laravel.

## SEO

Each HTML file already has `title`, `meta description`, and Open Graph tags. In Blade:

```blade
<title>{{ $page->seo_title }}</title>
<meta name="description" content="{{ $page->seo_description }}">
<meta property="og:image" content="{{ $page->og_image }}">
```

Detail templates should receive those fields from the model, not from JavaScript.

## JavaScript after migration

Keep only behavior modules:

- navigation (mobile menu, scroll state)
- theme / language if still client-side
- sliders
- galleries
- form helpers (WhatsApp URL, success panel)
- reveal animations

Remove `detail-pages.js` entity rendering once Blade outputs the same markup.

## Suggested first Laravel steps

1. Copy CSS/JS/images into `public/`.
2. Create `layouts/app.blade.php` from shared chrome.
3. Convert `index.html` to `home.blade.php` with `@yield` / `@section`.
4. Extract navbar/footer/WhatsApp into Blade components.
5. Replace `data/programs.js` loops with Eloquent + `@foreach`.
6. Add real routes and route-model-bound show pages.
7. Wire the contact form to a controller.
8. Move i18n strings into `lang/`.
