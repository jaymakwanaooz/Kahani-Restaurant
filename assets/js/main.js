/**
 * Kahani Restaurant - Main JavaScript
 * Interactive features and animations
 */

// ============================================
// DOM Ready
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initNavigation();
  initScrollReveal();
  initParallax();
  initSmoothScroll();
  initMobileMenu();
  initFormValidation();
  initImageLazyLoading();
  initMenuAnimations();
  initCustomCursor();
  initBackToTop();
  initHeroAnimations();
});

// ============================================
// Page Loader Animation (Homepage Only)
// ============================================

function initPageLoader() {
  // Only run loader on homepage
  const isHomepage = window.location.pathname.includes('index.html') || 
                     window.location.pathname.endsWith('/website/') ||
                     window.location.pathname === '/' ||
                     document.title.includes('Home');
  
  if (!isHomepage) {
    // On subpages, trigger fade-up entrance animation
    // subpage class is already on body in HTML to prevent flash
    
    // Add loaded class to nav immediately
    const nav = document.querySelector('nav');
    if (nav) {
      nav.classList.add('loaded');
    }
    
    // Trigger subpage animation on next frame for smooth entrance
    requestAnimationFrame(() => {
      document.body.classList.add('subpage-ready');
    });
    
    return;
  }
  
  // Add loading class to body
  document.body.classList.add('loading');
  
  // Create loader element if it doesn't exist
  if (!document.querySelector('.page-loader')) {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div class="loader-logo">
        <span class="text-4xl font-headline italic text-primary tracking-widest">Kahani</span>
      </div>
    `;
    document.body.appendChild(loader);
  }
  
  // Wait for all images to load
  const images = document.querySelectorAll('img');
  let loadedImages = 0;
  const totalImages = images.length;
  
  function checkAllLoaded() {
    loadedImages++;
    if (loadedImages >= totalImages || totalImages === 0) {
      // Small delay for visual effect
      setTimeout(() => {
        finishLoading();
      }, 400);
    }
  }
  
  function finishLoading() {
    const loader = document.querySelector('.page-loader');
    const nav = document.querySelector('nav');
    
    if (loader) {
      loader.classList.add('loaded');
    }
    
    if (nav) {
      nav.classList.add('loaded');
    }
    
    // Remove loading class after animation
    setTimeout(() => {
      document.body.classList.remove('loading');
      if (loader) {
        loader.remove();
      }
    }, 800);
  }
  
  // Check if images are already loaded
  images.forEach(img => {
    if (img.complete) {
      checkAllLoaded();
    } else {
      img.addEventListener('load', checkAllLoaded);
      img.addEventListener('error', checkAllLoaded);
    }
  });
  
  // Fallback: finish loading after max 2 seconds
  setTimeout(finishLoading, 2000);
}

// ============================================
// Hero Section Animations (Homepage Only)
// ============================================

function initHeroAnimations() {
  // Only run hero animations on homepage
  const isHomepage = window.location.pathname.includes('index.html') || 
                     window.location.pathname.endsWith('/website/') ||
                     window.location.pathname === '/' ||
                     document.title.includes('Home');
  
  if (!isHomepage) return;
  
  // Add hero-bg class to hero background images
  const heroBg = document.querySelector('section:first-of-type .absolute img');
  if (heroBg) {
    heroBg.classList.add('hero-bg');
  }
  
  // Animate hero elements on load
  const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-cta');
  heroElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      el.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 600 + (index * 150));
  });
  
  // Add floating animation to scroll indicator
  const scrollIndicator = document.querySelector('.animate-bounce');
  if (scrollIndicator) {
    scrollIndicator.classList.add('float-animation');
  }
}

// ============================================
// Navigation
// ============================================

function initNavigation() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  
  let lastScroll = 0;
  const scrollThreshold = 100;
  
  // Check if this is a subpage (not homepage)
  const isSubpage = document.body.classList.contains('subpage');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove background on scroll
    if (currentScroll > scrollThreshold) {
      nav.classList.add('nav-scrolled');
      nav.style.background = 'rgba(5, 23, 16, 0.95)';
      nav.style.backdropFilter = 'blur(20px)';
    } else {
      nav.classList.remove('nav-scrolled');
      nav.style.background = 'transparent';
      nav.style.backdropFilter = 'none';
    }
    
    // Hide/show on scroll direction - ONLY on homepage, not subpages
    if (!isSubpage) {
      if (currentScroll > lastScroll && currentScroll > 500) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
    }
    
    lastScroll = currentScroll;
  }, { passive: true });
  
  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

// ============================================
// Scroll Reveal Animations
// ============================================

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Unobserve after animation
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => revealObserver.observe(el));
}

// ============================================
// Parallax Effects
// ============================================

function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  if (parallaxElements.length === 0) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
          const speed = el.dataset.speed || 0.5;
          const yPos = -(scrolled * speed);
          el.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
      });
      
      ticking = true;
    }
  }, { passive: true });
}

// ============================================
// Smooth Scroll
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// Mobile Menu
// ============================================

function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  if (!hamburger || !mobileMenu) return;
  
  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMenu);
  }
  
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

// ============================================
// Form Validation
// ============================================

function initFormValidation() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          
          // Shake animation
          field.style.animation = 'shake 0.5s ease';
          setTimeout(() => {
            field.style.animation = '';
          }, 500);
        } else {
          field.classList.remove('error');
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        showNotification('Please fill in all required fields', 'error');
      } else {
        // Simulate form submission
        e.preventDefault();
        showNotification('Thank you! Your submission has been received.', 'success');
        form.reset();
      }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });
      
      input.addEventListener('input', () => {
        if (input.classList.contains('error') && input.value.trim()) {
          input.classList.remove('error');
        }
      });
    });
  });
}

// ============================================
// Image Lazy Loading
// ============================================

function initImageLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px'
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// ============================================
// Menu Animations
// ============================================

function initMenuAnimations() {
  const menuItems = document.querySelectorAll('.menu-item');
  
  const menuObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        
        menuObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  menuItems.forEach(item => menuObserver.observe(item));
}

// ============================================
// Custom Cursor (Desktop Only)
// ============================================

function initCustomCursor() {
  // Only on desktop
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  const cursorDot = document.createElement('div');
  const cursorOutline = document.createElement('div');
  
  cursorDot.className = 'cursor-dot';
  cursorOutline.className = 'cursor-outline';
  
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorOutline);
  
  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });
  
  // Smooth follow for outline
  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    
    requestAnimationFrame(animateOutline);
  }
  animateOutline();
  
  // Hover effects
  const hoverElements = document.querySelectorAll('a, button, .card-hover, .image-hover');
  
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', () => {
      cursorOutline.classList.remove('hover');
    });
  });
}

// ============================================
// Back to Top Button
// ============================================

function initBackToTop() {
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.innerHTML = '<span class="material-symbols-outlined">arrow_upward</span>';
  backToTop.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: rgba(172, 206, 188, 0.1);
    border: 1px solid rgba(172, 206, 188, 0.2);
    border-radius: 50%;
    color: #accebc;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 999;
  `;
  
  document.body.appendChild(backToTop);
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  backToTop.addEventListener('mouseenter', () => {
    backToTop.style.background = 'rgba(233, 195, 73, 0.2)';
    backToTop.style.borderColor = 'rgba(233, 195, 73, 0.4)';
    backToTop.style.color = '#e9c349';
    backToTop.style.transform = 'translateY(0) scale(1.1)';
  });
  
  backToTop.addEventListener('mouseleave', () => {
    backToTop.style.background = 'rgba(172, 206, 188, 0.1)';
    backToTop.style.borderColor = 'rgba(172, 206, 188, 0.2)';
    backToTop.style.color = '#accebc';
    backToTop.style.transform = 'translateY(0) scale(1)';
  });
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTop.style.opacity = '1';
      backToTop.style.visibility = 'visible';
      backToTop.style.transform = 'translateY(0)';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.visibility = 'hidden';
      backToTop.style.transform = 'translateY(20px)';
    }
  }, { passive: true });
}

// ============================================
// Notification System
// ============================================

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 30px;
    padding: 16px 24px;
    background: ${type === 'error' ? '#dc2626' : type === 'success' ? '#059669' : '#0b3525'};
    color: white;
    border-radius: 8px;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(0)';
    notification.style.opacity = '1';
  });
  
  // Remove after delay
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    notification.style.opacity = '0';
    
    setTimeout(() => {
      notification.remove();
    }, 400);
  }, 4000);
}

// ============================================
// Utility Functions
// ============================================

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Add shake animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

// ============================================
// Gallery Lightbox (if gallery exists)
// ============================================

function initLightbox() {
  const galleryImages = document.querySelectorAll('.gallery-image');
  if (galleryImages.length === 0) return;
  
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox fixed inset-0 z-50 flex items-center justify-center bg-black/90';
  lightbox.innerHTML = `
    <div class="lightbox-content relative max-w-5xl max-h-[90vh] p-4">
      <img src="" alt="Gallery Image" class="max-w-full max-h-[85vh] object-contain rounded-lg">
      <button class="lightbox-close absolute -top-12 right-0 text-white/80 hover:text-white transition-colors">
        <span class="material-symbols-outlined text-4xl">close</span>
      </button>
    </div>
  `;
  
  document.body.appendChild(lightbox);
  
  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  
  galleryImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
  
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Initialize lightbox if gallery exists
document.addEventListener('DOMContentLoaded', initLightbox);

// ============================================
// Counter Animation (for statistics)
// ============================================

function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start).toLocaleString();
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString();
    }
  }
  
  updateCounter();
}

// Initialize counters when visible
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.counter);
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
}

document.addEventListener('DOMContentLoaded', initCounters);

// ============================================
// Text Scramble Effect (for hero text)
// ============================================

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  
  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="text-secondary/50">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.el.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Initialize text scramble on hero title
function initTextScramble() {
  const heroTitle = document.querySelector('.hero-title-scramble');
  if (!heroTitle) return;
  
  const fx = new TextScramble(heroTitle);
  const originalText = heroTitle.innerText;
  
  setTimeout(() => {
    fx.setText(originalText);
  }, 500);
}

document.addEventListener('DOMContentLoaded', initTextScramble);

// ============================================
// Preloader
// ============================================

function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, 1000);
  });
}

document.addEventListener('DOMContentLoaded', initPreloader);

// ============================================
// Console Easter Egg
// ============================================

console.log('%c🍽️ Kahani Restaurant', 'font-size: 24px; font-weight: bold; color: #e9c349;');
console.log('%cWhere every dish tells a story', 'font-size: 14px; color: #accebc;');
console.log('%cCrafted with care and attention to detail', 'font-size: 12px; color: #8b928d;');
