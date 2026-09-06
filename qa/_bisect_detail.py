from playwright.sync_api import sync_playwright


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://127.0.0.1:8080/")
        # Load as classic script via blob won't work for modules. Use Function constructor on text.
        text = page.evaluate(
            """async () => {
              const res = await fetch('/assets/js/detail-pages.js');
              return await res.text();
            }"""
        )
        # Binary search for parse error by wrapping chunks
        lines = text.splitlines()
        print("lines", len(lines))
        lo, hi = 0, len(lines)
        bad = None
        while lo < hi:
            mid = (lo + hi) // 2
            chunk = "\n".join(lines[: mid + 1])
            # try parse as module by dynamic Function of import? use page evaluate new Function
            ok = page.evaluate(
                """(src) => {
                  try {
                    // strip imports/exports for Function parse of statements roughly won't work.
                    return null;
                  } catch (e) { return e.message; }
                }""",
                chunk,
            )
            # Better: write temporary module via blob URL
            result = page.evaluate(
                """async (src) => {
                  const blob = new Blob([src], {type: 'text/javascript'});
                  const url = URL.createObjectURL(blob);
                  try {
                    await import(url);
                    URL.revokeObjectURL(url);
                    return 'OK';
                  } catch (e) {
                    URL.revokeObjectURL(url);
                    return e.message;
                  }
                }""",
                chunk,
            )
            print(mid + 1, result)
            if result == "OK":
                lo = mid + 1
            else:
                bad = mid
                hi = mid
        if bad is not None:
            start = max(0, bad - 5)
            end = min(len(lines), bad + 6)
            print("AROUND LINE", bad + 1)
            for i in range(start, end):
                print(f"{i+1}: {lines[i]}")
        browser.close()


if __name__ == "__main__":
    main()
