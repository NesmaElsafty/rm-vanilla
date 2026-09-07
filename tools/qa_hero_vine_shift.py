from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path("tools/qa_out")
OUT.mkdir(parents=True, exist_ok=True)
VIEWPORTS = [(1366, 768), (1440, 900), (1920, 1080)]


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)

        for w, h in VIEWPORTS:
            page.set_viewport_size({"width": w, "height": h})
            page.goto("http://127.0.0.1:8080/", wait_until="networkidle")
            page.evaluate("() => document.getElementById('hero')?.classList.add('hero-is-ready')")
            page.wait_for_timeout(400)

            metrics = page.evaluate(
                """() => {
                  const front = document.querySelector('#hero .portrait-vine--front');
                  const back = document.querySelector('#hero .portrait-vine--back');
                  const img = document.querySelector('#hero .portrait-frame img');
                  const fcs = getComputedStyle(front);
                  const bcs = getComputedStyle(back);
                  const fr = front.getBoundingClientRect();
                  const ir = img.getBoundingClientRect();
                  return {
                    frontLeft: fcs.left,
                    backRight: bcs.right,
                    frontTransform: fcs.transform,
                    backTransform: bcs.transform,
                    imgSrc: img.getAttribute('src'),
                    frontVsImg: Math.round(ir.left - fr.left),
                    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
                  };
                }"""
            )
            print(w, h, metrics)
            # -21% of ~360px ≈ -76px (was -14% ≈ -50px → ~25px left)
            assert -85 <= float(metrics["frontLeft"].replace("px", "")) <= -65, metrics
            assert metrics["backRight"].endswith("px") and float(metrics["backRight"].replace("px", "")) < 0
            assert "matrix(-0.984808" in metrics["frontTransform"] or "matrix(-0.98" in metrics["frontTransform"]
            assert metrics["imgSrc"] == "assets/images/dr_rana_portrait.png"
            assert not metrics["overflow"], f"overflow at {w}x{h}"
            page.locator("#hero .hero-portrait").screenshot(path=str(OUT / f"hero-vine-{w}.png"))

        assert not errors, errors
        print("LEFT VINE SHIFT QA PASSED")
        browser.close()


if __name__ == "__main__":
    main()
