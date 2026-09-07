from playwright.sync_api import sync_playwright

AR_SNIPPETS = [
    "من هي د. رنا مسعد؟",
    "هل يمكن للإنسان أن يبدأ من جديد؟",
    "واليوم، اصبحت مدربة وعي ذاتي وروحي.",
    "منهجي",
    "Neuro-semantics Trainer of Trainers",
    "Meta-Coach",
    "ICF Certified Life Coach",
    "ليه تختار رنا كرفيق في رحلتك؟",
    "المشكلات التي أساعدك علي حلها.",
    "روح، ونفس، وجسد",
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
            assert snip in body, f"missing AR: {snip}\n---\n{body[:500]}"

        assert page.locator(".about-page-credentials li").count() == 8
        assert page.locator(".about-page-reason").count() == 3
        assert page.locator(".about-page-problems li").count() == 11

        geo = page.evaluate(
            """() => {
              const media = document.querySelector('.about-page-intro-media');
              const copy = document.querySelector('.about-page-intro-copy');
              const mr = media.getBoundingClientRect();
              const cr = copy.getBoundingClientRect();
              return {
                mediaLeft: mr.left,
                copyLeft: cr.left,
                mediaBeforeCopy: mr.left < cr.left - 40,
                img: document.querySelector('.about-page-intro-frame img')?.getAttribute('src'),
                overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
                dir: document.documentElement.dir,
              };
            }"""
        )
        print("desktop geo", geo)
        assert geo["mediaBeforeCopy"], "image must be physically left of text"
        assert geo["img"] == "assets/images/rana-about.jpg"
        assert not geo["overflow"]
        assert geo["dir"] == "rtl"

        page.locator('[data-locale-set="en"]').click()
        page.wait_for_timeout(300)
        assert page.evaluate("() => document.documentElement.dir") == "ltr"
        assert "Who is Dr. Rana Mosaad?" in page.locator("main.about-page").inner_text()

        for w, h in [(390, 844), (768, 1024), (1366, 768), (1920, 1080)]:
            page.set_viewport_size({"width": w, "height": h})
            page.wait_for_timeout(120)
            overflow = page.evaluate(
                "() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1"
            )
            assert not overflow, f"overflow {w}x{h}"

        assert not errors, errors
        print("ABOUT PAGE QA PASSED")
        browser.close()


if __name__ == "__main__":
    main()
