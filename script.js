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
  let lockedScrollPosition = 0;

  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  function setTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme === 'mono' ? 'dark' : 'light';
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', theme === 'mono' ? '#050505' : '#dcedc1');
    if (themeButton) {
      const monoNext = theme === 'palette';
      themeButton.setAttribute('aria-label', monoNext ? 'Switch to monochrome theme' : 'Switch to colorful theme');
      themeButton.setAttribute('title', monoNext ? 'Use monochrome theme' : 'Use colorful theme');
    }
    try { localStorage.setItem(themeStorageKey, theme); } catch (_) {}
    window.dispatchEvent(new CustomEvent('portfolio:themechange', { detail: { theme } }));
  }

  setTheme(root.dataset.theme === 'mono' ? 'mono' : 'palette');
  themeButton?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'mono' ? 'palette' : 'mono');
  });

  function closeMenu(restoreFocus = false) {
    if (!menuButton || !mobileMenu) return;
    mobileMenu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    const srText = menuButton.querySelector('.sr-only');
    if (srText) srText.textContent = 'Open menu';
    body.classList.remove('menu-open');
    body.style.removeProperty('top');
    if (main) main.inert = false;
    if (footer) footer.inert = false;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, lockedScrollPosition);
    root.style.scrollBehavior = previousScrollBehavior;
    if (restoreFocus) menuButton.focus({ preventScroll: true });
  }

  function openMenu() {
    if (!menuButton || !mobileMenu) return;
    lockedScrollPosition = window.scrollY;
    mobileMenu.hidden = false;
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Close menu');
    const srText = menuButton.querySelector('.sr-only');
    if (srText) srText.textContent = 'Close menu';
    body.style.top = `-${lockedScrollPosition}px`;
    body.classList.add('menu-open');
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

  function onScroll() {
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 920 && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
      event.preventDefault();
      closeMenu(true);
    }
  });

  const revealNodes = [...document.querySelectorAll('[data-reveal]')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });
    revealNodes.forEach((node) => revealObserver.observe(node));
  }

  if ('IntersectionObserver' in window) {
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
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.1, 0.4, 0.7] });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  initNetworkGlobe(reduceMotion);

  function initNetworkGlobe(reduceMotionEnabled) {
    const canvas = document.querySelector('.network-globe');
    const visual = document.querySelector('.hero-visual');
    const scene = document.querySelector('.orbital-scene');
    if (!(canvas instanceof HTMLCanvasElement) || !visual || !scene) return;

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const pointCount = 104;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const points = Array.from({ length: pointCount }, (_, index) => {
      const y = 1 - (index / (pointCount - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * index;
      return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius };
    });

    const connections = [];
    for (let a = 0; a < points.length; a += 1) {
      for (let b = a + 1; b < points.length; b += 1) {
        const dx = points[a].x - points[b].x;
        const dy = points[a].y - points[b].y;
        const dz = points[a].z - points[b].z;
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 0.34) connections.push([a, b]);
      }
    }

    let width = 0;
    let height = 0;
    let frame = 0;
    let previousTime = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function rotatePoint(point, rotationY, rotationX) {
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const xY = point.x * cosY - point.z * sinY;
      const zY = point.x * sinY + point.z * cosY;
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      return {
        x: xY,
        y: point.y * cosX - zY * sinX,
        z: point.y * sinX + zY * cosX
      };
    }

    function draw(time = 0) {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);
      pointerX += (targetPointerX - pointerX) * 0.045;
      pointerY += (targetPointerY - pointerY) * 0.045;

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.315;
      const rotationY = time * 0.00012 + pointerX;
      const rotationX = -0.16 + Math.sin(time * 0.00017) * 0.035 + pointerY;
      const ink = getComputedStyle(root).getPropertyValue('--ink').trim() || '#111111';
      const projected = points.map((point) => {
        const rotated = rotatePoint(point, rotationY, rotationX);
        const perspective = 2.8 / (3.3 - rotated.z);
        return {
          x: centerX + rotated.x * radius * perspective,
          y: centerY + rotated.y * radius * perspective,
          z: rotated.z,
          depth: (rotated.z + 1) / 2
        };
      });

      context.lineCap = 'round';
      connections.forEach(([a, b]) => {
        const first = projected[a];
        const second = projected[b];
        const depth = Math.max(0, (first.depth + second.depth) / 2);
        context.beginPath();
        context.moveTo(first.x, first.y);
        context.lineTo(second.x, second.y);
        context.strokeStyle = ink;
        context.globalAlpha = 0.025 + depth * 0.15;
        context.lineWidth = 0.45 + depth * 0.38;
        context.stroke();
      });

      projected
        .map((point, index) => ({ ...point, index }))
        .sort((a, b) => a.z - b.z)
        .forEach((point) => {
          const pulse = 0.88 + Math.sin(time * 0.002 + point.index * 0.72) * 0.16;
          context.beginPath();
          context.arc(point.x, point.y, (0.62 + point.depth * 1.15) * pulse, 0, Math.PI * 2);
          context.fillStyle = ink;
          context.globalAlpha = 0.12 + point.depth * 0.72;
          context.fill();
        });
      context.globalAlpha = 1;
    }

    function animate(time) {
      if (time - previousTime > 28) {
        draw(time);
        previousTime = time;
      }
      frame = requestAnimationFrame(animate);
    }

    function onPointerMove(event) {
      if (event.pointerType === 'touch') return;
      const bounds = visual.getBoundingClientRect();
      const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;
      targetPointerX = normalizedX * 0.26;
      targetPointerY = normalizedY * -0.18;
      scene.style.setProperty('--scene-tilt-x', `${normalizedX * 5}deg`);
      scene.style.setProperty('--scene-tilt-y', `${normalizedY * -4}deg`);
    }

    function resetTilt() {
      targetPointerX = 0;
      targetPointerY = 0;
      scene.style.setProperty('--scene-tilt-x', '0deg');
      scene.style.setProperty('--scene-tilt-y', '0deg');
    }

    function redraw() { draw(reduceMotionEnabled ? 0 : performance.now()); }

    resize();
    redraw();
    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(() => { resize(); redraw(); });
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener('resize', () => { resize(); redraw(); });
    }
    visual.addEventListener('pointermove', onPointerMove);
    visual.addEventListener('pointerleave', resetTilt);
    window.addEventListener('portfolio:themechange', redraw);
    if (!reduceMotionEnabled) frame = requestAnimationFrame(animate);

    window.addEventListener('pagehide', () => cancelAnimationFrame(frame), { once: true });
  }
})();
