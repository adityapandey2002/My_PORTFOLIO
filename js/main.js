/* ============================================================
   MAIN JS — Core interactions, cursor, navbar, animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── LOADER ─────────────────────────────────────────────────
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader && loader.classList.add('done');
  }, 1800);

  // ── CUSTOM CURSOR ─────────────────────────────────────────
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (dot) { dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px'; }
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    if (ring) { ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px'; }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .project-card, .exp-card, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot && dot.classList.add('hover');
      ring && ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot && dot.classList.remove('hover');
      ring && ring.classList.remove('hover');
    });
  });

  // ── NAVBAR SCROLL ─────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
    updateActiveLink();
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }

  // ── MOBILE NAV ────────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const navLinksContainer = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  function closeNav() {
    navLinksContainer && navLinksContainer.classList.remove('open');
    navOverlay && navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger && hamburger.addEventListener('click', () => {
    navLinksContainer.classList.toggle('open');
    navOverlay && navOverlay.classList.toggle('open');
    document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
  });

  navOverlay && navOverlay.addEventListener('click', closeNav);

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', closeNav);
  });

  // ── SCROLL REVEAL ─────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // ── SKILL BARS ────────────────────────────────────────────
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.width;
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });
  skillFills.forEach(f => skillObserver.observe(f));

  // ── RADAR CHART ───────────────────────────────────────────
  const radarCanvas = document.getElementById('radarChart');
  if (radarCanvas) {
    const rCtx = radarCanvas.getContext('2d');
    const skills = [
      { label: 'Data Analysis', value: 88 },
      { label: 'Field Ops / ODK', value: 90 },
      { label: 'Python & SQL', value: 82 },
      { label: 'Full-Stack Dev', value: 78 },
      { label: 'AI / ML Tools', value: 72 },
    ];
    const cx = radarCanvas.width / 2;
    const cy = radarCanvas.height / 2;
    const R = Math.min(cx, cy) * 0.72;
    const N = skills.length;
    let progress = 0;
    let started = false;

    function drawRadar(prog) {
      rCtx.clearRect(0, 0, radarCanvas.width, radarCanvas.height);
      const angles = skills.map((_, i) => (Math.PI * 2 * i / N) - Math.PI / 2);

      // Background web
      [0.2, 0.4, 0.6, 0.8, 1.0].forEach(level => {
        rCtx.beginPath();
        angles.forEach((a, i) => {
          const x = cx + Math.cos(a) * R * level;
          const y = cy + Math.sin(a) * R * level;
          i === 0 ? rCtx.moveTo(x, y) : rCtx.lineTo(x, y);
        });
        rCtx.closePath();
        rCtx.strokeStyle = 'rgba(0,212,255,0.08)';
        rCtx.lineWidth = 1;
        rCtx.stroke();
        if (level === 1.0) {
          rCtx.fillStyle = 'rgba(0,212,255,0.02)';
          rCtx.fill();
        }
      });

      // Axis lines
      angles.forEach(a => {
        rCtx.beginPath();
        rCtx.moveTo(cx, cy);
        rCtx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        rCtx.strokeStyle = 'rgba(0,212,255,0.1)';
        rCtx.lineWidth = 1;
        rCtx.stroke();
      });

      // Data polygon (animated)
      rCtx.beginPath();
      angles.forEach((a, i) => {
        const val = (skills[i].value / 100) * prog;
        const x = cx + Math.cos(a) * R * val;
        const y = cy + Math.sin(a) * R * val;
        i === 0 ? rCtx.moveTo(x, y) : rCtx.lineTo(x, y);
      });
      rCtx.closePath();
      const grad = rCtx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      grad.addColorStop(0, 'rgba(0,212,255,0.35)');
      grad.addColorStop(1, 'rgba(124,58,237,0.35)');
      rCtx.fillStyle = grad;
      rCtx.fill();
      rCtx.strokeStyle = '#00d4ff';
      rCtx.lineWidth = 2;
      rCtx.shadowBlur = 8;
      rCtx.shadowColor = '#00d4ff';
      rCtx.stroke();
      rCtx.shadowBlur = 0;

      // Data dots
      angles.forEach((a, i) => {
        const val = (skills[i].value / 100) * prog;
        const x = cx + Math.cos(a) * R * val;
        const y = cy + Math.sin(a) * R * val;
        rCtx.beginPath();
        rCtx.arc(x, y, 4, 0, Math.PI * 2);
        rCtx.fillStyle = '#00d4ff';
        rCtx.shadowBlur = 10;
        rCtx.shadowColor = '#00d4ff';
        rCtx.fill();
        rCtx.shadowBlur = 0;
      });

      // Labels
      rCtx.font = '500 11px Inter, sans-serif';
      rCtx.fillStyle = '#7a8fa6';
      rCtx.textAlign = 'center';
      rCtx.textBaseline = 'middle';
      angles.forEach((a, i) => {
        const offset = 20;
        const x = cx + Math.cos(a) * (R + offset);
        const y = cy + Math.sin(a) * (R + offset);
        rCtx.fillText(skills[i].label, x, y);
      });
    }

    function animateRadar() {
      if (progress < 1) {
        progress += 0.025;
        drawRadar(progress);
        requestAnimationFrame(animateRadar);
      } else {
        drawRadar(1);
      }
    }

    const radarObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        animateRadar();
        radarObserver.disconnect();
      }
    }, { threshold: 0.3 });
    radarObserver.observe(radarCanvas);
  }

  // ── CARD TILT ─────────────────────────────────────────────
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', `${-y * 8}deg`);
      card.style.setProperty('--tilt-y', `${x * 8}deg`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });

  // ── CONTACT PARTICLE BURST ────────────────────────────────
  const nameInput = document.getElementById('contact-name');
  if (nameInput) {
    nameInput.addEventListener('focus', () => {
      nameInput.style.borderColor = 'var(--accent-cyan)';
    });
  }

  // ── INIT PARTICLES ────────────────────────────────────────
  if (typeof ParticleNetwork !== 'undefined') ParticleNetwork.init();

  // ── SMOOTH SCROLL ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── HERO ANIMATIONS ───────────────────────────────────────
  const heroEls = [
    { el: '.hero-greeting', delay: 200 },
    { el: '.hero-name', delay: 400 },
    { el: '.hero-roles', delay: 600 },
    { el: '.hero-typewriter', delay: 800 },
    { el: '.hero-mission', delay: 1000 },
    { el: '.hero-ctas', delay: 1200 },
    { el: '.hero-socials', delay: 1400 },
    { el: '.hero-scroll-hint', delay: 1800 },
  ];

  heroEls.forEach(({ el, delay }) => {
    const node = document.querySelector(el);
    if (node) {
      setTimeout(() => {
        node.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
        node.style.opacity = '1';
        node.style.transform = 'translateY(0)';
      }, delay);
    }
  });

  // ── TYPED.JS ROLES ────────────────────────────────────────
  if (window.Typed) {
    new Typed('#typed-roles', {
      strings: [
        'Data Analyst',
        'Field Data Systems Expert',
        'Full-Stack Developer',
        'AI Practitioner',
        'Public Health Data Professional',
      ],
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      cursorChar: '_',
    });
  }

  // ── COUNTUP ON SCROLL ─────────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 2000;
        let startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
          const current = Math.floor(eased * target);
          el.textContent = prefix + current.toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = prefix + target.toLocaleString() + suffix;
        }

        requestAnimationFrame(step);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => countObserver.observe(c));
});
