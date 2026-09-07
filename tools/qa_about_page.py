from playwright.sync_api import sync_playwright

AR_SNIPPETS = [
    "من هي د. رنا مسعد؟",
    "هل يمكن للإنسان أن يبدأ من جديد؟",
    "واليوم، اصبحت مدربة وعي ذاتي وروحي.",
    "منهجي",
    "التجربة الواقعية",
    "التدريب العملي",
    "المنهج العلمي",
    "الجذور النفسية والروحية",
    "Neuro-semantics Trainer of Trainers",
    "Meta-Coach",
    "ICF Certified Life Coach",
    "Enneagram Practitioner",
    "Trauma Healer",
    "ليه تختار رنا كرفيق في رحلتك؟",
    "المشكلات التي أساعدك علي حلها.",
    "احجز استشارتك",
    "تعرف على البرامج",
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

        # Homepage CTA
        page.goto("http://127.0.0.1:8080/", wait_until="networkidle")
        page.locator("#about").scroll_into_view_if_needed()
        cta = page.locator("#about a.about-rana-more")
        assert cta.count() == 1
        assert cta.inner_text().strip() == "عرض المزيد"
        assert "about.html" in (cta.get_attribute("href") or "")
        page.locator('[data-locale-set="en"]').click()
        page.wait_for_timeout(250)
        assert cta.inner_text().strip() == "Read more"

        # About page (force Arabic)
        page.goto("http://127.0.0.1:8080/about.html", wait_until="networkidle")
        page.evaluate("() => localStorage.setItem('rana-site-locale', 'ar')")
        page.reload(wait_until="networkidle")
        page.wait_for_timeout(400)
        page.locator('[data-locale-set="ar"]').click()
        page.wait_for_timeout(300)
        body = page.locator("main.about-page").inner_text()
        for snip in AR_SNIPPETS:
            assert snip in body, f"missing AR: {snip}\n---\n{body[:800]}"

        assert page.locator(".about-page-pillar-label").count() == 4
        assert page.locator(".about-page-credentials li").count() == 8
        assert page.locator(".about-page-reason").count() == 3
        assert page.locator(".about-page-problems li").count() == 11
        assert page.locator(".about-page-manifesto-part").count() == 3
        assert page.locator("[data-counter]").count() == 2

        parts = [t.strip() for t in page.locator(".about-page-manifesto-part").all_inner_texts()]
        assert parts == ["روح", "نفس", "جسد"], parts

        book = page.locator('.about-page-cta a[href="index.html#contact"]')
        programs = page.locator('.about-page-cta a[href="index.html#programs"]')
        assert book.count() == 1
        assert programs.count() == 1

        geo = page.evaluate(
            """() => {
              const media = document.querySelector('.about-page-intro-media');
              const copy = document.querySelector('.about-page-intro-copy');
              const head = document.querySelector('.about-page-intro-head');
              const mr = media.getBoundingClientRect();
              const cr = copy.getBoundingClientRect();
              const hr = head.getBoundingClientRect();
              return {
                mediaLeft: mr.left,
                copyLeft: cr.left,
                headLeft: hr.left,
                mediaBeforeCopy: mr.left < cr.left - 40,
                mediaBeforeHead: mr.left < hr.left - 40,
                img: document.querySelector('.about-page-intro-frame img')?.getAttribute('src'),
                overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
                dir: document.documentElement.dir,
                theme: document.documentElement.getAttribute('data-theme'),
              };
            }"""
        )
        print("desktop geo", geo)
        assert geo["mediaBeforeCopy"], "image must be physically left of text"
        assert geo["mediaBeforeHead"], "image must be physically left of title block"
        assert geo["img"] == "assets/images/rana-about.jpg"
        assert not geo["overflow"]
        assert geo["dir"] == "rtl"

        # Themes
        page.locator("[data-theme-toggle]").click()
        page.wait_for_timeout(200)
        theme = page.evaluate("() => document.documentElement.getAttribute('data-theme')")
        assert theme == "cream-elegance", theme
        page.locator("[data-theme-toggle]").click()
        page.wait_for_timeout(200)
        theme = page.evaluate("() => document.documentElement.getAttribute('data-theme')")
        assert theme == "luxury-rose", theme

        page.locator('[data-locale-set="en"]').click()
        page.wait_for_timeout(300)
        assert page.evaluate("() => document.documentElement.dir") == "ltr"
        en_body = page.locator("main.about-page").inner_text()
        assert "Who is Dr. Rana Mosaad?" in en_body
        assert "Book your consultation" in en_body
        assert "Explore the programs" in en_body
        assert "Neuro-semantics Trainer of Trainers" in en_body

        en_geo = page.evaluate(
            """() => {
              const media = document.querySelector('.about-page-intro-media');
              const copy = document.querySelector('.about-page-intro-copy');
              return {
                mediaBeforeCopy: media.getBoundingClientRect().left < copy.getBoundingClientRect().left - 40,
              };
            }"""
        )
        assert en_geo["mediaBeforeCopy"], "EN desktop must keep image left"

        # Mobile stacking: title/question above image
        page.set_viewport_size({"width": 390, "height": 844})
        page.wait_for_timeout(150)
        mobile = page.evaluate(
            """() => {
              const head = document.querySelector('.about-page-intro-head');
              const media = document.querySelector('.about-page-intro-media');
              const copy = document.querySelector('.about-page-intro-copy');
              const hr = head.getBoundingClientRect();
              const mr = media.getBoundingClientRect();
              const cr = copy.getBoundingClientRect();
              return {
                headAboveMedia: hr.bottom <= mr.top + 8,
                mediaAboveCopy: mr.bottom <= cr.top + 8,
                overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
              };
            }"""
        )
        print("mobile stack", mobile)
        assert mobile["headAboveMedia"], "mobile: title/question above image"
        assert mobile["mediaAboveCopy"], "mobile: image above story body"
        assert not mobile["overflow"]

        for w, h in VIEWPORTS:
            page.set_viewport_size({"width": w, "height": h})
            page.wait_for_timeout(100)
            overflow = page.evaluate(
                "() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1"
            )
            assert not overflow, f"overflow {w}x{h}"

        assert not errors, errors
        print("ABOUT PAGE QA PASSED")
        browser.close()


if __name__ == "__main__":
    main()
