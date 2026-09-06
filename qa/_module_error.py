from playwright.sync_api import sync_playwright


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.on(
            "pageerror",
            lambda err: print("PAGEERROR:", err, getattr(err, "stack", None)),
        )
        page.on(
            "response",
            lambda res: print("RESP", res.status, res.url)
            if ("/assets/js/" in res.url or "/data/" in res.url) and res.status >= 400
            else None,
        )
        page.on(
            "requestfailed",
            lambda req: print("REQFAIL", req.url, req.failure),
        )
        page.goto("http://127.0.0.1:8080/index.html", wait_until="domcontentloaded")
        page.wait_for_timeout(2500)
        # Try dynamic import to surface module parse errors
        result = page.evaluate(
            """async () => {
              try {
                await import('/assets/js/main.js');
                return {ok: true};
              } catch (e) {
                return {ok: false, name: e.name, message: e.message, stack: String(e.stack || '')};
              }
            }"""
        )
        print("IMPORT", result)
        browser.close()


if __name__ == "__main__":
    main()
