const HOME_SECTIONS = ['hero', 'about', 'philosophy', 'programs', 'testimonials', 'final-cta', 'contact'];
const SCROLL_OFFSET = 180;
const SCROLL_THRESHOLD = 24;

const SECTION_HREF = {
  hero: 'index.html#hero',
  about: 'index.html#about',
  philosophy: 'index.html#philosophy',
  programs: 'index.html#programs',
  testimonials: 'index.html#testimonials',
  contact: 'index.html#contact',
  'final-cta': 'index.html#final-cta',
};

function currentPage() {
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  return file || 'index.html';
}

export function isHomePage() {
  const page = currentPage();
  return page === 'index.html' || page === 'index' || page === '';
}

export function isAboutPage() {
  return currentPage() === 'about.html';
}

function closeMobileMenu() {
  document.querySelectorAll('[data-mobile-menu]').forEach((menu) => {
    menu.classList.remove('is-open');
    menu.hidden = true;
  });
  document.querySelectorAll('[data-menu-toggle]').forEach((btn) => {
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('is-open');
  });
  document.body.style.overflow = '';
}

function openMobileMenu() {
  document.querySelectorAll('[data-mobile-menu]').forEach((menu) => {
    menu.classList.add('is-open');
    menu.hidden = false;
  });
  document.querySelectorAll('[data-menu-toggle]').forEach((btn) => {
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('is-open');
  });
  document.body.style.overflow = 'hidden';
}

function isMenuOpen() {
  return Boolean(document.querySelector('[data-mobile-menu].is-open'));
}

function toggleMobileMenu() {
  if (isMenuOpen()) closeMobileMenu();
  else openMobileMenu();
}

function updateScrollNav() {
  const scrolled = window.scrollY > SCROLL_THRESHOLD;
  document.querySelectorAll('nav, .nav-luxury').forEach((nav) => {
    nav.classList.toggle('nav-luxury-scrolled', scrolled);
    nav.classList.toggle('nav--scrolled', scrolled);
  });
}

function setActiveSection(id) {
  document.querySelectorAll('[data-nav]').forEach((link) => {
    const target = link.getAttribute('data-nav');
    let active = false;
    if (target === 'about' && isAboutPage()) active = true;
    else if (isHomePage() && target === id) active = true;
    link.classList.toggle('is-active', active);
    link.classList.toggle('text-brand-gold', active);
  });
}

function syncActiveFromScroll() {
  if (!isHomePage() || isAboutPage()) return;
  let current = 'hero';
  const y = window.scrollY + SCROLL_OFFSET;
  for (const id of HOME_SECTIONS) {
    const el = document.getElementById(id);
    if (el && y >= el.offsetTop && y < el.offsetTop + el.offsetHeight) current = id;
  }
  setActiveSection(current);
}

export function goToSection(id) {
  closeMobileMenu();

  if (!isHomePage()) {
    location.href = SECTION_HREF[id] ?? `index.html#${id}`;
    return;
  }

  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  location.href = SECTION_HREF[id] ?? `index.html#${id}`;
}

export function goHome() {
  closeMobileMenu();
  if (isHomePage()) {
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  location.href = 'index.html';
}

function applyPreselectFromQuery() {
  const params = new URLSearchParams(location.search);
  const program = params.get('session') || params.get('program');
  if (program) window.__preSelectedProgram = program;
  return params;
}

function scrollToTarget(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function highlightCurrentPage() {
  if (isAboutPage()) {
    document.querySelectorAll('[data-nav]').forEach((link) => {
      const active = link.getAttribute('data-nav') === 'about';
      link.classList.toggle('is-active', active);
      link.classList.toggle('text-brand-gold', active);
    });
    return;
  }

  if (currentPage() === 'recorded-sessions.html' || currentPage() === 'policies.html') {
    document.querySelectorAll('[data-nav]').forEach((link) => {
      link.classList.remove('is-active', 'text-brand-gold');
    });
    return;
  }

  if (isHomePage()) syncActiveFromScroll();
}

function handleNavClick(event, id) {
  closeMobileMenu();

  if (isHomePage() && document.getElementById(id)) {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function initNavigation() {
  updateScrollNav();
  highlightCurrentPage();

  window.addEventListener('scroll', () => {
    updateScrollNav();
    syncActiveFromScroll();
  }, { passive: true });

  document.querySelectorAll('[data-menu-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => toggleMobileMenu());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isMenuOpen()) closeMobileMenu();
  });

  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('data-nav');
      if (!id) return;
      handleNavClick(event, id);
    });
  });

  document.querySelectorAll('[data-home]').forEach((el) => {
    el.addEventListener('click', (event) => {
      if (isHomePage()) {
        event.preventDefault();
        goHome();
        return;
      }
      closeMobileMenu();
    });
  });

  document.querySelectorAll('[data-scroll="contact"]').forEach((el) => {
    el.addEventListener('click', (event) => {
      closeMobileMenu();
      if (isHomePage() && document.getElementById('contact')) {
        event.preventDefault();
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  document.querySelectorAll('[data-policies]').forEach((el) => {
    el.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  const params = applyPreselectFromQuery();
  const hashTarget = location.hash.replace('#', '');
  const queryScroll = params.get('scroll');
  const target = queryScroll || hashTarget;

  if (target) {
    window.setTimeout(() => scrollToTarget(target), 120);
  }
}
