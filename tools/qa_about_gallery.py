from playwright.sync_api import sync_playwright

ABOUT_IMGS = [
    "assets/images/gallery/about/about-certification-group.png",
    "assets/images/gallery/about/about-certification-trainer.png",
    "assets/images/gallery/about/about-nstt-2025-group.png",
    "assets/images/gallery/about/about-nstt-speaking.png",
    "assets/images/gallery/about/about-pre-certification.png",
    "assets/images/gallery/about/about-retreat-casual.png",
    "assets/images/gallery/about/about-speaking-event.png",
]


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)

        page.goto("http://127.0.0.1:8080/about.html", wait_until="networkidle")
        page.evaluate("() => localStorage.setItem('rana-site-locale', 'ar')")
        page.reload(wait_until="networkidle")
        page.wait_for_timeout(400)
        page.locator('[data-locale-set="ar"]').click()
        page.wait_for_timeout(250)

        assert "لحظات من مسيرتي" in page.locator("main.about-page").inner_text()
        gallery = page.locator(".about-gallery")
        assert gallery.count() == 1

        # Placement: gallery before close
        order = page.evaluate(
            """() => {
              const nodes = [...document.querySelectorAll('main.about-page .about-chapter')];
              return nodes.map(n => {
                if (n.classList.contains('about-proof')) return 'proof';
                if (n.classList.contains('about-gallery')) return 'gallery';
                if (n.classList.contains('about-close')) return 'close';
                return 'other';
              }).filter(x => x != 'other');
            }"""
        )
        assert order[-3:] == ["proof", "gallery", "close"], order

        thumbs = page.locator(".about-gallery .program-detail-gallery-thumb")
        assert thumbs.count() == 7
        srcs = page.eval_on_selector_all(
            ".about-gallery [data-gallery-src]",
            "els => els.map(e => e.getAttribute('data-gallery-src'))",
        )
        assert srcs == ABOUT_IMGS, srcs

        main = page.locator(".about-gallery .program-detail-gallery-main-image")
        counter = page.locator(".about-gallery .program-detail-gallery-counter")
        assert counter.inner_text().strip() == "1 / 7"

        # object-fit contain
        fit = page.evaluate(
            "() => getComputedStyle(document.querySelector('.about-gallery-main-image')).objectFit"
        )
        assert fit == "contain", fit

        # next
        page.locator(".about-gallery .program-detail-gallery-nav--next").click()
        page.wait_for_timeout(220)
        assert ABOUT_IMGS[1] in (main.get_attribute("src") or "")
        assert counter.inner_text().strip() == "2 / 7"
        assert page.locator(".about-gallery .program-detail-gallery-thumb--active").count() == 1

        # thumb click last
        thumbs.nth(6).click()
        page.wait_for_timeout(220)
        assert ABOUT_IMGS[6] in (main.get_attribute("src") or "")
        assert counter.inner_text().strip() == "7 / 7"

        # wrap next -> first
        page.locator(".about-gallery .program-detail-gallery-nav--next").click()
        page.wait_for_timeout(220)
        assert ABOUT_IMGS[0] in (main.get_attribute("src") or "")
        assert counter.inner_text().strip() == "1 / 7"

        # keyboard
        page.locator(".about-gallery-slider").focus()
        page.keyboard.press("ArrowRight")
        page.wait_for_timeout(220)
        assert ABOUT_IMGS[1] in (main.get_attribute("src") or "")
        page.keyboard.press("ArrowLeft")
        page.wait_for_timeout(220)
        assert ABOUT_IMGS[0] in (main.get_attribute("src") or "")

        # EN title
        page.locator('[data-locale-set="en"]').click()
        page.wait_for_timeout(250)
        assert "Moments from my journey" in page.locator("main.about-page").inner_text()

        # themes
        page.locator("[data-theme-toggle]").click()
        page.wait_for_timeout(120)
        assert page.evaluate("() => document.documentElement.getAttribute('data-theme')") == "cream-elegance"
        page.locator("[data-theme-toggle]").click()
        page.wait_for_timeout(120)

        # overflow viewports
        page.locator('[data-locale-set="ar"]').click()
        page.wait_for_timeout(150)
        for w, h in [(390, 844), (768, 1024), (1024, 768), (1440, 900), (1920, 1080)]:
            page.set_viewport_size({"width": w, "height": h})
            page.wait_for_timeout(80)
            overflow = page.evaluate(
                "() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1"
            )
            assert not overflow, f"overflow {w}x{h}"

        # existing owner content still present
        body = page.locator("main.about-page").inner_text()
        for snip in ["من هي د. رنا مسعد؟", "رحلتي", "منهجي", "روح", "احجز استشارتك"]:
            assert snip in body

        # program gallery still initializes on a detail page
        page.goto("http://127.0.0.1:8080/program-detail.html?slug=apg", wait_until="networkidle")
        page.wait_for_timeout(500)
        assert page.locator(".program-detail-gallery").count() >= 1
        assert page.locator(".program-detail-gallery-main-image").count() >= 1

        assert not errors, errors
        print("ABOUT GALLERY QA PASSED")
        browser.close()


if __name__ == "__main__":
    main()
