 
(() => {
  'use strict';
 
  /* ------------------------------------------------------------------------
     01. HELPERS & PREFERENCES
     ------------------------------------------------------------------------ */
  const $  = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
 
  // Respect the user's OS-level "reduce motion" setting (WCAG 2.3.3)
  const motionQuery   = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReduced = () => motionQuery.matches;
 
  // True only for devices with a mouse/trackpad that can hover
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
 
 
  /* ------------------------------------------------------------------------
     02. FOOTER YEAR
     ------------------------------------------------------------------------ */
  const yearEl = $('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
 
 
  /* ------------------------------------------------------------------------
     03. SCROLL-DRIVEN UI
     One throttled scroll handler (via requestAnimationFrame) updates:
       - the progress bar width
       - header "scrolled" border and hide-on-scroll-down behaviour
       - a --scroll custom property used for the hero's slight upward drift
     ------------------------------------------------------------------------ */
  const header      = $('[data-header]');
  const progressBar = $('.progress');
  const root        = document.documentElement;
 
  let lastY = window.scrollY;
  let ticking = false;
 
  function onScrollFrame() {
    const y = window.scrollY;
    const maxScroll = root.scrollHeight - window.innerHeight;
 
    // Progress bar (0 → 1)
    if (progressBar && maxScroll > 0) {
      progressBar.style.setProperty('--progress', (y / maxScroll).toFixed(4));
    }
 
    // Hero drift only matters while the hero is on screen
    if (y < window.innerHeight * 1.2) {
      root.style.setProperty('--scroll', y);
    }
 
    if (header) {
      header.classList.toggle('is-scrolled', y > 8);
 
      const menuOpen = header.querySelector('[data-nav-toggle]')?.getAttribute('aria-expanded') === 'true';
      const scrollingDown = y > lastY && y > header.offsetHeight * 2;
 
      // Never hide the header while the menu is open or something inside it has focus
      const hasFocus = header.contains(document.activeElement) && document.activeElement !== document.body;
      header.classList.toggle('is-hidden', scrollingDown && !menuOpen && !hasFocus && !prefersReduced());
    }
 
    lastY = y;
    ticking = false;
  }
 
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScrollFrame);
    }
  }, { passive: true });
 
  // Bring the header back when keyboard users tab into it
  if (header) header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
 
  onScrollFrame();
 
 
  /* ------------------------------------------------------------------------
     04. MOBILE NAVIGATION
     - Button toggles aria-expanded and the .is-open class on the nav
     - Esc closes the menu and returns focus to the button
     - Tab is trapped inside the open overlay (button + links)
     - Selecting a link closes the menu
     ------------------------------------------------------------------------ */
  const nav       = $('[data-nav]');
  const navToggle = $('[data-nav-toggle]');
  const mobileMQ  = window.matchMedia('(max-width: 48em)');
 
  function setMenu(open) {
    if (!nav || !navToggle) return;
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.querySelector('.nav-toggle__label').textContent = open ? 'Close' : 'Menu';
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';   // stop the page scrolling behind the menu
  }
 
  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
    });
 
    // Close after choosing a link
    $$('a', nav).forEach(link => link.addEventListener('click', () => setMenu(false)));
 
    document.addEventListener('keydown', (event) => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (!isOpen) return;
 
      if (event.key === 'Escape') {
        setMenu(false);
        navToggle.focus();
        return;
      }
 
      // Simple focus trap: cycle between the brand, toggle and nav links
      if (event.key === 'Tab') {
        const focusable = [$('.brand'), navToggle, ...$$('a', nav)].filter(Boolean);
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
 
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
 
    // If the window grows past the mobile breakpoint, reset the menu state
    mobileMQ.addEventListener('change', (e) => { if (!e.matches) setMenu(false); });
  }
 
 
  /* ------------------------------------------------------------------------
     05. ACTIVE SECTION HIGHLIGHTING
     IntersectionObserver marks the nav link of the section in view with
     aria-current="location" (announced by screen readers, styled in CSS).
     ------------------------------------------------------------------------ */
  const navLinks = $$('.site-nav a[href^="#"]');
  const sections = navLinks
    .map(link => $(link.getAttribute('href')))
    .filter(Boolean);
 
  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const match = link.getAttribute('href') === `#${entry.target.id}`;
          if (match) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, {
      // A section counts as "current" when it crosses the middle band of the viewport
      rootMargin: '-45% 0px -50% 0px'
    });
 
    sections.forEach(section => sectionObserver.observe(section));
  }
 
 
  /* ------------------------------------------------------------------------
     06. SCROLL REVEAL
     Elements with .reveal fade/slide into place the first time they appear.
     Siblings get a small stagger so lists feel sequenced, not simultaneous.
     ------------------------------------------------------------------------ */
  const revealItems = $$('.reveal');
 
  if ('IntersectionObserver' in window && !prefersReduced()) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);          // animate once only
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
 
    revealItems.forEach(item => {
      // Stagger by position among siblings that share the same parent (max 4 steps)
      const index = Array.from(item.parentElement.children).indexOf(item);
      item.style.setProperty('--delay', `${Math.min(index, 4) * 90}ms`);
      revealObserver.observe(item);
    });
  } else {
    // No observer support or reduced motion: show everything immediately
    revealItems.forEach(item => item.classList.add('is-visible'));
  }
 
 
  /* ------------------------------------------------------------------------
     07. HERO TITLE
     a) Split each line into letters (.char) for the staggered load-in.
        The real text stays in a visually-hidden span so assistive tech reads
        "Niko Jhon Ruizo" instead of individual letters.
     b) On devices with a pointer, letters gain weight as the cursor nears
        them by updating the --wght custom property (variable font axis).
     ------------------------------------------------------------------------ */
  const heroTitle = $('[data-hero-title]');
 
  if (heroTitle) {
    let charIndex = 0;
 
    $$('[data-split]', heroTitle).forEach(line => {
      const text = line.textContent.trim();
      line.textContent = '';
 
      // Screen-reader copy (trailing space keeps the two lines from running together)
      const sr = document.createElement('span');
      sr.className = 'visually-hidden';
      sr.textContent = `${text} `;
 
      // Visual copy, hidden from assistive tech
      const visual = document.createElement('span');
      visual.setAttribute('aria-hidden', 'true');
 
      Array.from(text).forEach(letter => {
        const span = document.createElement('span');
        span.className = 'char';
        span.style.setProperty('--i', charIndex++);
        span.textContent = letter;
        visual.appendChild(span);
      });
 
      line.append(sr, visual);
    });
 
    const chars = $$('.char', heroTitle);
    const hero  = $('#hero');
 
    if (canHover && !prefersReduced() && hero) {
      const MIN_WEIGHT = 320;
      const MAX_WEIGHT = 800;
      const RADIUS     = 220;     // px: how far the cursor's influence reaches
 
      let pointer = null;
      let frame   = null;
 
      const paint = () => {
        frame = null;
        chars.forEach(char => {
          if (!pointer) { char.style.removeProperty('--wght'); return; }
 
          const box = char.getBoundingClientRect();
          const dx  = pointer.x - (box.left + box.width / 2);
          const dy  = pointer.y - (box.top + box.height / 2);
          const closeness = Math.max(0, 1 - Math.hypot(dx, dy) / RADIUS);
 
          // Ease the falloff so the swell feels smooth
          const weight = MIN_WEIGHT + (MAX_WEIGHT - MIN_WEIGHT) * closeness * closeness;
          char.style.setProperty('--wght', Math.round(weight));
        });
      };
 
      const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
 
      hero.addEventListener('pointermove', (e) => { pointer = { x: e.clientX, y: e.clientY }; schedule(); });
      hero.addEventListener('pointerleave', () => { pointer = null; schedule(); });
    }
  }
 
 
  /* ------------------------------------------------------------------------
     08. PROJECT LIST PREVIEW
     A card follows the cursor (with easing) while a project row is hovered,
     and appears beside the row when it receives keyboard focus.
     Other rows dim so the active one stands out.
     ------------------------------------------------------------------------ */
  const projectList = $('[data-project-list]');
  const preview     = $('[data-project-preview]');
 
  if (projectList && preview && canHover) {
    const label    = $('[data-preview-label]', preview);
    const projects = $$('.project', projectList);
 
    // Current (cx, cy) eases toward target (tx, ty) each frame
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let frame = null;
 
    const size = () => ({ w: preview.offsetWidth, h: preview.offsetHeight });
 
    function loop() {
      const ease = prefersReduced() ? 1 : 0.16;
      cx += (tx - cx) * ease;
      cy += (ty - cy) * ease;
      preview.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) rotate(${((tx - cx) * 0.02).toFixed(2)}deg)`;
 
      if (Math.abs(tx - cx) > 0.2 || Math.abs(ty - cy) > 0.2) {
        frame = requestAnimationFrame(loop);
      } else {
        frame = null;
      }
    }
 
    function moveTo(x, y, snap = false) {
      const { w, h } = size();
      const margin = 16;
      const offset = 28;
 
      // Sit to the right of the cursor, flip to the left near the screen edge
      let nx = x + offset;
      if (nx + w > window.innerWidth - margin) nx = x - w - offset;
 
      // Keep vertically inside the viewport
      let ny = y - h / 2;
      ny = Math.max(margin, Math.min(ny, window.innerHeight - h - margin));
 
      tx = nx; ty = ny;
      if (snap) { cx = tx; cy = ty; }
      if (!frame) frame = requestAnimationFrame(loop);
    }
 
    function activate(link, x, y, snap) {
      preview.style.setProperty('--a', link.dataset.colorA || '#f0b95a');
      preview.style.setProperty('--b', link.dataset.colorB || '#d9663f');
      label.textContent = link.dataset.preview || '';
 
      preview.classList.add('is-active');
      projectList.classList.add('has-active');
      projects.forEach(p => p.classList.toggle('is-current', p === link));
 
      moveTo(x, y, snap);
    }
 
    function deactivate() {
      preview.classList.remove('is-active');
      projectList.classList.remove('has-active');
      projects.forEach(p => p.classList.remove('is-current'));
    }
 
    projects.forEach(link => {
      // Mouse
      link.addEventListener('pointerenter', (e) => activate(link, e.clientX, e.clientY, !preview.classList.contains('is-active')));
      link.addEventListener('pointermove',  (e) => moveTo(e.clientX, e.clientY));
      link.addEventListener('pointerleave', deactivate);
 
      // Keyboard: same effect on focus, anchored to the row's right edge
      link.addEventListener('focus', () => {
        const box = link.getBoundingClientRect();
        activate(link, box.right - preview.offsetWidth - 56, box.top + box.height / 2, true);
      });
      link.addEventListener('blur', deactivate);
    });
 
    // Hide the preview if the page scrolls out from under a stationary cursor
    window.addEventListener('scroll', () => {
      if (!projectList.matches(':hover') && !projectList.contains(document.activeElement)) deactivate();
    }, { passive: true });
  }
 
 
  /* ------------------------------------------------------------------------
     09. CONTACT FORM
     Client-side validation with accessible errors:
       - message text next to the field (not colour alone)
       - aria-invalid + aria-describedby tie the message to the input
       - focus moves to the first invalid field
       - a polite live region announces the result
     On success it opens the visitor's email app with the message pre-filled.
     EDIT: to send without an email app, point the form at a service such as
     Formspree/Netlify Forms and replace the mailto section below with fetch().
     ------------------------------------------------------------------------ */
  const form = $('[data-contact-form]');
 
  if (form) {
    const status = $('[data-form-status]', form);
    const TO = 'nja.ruizo@unp.edu.ph';      // EDIT: must match the address in index.html
 
    const messages = {
      name:    { valueMissing: 'Enter your name so I know who to reply to.' },
      email:   { valueMissing: 'Enter your email address.', typeMismatch: 'Enter an email address like name@example.com.' },
      message: { valueMissing: 'Write a short message before sending.' }
    };
 
    function showError(field, text) {
      const error = document.getElementById(`${field.id}-error`);
      field.setAttribute('aria-invalid', 'true');
      error.textContent = text;
      error.hidden = false;
    }
 
    function clearError(field) {
      const error = document.getElementById(`${field.id}-error`);
      field.removeAttribute('aria-invalid');
      error.textContent = '';
      error.hidden = true;
    }
 
    function validate(field) {
      clearError(field);
      if (field.validity.valid) return true;
 
      const rules = messages[field.name] || {};
      const key = Object.keys(rules).find(k => field.validity[k]);
      showError(field, rules[key] || field.validationMessage);
      return false;
    }
 
    const fields = $$('input, textarea', form);
 
    // Re-check a field as soon as the user fixes it
    fields.forEach(field => {
      field.addEventListener('blur', () => { if (field.value) validate(field); });
      field.addEventListener('input', () => { if (field.hasAttribute('aria-invalid')) validate(field); });
    });
 
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      status.textContent = '';
 
      const invalid = fields.filter(field => !validate(field));
 
      if (invalid.length) {
        invalid[0].focus();
        status.textContent = `Please fix ${invalid.length} ${invalid.length === 1 ? 'field' : 'fields'} and try again.`;
        return;
      }
 
      const data    = new FormData(form);
      const subject = `Portfolio enquiry from ${data.get('name')}`;
      const body    = `${data.get('message')}\n\n${data.get('name')}\n${data.get('email')}`;
 
      status.textContent = 'Opening your email app with the message ready to send.';
      window.location.href = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      form.reset();
    });
  }
})();
 