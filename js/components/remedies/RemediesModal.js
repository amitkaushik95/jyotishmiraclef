/**
 * My Remedies Modal Component
 * User workflow for viewing personalized remedies
 */

import { findCustomerById } from '../../utils/storage.js';
import { fetchRemediesByQuery } from '../../utils/api.js';
import { calculateAge } from '../../utils/calculations.js';

export class RemediesModal {
    constructor() {
        this.modal = null;
        this.modalBody = null;
        this.closeBtn = null;
        this.init();
    }

    init() {
        this.modal = document.getElementById('remediesModal');
        this.modalBody = document.getElementById('remediesModalBody');
        const myRemediesBtn = document.getElementById('myRemediesBtn');
        this.closeBtn = document.getElementById('closeRemediesModal');

        if (!this.modal || !myRemediesBtn) return;

        // Open modal
        myRemediesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
            this.modal.classList.add('modal--open');
            document.body.style.overflow = 'hidden';
        });

        // Close modal
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        const overlay = this.modal.querySelector('.modal__overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }
    }

    showLoginForm() {
        if (!this.modalBody) return;
        
        this.modalBody.innerHTML = `
            <form class="remedies-form" id="remediesLoginForm">
                <h2 class="remedies-form__title">My Remedies</h2>
                <p style="text-align: center; margin-bottom: 20px; color: var(--color-gray);">
                    Enter your Customer ID to view your personalized remedies
                </p>
                <input 
                    type="text" 
                    class="remedies-form__input" 
                    id="customerIdInput" 
                    placeholder="Enter Customer ID" 
                    required
                    autofocus
                />
                <button type="submit" class="remedies-form__submit">View My Remedies</button>
            </form>
            <div class="remedies-error" id="remediesError" style="display: none;">
                <p class="remedies-error__message" id="remediesErrorMessage"></p>
            </div>
        `;
        
        const loginForm = document.getElementById('remediesLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    /**
     * Open the remedies modal programmatically. If a customerId is provided,
     * populate the input and trigger the lookup.
     */
    async open(customerId) {
        if (!this.modal) return;
        this.showLoginForm();
        this.modal.classList.add('modal--open');
        document.body.style.overflow = 'hidden';

        if (customerId) {
            // Populate input and trigger lookup
            const input = document.getElementById('customerIdInput');
            if (input) input.value = String(customerId).trim();
            try {
                await this.handleLogin({ preventDefault: () => {} });
            } catch (err) {
                // handleLogin already logs errors; nothing additional needed here
            }
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const customerId = document.getElementById('customerIdInput').value.trim();

        const errorDiv = document.getElementById('remediesError');
        const errorMessage = document.getElementById('remediesErrorMessage');

        try {
            const results = await fetchRemediesByQuery(customerId);
            const customer = Array.isArray(results) && results.length > 0 ? results[0] : null;
            if (customer) {
                this.showDashboard(customer);
                if (errorDiv) errorDiv.style.display = 'none';
                return;
            }
            // Not found
            if (errorDiv) errorDiv.style.display = 'block';
            if (errorMessage) {
                errorMessage.textContent = 'Customer ID not found. Please contact support for assistance.';
            }
        } catch (err) {
            console.error('Remedies lookup failed:', err.message);
            if (errorDiv) errorDiv.style.display = 'block';
            if (errorMessage) {
                errorMessage.textContent = 'Unable to reach the server. Please try again. (Start backend: cd backend && npm run dev)';
            }
        }
    }

    showDashboard(customer) {
        if (!this.modalBody) return;
        
        const ageInfo = calculateAge(customer.dob);
        const ageText = ageInfo 
            ? `${ageInfo.age} years (Born in ${ageInfo.year}${ageInfo.zodiacYear ? `, ${ageInfo.zodiacYear} Year` : ''})` 
            : 'N/A';
        
        const remedies = (customer.remedies && customer.remedies.length
            ? customer.remedies
            : [
                customer.remedy1,
                customer.remedy2,
                customer.remedy3,
                customer.remedy4,
                customer.remedy5
            ]
        ).filter(r => r && String(r).trim());
        
        this.modalBody.innerHTML = `
            <div class="remedies-dashboard remedies-dashboard--active">
                <h2 class="remedies-dashboard__title">Your Personalized Remedies</h2>
                
                <div class="remedies-dashboard__info">
                    <div class="remedies-dashboard__info-item">
                        <strong>Customer ID:</strong> ${customer.customerId}
                    </div>
                    <div class="remedies-dashboard__info-item">
                        <strong>Name:</strong> ${customer.name || customer.customerName}
                    </div>
                    <div class="remedies-dashboard__info-item">
                        <strong>Date of Birth:</strong> ${customer.dob}
                    </div>
                    <div class="remedies-dashboard__info-item">
                        <strong>Age:</strong> ${ageText}
                    </div>
                </div>
                
                <h3 class="remedies-dashboard__remedies-title">Your Remedies</h3>
                
                ${remedies.length > 0 ? remedies.map((remedy, index) => `
                    <div class="remedies-dashboard__remedy">
                        <div class="remedies-dashboard__remedy-number">Remedy ${index + 1}</div>
                        <div class="remedies-dashboard__remedy-text">${remedy}</div>
                    </div>
                `).join('') : `
                    <p style="text-align: center; color: var(--color-gray); padding: 20px;">
                        No remedies assigned yet. Please contact support.
                    </p>
                `}
            </div>
        `;
    }

    close() {
        if (this.modal) {
            this.modal.classList.remove('modal--open');
        }
        document.body.style.overflow = '';
    }
}
