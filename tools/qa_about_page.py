from playwright.sync_api import sync_playwright

LOCKED_AR = [
    "من هي د. رنا مسعد؟",
    "بدأت رحلتي بسؤال واحد:",
    "هل يمكن للإنسان أن يبدأ من جديد؟",
    "واليوم، اصبحت مدربة وعي ذاتي وروحي.",
    "منهجي",
    "Neuro-semantics Trainer of Trainers",
    "ليه تختار رنا كرفيق في رحلتك؟",
    "المشكلات التي أساعدك علي حلها.",
    "أرافقك في مساحات تحول متعددة، منها:",
    "لحظات من مسيرتي",
    "جاهزة لبدء رحلتك؟",
    "احجزي استشارتك",
]

VIEWPORTS = [
    (390, 844),
    (430, 932),
    (768, 1024),
    (1024, 768),
    (1366, 768),
    (1440, 900),
    (1920, 1080),
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
        page.wait_for_timeout(350)
        page.locator('[data-locale-set="ar"]').click()
        page.wait_for_timeout(250)

        body = page.locator("main.about-page").inner_text()
        for snip in LOCKED_AR:
            assert snip in body, f"missing: {snip}"

        # Exactly the structural sections we care about
        assert page.locator("main.about-page > .about-page-inner > .about-s1").count() == 1
        assert page.locator("main.about-page > .about-page-inner > .about-s2").count() == 1
        assert page.locator("main.about-page > .about-page-inner > .about-s3").count() == 1
        assert page.locator("main.about-page > .about-page-inner > .about-s4").count() == 1
        assert page.locator("main.about-page > .about-page-inner > .about-gallery").count() == 1
        assert page.locator("main.about-page > .about-page-inner > .about-cta-bar").count() == 1

        # Removed sections
        for sel in [
            ".about-snapshot",
            ".about-work",
            ".about-voices",
            ".about-impact",
            ".about-proof",
            ".about-method-grid",
            ".about-chapter--cover",
        ]:
            assert page.locator(sel).count() == 0, sel

        assert page.locator(".about-cred-matrix li").count() == 8
        assert page.locator(".about-why-item").count() == 3
        assert page.locator(".about-practice-grid li").count() == 11
        assert page.locator(".about-s4-part").count() == 3
        assert page.locator("[data-counter]").count() == 2
        assert page.locator(".about-gallery .program-detail-gallery-thumb").count() == 7

        # No duplicate stats labels outside s1
        assert body.count("طالب وسيدة") == 1
        assert body.count("سنوات من الخبرة") == 1

        geo = page.evaluate(
            """() => {
              const media = document.querySelector('.about-s1-media').getBoundingClientRect();
              const copy = document.querySelector('.about-s1-copy').getBoundingClientRect();
              return {
                mediaLeft: media.left < copy.left - 40,
                overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
              };
            }"""
        )
        assert geo["mediaLeft"], geo
        assert not geo["overflow"]

        # Mobile order title -> media -> copy
        page.set_viewport_size({"width": 390, "height": 844})
        page.wait_for_timeout(120)
        mobile = page.evaluate(
            """() => {
              const t = document.querySelector('.about-s1-title-wrap').getBoundingClientRect();
              const m = document.querySelector('.about-s1-media').getBoundingClientRect();
              const c = document.querySelector('.about-s1-copy').getBoundingClientRect();
              return {
                titleAboveMedia: t.bottom <= m.top + 8,
                mediaAboveCopy: m.bottom <= c.top + 8,
              };
            }"""
        )
        assert mobile["titleAboveMedia"] and mobile["mediaAboveCopy"], mobile

        page.locator('[data-locale-set="en"]').click()
        page.wait_for_timeout(250)
        en = page.locator("main.about-page").inner_text()
        assert "Who is Dr. Rana Mosaad?" in en
        assert "Ready to begin your journey?" in en
        assert "Book Your Consultation" in en
        assert "Moments from my journey" in en

        page.locator("[data-theme-toggle]").click()
        page.wait_for_timeout(120)
        assert page.evaluate("() => document.documentElement.getAttribute('data-theme')") == "cream-elegance"
        page.locator("[data-theme-toggle]").click()
        page.wait_for_timeout(120)

        page.locator('[data-locale-set="ar"]').click()
        page.wait_for_timeout(150)
        for w, h in VIEWPORTS:
            page.set_viewport_size({"width": w, "height": h})
            page.wait_for_timeout(70)
            overflow = page.evaluate(
                "() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1"
            )
            assert not overflow, f"overflow {w}x{h}"

        # Gallery still works
        page.set_viewport_size({"width": 1440, "height": 900})
        page.locator(".about-gallery .program-detail-gallery-nav--next").click()
        page.wait_for_timeout(220)
        assert "2 / 7" in page.locator(".about-gallery-counter").inner_text()

        assert not errors, errors
        print("ABOUT 6-SECTION QA PASSED")
        browser.close()


if __name__ == "__main__":
    main()
