(() => {
  'use strict';

  const root = document.documentElement;
  const header = document.querySelector('[data-header]');
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const yearNode = document.querySelector('[data-year]');
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const revealNodes = [...document.querySelectorAll('[data-reveal]')];

  const safeStorage = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Storage may be blocked; the site remains fully functional.
      }
    }
  };

  const savedTheme = safeStorage.get('portfolio-theme');
  const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    themeToggle?.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
    );
    themeToggle?.setAttribute(
      'title',
      theme === 'dark' ? 'Use light theme' : 'Use dark theme'
    );
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#0b0b0b' : '#ffffff'
    );
    window.dispatchEvent(new CustomEvent('portfolio:themechange', { detail: { theme } }));
  };

  setTheme(initialTheme);

  themeToggle?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    safeStorage.set('portfolio-theme', nextTheme);
  });

  const closeMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
    document.body.classList.remove('menu-open');
  };

  menuToggle?.addEventListener('click', () => {
    if (!mobileMenu) return;
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.hidden = isOpen;
    document.body.classList.toggle('menu-open', !isOpen);
  });

  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 920) closeMenu();
  });

  window.addEventListener(
    'scroll',
    () => header?.classList.toggle('is-scrolled', window.scrollY > 12),
    { passive: true }
  );

  header?.classList.toggle('is-scrolled', window.scrollY > 12);

  if (yearNode) yearNode.textContent = String(new Date().getFullYear());

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -7% 0px' }
    );

    revealNodes.forEach((node) => revealObserver.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  }

  if ('IntersectionObserver' in window && navLinks.length) {
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${visible.target.id}`;
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0.1, 0.4, 0.7] }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }


  const globeCanvas = document.querySelector('[data-network-globe]');
  const orbitalVisual = document.querySelector('[data-orbital-visual]');
  const orbitalScene = document.querySelector('[data-orbital-scene]');

  if (globeCanvas && orbitalVisual && orbitalScene) {
    const context = globeCanvas.getContext('2d', { alpha: true });
    const pointCount = 104;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const points = Array.from({ length: pointCount }, (_, index) => {
      const y = 1 - (index / (pointCount - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * index;
      return {
        x: Math.cos(theta) * radius,
        y,
        z: Math.sin(theta) * radius
      };
    });

    const connections = [];
    for (let a = 0; a < points.length; a += 1) {
      for (let b = a + 1; b < points.length; b += 1) {
        const dx = points[a].x - points[b].x;
        const dy = points[a].y - points[b].y;
        const dz = points[a].z - points[b].z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (distance < 0.34) connections.push([a, b]);
      }
    }

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frame = 0;
    let previousTime = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;

    const resizeGlobe = () => {
      const bounds = globeCanvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      globeCanvas.width = Math.round(width * pixelRatio);
      globeCanvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const rotatePoint = (point, rotationY, rotationX) => {
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
    };

    const drawGlobe = (time = 0) => {
      if (!context || !width || !height) return;

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
          depth: (rotated.z + 1) / 2,
          perspective
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
          context.arc(
            point.x,
            point.y,
            (0.62 + point.depth * 1.15) * pulse,
            0,
            Math.PI * 2
          );
          context.fillStyle = ink;
          context.globalAlpha = 0.12 + point.depth * 0.72;
          context.fill();
        });

      context.globalAlpha = 1;
    };

    const animateGlobe = (time) => {
      if (time - previousTime > 28) {
        drawGlobe(time);
        previousTime = time;
      }
      frame = window.requestAnimationFrame(animateGlobe);
    };

    const updateSceneTilt = (event) => {
      if (event.pointerType === 'touch') return;
      const bounds = orbitalVisual.getBoundingClientRect();
      const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;
      targetPointerX = normalizedX * 0.26;
      targetPointerY = normalizedY * -0.18;
      orbitalScene.style.setProperty('--scene-tilt-x', `${normalizedX * 5}deg`);
      orbitalScene.style.setProperty('--scene-tilt-y', `${normalizedY * -4}deg`);
    };

    const resetSceneTilt = () => {
      targetPointerX = 0;
      targetPointerY = 0;
      orbitalScene.style.setProperty('--scene-tilt-x', '0deg');
      orbitalScene.style.setProperty('--scene-tilt-y', '0deg');
    };

    resizeGlobe();
    new ResizeObserver(() => {
      resizeGlobe();
      if (reduceMotion) drawGlobe(0);
    }).observe(globeCanvas);
    orbitalVisual.addEventListener('pointermove', updateSceneTilt);
    orbitalVisual.addEventListener('pointerleave', resetSceneTilt);

    if (reduceMotion) {
      drawGlobe(0);
      window.addEventListener('portfolio:themechange', () => drawGlobe(0));
    } else {
      frame = window.requestAnimationFrame(animateGlobe);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          window.cancelAnimationFrame(frame);
        } else {
          previousTime = 0;
          frame = window.requestAnimationFrame(animateGlobe);
        }
      });
    }
  }
})();
