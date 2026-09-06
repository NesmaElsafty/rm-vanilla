from playwright.sync_api import sync_playwright


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for width in (375, 1280):
            print("===", width)
            for label, url in (("react", "http://127.0.0.1:3000/"), ("vanilla", "http://127.0.0.1:8080/index.html")):
                ctx = browser.new_context(viewport={"width": width, "height": 900})
                page = ctx.new_page()
                page.add_init_script(
                    "localStorage.setItem('rana-site-locale','ar'); localStorage.setItem('rana-site-theme','luxury-rose');"
                )
                page.goto(url, wait_until="domcontentloaded")
                page.wait_for_timeout(2000)
                data = page.evaluate(
                    """() => {
                      const img = document.querySelector('#hero img');
                      const menu = document.querySelector('[data-menu-toggle], .nav-menu-btn') || [...document.querySelectorAll('nav button')].find(b => b.querySelector('svg') && !b.textContent.trim());
                      const card = document.querySelector('#programs article, .program-card');
                      const book = [...document.querySelectorAll('nav button')].find(b => /احجزي|Book/.test(b.textContent||''));
                      const ir = img.getBoundingClientRect();
                      return {
                        img: {w: Math.round(ir.width), h: Math.round(ir.height)},
                        menu: menu ? {w: Math.round(menu.getBoundingClientRect().width), h: Math.round(menu.getBoundingClientRect().height), hasSvg: !!menu.querySelector('svg')} : null,
                        icons: [...document.querySelectorAll('[data-icon]')].slice(0,3).map(el => ({name: el.getAttribute('data-icon'), hasSvg: !!el.querySelector('svg')})),
                        cardH: card ? Math.round(card.getBoundingClientRect().height) : null,
                        bookH: book ? Math.round(book.getBoundingClientRect().height) : null,
                        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
                      };
                    }"""
                )
                print(label, data)
                ctx.close()
        browser.close()


if __name__ == "__main__":
    main()
