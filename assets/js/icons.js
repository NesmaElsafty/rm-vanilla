function svg(cls, inner, strokeWidth = '1.75') {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

export function iconMenu(cls = 'icon icon-sm') {
  return svg(
    cls,
    '<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>',
  );
}

export function iconX(cls = 'icon icon-sm') {
  return svg(cls, '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>');
}

export function iconSun(cls = 'icon icon-sm') {
  return svg(
    cls,
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  );
}

export function iconMoon(cls = 'icon icon-sm') {
  return svg(cls, '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>');
}

export function iconLanguages(cls = 'icon icon-sm') {
  return svg(
    cls,
    '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
  );
}

export function iconChevronLeft(cls = 'icon icon-sm') {
  return svg(cls, '<path d="m15 18-6-6 6-6"/>');
}

export function iconChevronRight(cls = 'icon icon-sm') {
  return svg(cls, '<path d="m9 18 6-6-6-6"/>');
}

export function iconChevronDown(cls = 'icon icon-sm') {
  return svg(cls, '<path d="m6 9 6 6 6-6"/>');
}

export function iconArrowDown(cls = 'icon icon-sm') {
  return svg(cls, '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>');
}

export function iconArrowLeft(cls = 'icon icon-sm') {
  return svg(cls, '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>');
}

export function iconArrowRight(cls = 'icon icon-sm') {
  return svg(cls, '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>');
}

export function iconSend(cls = 'icon icon-sm') {
  return svg(cls, '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>');
}

export function iconPhone(cls = 'icon icon-sm') {
  return svg(
    cls,
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    '1.5',
  );
}

export function iconMail(cls = 'icon icon-sm') {
  return svg(
    cls,
    '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    '1.5',
  );
}

export function iconClock(cls = 'icon icon-sm') {
  return svg(cls, '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', '1.5');
}

export function iconMessageSquare(cls = 'icon icon-sm') {
  return svg(cls, '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>');
}

export function iconCheckCircle(cls = 'icon icon-sm') {
  return svg(cls, '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>');
}

export function iconCheck(cls = 'icon icon-sm') {
  return svg(cls, '<path d="M20 6 9 17l-5-5"/>');
}

export function iconShield(cls = 'icon icon-sm') {
  return svg(cls, '<path d="M20 13c0 5-3.5 7.5-8 10.5C7.5 20.5 4 18 4 13V6l8-3 8 3z"/>');
}

export function iconShieldAlert(cls = 'icon icon-sm') {
  return svg(
    cls,
    '<path d="M20 13c0 5-3.5 7.5-8 10.5C7.5 20.5 4 18 4 13V6l8-3 8 3z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    '1.5',
  );
}

export function iconGlobe(cls = 'icon icon-sm') {
  return svg(
    cls,
    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  );
}

export function iconCompass(cls = 'icon icon-sm') {
  return svg(
    cls,
    '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  );
}

export function iconSparkles(cls = 'icon icon-sm') {
  return svg(
    cls,
    '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
  );
}

export function iconHeart(cls = 'icon icon-sm') {
  return svg(
    cls,
    '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  );
}

export function iconStar(cls = 'icon icon-sm') {
  return svg(
    cls,
    '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  );
}

export function iconQuote(cls = 'icon icon-sm') {
  return svg(
    cls,
    '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
  );
}

export function iconFacebook(cls = 'icon icon-sm') {
  return svg(cls, '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>');
}

export function iconInstagram(cls = 'icon icon-sm') {
  return svg(
    cls,
    '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
  );
}

export function iconYoutube(cls = 'icon icon-sm') {
  return svg(
    cls,
    '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
  );
}

export function iconTelegram(cls = 'icon icon-sm') {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.94 4.57a1.5 1.5 0 0 0-1.56-.25L2.89 12.13c-1.05.44-1.04 1.93.02 2.35l4.78 1.9 1.84 5.58a1.17 1.17 0 0 0 1.12.8c.5 0 .97-.3 1.16-.78l2.08-5.18 5.05 3.72a1.5 1.5 0 0 0 2.35-.92l3.75-12.13ZM9.6 14.2l-.28 3.05 1.05-3.18 5.58-5.05-6.35 5.18Z"/></svg>`;
}

export function iconUsers(cls = 'icon icon-sm') {
  return svg(
    cls,
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  );
}

const ICON_MAP = {
  menu: iconMenu,
  x: iconX,
  sun: iconSun,
  moon: iconMoon,
  languages: iconLanguages,
  chevronLeft: iconChevronLeft,
  chevronRight: iconChevronRight,
  chevronDown: iconChevronDown,
  arrowDown: iconArrowDown,
  arrowLeft: iconArrowLeft,
  arrowRight: iconArrowRight,
  send: iconSend,
  phone: iconPhone,
  mail: iconMail,
  clock: iconClock,
  messageSquare: iconMessageSquare,
  checkCircle: iconCheckCircle,
  check: iconCheck,
  shield: iconShield,
  shieldAlert: iconShieldAlert,
  globe: iconGlobe,
  compass: iconCompass,
  sparkles: iconSparkles,
  heart: iconHeart,
  star: iconStar,
  quote: iconQuote,
  facebook: iconFacebook,
  instagram: iconInstagram,
  youtube: iconYoutube,
  telegram: iconTelegram,
  users: iconUsers,
};

function resolveDirectionalIcon(name) {
  const rtl = document.documentElement.dir === 'rtl';
  if (name === 'chevronForward') return rtl ? 'chevronLeft' : 'chevronRight';
  if (name === 'chevronBack') return rtl ? 'chevronRight' : 'chevronLeft';
  if (name === 'arrowBack') return rtl ? 'arrowRight' : 'arrowLeft';
  if (name === 'arrowForward') return rtl ? 'arrowLeft' : 'arrowRight';
  return name;
}

export function getIcon(name, cls = 'icon icon-sm') {
  return ICON_MAP[resolveDirectionalIcon(name)]?.(cls) ?? '';
}

export function initIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((el) => {
    const name = el.getAttribute('data-icon');
    const cls = el.getAttribute('data-icon-class') || 'icon icon-sm';
    const markup = getIcon(name, cls);
    if (markup) el.innerHTML = markup;
  });
}
