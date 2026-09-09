export const PAGES = [
  { path: '/index.html', name: 'home' },
  { path: '/about.html', name: 'about' },
  { path: '/policies.html', name: 'policies' },
  { path: '/recorded-sessions.html', name: 'recorded-library' },
  { path: '/programs-methodology-details.html?slug=apg', name: 'program-methodology' },
  { path: '/workshops-details.html?slug=you-first', name: 'workshop-rich' },
  {
    path: '/private-sessions-details.html?slug=restore-confidence-self-worth',
    name: 'private-session-rich',
  },
  { path: '/recorded-sessions-details.html?slug=forgiveness', name: 'recorded-rich' },
  { path: '/retreat-detail.html?slug=upcoming', name: 'retreat-detail' },
  { path: '/programs-details.html?slug=nlp', name: 'program-master' },
  { path: '/programs-feminine-details.html?slug=ana-ontha', name: 'program-feminine' },
];

export const VIEWPORTS = [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920];

export const DETAIL_SLUGS = {
  program: [
    'apg',
    'nlp',
    'mottasel',
    'self-confidence',
    'ana-ontha',
    'new-version-of-yourself',
  ],
  workshop: ['you-first', 'emotional-management-secret', 'feminine-code'],
  session: [
    'restore-confidence-self-worth',
    'emotional-need-attachment-release',
    'return-to-god-inner-peace',
  ],
  recorded: ['forgiveness'],
  retreat: ['upcoming'],
};

export async function setLocale(page, locale) {
  await page.addInitScript((value) => {
    localStorage.setItem('rana-site-locale', value);
  }, locale);
}

export async function setTheme(page, theme) {
  await page.addInitScript((value) => {
    localStorage.setItem('rana-site-theme', value);
  }, theme);
}

export async function collectConsoleErrors(page) {
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  return errors;
}

export async function measureOverflow(page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
}
