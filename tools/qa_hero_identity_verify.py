from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path("tools/qa_out")
OUT.mkdir(parents=True, exist_ok=True)


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1680, "height": 980})
        # Bypass stale CSS caches
        page.goto("http://127.0.0.1:8080/index.html", wait_until="networkidle")
        page.evaluate("() => document.querySelectorAll('link[rel=stylesheet]').forEach((l) => { l.href = l.href.split('?')[0] + '?v=' + Date.now(); })")
        page.wait_for_timeout(500)
        page.wait_for_selector(".hero-portrait-identity")
        page.wait_for_timeout(400)

        report = page.evaluate(
            """() => {
              const bar = document.querySelector('#hero .hero-portrait-identity');
              const img = document.querySelector('#hero .portrait-frame img');
              const arch = document.querySelector('#hero .portrait-arch');
              const cs = getComputedStyle(bar);
              const br = bar.getBoundingClientRect();
              const ir = img.getBoundingClientRect();
              const ar = arch.getBoundingClientRect();
              const title = bar.querySelector('.portrait-name-title').getBoundingClientRect();
              return {
                portraitLeft: Math.round(ir.left * 10) / 10,
                barLeft: Math.round(br.left * 10) / 10,
                differencePx: Math.round((ir.left - br.left) * 10) / 10,
                position: cs.position,
                textAlign: cs.textAlign,
                left: cs.left,
                right: cs.right,
                insetInline: cs.insetInline,
                insetInlineStart: cs.insetInlineStart,
                insetInlineEnd: cs.insetInlineEnd,
                width: cs.width,
                transform: cs.transform,
                barWidth: Math.round(br.width),
                archWidth: Math.round(ar.width),
                titleLeftSpace: Math.round(title.left - br.left),
                titleRightGap: Math.round(br.right - title.right),
              };
            }"""
        )

        page.locator("#hero .hero-portrait").screenshot(path=str(OUT / "hero-identity-verified-1680.png"))

        assert report["position"] == "absolute", report
        assert report["textAlign"] == "right", report
        assert 16 <= report["differencePx"] <= 26, report
        assert report["titleLeftSpace"] > report["titleRightGap"] + 40, report
        assert abs(report["barWidth"] - report["archWidth"]) <= 2, report

        print("REPORT")
        print(f"1. portrait left: {report['portraitLeft']}px")
        print(f"2. bar left:      {report['barLeft']}px")
        print(f"3. difference:    {report['differencePx']}px")
        print(f"4. position:      {report['position']}")
        print(f"5. text-align:    {report['textAlign']}")
        print("extra:", report)
        print(f"screenshot: {OUT / 'hero-identity-verified-1680.png'}")
        browser.close()


if __name__ == "__main__":
    main()
