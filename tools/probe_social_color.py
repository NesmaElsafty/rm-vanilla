from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://127.0.0.1:8080/", wait_until="networkidle")
    page.locator("[data-theme-toggle]").first.click()
    page.wait_for_timeout(400)
    page.locator(".footer-social").first.scroll_into_view_if_needed()
    page.wait_for_timeout(200)
    print(
        page.evaluate(
            """() => {
              const theme = document.documentElement.getAttribute('data-theme');
              const label = document.querySelector('.footer-social .footer-label');
              const icon = document.querySelector('.footer-social a.footer-social-icon');
              return {
                theme,
                labelColor: getComputedStyle(label).color,
                iconColor: getComputedStyle(icon).color,
              };
            }"""
        )
    )
    browser.close()
