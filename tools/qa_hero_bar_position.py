from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8080/"
OUT = Path("tools/qa_out")
OUT.mkdir(parents=True, exist_ok=True)


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1680, "height": 980})
        page.goto(BASE, wait_until="networkidle")
        page.wait_for_timeout(500)
        page.locator("#hero").scroll_into_view_if_needed()
        page.wait_for_timeout(200)

        metrics = page.evaluate(
            """() => {
              const arch = document.querySelector('.hero-portrait .portrait-arch');
              const frame = document.querySelector('.hero-portrait .portrait-frame');
              const bar = document.querySelector('.hero-portrait .portrait-name');
              const vines = document.querySelectorAll('.hero-portrait .portrait-vine');
              const ar = arch.getBoundingClientRect();
              const fr = frame.getBoundingClientRect();
              const br = bar.getBoundingClientRect();
              const cs = getComputedStyle(bar);
              return {
                archW: ar.width,
                frameW: fr.width,
                barW: br.width,
                widthRatio: br.width / ar.width,
                leftOverhang: ar.left - br.left,
                rightInset: ar.right - br.right,
                bottomGap: ar.bottom - br.bottom,
                barBottomFromFrame: fr.bottom - br.bottom,
                position: cs.position,
                left: cs.left,
                width: cs.width,
                vineCount: vines.length,
                imgSrc: frame.querySelector('img')?.getAttribute('src'),
                clippedByArch: getComputedStyle(arch).overflow,
                clippedByFrame: getComputedStyle(frame).overflow,
                parentOverflow: getComputedStyle(bar.parentElement).overflow,
              };
            }"""
        )
        print(metrics)

        page.locator(".hero-portrait").screenshot(path=str(OUT / "hero-portrait-bar-1680.png"))
        page.screenshot(path=str(OUT / "hero-full-1680.png"), full_page=False)

        assert metrics["widthRatio"] >= 0.95, f"bar too narrow: {metrics['widthRatio']}"
        assert 16 <= metrics["leftOverhang"] <= 26, f"left overhang off: {metrics['leftOverhang']}"
        assert 12 <= metrics["bottomGap"] <= 28, f"bottom gap off: {metrics['bottomGap']}"
        # Right inset should roughly match left overhang (full-width bar shifted left)
        assert abs(metrics["rightInset"] - metrics["leftOverhang"]) < 3, f"asymmetric shift broken: {metrics}"
        align = page.evaluate(
            "() => getComputedStyle(document.querySelector('.hero-portrait .portrait-name')).textAlign"
        )
        assert align == "right", f"text-align should be physical right, got {align}"
        text_geom = page.evaluate(
            """() => {
              const bar = document.querySelector('.hero-portrait .portrait-name');
              const title = bar.querySelector('.portrait-name-title');
              const name = bar.querySelector('.portrait-name-text');
              const br = bar.getBoundingClientRect();
              const tr = title.getBoundingClientRect();
              const nr = name.getBoundingClientRect();
              return {
                titleRightGap: br.right - tr.right,
                nameRightGap: br.right - nr.right,
                titleLeftSpace: tr.left - br.left,
                nameLeftSpace: nr.left - br.left,
              };
            }"""
        )
        print("text_geom", text_geom)
        assert text_geom["titleLeftSpace"] > text_geom["titleRightGap"] + 20, "title not right-biased"
        assert text_geom["nameLeftSpace"] > text_geom["nameRightGap"] + 20, "name not right-biased"
        assert metrics["clippedByArch"] == "hidden", "arch must still clip image"
        assert metrics["clippedByFrame"] == "hidden", "frame must still clip image"
        assert metrics["parentOverflow"] == "visible", "bar parent must not clip"
        assert metrics["imgSrc"] == "assets/images/dr_rana_portrait.png"
        assert metrics["vineCount"] == 2

        # RTL should keep same physical left offset
        page.locator('[data-locale-set="ar"]').click()
        page.wait_for_timeout(250)
        rtl = page.evaluate(
            """() => {
              const arch = document.querySelector('.hero-portrait .portrait-arch').getBoundingClientRect();
              const bar = document.querySelector('.hero-portrait .portrait-name').getBoundingClientRect();
              return { leftOverhang: arch.left - bar.left, widthRatio: bar.width / arch.width };
            }"""
        )
        print("rtl", rtl)
        assert abs(rtl["leftOverhang"] - metrics["leftOverhang"]) < 2, "RTL mirrored bar"
        assert rtl["widthRatio"] >= 0.95

        print("POSITION QA PASSED")
        print(f"screenshots: {OUT}")
        browser.close()


if __name__ == "__main__":
    main()
