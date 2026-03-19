// Kahani Restaurant - Interactive Storytelling Website
// Main JavaScript File

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initParallaxEffects();
    initMenuInteractions();
    initSmoothScroll();
    initImageLazyLoading();
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const header = document.querySelector('.main-header');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    let lastScrollY = window.scrollY;
    let ticking = false;

    // Header scroll behavior
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                
                // Add/remove scrolled class
                if (currentScrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Hide/show header on scroll direction
                if (currentScrollY > lastScrollY && currentScrollY > 300) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }

                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle?.classList.remove('active');
            navLinks?.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade'
    );

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // Stagger animation for grids
    const staggerContainers = document.querySelectorAll('.stagger-container');
    staggerContainers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}

// ============================================
// PARALLAX EFFECTS
// ============================================
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                
                parallaxElements.forEach(el => {
                    const speed = el.dataset.speed || 0.5;
                    const yPos = -(scrollY * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ============================================
// MENU INTERACTIONS
// ============================================
function initMenuInteractions() {
    // Menu category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            // Update active button
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter items with animation
            menuItems.forEach(item => {
                const itemCategory = item.dataset.category;
                
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 10);
                } else {
                    item.classList.remove('visible');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Menu item hover effects
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('hovered');
        });
        
        item.addEventListener('mouseleave', () => {
            item.classList.remove('hovered');
        });
    });

    // Initialize all items as visible
    menuItems.forEach(item => item.classList.add('visible'));
}

// ============================================
// SMOOTH SCROLL
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
// IMAGE LAZY LOADING
// ============================================
function initImageLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

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
        rootMargin: '50px 0px'
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// ============================================
// UTILITY FUNCTIONS
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

// ============================================
// INTERACTIVE STORYTELLING FEATURES
// ============================================

// Story reveal on scroll
const storySections = document.querySelectorAll('.story-section');
const storyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('story-revealed');
        }
    });
}, { threshold: 0.3 });

storySections.forEach(section => storyObserver.observe(section));

// Text scramble effect for headings
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
                output += `<span class="scramble-char">${char}</span>`;
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

// Initialize text scramble on hero headings
const heroHeading = document.querySelector('.hero-title');
if (heroHeading) {
    const fx = new TextScramble(heroHeading);
    const phrases = [
        'Kahani',
        'A Story on Your Plate'
    ];
    
    let counter = 0;
    const next = () => {
        fx.setText(phrases[counter]).then(() => {
            setTimeout(next, 3000);
        });
        counter = (counter + 1) % phrases.length;
    };
    
    // Start after initial load
    setTimeout(next, 2000);
}

// Magnetic button effect
const magneticButtons = document.querySelectorAll('.magnetic-btn');
magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// Cursor follower effect
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

let cursorX = 0, cursorY = 0;
let currentX = 0, currentY = 0;

if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    function animateCursor() {
        currentX += (cursorX - currentX) * 0.1;
        currentY += (cursorY - currentY) * 0.1;
        
        cursor.style.left = currentX + 'px';
        cursor.style.top = currentY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover states
    const hoverElements = document.querySelectorAll('a, button, .menu-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// ============================================
// MENU PAGE SPECIFIC
// ============================================

// Menu item modal/popup
function openMenuModal(itemData) {
    const modal = document.createElement('div');
    modal.className = 'menu-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-image">
                <img src="${itemData.image}" alt="${itemData.name}">
            </div>
            <div class="modal-info">
                <h3>${itemData.name}</h3>
                <p class="modal-price">${itemData.price}</p>
                <p class="modal-description">${itemData.description}</p>
                <div class="modal-tags">
                    ${itemData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Animate in
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
    
    // Close handlers
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
}

// Add click handlers to menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const itemData = {
            name: item.querySelector('h4').textContent,
            price: item.querySelector('.menu-price').textContent,
            description: item.querySelector('p').textContent,
            image: item.querySelector('img')?.src || '',
            tags: Array.from(item.querySelectorAll('.dietary-tag')).map(t => t.textContent)
        };
        openMenuModal(itemData);
    });
});

// ============================================
// RESERVATION FORM
// ============================================
const reservationForm = document.querySelector('.reservation-form');
if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.innerHTML = `
            <div class="success-content">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3>Reservation Request Received</h3>
                <p>We'll confirm your booking shortly.</p>
            </div>
        `;
        
        reservationForm.innerHTML = '';
        reservationForm.appendChild(successMsg);
        
        // Animate in
        requestAnimationFrame(() => {
            successMsg.classList.add('visible');
        });
    });
}

// ============================================
// NEWSLETTER FORM
// ============================================
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (email) {
            const btn = newsletterForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Subscribed!';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                newsletterForm.reset();
            }, 3000);
        }
    });
}

console.log('🍽️ Kahani Restaurant - Interactive Storytelling Website Loaded');
