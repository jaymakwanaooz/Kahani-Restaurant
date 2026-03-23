/**
 * Kahani Restaurant - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initSmoothLinks();
});

// ============================================
// Page Loader
// ============================================
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) {
    document.body.classList.remove('loading');
    return;
  }

  // Minimum wait time to show the Kahani intro
  const minWait = 1200;
  const startTime = Date.now();

  const finishLoading = () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minWait - elapsed);

    setTimeout(() => {
      loader.classList.add('loaded');
      setTimeout(() => {
        document.body.classList.remove('loading');
        loader.style.display = 'none';
      }, 800); // Wait for CSS transition
    }, remaining);
  };

  // Wait for images to load if on homepage
  const images = document.querySelectorAll('img');
  if (images.length === 0) {
    finishLoading();
    return;
  }

  let loadedCount = 0;
  images.forEach(img => {
    if (img.complete) {
      loadedCount++;
      if (loadedCount === images.length) finishLoading();
    } else {
      img.addEventListener('load', () => {
        loadedCount++;
        if (loadedCount === images.length) finishLoading();
      });
      img.addEventListener('error', () => {
        loadedCount++; // Ignore errors to prevent infinite loading
        if (loadedCount === images.length) finishLoading();
      });
    }
  });

  // Fallback if images take way too long
  setTimeout(finishLoading, 4000);
}

// ============================================
// Navbar Scroll Effect
// ============================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Call once to set initial state
  handleScroll();
}

// ============================================
// Mobile Menu
// ============================================
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  
  if (!btn || !menu) return;

  let isOpen = false;

  const toggleMenu = () => {
    isOpen = !isOpen;
    if (isOpen) {
      menu.classList.add('open');
      btn.querySelector('span').textContent = 'close';
    } else {
      menu.classList.remove('open');
      btn.querySelector('span').textContent = 'menu';
    }
  };

  btn.addEventListener('click', toggleMenu);

  // Close when clicking a link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (isOpen) toggleMenu();
    });
  });
}

// ============================================
// Scroll Reveal Animations
// ============================================
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ============================================
// Internal Links Smooth Transition
// ============================================
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}
