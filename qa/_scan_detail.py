from pathlib import Path
import re

t = Path(r"d:\Projects\rana\ranamosaad-vanilla\assets\js\detail-pages.js").read_text(encoding="utf-8")
print("len", len(t))
print("braces", t.count("{"), t.count("}"))

for n, line in enumerate(t.splitlines(), 1):
    weird = [(c, hex(ord(c))) for c in line if ord(c) > 127 and c not in "٠١٢٣٤٥٦٧٨٩"]
    if weird:
        print(n, weird[:8], line[:120])

# Look for export function with destructuring
for n, line in enumerate(t.splitlines(), 1):
    if "refreshPolicies" in line or "scrollToHighlight" in line:
        print("LINE", n, line)
