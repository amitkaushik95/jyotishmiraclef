/**
 * Validation Utilities
 * Input sanitization and validation
 */

import { validateDOB } from './calculations.js';

/**
 * Sanitize string input
 */
export function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate email format
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate mobile number (Indian format)
 */
export function validateMobile(mobile) {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile.replace(/\D/g, ''));
}

/**
 * Validate Customer ID format
 */
export function validateCustomerId(customerId) {
    return /^[A-Z0-9]{4,10}$/i.test(customerId);
}

/**
 * Validate form data
 */
export function validateConsultationForm(formData) {
    const errors = {};
    
    if (!formData.name || formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.dob || !validateDOB(formData.dob)) {
        errors.dob = 'Invalid date of birth format (MMDDYY)';
    }
    
    if (!formData.time) {
        errors.time = 'Time of birth is required';
    }
    
    if (!formData.place || formData.place.trim().length < 2) {
        errors.place = 'Place of birth is required';
    }
    
    if (!formData.mobile || !validateMobile(formData.mobile)) {
        errors.mobile = 'Invalid mobile number';
    }
    
    if (!formData.email || !validateEmail(formData.email)) {
        errors.email = 'Invalid email address';
    }
    
    if (!formData.query || formData.query.trim().length < 10) {
        errors.query = 'Query must be at least 10 characters';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
