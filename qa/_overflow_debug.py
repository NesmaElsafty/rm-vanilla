from playwright.sync_api import sync_playwright


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 375, "height": 812})
        page = context.new_page()
        page.add_init_script(
            "localStorage.setItem('rana-site-locale','ar');"
            "localStorage.setItem('rana-site-theme','luxury-rose');"
        )
        page.goto("http://127.0.0.1:8080/index.html", wait_until="domcontentloaded")
        page.wait_for_timeout(2500)
        data = page.evaluate(
            """() => {
              const docW = document.documentElement.clientWidth;
              const out = [];
              for (const el of document.querySelectorAll('body *')) {
                const r = el.getBoundingClientRect();
                if (r.width < 1 || r.height < 1) continue;
                if (r.right > docW + 1 || r.left < -1) {
                  const cls = (el.className && typeof el.className === 'string')
                    ? el.className.slice(0, 120)
                    : el.tagName;
                  out.push({
                    tag: el.tagName,
                    cls,
                    left: Math.round(r.left),
                    right: Math.round(r.right),
                    w: Math.round(r.width),
                    id: el.id || '',
                  });
                }
              }
              out.sort((a, b) => Math.max(b.right - docW, -a.left) - Math.max(a.right - docW, -b.left));
              return {
                client: docW,
                scroll: document.documentElement.scrollWidth,
                offenders: out.slice(0, 30),
              };
            }"""
        )
        print(data["client"], data["scroll"])
        for item in data["offenders"]:
            print(item)
        browser.close()


if __name__ == "__main__":
    main()
