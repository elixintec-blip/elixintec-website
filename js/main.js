/* ============================================================
   ELIXINTEC - Main JavaScript
   ============================================================ */

let CONTACT_PHONE  = '+212661090654';
let WHATSAPP_NUMBER = '212665311687';
let CONTACT_EMAIL   = 'contact@elixintec.com';

function openWhatsApp(message) {
  const msg = message || 'Bonjour ELIXINTEC, je souhaite une consultation gratuite.';
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ── Settings loader ───────────────────────────────────────────
(function loadSettings() {
  const depth = window.location.pathname.split('/').filter(Boolean).length - 1;
  const base  = depth > 0 ? '../'.repeat(depth) : '';
  fetch(base + '_data/settings.json')
    .then(r => r.json())
    .then(s => {
      if (s.phone)    CONTACT_PHONE  = s.phone.replace(/\s/g, '');
      if (s.whatsapp) WHATSAPP_NUMBER = s.whatsapp.replace(/[^0-9]/g, '');

      // Update all tel: links
      if (s.phone) {
        document.querySelectorAll('a[href^="tel:"]').forEach(a => {
          a.href = 'tel:' + CONTACT_PHONE;
          if (a.textContent.trim().startsWith('+')) a.textContent = s.phone;
        });
      }

      // Update all wa.me links
      if (s.whatsapp) {
        document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => {
          a.href = 'https://wa.me/' + WHATSAPP_NUMBER;
          if (a.textContent.trim().startsWith('+')) a.textContent = s.whatsapp;
        });
      }

      // Update [data-setting] elements
      document.querySelectorAll('[data-setting]').forEach(el => {
        const key = el.dataset.setting;
        if (!s[key]) return;
        if (el.tagName === 'A' && el.href.includes('mailto:')) {
          el.href = 'mailto:' + s[key];
          el.textContent = s[key];
        } else if (el.dataset.settingType === 'stat') {
          const m = String(s[key]).match(/^(\d+)(.*)/);
          if (m) {
            el.dataset.target  = m[1];
            el.dataset.suffix  = m[2];
            el.textContent     = '0' + m[2];
          }
        } else {
          el.textContent = s[key];
        }
      });
    })
    .catch(() => {});
})();

// ── Navbar scroll effect ──────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
  // Trigger on load
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}

// ── Mobile nav toggle ─────────────────────────────────────────
const toggle = document.getElementById('navToggle');
const menu   = document.getElementById('navMenu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('open');
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      toggle.classList.remove('active');
      menu.classList.remove('open');
    }
  });
}

// ── Mobile dropdown toggle ────────────────────────────────────
document.querySelectorAll('.nav-item.has-dropdown > .nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      link.closest('.nav-item').classList.toggle('open');
    }
  });
});

// ── Scroll reveal animation ───────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Counter animation ─────────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + (el.getAttribute('data-suffix') || '');
  }, 16);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── Hero particles ────────────────────────────────────────────
const particlesContainer = document.getElementById('heroParticles');
if (particlesContainer) {
  for (let i = 0; i < 30; i++) {
    const span = document.createElement('span');
    span.style.cssText = `
      left: ${Math.random() * 100}%;
      animation-duration: ${4 + Math.random() * 8}s;
      animation-delay: ${Math.random() * 6}s;
      width: ${1 + Math.random() * 3}px;
      height: ${1 + Math.random() * 3}px;
      opacity: ${0.3 + Math.random() * 0.7};
    `;
    particlesContainer.appendChild(span);
  }
}

// ── Contact form ──────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = contactForm.querySelector('[name="name"]').value;
    const service = contactForm.querySelector('[name="service"]').value;
    const phone   = contactForm.querySelector('[name="phone"]').value;
    const message = contactForm.querySelector('[name="message"]').value;

    const waMsg = `Bonjour ELIXINTEC,\n\nJe m'appelle *${name}*.\nService souhaité : *${service}*\nTél : *${phone}*\n\nMessage :\n${message}\n\nMerci de me recontacter.`;
    openWhatsApp(waMsg);
  });
}

// ── WhatsApp CTA buttons ──────────────────────────────────────
document.querySelectorAll('[data-whatsapp]').forEach(btn => {
  btn.addEventListener('click', () => openWhatsApp(btn.getAttribute('data-whatsapp') || undefined));
});

// ── Active nav link ───────────────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href && (href === currentPage || href.includes(currentPage))) {
    link.classList.add('active');
  }
});

// ── Smooth scroll for anchor links ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Service page dynamic loader ───────────────────────────
(function loadServicePage() {
  const path  = window.location.pathname;
  const match = path.match(/services\/([^/]+)\.html/);
  if (!match) return;
  const slug = match[1];

  fetch('../_data/services.json')
    .then(r => r.json())
    .then(data => {
      const svc = (data.services || []).find(s => s.slug === slug);
      if (!svc) return;

      // Hero image
      if (svc.hero_image) {
        const hero = document.querySelector('.page-hero');
        if (hero) {
          hero.style.backgroundImage =
            `linear-gradient(rgba(13,27,53,0.72),rgba(13,27,53,0.72)), url('${svc.hero_image}')`;
          hero.style.backgroundSize = 'cover';
          hero.style.backgroundPosition = 'center';
        }
      }

      // Intro title
      if (svc.intro_title) {
        const h2 = document.querySelector('.section h2');
        if (h2) h2.textContent = svc.intro_title;
      }

      // Intro text — first non-hero paragraph in first section
      if (svc.intro_text) {
        const firstSection = document.querySelector('.section .reveal > p');
        if (firstSection) firstSection.textContent = svc.intro_text;
      }

      // Features list
      if (svc.features && svc.features.length) {
        const list = document.querySelector('.feature-list');
        if (list) {
          list.innerHTML = svc.features
            .map(f => `<li><span class="feature-icon">✅</span><span>${f}</span></li>`)
            .join('');
        }
      }
    })
    .catch(() => {});
})();

// ── Réalisations filter ───────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline-dark');
      });
      btn.classList.remove('btn-outline-dark');
      btn.classList.add('btn-primary');

      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.project-card').forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = '';
          setTimeout(() => card.classList.add('visible'), 10);
        } else {
          card.style.display = 'none';
          card.classList.remove('visible');
        }
      });
    });
  });
}
