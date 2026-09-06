"""Visual QA capture: React vs Vanilla side-by-side screenshots."""
from __future__ import annotations

import json
from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path(__file__).resolve().parent / "screenshots"
OUT.mkdir(parents=True, exist_ok=True)

REACT = "http://127.0.0.1:3000"
VANILLA = "http://127.0.0.1:8080"

PAGES = [
    ("home", "/", "/index.html"),
    ("about", "/about", "/about.html"),
    ("policies", "/policies", "/policies.html"),
    ("recorded-sessions", "/recorded-sessions", "/recorded-sessions.html"),
    ("program-detail", "/programs/apg", "/program-detail.html?slug=apg"),
    ("workshop-detail", "/workshops/you-first", "/workshop-detail.html?slug=you-first"),
    ("session-detail", "/sessions/restore-confidence-self-worth", "/session-detail.html?slug=restore-confidence-self-worth"),
    ("recorded-session-detail", "/recorded-sessions/forgiveness", "/recorded-session-detail.html?slug=forgiveness"),
    ("retreat-detail", "/retreats/upcoming", "/retreat-detail.html?slug=upcoming"),
]

# Focus set for first pass; expand after fixes if needed.
VIEWPORTS = [
    ("375", 375, 812),
    ("390", 390, 844),
    ("768", 768, 1024),
    ("1280", 1280, 800),
    ("1920", 1920, 1080),
]

CONFIGS = [
    ("ar-luxury", "ar", "luxury-rose"),
    ("en-luxury", "en", "luxury-rose"),
    ("ar-cream", "ar", "cream-elegance"),
]


def prepare(page, locale: str, theme: str) -> None:
    page.add_init_script(
        f"""
        localStorage.setItem('rana-site-locale', '{locale}');
        localStorage.setItem('rana-site-theme', '{theme}');
        """
    )


def capture(page, url: str, out_path: Path) -> dict:
    page.goto(url, wait_until="domcontentloaded", timeout=45000)
    page.wait_for_timeout(1500)
    # Hide floating dock for cleaner layout comparison of main chrome
    page.evaluate(
        """() => {
          const dock = document.getElementById('whatsapp-floating-component');
          if (dock) dock.style.visibility = 'hidden';
        }"""
    )
    page.screenshot(path=str(out_path), full_page=True)
    metrics = page.evaluate(
        """() => {
          const body = document.body;
          const html = document.documentElement;
          return {
            scrollWidth: Math.max(body.scrollWidth, html.scrollWidth),
            clientWidth: html.clientWidth,
            overflowX: Math.max(body.scrollWidth, html.scrollWidth) - html.clientWidth,
            title: document.title,
            lang: html.lang,
            dir: html.dir,
            theme: html.getAttribute('data-theme'),
          };
        }"""
    )
    return metrics


def main() -> None:
    # Faster focused matrix: key pages × critical viewports × all locale/theme configs
    focused_pages = [
        PAGES[0],  # home
        PAGES[1],  # about
        PAGES[2],  # policies
        PAGES[3],  # recorded list
        PAGES[4],  # program detail
        PAGES[5],  # workshop
        PAGES[6],  # session
        PAGES[7],  # recorded detail
        PAGES[8],  # retreat
    ]
    focused_viewports = [
        ("375", 375, 812),
        ("768", 768, 1024),
        ("1280", 1280, 800),
    ]
    report = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for cfg_name, locale, theme in CONFIGS:
            for vp_name, width, height in focused_viewports:
                # Full page set only at 1280 + ar-luxury; subset elsewhere
                page_subset = focused_pages if (cfg_name == "ar-luxury" and vp_name in {"375", "1280"}) else [focused_pages[0], focused_pages[1], focused_pages[4]]
                for page_name, react_path, vanilla_path in page_subset:
                    context = browser.new_context(
                        viewport={"width": width, "height": height},
                        device_scale_factor=1,
                    )
                    page = context.new_page()
                    prepare(page, locale, theme)
                    stem = f"{page_name}__{cfg_name}__{vp_name}"
                    react_file = OUT / f"react__{stem}.png"
                    vanilla_file = OUT / f"vanilla__{stem}.png"
                    try:
                        print(f"CAPTURING {stem} ...", flush=True)
                        r_metrics = capture(page, f"{REACT}{react_path}", react_file)
                        v_metrics = capture(page, f"{VANILLA}{vanilla_path}", vanilla_file)
                        report.append(
                            {
                                "page": page_name,
                                "config": cfg_name,
                                "viewport": vp_name,
                                "react": r_metrics,
                                "vanilla": v_metrics,
                                "react_shot": react_file.name,
                                "vanilla_shot": vanilla_file.name,
                            }
                        )
                        print(f"OK {stem} overflowR={r_metrics['overflowX']} overflowV={v_metrics['overflowX']}", flush=True)
                    except Exception as exc:  # noqa: BLE001
                        print(f"FAIL {stem}: {exc}", flush=True)
                        report.append({"page": page_name, "config": cfg_name, "viewport": vp_name, "error": str(exc)})
                    finally:
                        context.close()
        browser.close()

    (OUT / "report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"Wrote {OUT / 'report.json'} with {len(report)} entries", flush=True)


if __name__ == "__main__":
    main()
