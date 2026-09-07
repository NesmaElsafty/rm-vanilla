from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8080/"
VIEWPORTS = [(390, 844), (768, 1024), (1366, 768), (1440, 900), (1920, 1080)]


def assert_true(cond, msg):
    if not cond:
        raise AssertionError(msg)


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)

        page.goto(BASE, wait_until="networkidle")
        page.wait_for_timeout(400)

        bar = page.locator(".hero-portrait .portrait-name.portrait-name-bar")
        assert_true(bar.count() == 1, "bar missing")
        title = bar.locator(".portrait-name-title").inner_text().strip()
        name = bar.locator(".portrait-name-text").inner_text().strip()
        assert_true(title == "مدربة وعي ذاتي وروحي", f"AR title: {title}")
        assert_true(name == "Dr. Rana Mosaad", f"AR name: {name}")

        metrics = page.evaluate(
            """() => {
              const frame = document.querySelector('.hero-portrait .portrait-frame');
              const bar = document.querySelector('.hero-portrait .portrait-name');
              const img = frame.querySelector('img');
              const vines = document.querySelectorAll('.hero-portrait .portrait-vine');
              const fr = frame.getBoundingClientRect();
              const br = bar.getBoundingClientRect();
              const cs = getComputedStyle(bar);
              return {
                imgSrc: img?.getAttribute('src'),
                vineCount: vines.length,
                barInside:
                  br.left >= fr.left - 1 &&
                  br.right <= fr.right + 1 &&
                  br.bottom <= fr.bottom + 1 &&
                  br.top > fr.top + fr.height * 0.45,
                position: cs.position,
                opacity: parseFloat(cs.opacity),
                overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
              };
            }"""
        )
        print(metrics)
        assert_true(metrics["imgSrc"] == "assets/images/dr_rana_portrait.png", "image changed")
        assert_true(metrics["vineCount"] == 2, "vines missing")
        assert_true(metrics["barInside"], "bar not over lower portrait")
        assert_true(metrics["position"] == "absolute", "not absolute")
        assert_true(not metrics["overflow"], "overflow")

        page.locator('[data-locale-set="en"]').click()
        page.wait_for_timeout(250)
        assert_true(
            bar.locator(".portrait-name-title").inner_text().strip()
            == "Self-Awareness & Spiritual Coach",
            "EN title",
        )
        assert_true(bar.locator(".portrait-name-text").inner_text().strip() == "Dr. Rana Mosaad", "EN name")

        page.locator('[data-locale-set="ar"]').click()
        page.wait_for_timeout(200)

        for w, h in VIEWPORTS:
            page.set_viewport_size({"width": w, "height": h})
            page.wait_for_timeout(100)
            ok = page.evaluate(
                """() => {
                  const frame = document.querySelector('.hero-portrait .portrait-frame');
                  const bar = document.querySelector('.hero-portrait .portrait-name');
                  const fr = frame.getBoundingClientRect();
                  const br = bar.getBoundingClientRect();
                  return (
                    br.width > 80 &&
                    br.left >= fr.left - 2 &&
                    br.right <= fr.right + 2 &&
                    br.bottom <= fr.bottom + 2 &&
                    document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1
                  );
                }"""
            )
            assert_true(ok, f"viewport fail {w}x{h}")
            print("ok", w, h)

        assert_true(not errors, f"errors: {errors}")
        print("HERO PORTRAIT NAME BAR QA PASSED")
        browser.close()


if __name__ == "__main__":
    main()
