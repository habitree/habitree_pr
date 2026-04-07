// ===== Habitree v3 — Clean & Performant =====
(function () {
  'use strict';

  const isReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Scroll Progress ───
  const bar = document.getElementById('scrollProgress');
  function updateProgress() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (h > 0) bar.style.width = (window.scrollY / h) * 100 + '%';
  }

  // ─── Reveal Observer ───
  const obs = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
  );
  document.querySelectorAll('.reveal, .stagger').forEach((el) => obs.observe(el));

  // ─── Navigation ───
  const nav = document.getElementById('fixedNav');
  const darkSections = document.querySelectorAll('.hero, .problem-section, .behind-section, .site-footer');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.fixed-nav a[href^="#"]');

  function handleNav() {
    nav.classList.toggle('show', window.scrollY > 300);
    let inDark = false;
    darkSections.forEach((s) => {
      const r = s.getBoundingClientRect();
      if (r.top < 80 && r.bottom > 80) inDark = true;
    });
    nav.classList.toggle('light-mode', !inDark);
  }

  function updateActive() {
    const y = window.scrollY + 200;
    sections.forEach((s) => {
      if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
        navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + s.id));
      }
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ─── Split Text (Hero headline) ───
  function splitText(el) {
    if (isReduced) return;
    const lines = el.querySelectorAll('.line');
    let idx = 0;
    lines.forEach((line) => {
      const nodes = [...line.childNodes];
      line.innerHTML = '';
      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          [...node.textContent].forEach((ch) => {
            const s = document.createElement('span');
            s.style.cssText = `display:inline-block;opacity:0;transform:translateY(24px);transition:opacity 0.5s var(--ease),transform 0.5s var(--ease);transition-delay:${idx * 0.035}s`;
            s.textContent = ch === ' ' ? '\u00A0' : ch;
            line.appendChild(s);
            idx++;
          });
        } else {
          const wrap = node.cloneNode(false);
          [...node.textContent].forEach((ch) => {
            const s = document.createElement('span');
            s.style.cssText = `display:inline-block;opacity:0;transform:translateY(24px);transition:opacity 0.5s var(--ease),transform 0.5s var(--ease);transition-delay:${idx * 0.035}s`;
            s.textContent = ch === ' ' ? '\u00A0' : ch;
            wrap.appendChild(s);
            idx++;
          });
          line.appendChild(wrap);
        }
      });
    });
    setTimeout(() => {
      el.querySelectorAll('span[style]').forEach((s) => {
        s.style.opacity = '1';
        s.style.transform = 'translateY(0)';
      });
    }, 200);
  }

  const splitEl = document.querySelector('[data-split-text]');
  if (splitEl) splitText(splitEl);

  // ─── Counter Animation ───
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / 1200, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const cObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-target]').forEach(animateCounter);
        cObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stats-grid').forEach((el) => cObs.observe(el));

  // ─── Scroll-Reveal Text (Answer blockquote) ───
  (function () {
    const el = document.querySelector('[data-scroll-reveal]');
    if (!el || isReduced) return;
    const html = el.innerHTML;
    let wi = 0;
    el.innerHTML = html.split(/(<[^>]+>)/).map((p) => {
      if (p.startsWith('<')) return p;
      return p.split(/(\s+)/).map((w) => /^\s+$/.test(w) ? w : `<span class="sw" style="transition:opacity 0.3s">${w}</span>`).join('');
    }).join('');
    const words = el.querySelectorAll('.sw');
    const total = words.length;
    function onScroll() {
      const r = el.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
      const reveal = Math.floor(progress * total * 1.8);
      words.forEach((w, i) => { w.style.opacity = i < reveal ? '1' : '0.1'; });
    }
    window.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
    onScroll();
  })();

  // ─── Unified Scroll ───
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        handleNav();
        updateActive();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateProgress();
  handleNav();
})();
