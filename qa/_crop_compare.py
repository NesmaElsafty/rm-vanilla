from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path(__file__).resolve().parent / "screenshots"


def shot(page, url, path, clip=None):
    page.goto(url, wait_until="domcontentloaded")
    page.wait_for_timeout(1800)
    page.evaluate(
        """() => {
          const dock = document.getElementById('whatsapp-floating-component');
          if (dock) dock.style.visibility = 'hidden';
        }"""
    )
    if clip:
        page.screenshot(path=str(path), clip=clip)
    else:
        page.screenshot(path=str(path), full_page=False)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    cases = [
        ("home", "/", "/index.html", None),
        ("home-hero", "/", "/index.html", {"x": 0, "y": 0, "width": 1280, "height": 900}),
        ("home-programs", "/", "/index.html", {"x": 0, "y": 1400, "width": 1280, "height": 900}),
        ("about", "/about", "/about.html", None),
        ("program", "/programs/apg", "/program-detail.html?slug=apg", None),
    ]
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for name, react_path, vanilla_path, clip in cases:
            for label, base in (("react", "http://127.0.0.1:3000"), ("vanilla", "http://127.0.0.1:8080")):
                for cfg, locale, theme, width in (
                    ("ar375", "ar", "luxury-rose", 375),
                    ("ar1280", "ar", "luxury-rose", 1280),
                    ("en1280", "en", "luxury-rose", 1280),
                    ("cream1280", "ar", "cream-elegance", 1280),
                ):
                    if clip and width != 1280:
                        continue
                    context = browser.new_context(viewport={"width": width, "height": 900 if width >= 1280 else 812})
                    page = context.new_page()
                    page.add_init_script(
                        f"localStorage.setItem('rana-site-locale','{locale}');"
                        f"localStorage.setItem('rana-site-theme','{theme}');"
                    )
                    url = f"{base}{react_path if label == 'react' else vanilla_path}"
                    out = OUT / f"cmp_{label}_{name}_{cfg}.png"
                    try:
                        used_clip = None
                        if clip and width == 1280:
                            used_clip = clip
                        elif width == 375 and name == "home-hero":
                            used_clip = {"x": 0, "y": 0, "width": 375, "height": 900}
                        shot(page, url, out, used_clip)
                        print("OK", out.name)
                    except Exception as exc:  # noqa: BLE001
                        print("FAIL", out.name, exc)
                    context.close()
        browser.close()


if __name__ == "__main__":
    main()
