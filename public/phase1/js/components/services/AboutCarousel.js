/**
 * About Section Carousel Component
 * Profile carousel for Analytical Minds section
 */

export class AboutCarousel {
    constructor() {
        this.currentProfile = 0;
        this.slides = [];
        this.dots = [];
        this.prevBtn = null;
        this.nextBtn = null;
        this.init();
    }

    init() {
        this.slides = Array.from(document.querySelectorAll('.about__slide'));
        this.dots = Array.from(document.querySelectorAll('.about__dot'));
        this.prevBtn = document.getElementById('aboutPrev');
        this.nextBtn = document.getElementById('aboutNext');

        if (this.slides.length === 0) return;

        // Setup controls
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                const nextIndex = (this.currentProfile + 1) % this.slides.length;
                this.showProfile(nextIndex);
            });
        }

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                const prevIndex = (this.currentProfile - 1 + this.slides.length) % this.slides.length;
                this.showProfile(prevIndex);
            });
        }

        // Setup dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.showProfile(index);
            });
        });

        // Show first profile
        this.showProfile(0);
    }

    showProfile(index) {
        this.slides.forEach(slide => slide.classList.remove('about__slide--active'));
        this.dots.forEach(dot => dot.classList.remove('about__dot--active'));
        
        if (this.slides[index]) {
            this.slides[index].classList.add('about__slide--active');
        }
        if (this.dots[index]) {
            this.dots[index].classList.add('about__dot--active');
        }
        
        this.currentProfile = index;
    }
}
