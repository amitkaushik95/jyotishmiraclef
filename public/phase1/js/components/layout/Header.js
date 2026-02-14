/**
 * Header Component
 * Sticky header with scroll effects and mobile navigation
 */

export class Header {
    constructor() {
        this.header = null;
        this.mobileToggle = null;
        this.nav = null;
        this.init();
    }

    init() {
        this.header = document.getElementById('header');
        this.mobileToggle = document.getElementById('mobileToggle');
        this.nav = document.getElementById('nav');
        
        if (!this.header) return;
        
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScroll();
    }

    setupScrollEffect() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                this.header.classList.add('header--scrolled');
            } else {
                this.header.classList.remove('header--scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }

    setupMobileMenu() {
        if (!this.mobileToggle || !this.nav) return;
        
        this.mobileToggle.addEventListener('click', () => {
            this.nav.classList.toggle('header__nav--active');
            this.mobileToggle.classList.toggle('header__mobile-toggle--active');
        });

        // Close mobile nav when clicking a link
        const navLinks = document.querySelectorAll('.header__nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.nav.classList.remove('header__nav--active');
                this.mobileToggle.classList.remove('header__mobile-toggle--active');
            });
        });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href !== '') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerHeight = document.getElementById('header').offsetHeight;
                        const targetPosition = target.offsetTop - headerHeight;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}
