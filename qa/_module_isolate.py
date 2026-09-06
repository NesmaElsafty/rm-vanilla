from playwright.sync_api import sync_playwright

CANDIDATES = [
    "/assets/js/theme.js",
    "/assets/js/language.js",
    "/assets/js/icons.js",
    "/assets/js/navigation.js",
    "/assets/js/animations.js",
    "/assets/js/forms.js",
    "/assets/js/modals.js",
    "/assets/js/galleries.js",
    "/assets/js/detail-pages.js",
    "/assets/js/sliders.js",
    "/assets/js/svg-decor.js",
    "/data/content.js",
    "/data/programs.js",
    "/data/workshops.js",
    "/data/sessions.js",
    "/data/recorded-sessions.js",
    "/data/retreats.js",
    "/data/testimonials.js",
    "/data/policies.js",
    "/assets/js/main.js",
]


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://127.0.0.1:8080/index.html", wait_until="domcontentloaded")
        for url in CANDIDATES:
            result = page.evaluate(
                """async (url) => {
                  try {
                    await import(url + '?t=' + Date.now());
                    return 'OK';
                  } catch (e) {
                    return e.message;
                  }
                }""",
                url,
            )
            print(url, result)
        browser.close()


if __name__ == "__main__":
    main()
