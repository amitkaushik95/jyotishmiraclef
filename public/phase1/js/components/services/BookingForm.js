/**
 * Booking Form Component
 * Consultation form with validation
 */

import { sanitizeInput, validateConsultationForm } from '../../utils/validation.js';

export class BookingForm {
    constructor() {
        this.form = null;
        this.successDiv = null;
        this.init();
    }

    init() {
        this.form = document.getElementById('bookingForm');
        this.successDiv = document.getElementById('bookingSuccess');

        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            name: sanitizeInput(document.getElementById('name').value),
            dob: document.getElementById('dob').value.replace(/\D/g, ''), // MMDDYY format
            time: document.getElementById('time').value,
            place: sanitizeInput(document.getElementById('place').value),
            mobile: document.getElementById('mobile').value.replace(/\D/g, ''),
            email: sanitizeInput(document.getElementById('email').value),
            query: sanitizeInput(document.getElementById('query').value),
            timestamp: new Date().toISOString()
        };

        // Validate form
        const validation = validateConsultationForm(formData);
        
        if (!validation.isValid) {
            this.showErrors(validation.errors);
            return;
        }

        // Log to console (for development)
        console.log('Booking Form Submission:', formData);
        
        // TODO: Future API integration
        // Example with EmailJS:
        // emailjs.send('service_id', 'template_id', formData)
        //     .then(() => this.showSuccess())
        //     .catch(error => console.error('Error:', error));
        
        // Example with Telegram Bot:
        // fetch('https://api.telegram.org/bot<TOKEN>/sendMessage', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         chat_id: '<CHAT_ID>',
        //         text: `New Consultation Request:\n\nName: ${formData.name}\nDOB: ${formData.dob}\n...`
        //     })
        // })
        //     .then(() => this.showSuccess())
        //     .catch(error => console.error('Error:', error));
        
        // Show success message
        this.showSuccess();
    }

    showErrors(errors) {
        // Remove existing error messages
        document.querySelectorAll('.booking__error').forEach(el => el.remove());
        
        // Show errors
        Object.keys(errors).forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'booking__error';
                errorDiv.style.color = 'var(--color-imperial-red)';
                errorDiv.style.fontSize = '0.9rem';
                errorDiv.style.marginTop = '5px';
                errorDiv.textContent = errors[field];
                input.parentNode.appendChild(errorDiv);
            }
        });
    }

    showSuccess() {
        if (this.form) {
            this.form.style.display = 'none';
        }
        if (this.successDiv) {
            this.successDiv.style.display = 'block';
            this.successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Reset form after 10 seconds (optional)
        setTimeout(() => {
            if (this.form) {
                this.form.reset();
                this.form.style.display = 'block';
            }
            if (this.successDiv) {
                this.successDiv.style.display = 'none';
            }
        }, 10000);
    }
}
