"""Inject the shared page loader into every public HTML page."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

INLINE_CSS = """  <style id="page-loader-critical">
    html.page-loading{background-color:var(--theme-bg,#071424)}
    html.page-loading body{overflow:hidden}
    .page-loader{position:fixed;inset:0;z-index:4000;display:flex;align-items:center;justify-content:center;background:#071424;transition:opacity .25s ease}
    html[data-theme="cream-elegance"] .page-loader{background:#F8F3EB}
    .page-loader-inner{display:flex;flex-direction:column;align-items:center;gap:1rem}
    .page-loader-logo{width:5.5rem;height:auto;display:block}
    .page-loader-spinner{width:1.35rem;height:1.35rem;border:1.5px solid rgba(199,154,59,.28);border-top-color:#C79A3B;border-radius:50%;animation:page-loader-spin .85s linear infinite}
    .page-loader-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
    html.page-is-ready .page-loader{opacity:0;pointer-events:none}
    html.page-loading-reduce .page-loader-spinner,html.page-is-ready .page-loader{animation:none}
    @keyframes page-loader-spin{to{transform:rotate(360deg)}}
    @media (prefers-reduced-motion:reduce){.page-loader-spinner,html.page-is-ready .page-loader{animation:none;transition:none}}
  </style>"""

LOADER_HTML = """  <div id="page-loader" class="page-loader" role="status" aria-live="polite">
    <div class="page-loader-inner">
      <img src="assets/images/rana-logo.webp" alt="" class="page-loader-logo" width="96" height="96">
      <span class="page-loader-spinner" aria-hidden="true"></span>
      <span class="page-loader-label">
        <span lang="ar">جاري التحميل...</span>
        <span lang="en">Loading...</span>
      </span>
    </div>
  </div>"""

INDEX_PRELOAD = """  <link rel="preload" as="image" type="image/webp" href="assets/images/dr_rana_portrait-720.webp" imagesrcset="assets/images/dr_rana_portrait-480.webp 480w, assets/images/dr_rana_portrait-720.webp 720w" imagesizes="(max-width: 767px) 280px, 360px">"""
ABOUT_PRELOAD = """  <link rel="preload" as="image" type="image/webp" href="assets/images/about-800.webp" imagesrcset="assets/images/about-800.webp 800w, assets/images/about-1400.webp 1362w" imagesizes="(max-width: 767px) 70vw, 420px">"""

CRITICAL = {
    "index.html": "#hero img",
    "about.html": ".about-s1 img",
    "programs-details.html": ".program-detail-image, .program-detail-hero img",
    "programs-transformation-details.html": ".program-transform-hero__image",
    "programs-methodology-details.html": "[data-pm-hero-image], .program-methodology-hero img, .program-detail-image",
    "programs-spiritual-details.html": ".program-spiritual-hero img, [data-ps-image]",
    "programs-practical-details.html": ".program-practical-hero img, [data-pp-image]",
    "programs-feminine-details.html": ".program-feminine-hero img, [data-pf-image]",
    "private-sessions-details.html": ".session-hero__photo, [data-critical-hero]",
    "recorded-sessions-details.html": ".session-hero__photo, [data-critical-hero]",
    "workshops-details.html": ".program-detail-image, [data-critical-hero]",
    "retreat-detail.html": ".program-detail-image, [data-critical-hero]",
    "recorded-sessions.html": "",
    "policies.html": "",
}


def patch(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    name = path.name

    if "classList.add('page-loading')" not in text:
        text = text.replace(
            "document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';",
            "document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';\n"
            "        document.documentElement.classList.add('page-loading');",
            1,
        )

    if 'id="page-loader-critical"' not in text:
        preload = ""
        if name == "index.html":
            preload = INDEX_PRELOAD + "\n"
        elif name == "about.html":
            preload = ABOUT_PRELOAD + "\n"
        text = text.replace(
            "  <link rel=\"stylesheet\" href=\"assets/css/main.css\">",
            preload + INLINE_CSS + "\n  <link rel=\"stylesheet\" href=\"assets/css/main.css\">",
            1,
        )

    selector = CRITICAL.get(name, "")
    attr = f' data-critical-image="{selector}"' if selector else ""
    if "data-critical-image" not in text:
        text = text.replace("<body ", f"<body{attr} ", 1)
        text = text.replace("<body>", f"<body{attr}>", 1)

    if 'id="page-loader"' not in text:
        text = text.replace(
            '<a class="skip-link" href="#main-content">Skip to content</a>',
            '<a class="skip-link" href="#main-content">Skip to content</a>\n' + LOADER_HTML,
            1,
        )

    path.write_text(text, encoding="utf-8")
    print("patched", name)


def main() -> None:
    for path in sorted(ROOT.glob("*.html")):
        patch(path)


if __name__ == "__main__":
    main()
