from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path("tools/qa_out")
OUT.mkdir(parents=True, exist_ok=True)


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1680, "height": 980})
        page.goto("http://127.0.0.1:8080/index.html", wait_until="networkidle")
        page.evaluate(
            """() => {
              document.getElementById('hero')?.classList.add('hero-is-ready');
              document.querySelectorAll('link[rel=stylesheet]').forEach((l) => {
                l.href = l.href.split('?')[0] + '?v=' + Date.now();
              });
            }"""
        )
        page.wait_for_timeout(700)

        report = page.evaluate(
            """() => {
              const arch = document.querySelector('#hero .portrait-arch');
              const bar = document.querySelector('#hero .portrait-name-bar.portrait-name');
              const frame = document.querySelector('#hero .portrait-frame');
              const img = document.querySelector('#hero .portrait-frame img');
              const name = bar?.querySelector('.portrait-name-text');
              const cs = getComputedStyle(bar);
              const br = bar.getBoundingClientRect();
              const ar = arch.getBoundingClientRect();
              const ir = img.getBoundingClientRect();
              return {
                parentIsArch: bar.parentElement === arch,
                afterFrame: bar.previousElementSibling === frame,
                hasKeynote: name?.classList.contains('keynote-headline'),
                hasIdentityHack: bar.classList.contains('hero-portrait-identity'),
                position: cs.position,
                bottom: cs.bottom,
                insetInline: cs.insetInline,
                textAlign: cs.textAlign,
                barLeft: Math.round(br.left),
                imgLeft: Math.round(ir.left),
                archLeft: Math.round(ar.left),
                barWidth: Math.round(br.width),
                archWidth: Math.round(ar.width),
                leftDiff: Math.round(br.left - ir.left),
                rightDiff: Math.round(ir.right - br.right),
              };
            }"""
        )
        page.locator("#hero .hero-portrait").screenshot(path=str(OUT / "hero-identity-restored.png"))
        print(report)
        assert report["parentIsArch"], "bar must be inside .portrait-arch"
        assert report["afterFrame"], "bar must follow .portrait-frame"
        assert report["hasKeynote"], "name must have keynote-headline"
        assert not report["hasIdentityHack"], "hero-portrait-identity must be removed"
        assert report["textAlign"] == "start", report
        assert report["position"] == "relative", report
        # ~20px overhang left / inset right (old inset-inline: 5% geometry)
        assert abs(report["leftDiff"] + 18) <= 6, report
        assert abs(report["rightDiff"] - 18) <= 6, report
        print("RESTORE QA PASSED")
        print(f"left overhang ~{-report['leftDiff']}px, right inset ~{report['rightDiff']}px")
        browser.close()


if __name__ == "__main__":
    main()
