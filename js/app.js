/**
 * Main Application Entry Point
 * Initializes all components and modules
 */

import { Header } from './components/layout/Header.js';
import { HeroCarousel } from './components/hero/HeroCarousel.js';
import { AboutCarousel } from './components/services/AboutCarousel.js';
import { TestimonialSlider } from './components/services/TestimonialSlider.js';
import { BookingForm } from './components/services/BookingForm.js';
import { RemediesModal } from './components/remedies/RemediesModal.js';
import { initRemediesDatabase } from './utils/storage.js';
import { router } from './utils/router.js';

class App {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        // Initialize database
            // Database is now API-backed (no local initialization required)

        // Initialize components
        this.components.header = new Header();
        this.components.heroCarousel = new HeroCarousel();
        this.components.aboutCarousel = new AboutCarousel();
        this.components.testimonialSlider = new TestimonialSlider();
        this.components.bookingForm = new BookingForm();
        this.components.remediesModal = new RemediesModal();

        // Auto-open My Remedies modal when arriving via special link (emails may use hash or query)
        const openFromURL = () => {
            try {
                const url = new URL(window.location.href);
                const hash = url.hash || '';
                const params = url.searchParams;

                // If hash or query explicitly indicate remedies, open modal
                if (hash.toLowerCase().includes('remedies') || params.get('view') === 'remedies') {
                    this.components.remediesModal.open();
                    return;
                }

                // customerId may be provided in search params or encoded in hash
                const cid = params.get('customerId') || (() => {
                    // try to parse customerId from hash like #myRemedies?customerId=XYZ or #remedies:CUST
                    const m = hash.match(/customerId=([^&]+)/i) || hash.match(/[:=]([A-Za-z0-9-_]+)/);
                    return m ? decodeURIComponent(m[1]) : null;
                })();

                if (cid) {
                    this.components.remediesModal.open(cid);
                }
            } catch (err) {
                console.warn('Failed to parse URL for My Remedies auto-open', err.message);
            }
        };

        // Run once now
        openFromURL();

        // Also respond to hash changes/navigation
        window.addEventListener('hashchange', openFromURL);
        window.addEventListener('popstate', openFromURL);

        // Setup lazy loading for images
        this.setupLazyLoading();

        // Setup gallery interactions
        this.setupGallery();

        console.log('JyotishMiracle.com - Application initialized successfully');
    }

    setupLazyLoading() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupGallery() {
        // Gallery booking buttons
        document.querySelectorAll('.gallery__btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Scroll to booking form
                const bookingSection = document.getElementById('contact');
                if (bookingSection) {
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const targetPosition = bookingSection.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new App();
    });
} else {
    window.app = new App();
}
