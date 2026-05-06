/* ═══════════════════════════════════════════
   AR Portfolio — main.js
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Theme Toggle ─── */
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');

  // Apply saved preference immediately (before first paint)
  const savedTheme = localStorage.getItem('ar-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ar-theme', next);
  });

  /* ─── NAV: scroll class ─── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── NAV: active link highlight ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* Inject active style */
  const style = document.createElement('style');
  style.textContent = `.nav-links a.active { color: var(--clr-green) !important; }`;
  document.head.appendChild(style);

  /* ─── Mobile Nav ─── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const closeMobile = () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Click on the dimmed backdrop (area outside drawer) to close
  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) closeMobile();
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMobile));

  /* ─── Intersection Observer: card animations ─── */
  const observerOpts = { threshold: 0.15 };

  // Expertise cards
  const expertiseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        expertiseObserver.unobserve(entry.target);
      }
    });
  }, observerOpts);

  document.querySelectorAll('.expertise-card').forEach(card => {
    expertiseObserver.observe(card);
  });

  // Generic fade-in for project cards, stack groups, quality cards, edu items
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.fadeDelay || 0;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const fadeTargets = document.querySelectorAll(
    '.project-card, .stack-group, .quality-card, .edu-item, .contact-left, .contact-right'
  );

  fadeTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    el.dataset.fadeDelay = String((i % 4) * 80); // stagger within row
    fadeObserver.observe(el);
  });

  // Quality bar animation
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.quality-bar-fill');
        const width = entry.target.querySelector('.quality-bar').dataset.width;
        if (bar && width) {
          setTimeout(() => { bar.style.width = width + '%'; }, 200);
        }
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.quality-card').forEach(card => barObserver.observe(card));

  /* ─── KPI counter animation ─── */
  const animateCounter = (el, target, duration, suffix) => {
    const start = 0;
    const step = timestamp => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const valueEl = card.querySelector('.kpi-value');
        if (!valueEl) return;

        // Parse value and unit from the text
        const kpiValueText = valueEl.textContent.trim();
        const match = kpiValueText.match(/^(\d+)/);
        if (!match) return;

        const numericVal = parseInt(match[1], 10);
        const unitEl = valueEl.querySelector('.kpi-unit');
        const unitText = unitEl ? unitEl.textContent : '';

        // Temporarily set to just the counter span
        valueEl.innerHTML = `0<span class="kpi-unit">${unitText}</span>`;
        const counterEl = document.createTextNode('0');
        valueEl.insertBefore(counterEl, valueEl.firstChild);
        valueEl.removeChild(valueEl.firstChild.nextSibling);

        // Actually animate
        let startTs = null;
        const step = (ts) => {
          if (!startTs) startTs = ts;
          const progress = Math.min((ts - startTs) / 1400, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * numericVal);
          valueEl.childNodes[0].textContent = current;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);

        kpiObserver.unobserve(card);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.kpi-card').forEach(card => kpiObserver.observe(card));

  /* ─── Smooth scroll for anchors ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── Parallax: hero glows ─── */
  const glowGreen = document.querySelector('.hero-glow--green');
  const glowOrange = document.querySelector('.hero-glow--orange');

  if (glowGreen && glowOrange) {
    window.addEventListener('mousemove', e => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      glowGreen.style.transform = `translate(${x * 30}px, ${y * 20}px)`;
      glowOrange.style.transform = `translate(${-x * 30}px, ${-y * 20}px)`;
    }, { passive: true });
  }

  /* ─── Typing cursor on hero logo ─── */
  const logo = document.querySelector('.nav-logo');
  if (logo) {
    logo.style.cursor = 'default';
  }

  /* ─── Footer year auto-update ─── */
  const copy = document.querySelector('.footer-copy');
  if (copy) {
    copy.textContent = `© ${new Date().getFullYear()} · Built with care. No frameworks harmed.`;
  }

  /* ─── Hero Typewriter (looping) ─── */
  const typewriterLines = [
    { id: 'typed-line-1', text: 'Results-Driven',          typeSpeed: 60, eraseSpeed: 35, delayAfter: 150 },
    { id: 'typed-line-2', text: 'Fullstack Development.',   typeSpeed: 55, eraseSpeed: 30, delayAfter: 150 },
    { id: 'typed-line-3', text: 'From Idea to Production.', typeSpeed: 50, eraseSpeed: 28, delayAfter: 0   },
  ];

  // Inject blinking cursor style
  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `
    .typed-cursor {
      display: inline-block;
      width: 2px;
      height: 0.85em;
      background: currentColor;
      margin-left: 3px;
      vertical-align: middle;
      border-radius: 1px;
      animation: blink-cursor 0.75s step-end infinite;
    }
    @keyframes blink-cursor {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }
  `;
  document.head.appendChild(cursorStyle);

  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  cursor.setAttribute('aria-hidden', 'true');

  // Clear all typed text nodes (leave cursor in place)
  function clearLine(el) {
    Array.from(el.childNodes).forEach(node => {
      if (node !== cursor) node.remove();
    });
  }

  function typeLine(cfg, onDone) {
    const el = document.getElementById(cfg.id);
    if (!el) { onDone(); return; }
    el.appendChild(cursor);
    let i = 0;
    const chars = cfg.text.split('');
    (function typeNext() {
      if (i < chars.length) {
        el.insertBefore(document.createTextNode(chars[i++]), cursor);
        setTimeout(typeNext, cfg.typeSpeed + Math.random() * 18);
      } else {
        setTimeout(onDone, cfg.delayAfter);
      }
    })();
  }

  function eraseLine(cfg, onDone) {
    const el = document.getElementById(cfg.id);
    if (!el) { onDone(); return; }
    el.appendChild(cursor);
    (function eraseNext() {
      // Find the last text node before cursor
      const nodes = Array.from(el.childNodes).filter(n => n !== cursor);
      if (nodes.length === 0) { onDone(); return; }
      const last = nodes[nodes.length - 1];
      if (last.nodeType === Node.TEXT_NODE && last.nodeValue.length > 1) {
        last.nodeValue = last.nodeValue.slice(0, -1);
      } else {
        last.remove();
      }
      setTimeout(eraseNext, cfg.eraseSpeed + Math.random() * 10);
    })();
  }

  function runTypePhase(index, onAllTyped) {
    if (index >= typewriterLines.length) { onAllTyped(); return; }
    typeLine(typewriterLines[index], () => runTypePhase(index + 1, onAllTyped));
  }

  function runErasePhase(index, onAllErased) {
    if (index < 0) { onAllErased(); return; }
    eraseLine(typewriterLines[index], () => runErasePhase(index - 1, onAllErased));
  }

  function loopTypewriter() {
    // 1. Type all lines sequentially
    runTypePhase(0, () => {
      // 2. Pause so reader can enjoy the full text
      setTimeout(() => {
        // 3. Erase all lines in reverse
        runErasePhase(typewriterLines.length - 1, () => {
          // 4. Short breath, then restart
          setTimeout(loopTypewriter, 500);
        });
      }, 1800);
    });
  }

  // Kick off after page settles
  setTimeout(loopTypewriter, 400);

})();
