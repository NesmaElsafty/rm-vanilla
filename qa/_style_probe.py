from playwright.sync_api import sync_playwright


SELECTORS = [
    ".nav-luxury",
    ".nav-book",
    ".hero-title",
    ".hero-portrait-frame",
    ".section-keynote-title",
    ".section-keynote-header",
    ".program-card",
    ".program-card .btn-luxury-ghost",
    ".contact-info-title",
    ".about-grid",
    ".about-card",
]


def styles(page, selector):
    return page.evaluate(
        """(sel) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return {
            w: Math.round(r.width),
            h: Math.round(r.height),
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight,
            lineHeight: cs.lineHeight,
            padding: cs.padding,
            marginBottom: cs.marginBottom,
            borderRadius: cs.borderRadius,
            display: cs.display,
            gap: cs.gap,
          };
        }""",
        selector,
    )


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for width in (375, 1280):
            print("\n===", width, "===")
            for label, url in (
                ("react", "http://127.0.0.1:3000/"),
                ("vanilla", "http://127.0.0.1:8080/index.html"),
            ):
                context = browser.new_context(viewport={"width": width, "height": 900})
                page = context.new_page()
                page.add_init_script(
                    "localStorage.setItem('rana-site-locale','ar');"
                    "localStorage.setItem('rana-site-theme','luxury-rose');"
                )
                page.goto(url, wait_until="domcontentloaded")
                page.wait_for_timeout(1500)
                print(label)
                for sel in SELECTORS:
                    print(" ", sel, styles(page, sel))
                # menu button visibility
                print(
                    "  menuBtn",
                    page.evaluate(
                        """() => {
                          const el = document.querySelector('[data-menu-toggle], .nav-menu-btn');
                          if (!el) return null;
                          const cs = getComputedStyle(el);
                          return {display: cs.display, w: el.getBoundingClientRect().width};
                        }"""
                    ),
                )
                context.close()
        browser.close()


if __name__ == "__main__":
    main()
