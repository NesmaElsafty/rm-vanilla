from playwright.sync_api import sync_playwright

AR_SNIPPETS = [
    "من هي د. رنا مسعد؟",
    "مدربة وعي ذاتي وروحي",
    "رحلتي",
    "هل يمكن للإنسان أن يبدأ من جديد؟",
    "منهجي",
    "التجربة الواقعية",
    "الاعتمادات والتخصصات",
    "Neuro-semantics Trainer of Trainers",
    "مختارات من البرامج والخدمات",
    "جلسات خاصة",
    "مساحات أعمل عليها",
    "ليه تختار رنا كرفيق في رحلتك؟",
    "مختارات من قصص التحول",
    "هاجر ايت ناصر",
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
        page.wait_for_timeout(400)
        page.locator('[data-locale-set="ar"]').click()
        page.wait_for_timeout(300)

        body = page.locator("main.about-page").inner_text()
        for snip in AR_SNIPPETS:
            assert snip in body, f"missing AR: {snip}"

        assert page.locator(".about-hero").count() == 1
        assert page.locator(".about-snapshot-item").count() == 4
        assert page.locator(".about-method-pillar").count() == 4
        assert page.locator(".about-cred-matrix li").count() == 8
        assert page.locator(".about-work-grid article").count() == 5
        assert page.locator(".about-practice-grid li").count() == 11
        assert page.locator(".about-why-item").count() == 3
        assert page.locator(".about-voice").count() == 3
        assert page.locator(".about-manifesto-part").count() == 3
        assert page.locator("[data-counter]").count() >= 2

        # No glass-panel spam on about
        glass = page.locator("main.about-page .glass-panel, main.about-page .glass-slide").count()
        assert glass == 0, f"too many glass surfaces: {glass}"

        geo = page.evaluate(
            """() => {
              const media = document.querySelector('.about-hero-media');
              const identity = document.querySelector('.about-hero-identity');
              const mr = media.getBoundingClientRect();
              const ir = identity.getBoundingClientRect();
              return {
                mediaBeforeIdentity: mr.left < ir.left - 40,
                img: document.querySelector('.about-hero-frame img')?.getAttribute('src'),
                overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
                dir: document.documentElement.dir,
              };
            }"""
        )
        print("desktop geo", geo)
        assert geo["mediaBeforeIdentity"]
        assert geo["img"] == "assets/images/rana-about.jpg"
        assert not geo["overflow"]

        book = page.locator('main.about-page a[href="index.html#contact"]')
        programs = page.locator('main.about-page a[href="index.html#programs"]')
        testimonials = page.locator('main.about-page a[href="index.html#testimonials"]')
        assert book.count() >= 2
        assert programs.count() >= 2
        assert testimonials.count() == 1

        page.locator("[data-theme-toggle]").click()
        page.wait_for_timeout(150)
        assert page.evaluate("() => document.documentElement.getAttribute('data-theme')") == "cream-elegance"
        page.locator("[data-theme-toggle]").click()
        page.wait_for_timeout(150)
        assert page.evaluate("() => document.documentElement.getAttribute('data-theme')") == "luxury-rose"

        page.locator('[data-locale-set="en"]').click()
        page.wait_for_timeout(300)
        en = page.locator("main.about-page").inner_text()
        assert "Who is Dr. Rana Mosaad?" in en
        assert "Credentials & Qualifications" in en
        assert "Selected programs" in en
        assert "Neuro-semantics Trainer of Trainers" in en
        assert page.evaluate("() => document.documentElement.dir") == "ltr"

        page.set_viewport_size({"width": 390, "height": 844})
        page.wait_for_timeout(150)
        mobile = page.evaluate(
            """() => {
              const id = document.querySelector('.about-hero-identity').getBoundingClientRect();
              const media = document.querySelector('.about-hero-media').getBoundingClientRect();
              const pos = document.querySelector('.about-hero-position').getBoundingClientRect();
              return {
                idAboveMedia: id.bottom <= media.top + 8,
                mediaAbovePos: media.bottom <= pos.top + 8,
              };
            }"""
        )
        print("mobile stack", mobile)
        assert mobile["idAboveMedia"]
        assert mobile["mediaAbovePos"]

        for w, h in VIEWPORTS:
            page.set_viewport_size({"width": w, "height": h})
            page.wait_for_timeout(80)
            overflow = page.evaluate(
                "() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1"
            )
            assert not overflow, f"overflow {w}x{h}"

        # Screenshots for subjective check
        page.set_viewport_size({"width": 1440, "height": 900})
        page.locator('[data-locale-set="ar"]').click()
        page.wait_for_timeout(200)
        page.screenshot(path="tools/qa-about-portfolio-top.png", full_page=False)
        page.evaluate("() => window.scrollTo(0, document.body.scrollHeight * 0.4)")
        page.wait_for_timeout(100)
        page.screenshot(path="tools/qa-about-portfolio-mid.png", full_page=False)
        page.evaluate("() => window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(100)
        page.screenshot(path="tools/qa-about-portfolio-bottom.png", full_page=False)

        assert not errors, errors
        print("ABOUT PORTFOLIO QA PASSED")
        browser.close()


if __name__ == "__main__":
    main()
