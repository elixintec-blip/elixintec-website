/* ============================================================
   ELIXINTEC - Main JavaScript
   ============================================================ */

const CONTACT_PHONE = '+212661090654';
const WHATSAPP_NUMBER  = '212665311687';
const CONTACT_EMAIL    = 'contact@elixintec.com';

function openWhatsApp(message) {
  const msg = message || 'Bonjour ELIXINTEC, je souhaite une consultation gratuite.';
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

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
