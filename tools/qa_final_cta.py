from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8080/"

AR_TITLE = "كل برنامج هو باب… لكن الرسالة واحدة: أن تعود إلى حقيقتك بوعي وتمكين واتصال بالله."
AR_BUTTON = "احجز استشارتك المجانية"
EN_TITLE = "Every program is a door… but the message is one: that you return to your truth with awareness, empowerment, and connection with God."
EN_BUTTON = "Book your free consultation"

VIEWPORTS = [
    (390, 844),
    (768, 1024),
    (1366, 768),
    (1440, 900),
    (1920, 1080),
]


def assert_true(cond, msg):
    if not cond:
        raise AssertionError(msg)


def normalize(text):
    return " ".join((text or "").split())


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)

        page.goto(BASE, wait_until="networkidle")
        page.locator("#final-cta").scroll_into_view_if_needed()
        page.wait_for_timeout(250)

        title = normalize(page.locator("#final-cta .final-cta-title").inner_text())
        button = normalize(page.locator("#final-cta [data-i18n='finalCta.button']").inner_text())
        assert_true(title == AR_TITLE, f"AR title mismatch:\n{title}")
        assert_true(button == AR_BUTTON, f"AR button mismatch:\n{button}")
        assert_true(
            page.locator("#final-cta .final-cta-title .text-gold-gradient").count() == 1,
            "AR gold emphasis missing",
        )
        gold_ar = normalize(page.locator("#final-cta .final-cta-title .text-gold-gradient").inner_text())
        assert_true(gold_ar == "حقيقتك بوعي وتمكين واتصال بالله", f"AR emphasis: {gold_ar}")
        assert_true(page.evaluate("() => document.documentElement.dir") == "rtl", "AR RTL")

        # Button scrolls to contact
        page.locator("#final-cta [data-scroll='contact']").click()
        page.wait_for_timeout(700)
        contact_top = page.evaluate(
            """() => {
              const el = document.getElementById('contact');
              const r = el.getBoundingClientRect();
              return { top: r.top, id: location.hash };
            }"""
        )
        assert_true(abs(contact_top["top"]) < 120, f"contact not in view: {contact_top}")

        # English
        page.locator('[data-locale-set="en"]').click()
        page.wait_for_timeout(300)
        page.locator("#final-cta").scroll_into_view_if_needed()
        page.wait_for_timeout(200)
        title_en = normalize(page.locator("#final-cta .final-cta-title").inner_text())
        button_en = normalize(page.locator("#final-cta [data-i18n='finalCta.button']").inner_text())
        assert_true(title_en == EN_TITLE, f"EN title mismatch:\n{title_en}")
        assert_true(button_en == EN_BUTTON, f"EN button mismatch:\n{button_en}")
        gold_en = normalize(page.locator("#final-cta .final-cta-title .text-gold-gradient").inner_text())
        assert_true(
            gold_en == "truth with awareness, empowerment, and connection with God",
            f"EN emphasis: {gold_en}",
        )
        assert_true(page.evaluate("() => document.documentElement.dir") == "ltr", "EN LTR")

        # Themes
        for _ in range(2):
            ok = page.evaluate(
                """() => {
                  const panel = document.querySelector('#final-cta .final-cta-panel');
                  const r = panel.getBoundingClientRect();
                  return r.width > 200 && r.height > 80 && getComputedStyle(panel).opacity !== '0';
                }"""
            )
            assert_true(ok, "CTA panel visible")
            page.locator("[data-theme-toggle]").click()
            page.wait_for_timeout(200)

        # Spacing / overflow across viewports
        for w, h in VIEWPORTS:
            page.set_viewport_size({"width": w, "height": h})
            page.wait_for_timeout(120)
            metrics = page.evaluate(
                """() => {
                  const section = document.getElementById('final-cta');
                  const panel = section.querySelector('.final-cta-panel');
                  const cs = getComputedStyle(section);
                  const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
                  return {
                    padY,
                    panelPadTop: parseFloat(getComputedStyle(panel).paddingTop),
                    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
                  };
                }"""
            )
            assert_true(not metrics["overflow"], f"overflow at {w}x{h}")
            assert_true(metrics["padY"] <= 90, f"section pad too large at {w}x{h}: {metrics['padY']}")
            assert_true(
                metrics["panelPadTop"] <= 56,
                f"panel pad too large at {w}x{h}: {metrics['panelPadTop']}",
            )
            print(f"ok {w}x{h}", metrics)

        assert_true(not errors, f"console errors: {errors}")
        print("SECTION 8 CLOSING CTA QA PASSED")
        browser.close()


if __name__ == "__main__":
    main()
