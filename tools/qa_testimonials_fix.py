from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8080/"


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
        page.locator("#testimonials").scroll_into_view_if_needed()
        page.wait_for_timeout(350)

        slides = page.locator(".testimonials-slide")
        active = page.locator(".testimonials-slide.is-active")
        assert_true(slides.count() >= 4, f"expected all homepage slides, got {slides.count()}")
        assert_true(active.count() == 1, "exactly one active")

        metrics = page.evaluate(
            """() => {
          const el = document.querySelector('.testimonials-slide.is-active');
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          const quote = el.querySelector('.testimonials-quote');
          const name = el.querySelector('.testimonials-name');
          return {
            width: r.width,
            height: r.height,
            opacity: s.opacity,
            visibility: s.visibility,
            quoteVisible: !!(quote && quote.getBoundingClientRect().height > 0),
            nameVisible: !!(name && name.getBoundingClientRect().height > 0),
            quoteText: (quote?.textContent || '').trim().slice(0, 40),
            nameText: (name?.textContent || '').trim(),
            animationName: s.animationName,
            inViewport: r.top < innerHeight && r.bottom > 0,
          };
        }"""
        )
        print("active metrics:", metrics)
        assert_true(metrics["width"] > 200, "width")
        assert_true(metrics["height"] > 80, "height")
        assert_true(float(metrics["opacity"]) == 1.0, f"opacity {metrics['opacity']}")
        assert_true(metrics["visibility"] == "visible", "visibility")
        assert_true(metrics["quoteVisible"], "quote visible")
        assert_true(metrics["nameVisible"], "name visible")
        assert_true(metrics["inViewport"], "in viewport")

        first_name = metrics["nameText"]
        page.locator("[data-testimonial-next]").click()
        page.wait_for_timeout(400)
        second_name = page.locator(".testimonials-slide.is-active .testimonials-name").inner_text().strip()
        assert_true(second_name != first_name, "next should change slide")

        page.locator("[data-testimonial-prev]").click()
        page.wait_for_timeout(400)
        back_name = page.locator(".testimonials-slide.is-active .testimonials-name").inner_text().strip()
        assert_true(back_name == first_name, "prev should restore")

        page.locator('[data-testimonial-dot="2"]').click()
        page.wait_for_timeout(400)
        assert_true(
            page.locator('.testimonials-slide.is-active[data-testimonial-slide="2"]').count() == 1,
            "dot 2 active",
        )

        # overflow check
        overflow = page.evaluate("() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
        assert_true(not overflow, "horizontal overflow")

        # English
        page.locator('[data-locale-set="en"]').click()
        page.wait_for_timeout(300)
        page.locator("#testimonials").scroll_into_view_if_needed()
        page.wait_for_timeout(200)
        en_opacity = page.evaluate(
            "() => getComputedStyle(document.querySelector('.testimonials-slide.is-active')).opacity"
        )
        assert_true(float(en_opacity) == 1.0, "en opacity")

        # cream theme
        page.locator("[data-theme-toggle]").click()
        page.wait_for_timeout(250)
        theme = page.evaluate("() => document.documentElement.getAttribute('data-theme')")
        print("theme:", theme)
        cream_ok = page.evaluate(
            """() => {
          const el = document.querySelector('.testimonials-slide.is-active');
          const s = getComputedStyle(el);
          return s.opacity === '1' && el.getBoundingClientRect().height > 80;
        }"""
        )
        assert_true(cream_ok, "cream theme card visible")

        assert_true(not errors, f"console errors: {errors}")
        print("ALL TESTIMONIAL VISIBILITY QA PASSED")
        browser.close()


if __name__ == "__main__":
    main()
