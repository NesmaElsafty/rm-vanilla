from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8080/"


def assert_true(cond, msg):
    if not cond:
        raise AssertionError(msg)


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            has_touch=True,
        )
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on(
            "console",
            lambda m: errors.append(m.text) if m.type == "error" else None,
        )

        page.goto(BASE, wait_until="networkidle")
        page.locator("#testimonials").scroll_into_view_if_needed()
        page.wait_for_timeout(400)

        slides = page.locator(".testimonials-slide")
        assert_true(slides.count() == 20, f"expected all 20 stories, got {slides.count()}")

        # Stable track height across navigation
        heights = []
        for _ in range(5):
            h = page.evaluate(
                "() => document.querySelector('.testimonials-track').getBoundingClientRect().height"
            )
            heights.append(h)
            page.locator("[data-testimonial-next]").click()
            page.wait_for_timeout(320)
        assert_true(max(heights) - min(heights) < 2, f"track height jumped: {heights}")

        # Localized aria
        prev = page.locator("[data-testimonial-prev]").get_attribute("aria-label")
        next_label = page.locator("[data-testimonial-next]").get_attribute("aria-label")
        assert_true(prev == "الشهادة السابقة", f"ar prev aria: {prev}")
        assert_true(next_label == "الشهادة التالية", f"ar next aria: {next_label}")

        # Dot a11y pattern
        dot = page.locator('[data-testimonial-dot="0"]').get_attribute("aria-label")
        assert_true(dot and "قصة 1 من 20" in dot, f"ar storyOf: {dot}")

        # Compact programs for Mervat (5 programs)
        page.evaluate(
            """() => {
              const slides = [...document.querySelectorAll('[data-testimonial-slide]')];
              const idx = slides.findIndex((s) =>
                (s.querySelector('.testimonials-name')?.textContent || '').includes('مروه') ||
                (s.querySelector('.testimonials-name')?.textContent || '').includes('ميرفت') ||
                (s.querySelector('.testimonials-programs-more') != null)
              );
              if (idx >= 0) document.querySelector(`[data-testimonial-dot="${idx}"]`)?.click();
            }"""
        )
        page.wait_for_timeout(300)
        has_compact = page.locator(".testimonials-slide.is-active .testimonials-programs-more").count()
        # May be Arabic name; if not found, force EN and find Mervat
        if has_compact == 0:
            page.locator('[data-locale-set="en"]').click()
            page.wait_for_timeout(350)
            page.locator("#testimonials").scroll_into_view_if_needed()
            page.wait_for_timeout(200)
            page.evaluate(
                """() => {
                  const slides = [...document.querySelectorAll('[data-testimonial-slide]')];
                  const idx = slides.findIndex((s) =>
                    (s.querySelector('.testimonials-name')?.textContent || '').includes('Mervat')
                  );
                  if (idx >= 0) document.querySelector(`[data-testimonial-dot="${idx}"]`)?.click();
                }"""
            )
            page.wait_for_timeout(300)
            has_compact = page.locator(
                ".testimonials-slide.is-active .testimonials-programs-more"
            ).count()
        assert_true(has_compact == 1, "compact +N programs meta expected")

        # Excerpt + modal
        page.locator('[data-locale-set="en"]').click()
        page.wait_for_timeout(350)
        page.locator("#testimonials").scroll_into_view_if_needed()
        page.wait_for_timeout(200)
        page.locator('[data-testimonial-dot="0"]').click()
        page.wait_for_timeout(250)
        read_full = page.locator(".testimonials-slide.is-active [data-testimonial-read-full]")
        assert_true(read_full.count() == 1, "long story should show Read full story")
        read_full.click()
        page.wait_for_timeout(200)
        modal = page.locator("[data-testimonial-modal]")
        assert_true(modal.is_visible(), "modal open")
        full_len = page.evaluate(
            "() => (document.querySelector('[data-testimonial-modal-body] .testimonials-quote')?.textContent || '').length"
        )
        excerpt_len = page.evaluate(
            "() => (document.querySelector('.testimonials-slide.is-active .testimonials-quote')?.textContent || '').length"
        )
        assert_true(full_len > excerpt_len, f"full ({full_len}) > excerpt ({excerpt_len})")
        page.locator("[data-testimonial-modal-close]").click()
        page.wait_for_timeout(150)
        assert_true(not modal.is_visible(), "modal closed")

        # Keyboard
        page.locator("[data-testimonial-root]").focus()
        before = page.locator(".testimonials-slide.is-active .testimonials-name").inner_text().strip()
        page.keyboard.press("ArrowRight")
        page.wait_for_timeout(280)
        after = page.locator(".testimonials-slide.is-active .testimonials-name").inner_text().strip()
        assert_true(after != before, "ArrowRight should change slide in LTR")

        prev_en = page.locator("[data-testimonial-prev]").get_attribute("aria-label")
        assert_true(prev_en == "Previous story", f"en prev aria: {prev_en}")
        dot_en = page.locator('[data-testimonial-dot="1"]').get_attribute("aria-label")
        assert_true(dot_en and dot_en.startswith("Story 2 of 20"), f"en storyOf: {dot_en}")

        # Corner quote icon (absolute, not a layout row)
        icon_pos = page.evaluate(
            """() => {
              const icon = document.querySelector('.testimonials-slide.is-active .testimonials-quote-icon');
              return getComputedStyle(icon).position;
            }"""
        )
        assert_true(icon_pos == "absolute", f"quote icon position: {icon_pos}")

        # Mobile swipe (pointer events)
        page.set_viewport_size({"width": 390, "height": 844})
        page.locator("#testimonials").scroll_into_view_if_needed()
        page.wait_for_timeout(200)
        name_before = page.locator(".testimonials-slide.is-active .testimonials-name").inner_text().strip()
        box = page.locator("[data-testimonial-root]").bounding_box()
        assert_true(box is not None, "wrap box")
        x = box["x"] + box["width"] * 0.5
        y = box["y"] + box["height"] * 0.35
        idx_before = page.locator(".testimonials-slide.is-active").get_attribute("data-testimonial-slide")
        page.mouse.move(x + 90, y)
        page.mouse.down()
        page.mouse.move(x - 90, y, steps=8)
        page.mouse.up()
        page.wait_for_timeout(320)
        idx_after = page.locator(".testimonials-slide.is-active").get_attribute("data-testimonial-slide")
        assert_true(
            idx_after != idx_before,
            f"swipe should change slide ({idx_before}/{name_before} -> {idx_after})",
        )

        # RTL Arabic
        page.set_viewport_size({"width": 1440, "height": 900})
        page.locator('[data-locale-set="ar"]').click()
        page.wait_for_timeout(350)
        page.locator("#testimonials").scroll_into_view_if_needed()
        page.wait_for_timeout(200)
        dir_attr = page.evaluate("() => document.documentElement.getAttribute('dir')")
        assert_true(dir_attr == "rtl", f"dir={dir_attr}")
        ar_ok = page.evaluate(
            """() => {
              const el = document.querySelector('.testimonials-slide.is-active');
              const s = getComputedStyle(el);
              return s.opacity === '1' && el.getBoundingClientRect().height > 80;
            }"""
        )
        assert_true(ar_ok, "AR card visible")

        assert_true(not errors, f"console errors: {errors}")
        print("ALL TESTIMONIAL UX QA PASSED")
        browser.close()


if __name__ == "__main__":
    main()
