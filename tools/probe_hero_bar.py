from playwright.sync_api import sync_playwright


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1680, "height": 980})
        page.goto("http://127.0.0.1:8080/?nocache=1", wait_until="networkidle")
        page.wait_for_timeout(700)
        data = page.evaluate(
            """() => {
              const bar = document.querySelector('.hero-portrait .portrait-name');
              const arch = document.querySelector('.hero-portrait .portrait-arch');
              const vines = document.querySelector('.hero-portrait .portrait-with-vines');
              const frame = document.querySelector('.hero-portrait .hero-portrait-frame');
              const img = document.querySelector('.hero-portrait .portrait-frame img');
              const cs = getComputedStyle(bar);
              const br = bar.getBoundingClientRect();
              const ar = arch.getBoundingClientRect();
              const vr = vines.getBoundingClientRect();
              const fr = frame.getBoundingClientRect();
              const ir = img.getBoundingClientRect();
              return {
                classes: bar.className,
                position: cs.position,
                left: cs.left,
                right: cs.right,
                width: cs.width,
                textAlign: cs.textAlign,
                insetInlineStart: cs.insetInlineStart,
                insetInlineEnd: cs.insetInlineEnd,
                transform: cs.transform,
                marginLeft: cs.marginLeft,
                barLeft: br.left,
                archLeft: ar.left,
                imgLeft: ir.left,
                vinesLeft: vr.left,
                frameLeft: fr.left,
                diffArch: ar.left - br.left,
                diffImg: ir.left - br.left,
                barW: br.width,
                archW: ar.width,
                vinesW: vr.width,
                frameW: fr.width,
              };
            }"""
        )
        print(data)
        browser.close()


if __name__ == "__main__":
    main()
