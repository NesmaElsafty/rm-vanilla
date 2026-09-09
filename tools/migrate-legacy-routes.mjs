import fs from 'fs';
import path from 'path';

const root = 'd:/Projects/rana/ranamosaad-vanilla';

const FOOTER_PROGRAMS = `<ul>
              <li><a href="programs-transformation-details.html?slug=new-version-of-yourself" class="footer-link" data-i18n="footer.programNewVersion">النسخة الجديدة من نفسك</a></li>
              <li><a href="programs-practical-details.html?slug=self-confidence" class="footer-link" data-i18n="footer.programConfidence">كورس عمق الثقة بالنفس</a></li>
              <li><a href="programs-feminine-details.html?slug=ana-ontha" class="footer-link" data-i18n="footer.programAnaOntha">أنا أنثى (طاقة شفاء ذاتي)</a></li>
              <li><a href="programs-spiritual-details.html?slug=mottasel" class="footer-link" data-i18n="footer.programMottasel">برنامج متصل للذكاء العاطفي</a></li>
              <li><a href="programs-methodology-details.html?slug=apg" class="footer-link" data-i18n="footer.programApg">APG - إدارة الذات وعبقرية الأداء</a></li>
            </ul>`;

const replacements = [
  [
    /href="program-detail\.html\?slug=new-version-of-yourself"/g,
    'href="programs-transformation-details.html?slug=new-version-of-yourself"',
  ],
  [
    /href="program-detail\.html\?slug=self-confidence"/g,
    'href="programs-practical-details.html?slug=self-confidence"',
  ],
  [
    /href="program-detail\.html\?slug=mottasel"/g,
    'href="programs-spiritual-details.html?slug=mottasel"',
  ],
  [
    /href="program-detail\.html\?slug=apg"/g,
    'href="programs-methodology-details.html?slug=apg"',
  ],
  [
    /href="program-detail\.html\?slug=nlp"/g,
    'href="programs-details.html?slug=nlp"',
  ],
  [
    /href="program-detail\.html\?slug=i-am-female"/g,
    'href="programs-feminine-details.html?slug=ana-ontha"',
  ],
  [
    /href="program-detail\.html\?slug=ana-ontha"/g,
    'href="programs-feminine-details.html?slug=ana-ontha"',
  ],
  [
    /href="workshop-detail\.html\?slug=([^"]+)"/g,
    'href="workshops-details.html?slug=$1"',
  ],
  [
    /href="recorded-session-detail\.html\?slug=([^"]+)"/g,
    'href="recorded-sessions-details.html?slug=$1"',
  ],
  [
    /href="session-detail\.html\?slug=([^"]+)"/g,
    'href="private-sessions-details.html?slug=$1"',
  ],
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'qa' || entry.name === 'tools') {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(html|js|mjs|md)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

const files = walk(root);
let changed = 0;
for (const file of files) {
  let source = fs.readFileSync(file, 'utf8');
  const before = source;
  for (const [re, next] of replacements) {
    source = source.replace(re, next);
  }
  if (source !== before) {
    fs.writeFileSync(file, source);
    changed += 1;
    console.log('updated', path.relative(root, file));
  }
}
console.log('files changed', changed);
