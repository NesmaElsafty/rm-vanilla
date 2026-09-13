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

let navEls = [];
let navLinks = [];
let sectionEls = [];
let lastActiveId = null;
let lastScrolled = null;
let scrollRaf = 0;

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

function cacheNavDom() {
  navEls = Array.from(document.querySelectorAll('.nav-luxury'));
  if (!navEls.length) navEls = Array.from(document.querySelectorAll('nav'));
  navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  sectionEls = HOME_SECTIONS
    .map((id) => document.getElementById(id))
    .filter(Boolean);
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

function setScrolled(scrolled) {
  if (scrolled === lastScrolled) return;
  lastScrolled = scrolled;
  navEls.forEach((nav) => {
    nav.classList.toggle('nav-luxury-scrolled', scrolled);
    nav.classList.toggle('nav--scrolled', scrolled);
  });
}

function setActiveSection(id) {
  if (id === lastActiveId) return;
  lastActiveId = id;
  navLinks.forEach((link) => {
    const target = link.getAttribute('data-nav');
    let active = false;
    if (target === 'about' && isAboutPage()) active = true;
    else if (isHomePage() && target === id) active = true;
    const wasActive = link.classList.contains('is-active');
    if (active === wasActive) return;
    link.classList.toggle('is-active', active);
    link.classList.toggle('text-brand-gold', active);
  });
}

function clearActiveNav() {
  if (lastActiveId === '') return;
  lastActiveId = '';
  navLinks.forEach((link) => {
    link.classList.remove('is-active', 'text-brand-gold');
  });
}

function syncActiveFromCachedGeometry() {
  if (!isHomePage() || isAboutPage()) return;
  const y = window.scrollY + SCROLL_OFFSET;
  let current = 'hero';
  for (const el of sectionEls) {
    if (y >= el.offsetTop && y < el.offsetTop + el.offsetHeight) current = el.id;
  }
  setActiveSection(current);
}

function ensureScrollSentinel() {
  let sentinel = document.querySelector('[data-nav-scroll-sentinel]');
  if (sentinel) return sentinel;
  sentinel = document.createElement('div');
  sentinel.setAttribute('data-nav-scroll-sentinel', '');
  sentinel.setAttribute('aria-hidden', 'true');
  const shell = document.querySelector('.page-shell') || document.body;
  shell.insertBefore(sentinel, shell.firstChild);
  return sentinel;
}

function initNavbarSentinel() {
  if (!('IntersectionObserver' in window)) return false;
  const sentinel = ensureScrollSentinel();
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      setScrolled(!entry.isIntersecting);
    },
    { threshold: 0 },
  );
  observer.observe(sentinel);
  return true;
}

function initSectionObserver() {
  if (!isHomePage() || isAboutPage()) return false;
  if (!('IntersectionObserver' in window) || !sectionEls.length) return false;

  const intersectingIds = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) intersectingIds.add(entry.target.id);
        else intersectingIds.delete(entry.target.id);
      });
      let current = null;
      for (const id of HOME_SECTIONS) {
        if (intersectingIds.has(id)) current = id;
      }
      if (current) setActiveSection(current);
    },
    {
      root: null,
      rootMargin: '-20% 0px -55% 0px',
      threshold: 0,
    },
  );

  sectionEls.forEach((el) => observer.observe(el));
  return true;
}

function initScrollFallback() {
  const onScroll = () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      syncActiveFromCachedGeometry();
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

export function goToSection(id) {
  closeMobileMenu();

  if (!isHomePage()) {
    location.href = SECTION_HREF[id] ?? `index.html#${id}`;
    return;
  }

  const el = document.getElementById(id);
  if (el) {
    setActiveSection(id);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  location.href = SECTION_HREF[id] ?? `index.html#${id}`;
}

export function goHome() {
  closeMobileMenu();
  if (isHomePage()) {
    setActiveSection('hero');
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
    setActiveSection('about');
    return;
  }

  if (currentPage() === 'recorded-sessions.html' || currentPage() === 'policies.html') {
    clearActiveNav();
    return;
  }

  if (isHomePage()) {
    const hash = location.hash.replace('#', '');
    if (hash && HOME_SECTIONS.includes(hash)) {
      setActiveSection(hash);
      return;
    }
    setActiveSection('hero');
  }
}

function handleNavClick(event, id) {
  closeMobileMenu();

  const el = document.getElementById(id);
  if (isHomePage() && el) {
    event.preventDefault();
    setActiveSection(id);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function initNavigation() {
  cacheNavDom();
  highlightCurrentPage();
  setScrolled(window.scrollY > SCROLL_THRESHOLD);

  const navbarObserved = initNavbarSentinel();
  const sectionsObserved = initSectionObserver();
  const needsSectionFallback = isHomePage() && !isAboutPage() && !sectionsObserved;
  if (!navbarObserved || needsSectionFallback) {
    initScrollFallback();
  }

  document.querySelectorAll('[data-menu-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => toggleMobileMenu());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isMenuOpen()) closeMobileMenu();
  });

  navLinks.forEach((link) => {
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
      const contact = document.getElementById('contact');
      if (isHomePage() && contact) {
        event.preventDefault();
        setActiveSection('contact');
        contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
