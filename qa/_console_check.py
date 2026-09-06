from playwright.sync_api import sync_playwright


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 375, "height": 812})
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda err: errors.append(str(err)))
        page.on("console", lambda msg: errors.append(f"console:{msg.type}:{msg.text}") if msg.type in {"error", "warning"} else None)
        page.add_init_script(
            "localStorage.setItem('rana-site-locale','ar');"
            "localStorage.setItem('rana-site-theme','luxury-rose');"
        )
        page.goto("http://127.0.0.1:8080/index.html", wait_until="domcontentloaded")
        page.wait_for_timeout(3000)
        icon_state = page.evaluate(
            """() => {
              const nodes = [...document.querySelectorAll('[data-icon]')].slice(0, 8).map(el => ({
                name: el.getAttribute('data-icon'),
                hasSvg: !!el.querySelector('svg'),
                html: el.innerHTML.slice(0, 80),
              }));
              return {
                moduleScripts: [...document.querySelectorAll('script[type=module]')].map(s => s.src),
                nodes,
              };
            }"""
        )
        print("ERRORS:")
        for e in errors:
            print(" -", e)
        print("STATE:", icon_state)
        browser.close()


if __name__ == "__main__":
    main()
