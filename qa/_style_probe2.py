from playwright.sync_api import sync_playwright


def probe(page):
    return page.evaluate(
        """() => {
          const pick = (sels) => {
            for (const sel of sels) {
              const el = document.querySelector(sel);
              if (el) {
                const cs = getComputedStyle(el);
                const r = el.getBoundingClientRect();
                return {sel, w: Math.round(r.width), h: Math.round(r.height), fontSize: cs.fontSize, padding: cs.padding, display: cs.display, borderRadius: cs.borderRadius};
              }
            }
            return null;
          };
          const h1 = document.querySelector('#hero h1, .hero-title, .slide-hero h1');
          const h1cs = h1 ? getComputedStyle(h1) : null;
          const cards = document.querySelectorAll('#programs article, .program-card, #programs .glass-slide');
          const card = cards[0];
          const cardCs = card ? getComputedStyle(card) : null;
          const menu = [...document.querySelectorAll('nav button')].find(b => b.innerHTML.includes('M4 5') || b.querySelector('svg') && b.className.includes('md:hidden') || b.matches('[data-menu-toggle], .nav-menu-btn'));
          const menuFallback = document.querySelector('[data-menu-toggle], .nav-menu-btn') || [...document.querySelectorAll('nav button')].find(b => getComputedStyle(b).display !== 'none' && b.querySelector('svg') && !b.textContent.trim());
          const m = menu || menuFallback;
          const mcs = m ? getComputedStyle(m) : null;
          const aboutCards = document.querySelectorAll('#about .glass-panel, .about-card');
          const ac = aboutCards[0];
          const book = [...document.querySelectorAll('nav button')].find(b => (b.textContent||'').includes('احجزي') || (b.textContent||'').includes('Book'));
          return {
            h1: h1 ? {w: Math.round(h1.getBoundingClientRect().width), h: Math.round(h1.getBoundingClientRect().height), fontSize: h1cs.fontSize, lineHeight: h1cs.lineHeight} : null,
            cardCount: cards.length,
            card: card ? {w: Math.round(card.getBoundingClientRect().width), h: Math.round(card.getBoundingClientRect().height), padding: cardCs.padding, gap: cardCs.gap, borderRadius: cardCs.borderRadius} : null,
            aboutCount: aboutCards.length,
            aboutCard: ac ? {w: Math.round(ac.getBoundingClientRect().width), padding: getComputedStyle(ac).padding, borderRadius: getComputedStyle(ac).borderRadius} : null,
            menu: m ? {w: Math.round(m.getBoundingClientRect().width), h: Math.round(m.getBoundingClientRect().height), display: mcs.display, padding: mcs.padding, html: m.outerHTML.slice(0,180)} : null,
            book: book ? {w: Math.round(book.getBoundingClientRect().width), h: Math.round(book.getBoundingClientRect().height), fontSize: getComputedStyle(book).fontSize, padding: getComputedStyle(book).padding, borderRadius: getComputedStyle(book).borderRadius, display: getComputedStyle(book).display} : null,
            portrait: pick(['.hero-portrait-frame', '#hero img']),
          };
        }"""
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
                page.wait_for_timeout(2000)
                print(label, probe(page))
                context.close()
        browser.close()


if __name__ == "__main__":
    main()
