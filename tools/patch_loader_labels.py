from pathlib import Path

needle = ".page-loader-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}"
insert = needle + " html[lang=en] .page-loader-label [lang=ar],html:not([lang=en]) .page-loader-label [lang=en]{display:none}"

for path in Path('.').glob('*.html'):
    text = path.read_text(encoding='utf-8')
    if 'page-loader-label [lang=ar]' in text:
        print('already', path.name)
        continue
    if needle not in text:
        print('missing', path.name)
        continue
    path.write_text(text.replace(needle, insert, 1), encoding='utf-8')
    print('labels', path.name)
