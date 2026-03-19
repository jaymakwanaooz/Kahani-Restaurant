// Kahani Restaurant - Interactive Storytelling Website
// Smooth scrolling and animations

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initStoryCards();
    initMenuTabs();
    initReservationForm();
    initParallax();
});

// Navigation functionality
function initNavigation() {
    const nav = document.querySelector('.main-nav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // Sticky navigation on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navLinks.classList.remove('nav-active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    });
}

// Scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.story-card, .menu-item, .philosophy-content, .reservation-form').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Story cards interaction
function initStoryCards() {
    const cards = document.querySelectorAll('.story-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cards.forEach(c => {
                if (c !== card) {
                    c.style.opacity = '0.6';
                    c.style.transform = 'scale(0.98)';
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            cards.forEach(c => {
                c.style.opacity = '1';
                c.style.transform = 'scale(1)';
            });
        });
    });
}

// Menu tabs functionality
function initMenuTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuGrids = document.querySelectorAll('.menu-grid');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding menu section
            const category = btn.dataset.category;
            menuGrids.forEach(grid => {
                if (grid.dataset.category === category) {
                    grid.classList.add('active');
                } else {
                    grid.classList.remove('active');
                }
            });
        });
    });
}

// Reservation form
function initReservationForm() {
    const form = document.getElementById('reservation-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Show confirmation
            showNotification('Reservation request submitted! We will confirm shortly.', 'success');
            form.reset();
        });
    }
}

// Parallax effect for hero section
function initParallax() {
    const hero = document.querySelector('.hero');
    
    if (hero && !window.matchMedia('(pointer: coarse)').matches) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            hero.style.backgroundPositionY = `${rate}px`;
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--color-gold);
        color: var(--color-charcoal);
        padding: 1rem 2rem;
        border-radius: 4px;
        font-family: var(--font-body);
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add CSS animation class
const style = document.createElement('style');
style.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-scrolled {
        background: rgba(26, 26, 26, 0.98) !important;
        box-shadow: 0 2px 20px rgba(0,0,0,0.3);
    }
    
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: var(--color-charcoal);
            flex-direction: column;
            padding: 2rem;
            gap: 1.5rem;
            transform: translateY(-150%);
            transition: transform 0.3s ease;
            z-index: 999;
        }
        
        .nav-links.nav-active {
            transform: translateY(0);
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
    }
`;
document.head.appendChild(style);
