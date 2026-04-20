/* ===================================================
   김성규 개그맨 — main.js
   =================================================== */

// ── Nav scroll effect ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile menu ──
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  const spans = menuBtn.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    menuBtn.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity = '';
    });
  });
});

// ── Intersection Observer — reveal animations ──
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('active');
      }, i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));


// ── Profile Image Slider ──
const profileImages = document.querySelectorAll('.profile-slider .profile-img');
if (profileImages.length > 1) {
  let currentIndex = 0;
  setInterval(() => {
    profileImages[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % profileImages.length;
    profileImages[currentIndex].classList.add('active');
  }, 4000);
}

// ── Hero parallax ──
const heroContent = document.querySelector('.hero-content');
const heroBg = document.querySelector('.hero-bg');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight) {
    if (heroContent) {
      heroContent.style.transform = `translateY(${y * 0.25}px)`;
      heroContent.style.opacity = 1 - y / (window.innerHeight * 0.7);
    }
    if (heroBg) {
      heroBg.style.transform = `translateY(${y * 0.1}px)`;
    }
  }
}, { passive: true });

// ── Smooth cursor highlight on cards ──
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0,0,0,0.03), rgba(0,0,0,0.01) 50%, transparent)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

// ── Stats counter animation ──
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const text = num.textContent;
        const match = text.match(/\d+/);
        if (!match) return;
        const target = parseInt(match[0]);
        const sup = num.querySelector('sup');
        const supText = sup ? sup.textContent : '';
        let current = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          num.textContent = current;
          if (supText) {
            const newSup = document.createElement('sup');
            newSup.textContent = supText;
            num.appendChild(newSup);
          }
          if (current >= target) clearInterval(timer);
        }, 30);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.about-stats');
if (statsEl) statsObserver.observe(statsEl);

// ── Stats counter animation ──
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1800;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-num').forEach(el => counterObserver.observe(el));
