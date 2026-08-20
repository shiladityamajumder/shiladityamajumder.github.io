(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('.site-header');
  const main = document.querySelector('#main-content');
  const footer = document.querySelector('.site-footer');
  const themeButton = document.querySelector('[data-theme-toggle]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('#mobile-menu');
  const currentYear = document.querySelector('[data-current-year]');
  const navigationLinks = [...document.querySelectorAll('.desktop-nav a')];
  const sectionIds = ['about', 'experience', 'projects', 'skills', 'contact'];
  const themeStorageKey = 'portfolio-theme';
  const themeOrder = ['studio', 'mono', 'palette'];
  const themeMeta = {
    studio: { number: '01', name: 'Tech', fullName: 'Tech Blue', color: '#ffffff', scheme: 'light' },
    mono: { number: '02', name: 'Mono', fullName: 'Monochrome', color: '#050505', scheme: 'dark' },
    palette: { number: '03', name: 'Pastel', fullName: 'Pastel Joy', color: '#fffaf7', scheme: 'light' }
  };


  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  function setTheme(theme, persist = true) {
    const nextTheme = themeOrder.includes(theme) ? theme : 'studio';
    const index = themeOrder.indexOf(nextTheme);
    const nextIndex = (index + 1) % themeOrder.length;
    const meta = themeMeta[nextTheme];
    const nextMeta = themeMeta[themeOrder[nextIndex]];

    root.dataset.theme = nextTheme;
    root.style.colorScheme = meta.scheme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', meta.color);

    if (themeButton) {
      themeButton.setAttribute(
        'aria-label',
        `Theme ${index + 1} of ${themeOrder.length}: ${meta.fullName}. Click to switch to ${nextMeta.fullName}`
      );
      themeButton.setAttribute('title', `Switch to ${nextMeta.fullName}`);
    }

    if (persist) {
      try { localStorage.setItem(themeStorageKey, nextTheme); } catch (_) {}
    }

    window.dispatchEvent(new CustomEvent('portfolio:themechange', { detail: { theme: nextTheme } }));
  }

  function cycleTheme() {
    const currentIndex = themeOrder.indexOf(root.dataset.theme);
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  }

  setTheme(themeOrder.includes(root.dataset.theme) ? root.dataset.theme : 'studio', false);
  themeButton?.addEventListener('click', cycleTheme);

  function closeMenu(restoreFocus = false) {
    if (!menuButton || !mobileMenu) return;
    mobileMenu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    const srText = menuButton.querySelector('.sr-only');
    if (srText) srText.textContent = 'Open menu';
    root.classList.remove('menu-open');
    body.classList.remove('menu-open');
    header?.classList.remove('menu-active');
    if (main) main.inert = false;
    if (footer) footer.inert = false;
    if (restoreFocus) menuButton.focus({ preventScroll: true });
  }

  function openMenu() {
    if (!menuButton || !mobileMenu) return;
    mobileMenu.hidden = false;
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Close menu');
    const srText = menuButton.querySelector('.sr-only');
    if (srText) srText.textContent = 'Close menu';
    root.classList.add('menu-open');
    body.classList.add('menu-open');
    header?.classList.add('menu-active');
    if (main) main.inert = true;
    if (footer) footer.inert = true;
  }

  menuButton?.addEventListener('click', () => {
    if (menuButton.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenu();
  });

  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('touchmove', (event) => {
    if (!body.classList.contains('menu-open')) return;
    if (mobileMenu?.contains(event.target)) return;
    event.preventDefault();
  }, { passive: false });

  function onScroll() {
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1080 && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
      event.preventDefault();
      closeMenu(true);
    }
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealNodes = [...document.querySelectorAll('[data-reveal]')];

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealNodes.forEach((node) => revealObserver.observe(node));
  }

  if ('IntersectionObserver' in window && navigationLinks.length) {
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navigationLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${visible.target.id}`) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-24% 0px -62% 0px', threshold: [0.08, 0.35, 0.65] });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  initSystemScene(reduceMotion);

  function initSystemScene(reduceMotionEnabled) {
    const scene = document.querySelector('[data-system-scene]');
    if (!scene || reduceMotionEnabled) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function update() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      scene.style.setProperty('--tilt-x', `${currentX.toFixed(2)}deg`);
      scene.style.setProperty('--tilt-y', `${currentY.toFixed(2)}deg`);

      const moving = Math.abs(targetX - currentX) > 0.02 || Math.abs(targetY - currentY) > 0.02;
      if (moving) frame = requestAnimationFrame(update);
      else frame = 0;
    }

    function requestUpdate() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    scene.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const bounds = scene.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      targetX = x * 5.5;
      targetY = y * -4.2;
      requestUpdate();
    });

    scene.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
      requestUpdate();
    });

    window.addEventListener('pagehide', () => {
      if (frame) cancelAnimationFrame(frame);
    }, { once: true });
  }
})();
