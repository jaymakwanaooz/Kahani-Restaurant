/**
 * Kahani Restaurant - Main JavaScript
 * Interactive features and animations
 */

// ============================================
// DOM Ready
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initPageVisibilityAPI();
  initEnhancedFormValidation();
  initPageLoader();
  initNavigation();
  initScrollReveal();
  initParallax();
  initSmoothScroll();
  initMobileMenu();
  initFormValidation();
  initImageLazyLoading();
  initMenuAnimations();
  initBackToTop();
  initHeroAnimations();
});


// ============================================
// Page Visibility API
// ============================================

function initPageVisibilityAPI() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Pause animations by setting animation-play-state
      document.querySelectorAll('[style*="animation"], [style*="transition"]').forEach(el => {
        if (el.style.animation) {
          el.dataset.animationState = el.style.animationPlayState || 'running';
          el.style.animationPlayState = 'paused';
        }
      });
    } else {
      // Resume animations
      document.querySelectorAll('[data-animation-state]').forEach(el => {
        el.style.animationPlayState = el.dataset.animationState;
      });
    }
  });
}

// ============================================
// Enhanced Form Validation with Feedback
// ============================================

function initEnhancedFormValidation() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    const formInputs = form.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
      // Skip radio and checkbox inputs to not break custom UI (peer-checked)
      if (input.type === 'radio' || input.type === 'checkbox') return;
      
      // Add form-group wrapper if not exists
      if (!input.parentElement.classList.contains('form-group')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group';
        input.parentElement.insertBefore(wrapper, input);
        wrapper.appendChild(input);
      }
      
      // Real-time feedback
      input.addEventListener('blur', () => {
        validateField(input);
      });
      
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          validateField(input);
        }
      });
      
      input.addEventListener('focus', () => {
        // Clear previous messages on focus
        const errorMsg = input.parentElement.querySelector('.form-error-message');
        const successMsg = input.parentElement.querySelector('.form-success-message');
        if (errorMsg) errorMsg.classList.remove('show');
        if (successMsg) successMsg.classList.remove('show');
      });
    });
  });
}

// Enhanced email and phone validation
function validateField(input) {
  const formGroup = input.parentElement;
  const isRequired = input.hasAttribute('required');
  const isEmpty = !input.value.trim();
  const type = input.getAttribute('type');
  const id = input.getAttribute('id');

  // Remove existing message elements
  const existingError = formGroup.querySelector('.form-error-message');
  const existingSuccess = formGroup.querySelector('.form-success-message');
  if (existingError) existingError.remove();
  if (existingSuccess) existingSuccess.remove();

  if (isRequired && isEmpty) {
    input.classList.add('error');
    input.classList.remove('success');
    const errorMsg = document.createElement('div');
    errorMsg.className = 'form-error-message show';
    errorMsg.textContent = 'This field is required';
    formGroup.appendChild(errorMsg);
    return;
  }

  // Email validation
  if (id === 'email') {
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'protonmail.com'];
    const email = input.value.trim();
    const emailPattern = /^[^@\s]+@([^@\s]+)$/;
    const match = email.match(emailPattern);
    if (!match || !allowedDomains.some(domain => email.endsWith('@' + domain))) {
      input.classList.add('error');
      input.classList.remove('success');
      const errorMsg = document.createElement('div');
      errorMsg.className = 'form-error-message show';
      errorMsg.textContent = 'Enter a valid email (gmail, yahoo, outlook, protonmail)';
      formGroup.appendChild(errorMsg);
      return;
    }
  }

  // Phone validation
  if (id === 'phone') {
    const phone = input.value.replace(/\D/g, '');
    if (phone.length !== 10) {
      input.classList.add('error');
      input.classList.remove('success');
      const errorMsg = document.createElement('div');
      errorMsg.className = 'form-error-message show';
      errorMsg.textContent = 'Enter a valid 10-digit phone number';
      formGroup.appendChild(errorMsg);
      return;
    }
  }

  // If valid
  input.classList.remove('error');
  input.classList.add('success');
  const successMsg = document.createElement('div');
  successMsg.className = 'form-success-message show';
  successMsg.textContent = '✓ Valid';
  formGroup.appendChild(successMsg);
}

// ============================================
// Page Loader Animation (Homepage Only)
// ============================================

function initPageLoader() {
  // Only run loader on homepage
  const isHomepage = window.location.pathname.includes('index.html') || 
                     window.location.pathname.endsWith('/website/') ||
                     window.location.pathname === '/' ||
                     document.title.includes('Home');
  
  const existingLoader = document.querySelector('.page-loader');
  
  if (!isHomepage) {
    // Remove loader on subpages
    if (existingLoader) existingLoader.remove();
    document.body.classList.remove('loading');
    
    // On subpages, trigger fade-up entrance animation
    const nav = document.querySelector('nav');
    if (nav) {
      nav.classList.add('loaded');
    }
    
    // Trigger subpage animation after a micro-delay for smooth entrance
    setTimeout(() => {
      requestAnimationFrame(() => {
        document.body.classList.add('subpage-ready');
      });
    }, 50);
    
    return;
  }
  
  // Homepage: body already has 'loading' class from HTML
  // Loader already exists in HTML
  // Track when loading started for minimum display time
  const loadStartTime = Date.now();
  const MIN_LOADER_DISPLAY = 1200; // minimum ms to show loader
  
  // Wait for all images to load
  const images = document.querySelectorAll('img');
  let loadedImages = 0;
  const totalImages = images.length;
  let finishCalled = false;
  
  function checkAllLoaded() {
    loadedImages++;
    if (loadedImages >= totalImages || totalImages === 0) {
      const elapsed = Date.now() - loadStartTime;
      const remaining = Math.max(0, MIN_LOADER_DISPLAY - elapsed);
      setTimeout(() => {
        finishLoading();
      }, remaining);
    }
  }
  
  function finishLoading() {
    if (finishCalled) return;
    finishCalled = true;
    
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
  
  // Fallback: finish loading after max 3 seconds
  setTimeout(finishLoading, 3000);
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
  
  // Detect if this is the homepage
  const isHomepage = window.location.pathname === '/' || 
                     window.location.pathname.endsWith('/index.html') || 
                     window.location.pathname.endsWith('/website/') ||
                     window.location.href.includes('index.html') ||
                     document.body.classList.contains('homepage');
  
  // Make nav sticky on subpages
  if (!isHomepage) {
    nav.style.position = 'sticky';
    nav.style.top = '0';
    nav.style.zIndex = '100';
  }
  
  // Active link highlighting variables
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let isNavScrolled = false;
  let isNavHidden = false;
  let tickingNav = false;
  
  let sectionData = [];
  function cacheSections() {
    sectionData = Array.from(sections).map(section => ({
      id: section.getAttribute('id'),
      top: section.offsetTop - 200
    }));
  }
  if (sections.length > 0) {
    cacheSections();
    window.addEventListener('resize', cacheSections);
  }
  
  window.addEventListener('scroll', () => {
    if (!tickingNav) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.scrollY;
        
        // Add/remove background on scroll
        if (currentScroll > scrollThreshold) {
          if (!isNavScrolled) {
            nav.classList.add('nav-scrolled');
            nav.style.background = 'rgba(5, 23, 16, 0.95)';
            nav.style.backdropFilter = 'blur(20px)';
            isNavScrolled = true;
          }
        } else {
          if (isNavScrolled) {
            nav.classList.remove('nav-scrolled');
            nav.style.background = 'transparent';
            nav.style.backdropFilter = 'none';
            isNavScrolled = false;
          }
        }
        
        // Hide/show on scroll direction - ONLY on homepage
        if (isHomepage) {
          if (currentScroll > lastScroll && currentScroll > 500) {
            if (!isNavHidden) {
              nav.style.transform = 'translateY(-100%)';
              isNavHidden = true;
            }
          } else {
            if (isNavHidden) {
              nav.style.transform = 'translateY(0)';
              isNavHidden = false;
            }
          }
        }
        
        // Active link highlighting
        if (sections.length > 0) {
          let current = '';
          for (let i = 0; i < sectionData.length; i++) {
            if (currentScroll >= sectionData[i].top) {
              current = sectionData[i].id;
            }
          }
          
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${current}`) {
              if (!link.classList.contains('active')) link.classList.add('active');
            } else {
              if (link.classList.contains('active')) link.classList.remove('active');
            }
          });
        }
        
        lastScroll = currentScroll;
        tickingNav = false;
      });
      tickingNav = true;
    }
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
  // Smooth scroll for anchor links
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
  
  // Page transition for internal navigation links
  document.querySelectorAll('a:not([href^="#"]):not([href^="http"]):not([href^="/"]):not([target])').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      // Only intercept if it's an internal page link
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        e.preventDefault();
        
        // Add fade-out animation
        document.body.classList.add('page-transition-out');
        
        // Navigate after animation
        setTimeout(() => {
          window.location.href = href;
        }, 400);
      }
    });
  });
  
  // Add fade-in on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.add('page-transition-in');
    });
  } else {
    document.body.classList.add('page-transition-in');
  }
}

// ============================================
// Mobile Menu
// ============================================

function initMobileMenu() {
  const hamburger = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!hamburger || !mobileMenu) return;
  
  const mobileNavLinks = mobileMenu.querySelectorAll('a');
  
  function openMenu() {
    mobileMenu.classList.remove('hidden');
    const icon = hamburger.querySelector('.material-symbols-outlined');
    if (icon) icon.textContent = 'close';
  }
  
  function closeMenu() {
    mobileMenu.classList.add('hidden');
    const icon = hamburger.querySelector('.material-symbols-outlined');
    if (icon) icon.textContent = 'menu';
  }
  
  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('hidden')) {
      openMenu();
    } else {
      closeMenu();
    }
  });
  
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
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
