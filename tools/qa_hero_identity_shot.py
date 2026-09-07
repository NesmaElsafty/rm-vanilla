from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path("tools/qa_out")
OUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1680, "height": 980})
    page.goto("http://127.0.0.1:8080/index.html", wait_until="networkidle")
    page.evaluate(
        """() => {
          document.documentElement.classList.add('js');
          document.getElementById('hero')?.classList.add('hero-is-ready');
          document.querySelectorAll('link[rel=stylesheet]').forEach((l) => {
            l.href = l.href.split('?')[0] + '?v=' + Date.now();
          });
        }"""
    )
    page.wait_for_timeout(900)
    print(
        page.evaluate(
            """() => {
              const bar = document.querySelector('#hero .hero-portrait-identity');
              const cs = getComputedStyle(bar);
              const br = bar.getBoundingClientRect();
              const img = document.querySelector('#hero .portrait-frame img').getBoundingClientRect();
              return {
                opacity: cs.opacity,
                visibility: cs.visibility,
                display: cs.display,
                zIndex: cs.zIndex,
                height: br.height,
                width: br.width,
                barLeft: br.left,
                imgLeft: img.left,
                diff: img.left - br.left,
                position: cs.position,
                textAlign: cs.textAlign,
              };
            }"""
        )
    )
    page.locator("#hero").screenshot(path=str(OUT / "hero-section-identity.png"))
    page.screenshot(
        path=str(OUT / "hero-viewport-identity.png"),
        clip={"x": 250, "y": 80, "width": 520, "height": 620},
    )
    browser.close()
