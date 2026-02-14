/**
 * Hero Carousel Component
 * Auto-rotating carousel with pause on hover
 */

export class HeroCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.indicators = [];
        this.prevBtn = null;
        this.nextBtn = null;
        this.interval = null;
        this.init();
    }

    init() {
        this.slides = Array.from(document.querySelectorAll('.hero__slide'));
        this.indicators = Array.from(document.querySelectorAll('.hero__indicator'));
        this.prevBtn = document.getElementById('heroPrev');
        this.nextBtn = document.getElementById('heroNext');
        const carousel = document.getElementById('heroCarousel');

        if (this.slides.length === 0) return;

        // Setup controls
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetInterval();
            });
        }

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetInterval();
            });
        }

        // Setup indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.showSlide(index);
                this.resetInterval();
            });
        });

        // Pause on hover
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pause());
            carousel.addEventListener('mouseleave', () => this.start());
        }

        // Show first slide
        this.showSlide(0);
        this.start();
    }

    showSlide(index) {
        // Remove active class from all slides and indicators
        this.slides.forEach(slide => slide.classList.remove('hero__slide--active'));
        this.indicators.forEach(indicator => indicator.classList.remove('hero__indicator--active'));
        
        // Add active class to current slide and indicator
        if (this.slides[index]) {
            this.slides[index].classList.add('hero__slide--active');
        }
        if (this.indicators[index]) {
            this.indicators[index].classList.add('hero__indicator--active');
        }
        
        this.currentSlide = index;
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }

    start() {
        this.interval = setInterval(() => this.nextSlide(), 5000);
    }

    pause() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    resetInterval() {
        this.pause();
        this.start();
    }
}
