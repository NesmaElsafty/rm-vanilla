from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8080/"


def test_hero(page):
    page.goto(BASE, wait_until="domcontentloaded")
    timing = page.evaluate(
        """async () => {
      const hero = document.getElementById('hero');
      const start = performance.now();
      await new Promise((resolve) => {
        if (hero.classList.contains('hero-is-ready')) return resolve();
        const mo = new MutationObserver(() => {
          if (hero.classList.contains('hero-is-ready')) {
            mo.disconnect();
            resolve();
          }
        });
        mo.observe(hero, { attributes: true, attributeFilter: ['class'] });
        setTimeout(resolve, 3000);
      });
      const readyAt = performance.now() - start;
      const portrait = hero.querySelector('[data-hero-reveal="portrait"]');
      const style = getComputedStyle(portrait);
      return {
        readyAt,
        delay: style.transitionDelay,
        duration: style.transitionDuration,
        hasReady: hero.classList.contains('hero-is-ready'),
      };
    }"""
    )
    print("hero timing:", timing)
    assert timing["hasReady"], "hero-is-ready missing"
    assert timing["readyAt"] < 500, f"hero-is-ready too late: {timing['readyAt']}ms"
    assert "0s" in timing["delay"] or timing["delay"].startswith("0"), f"portrait delay too high: {timing['delay']}"
    print("PASS hero")


def test_counter(page):
    page.goto(BASE, wait_until="networkidle")
    page.wait_for_timeout(250)
    counter = page.locator('#stats [data-counter][data-count="1400"]')
    assert counter.count() == 1

    before = counter.inner_text().strip()
    print("before scroll:", before)
    assert before == "1400+", f"expected HTML fallback 1400+, got {before}"

    page.evaluate(
        """() => {
      const el = document.getElementById('stats');
      const top = el.getBoundingClientRect().top + window.scrollY;
      const y = top - (window.innerHeight / 2) + (el.offsetHeight / 2);
      window.scrollTo({ top: Math.max(0, y), behavior: 'instant' });
    }"""
    )

    page.wait_for_timeout(100)
    t0 = counter.inner_text().strip()
    print("at ~100ms:", t0)

    page.wait_for_timeout(400)
    t1 = counter.inner_text().strip()
    print("at ~500ms:", t1)
    assert t1 != "1400+", f"expected intermediate, got {t1}"
    assert t1.endswith("+")
    n1 = int(t1[:-1])
    assert 0 < n1 < 1400, f"expected in-progress, got {t1}"

    page.wait_for_timeout(2200)
    final = counter.inner_text().strip()
    print("final:", final)
    assert final == "1400+"

    values = [t.strip() for t in page.locator("#stats [data-counter]").all_inner_texts()]
    assert values == ["6+", "1400+", "10+", "30+", "10+"], values

    page.evaluate("() => window.scrollTo({ top: 0, behavior: 'instant' })")
    page.wait_for_timeout(200)
    page.evaluate(
        """() => {
      const el = document.getElementById('stats');
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
    }"""
    )
    page.wait_for_timeout(600)
    assert counter.inner_text().strip() == "1400+", "counter restarted"
    print("PASS counter")


def test_nav(page):
    page.goto(BASE, wait_until="networkidle")
    labels = [t.strip() for t in page.locator(".nav-links .nav-link").all_inner_texts()]
    expected_ar = [
        "الرئيسية",
        "عن رنا",
        "الفلسفه",
        "البرامج",
        "قالوا عنا",
        "تواصل",
    ]
    assert labels == expected_ar, f"ar nav mismatch: {labels!r}"

    page.locator('[data-locale-set="en"]').click()
    page.wait_for_timeout(250)
    en = [t.strip() for t in page.locator(".nav-links .nav-link").all_inner_texts()]
    expected_en = [
        "Home",
        "About Rana",
        "Philosophy",
        "Programs",
        "Testimonials",
        "Contact",
    ]
    assert en == expected_en, f"en nav mismatch: {en!r}"
    assert page.locator('[data-locale-set="en"]').get_attribute("aria-pressed") == "true"
    logo = page.locator(".nav-logo-btn img.logo-white-highlight").first
    assert logo.get_attribute("src").endswith("rana-logo.png")
    print("PASS nav")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1366, "height": 768})
        errors = []
        page.on("pageerror", lambda err: errors.append(str(err)))
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)

        test_hero(page)
        test_counter(page)
        test_nav(page)

        browser.close()
        assert not errors, f"console/page errors: {errors}"
        print("ALL QA PASSED")


if __name__ == "__main__":
    main()
