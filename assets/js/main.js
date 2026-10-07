(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    window.matchMedia('(min-width: 1181px)').addEventListener('change', closeMenu);
  }

  // Reserve each complete line so typing never shifts the surrounding content.
  const heroTitle = document.querySelector('.hero h1');
  const typedLines = [...document.querySelectorAll('[data-typewriter]')].map(line => ({
    output: line.querySelector('.typewriter-output'),
    text: line.querySelector('.typewriter-reserve').textContent
  }));
  let typingTimer;
  const finishTyping = () => {
    window.clearTimeout(typingTimer);
    typedLines.forEach(({output, text}) => {
      output.textContent = text;
      output.classList.remove('is-typing');
    });
  };
  const typeHero = () => {
    finishTyping();
    if (reducedMotion.matches) return;
    typedLines.forEach(({output}) => { output.textContent = ''; });
    let lineIndex = 0;
    let characterIndex = 0;
    const tick = () => {
      const {output, text} = typedLines[lineIndex];
      output.classList.add('is-typing');
      output.textContent = text.slice(0, ++characterIndex);
      if (characterIndex < text.length) {
        typingTimer = window.setTimeout(tick, lineIndex === 0 ? 45 : 75);
      } else {
        output.classList.remove('is-typing');
        lineIndex += 1;
        characterIndex = 0;
        if (lineIndex < typedLines.length) typingTimer = window.setTimeout(tick, 120);
      }
    };
    tick();
  };
  if (heroTitle && typedLines.length) {
    let titleVisible = false;
    const typingObserver = new IntersectionObserver(entries => {
      const visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .35;
      if (visible && !titleVisible) typeHero();
      if (!visible) finishTyping();
      titleVisible = visible;
    }, {threshold: [0, .35], rootMargin: '-74px 0px 0px 0px'});
    typingObserver.observe(heroTitle);
    reducedMotion.addEventListener('change', finishTyping);
  }

  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold: .12});
  reveals.forEach(el => revealObserver.observe(el));

  const sections = [...document.querySelectorAll('.section-anchor')];
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const railButtons = [...document.querySelectorAll('.section-rail button')];
  const header = document.querySelector('.site-header');
  let activeSectionId;
  const updateActive = (id) => {
    if (activeSectionId === id) return;
    activeSectionId = id;
    [...navLinks, ...railButtons].forEach(element => {
      const active = element.dataset.section === id || element.getAttribute('href') === `#${id}`;
      element.classList.toggle('active', active);
      if (active) element.setAttribute('aria-current', 'location');
      else element.removeAttribute('aria-current');
    });
  };
  // Track the section just below the header using all current section positions.
  // Observer callbacks only contain changed intersections, not every visible section.
  const syncActiveSection = () => {
    if (!sections.length) return;
    const activationLine = (header?.getBoundingClientRect().bottom || 0) + 24;
    let activeSection = sections[0];
    if (window.scrollY > 1) {
      for (const section of sections) {
        if (section.getBoundingClientRect().top > activationLine) break;
        activeSection = section;
      }
    }
    updateActive(activeSection.id);
  };
  let scrollFrame = 0;
  const queueActiveUpdate = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      syncActiveSection();
    });
  };
  window.addEventListener('scroll', queueActiveUpdate, {passive: true});
  window.addEventListener('resize', queueActiveUpdate);
  window.addEventListener('hashchange', queueActiveUpdate);
  window.addEventListener('pageshow', queueActiveUpdate);
  window.addEventListener('load', queueActiveUpdate, {once: true});
  document.fonts?.ready.then(queueActiveUpdate);
  if (typeof ResizeObserver !== 'undefined') {
    const layoutObserver = new ResizeObserver(queueActiveUpdate);
    sections.forEach(section => layoutObserver.observe(section));
    if (header) layoutObserver.observe(header);
  }
  syncActiveSection();
  railButtons.forEach(button => button.addEventListener('click', () => {
    document.getElementById(button.dataset.section)?.scrollIntoView({
      behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start'
    });
    queueActiveUpdate();
  }));

  // Move only the card's light; its content and artwork stay in place.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (finePointer.matches) {
    const surfaces = document.querySelectorAll('.project-body, .writing-card, .tech-card, .principles-grid article');
    let hoverFrame = 0;
    let hoverPoint;
    surfaces.forEach(surface => surface.addEventListener('pointermove', event => {
      if (reducedMotion.matches || !finePointer.matches) return;
      hoverPoint = {surface, x: event.clientX, y: event.clientY};
      if (hoverFrame) return;
      hoverFrame = window.requestAnimationFrame(() => {
        hoverFrame = 0;
        if (reducedMotion.matches || !finePointer.matches) return;
        const {surface: target, x, y} = hoverPoint;
        const bounds = target.getBoundingClientRect();
        target.style.setProperty('--hover-x', `${x - bounds.left}px`);
        target.style.setProperty('--hover-y', `${y - bounds.top}px`);
      });
    }, {passive: true}));
  }

  const glow = document.querySelector('.cursor-glow');
  if (glow && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }, {passive:true});
  } else if (glow) glow.style.display = 'none';

  document.getElementById('year').textContent = new Date().getFullYear();
})();
