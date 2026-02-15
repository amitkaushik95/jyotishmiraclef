/**
 * Testimonial Slider Component
 * Auto-scrolling testimonial slider
 */

export class TestimonialSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.indicators = [];
        this.interval = null;
        this.init();
    }

    init() {
        this.slides = Array.from(document.querySelectorAll('.testimonials__slide'));
        this.indicators = Array.from(document.querySelectorAll('.testimonials__indicator'));

        if (this.slides.length === 0) return;

        // Setup indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.showTestimonial(index);
                this.resetInterval();
            });
        });

        // Show first testimonial
        this.showTestimonial(0);
        this.start();
    }

    showTestimonial(index) {
        this.slides.forEach(slide => slide.classList.remove('testimonials__slide--active'));
        this.indicators.forEach(indicator => indicator.classList.remove('testimonials__indicator--active'));
        
        if (this.slides[index]) {
            this.slides[index].classList.add('testimonials__slide--active');
        }
        if (this.indicators[index]) {
            this.indicators[index].classList.add('testimonials__indicator--active');
        }
        
        this.currentSlide = index;
    }

    nextTestimonial() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showTestimonial(nextIndex);
    }

    start() {
        this.interval = setInterval(() => this.nextTestimonial(), 5000);
    }

    resetInterval() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.start();
    }
}
