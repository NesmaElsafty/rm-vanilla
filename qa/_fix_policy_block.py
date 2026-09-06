from pathlib import Path

path = Path(r"d:\Projects\rana\ranamosaad-vanilla\assets\js\detail-pages.js")
text = path.read_text(encoding="utf-8")
start = text.find("function renderPolicyBlock")
end = text.find("export function refreshPolicies", start)
if start < 0 or end < 0:
    raise SystemExit(f"markers not found start={start} end={end}")

replacement = """function renderPolicyBlock(block, locale) {
  if (block.type === 'ul') {
    const items = block.items?.[locale] ?? block.items?.ar ?? [];
    const listItems = items.map((item) => '<li>' + escapeHtml(item) + '</li>').join('');
    return `<ul class="${escapeHtml(block.className || 'policy-list')}">${listItems}</ul>`;
  }
  const html = block.html?.[locale] ?? block.html?.ar ?? '';
  return `<p>${html}</p>`;
}

"""

path.write_text(text[:start] + replacement + text[end:], encoding="utf-8")
print("fixed renderPolicyBlock")
