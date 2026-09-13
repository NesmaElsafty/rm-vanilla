from pathlib import Path

needle = "document.documentElement.classList.add('page-loading');"
insert = (
    needle
    + "\n        setTimeout(function () {"
    + " document.documentElement.classList.remove('page-loading');"
    + " document.documentElement.classList.add('page-is-ready');"
    + " }, 3000);"
)

for path in Path('.').glob('*.html'):
    text = path.read_text(encoding='utf-8')
    if "classList.remove('page-loading')" in text:
        print('already', path.name)
        continue
    if needle not in text:
        print('missing', path.name)
        continue
    path.write_text(text.replace(needle, insert, 1), encoding='utf-8')
    print('timeout', path.name)
