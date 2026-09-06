from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path(__file__).resolve().parent / "screenshots"


def capture(page, url, path, scroll_to=None):
    page.goto(url, wait_until="domcontentloaded")
    page.wait_for_timeout(1600)
    page.evaluate(
        "() => { const d=document.getElementById('whatsapp-floating-component'); if(d) d.style.visibility='hidden'; }"
    )
    if scroll_to:
        page.evaluate(
            f"""() => {{
              const el = document.querySelector('{scroll_to}');
              if (!el) return;
              const top = el.getBoundingClientRect().top + window.scrollY - 100;
              window.scrollTo(0, Math.max(0, top));
            }}"""
        )
        page.wait_for_timeout(700)
    page.screenshot(path=str(path), full_page=False)


def main():
    cases = [
        ("programs1280", "/", "/index.html", 1280, 900, "#programs", "ar", "luxury-rose"),
        ("contact1280", "/", "/index.html", 1280, 900, "#contact", "ar", "luxury-rose"),
        ("testimonials1280", "/", "/index.html", 1280, 900, "#testimonials", "ar", "luxury-rose"),
    ]
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for name, rpath, vpath, w, h, scroll, locale, theme in cases:
            context = browser.new_context(viewport={"width": w, "height": h})
            page = context.new_page()
            page.add_init_script(
                f"localStorage.setItem('rana-site-locale','{locale}');"
                f"localStorage.setItem('rana-site-theme','{theme}');"
            )
            capture(page, f"http://127.0.0.1:3000{rpath}", OUT / f"final_react_{name}.png", scroll)
            capture(page, f"http://127.0.0.1:8080{vpath}", OUT / f"final_vanilla_{name}.png", scroll)
            print("OK", name)
            context.close()
        browser.close()


if __name__ == "__main__":
    main()
