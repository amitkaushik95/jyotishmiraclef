/**
 * Admin Panel Application Entry Point
 * Handles login, authentication, and dashboard initialization
 */

import { 
    isAdminLoggedIn,
    setAdminLoggedIn,
    getRemediesDatabase,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    findCustomerById
} from './utils/storage.js';

import { loginAdmin, createRemedy, updateRemedy, deleteRemedy, listRemedies } from './utils/api.js';

import { AdminDashboard } from './components/admin/AdminDashboard.js';

// ============================================
// DOM Elements
// ============================================
const adminLogin = document.getElementById('adminLogin');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const loginErrorMessage = document.getElementById('loginErrorMessage');

const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const changePasswordModal = document.getElementById('changePasswordModal');
const customerModal = document.getElementById('customerModal');
const deleteModal = document.getElementById('deleteModal');

// ============================================
// Login Functionality
// ============================================
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    
    // Try API login first
    (async () => {
        const res = await loginAdmin({ username, password });
        if (res && res.token) {
            sessionStorage.setItem('admin_token', res.token);
            setAdminLoggedIn(true, username);
            sessionStorage.setItem('admin_username', username);
            showDashboard();
            loginError.style.display = 'none';
            return;
        }

        // API login failed
        loginError.style.display = 'block';
        loginErrorMessage.textContent = 'Invalid username or password';
    })();
});

// ============================================
// Forgot Password Functionality
// ============================================
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const closeForgotModal = document.getElementById('closeForgotModal');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const forgotPasswordMessage = document.getElementById('forgotPasswordMessage');

forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    forgotPasswordModal.classList.add('admin-modal--active');
});

closeForgotModal.addEventListener('click', () => {
    forgotPasswordModal.classList.remove('admin-modal--active');
    forgotPasswordForm.reset();
    forgotPasswordMessage.style.display = 'none';
});

forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('forgotUsername').value.trim();
    const email = document.getElementById('forgotEmail').value.trim();
    try {
        const res = await forgotPassword({ username, email });
        forgotPasswordMessage.style.display = 'block';
        forgotPasswordMessage.className = 'admin-modal__message admin-modal__message--success';
        // For this scaffold, server returns a token for convenience; do not expose in production.
        if (res && res.token) {
            forgotPasswordMessage.textContent = `Password reset token generated (for demo): ${res.token}`;
        } else {
            forgotPasswordMessage.textContent = 'If the account exists, password reset instructions have been issued.';
        }
    } catch (err) {
        forgotPasswordMessage.style.display = 'block';
        forgotPasswordMessage.className = 'admin-modal__message admin-modal__message--error';
        forgotPasswordMessage.textContent = 'Failed to request password reset.';
    }
});

// ============================================
// Change Password Functionality
// ============================================
const changePasswordLink = document.getElementById('changePasswordLink');
const closeChangeModal = document.getElementById('closeChangeModal');
const changePasswordForm = document.getElementById('changePasswordForm');
const changePasswordMessage = document.getElementById('changePasswordMessage');

changePasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    changePasswordModal.classList.add('admin-modal--active');
});

closeChangeModal.addEventListener('click', () => {
    changePasswordModal.classList.remove('admin-modal--active');
    changePasswordForm.reset();
    changePasswordMessage.style.display = 'none';
});

changePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (newPassword !== confirmPassword) {
        changePasswordMessage.style.display = 'block';
        changePasswordMessage.className = 'admin-modal__message admin-modal__message--error';
        changePasswordMessage.textContent = 'New passwords do not match.';
        return;
    }

    if (newPassword.length < 6) {
        changePasswordMessage.style.display = 'block';
        changePasswordMessage.className = 'admin-modal__message admin-modal__message--error';
        changePasswordMessage.textContent = 'Password must be at least 6 characters long.';
        return;
    }

    try {
        const res = await changePassword({ currentPassword, newPassword });
        if (res && res.ok) {
            changePasswordMessage.style.display = 'block';
            changePasswordMessage.className = 'admin-modal__message admin-modal__message--success';
            changePasswordMessage.textContent = 'Password changed successfully.';
            setTimeout(() => {
                changePasswordModal.classList.remove('admin-modal--active');
                changePasswordForm.reset();
                changePasswordMessage.style.display = 'none';
            }, 1500);
        } else {
            throw new Error(res && res.message ? res.message : 'Failed');
        }
    } catch (err) {
        changePasswordMessage.style.display = 'block';
        changePasswordMessage.className = 'admin-modal__message admin-modal__message--error';
        changePasswordMessage.textContent = `Password change failed: ${err.message}`;
    }
});

// ============================================
// Dashboard Functionality
// ============================================
let adminDashboardInstance = null;

function showDashboard() {
    adminLogin.style.display = 'none';
    adminDashboard.style.display = 'block';
    
    // Initialize AdminDashboard component
    adminDashboardInstance = new AdminDashboard();
    window.adminDashboard = adminDashboardInstance; // Make available globally for onclick handlers
    
    const username = sessionStorage.getItem('admin_username');
    if (username) {
        document.getElementById('adminUserDisplay').textContent = `Welcome, ${username}`;
    }
}

function hideDashboard() {
    adminDashboard.style.display = 'none';
    adminLogin.style.display = 'flex';
    loginForm.reset();
    loginError.style.display = 'none';
}

// ============================================
// Customer Modal Functions (Global for onclick handlers)
// ============================================
window.editCustomer = function(customerId) {
    // customerId here may be either the backend _id or the legacy customerId
    (async () => {
        // Try to resolve from API first
        let customer = null;
        try {
            const list = await listRemedies(customerId);
            if (Array.isArray(list) && list.length > 0) customer = list.find(c => c.customerId === customerId) || list[0];
        } catch (err) {
            // ignore
        }

        if (!customer) {
            customer = findCustomerById(customerId);
        }

        if (!customer) return;

        document.getElementById('customerModalTitle').textContent = 'Edit Customer';
        // store backend id in editCustomerId if present
        document.getElementById('editCustomerId').value = customer._id || customer.customerId;
        document.getElementById('customerId').value = customer.customerId || customer.customerId;
        document.getElementById('customerId').disabled = true;
        document.getElementById('customerName').value = customer.name || customer.customerName;
        document.getElementById('customerDob').value = customer.dob || '';
        const remedies = customer.remedies || [customer.remedy1, customer.remedy2, customer.remedy3, customer.remedy4, customer.remedy5];
        document.getElementById('remedy1').value = remedies[0] || '';
        document.getElementById('remedy2').value = remedies[1] || '';
        document.getElementById('remedy3').value = remedies[2] || '';
        document.getElementById('remedy4').value = remedies[3] || '';
        document.getElementById('remedy5').value = remedies[4] || '';

        customerModal.classList.add('admin-modal--active');
    })();
};

window.confirmDeleteCustomer = function(customerId) {
    // allow deleting via API id or customerId
    deleteModal.dataset.customerId = customerId;
    deleteModal.classList.add('admin-modal--active');
};

// ============================================
// Add/Edit Customer Modal
// ============================================
const addCustomerBtn = document.getElementById('addCustomerBtn');
const closeCustomerModal = document.getElementById('closeCustomerModal');
const cancelCustomerBtn = document.getElementById('cancelCustomerBtn');
const customerForm = document.getElementById('customerForm');

addCustomerBtn.addEventListener('click', () => {
    document.getElementById('customerModalTitle').textContent = 'Add New Customer';
    document.getElementById('editCustomerId').value = '';
    customerForm.reset();
    document.getElementById('customerId').disabled = false;
    customerModal.classList.add('admin-modal--active');
});

closeCustomerModal.addEventListener('click', () => {
    customerModal.classList.remove('admin-modal--active');
    customerForm.reset();
    document.getElementById('customerId').disabled = false;
});

cancelCustomerBtn.addEventListener('click', () => {
    customerModal.classList.remove('admin-modal--active');
    customerForm.reset();
    document.getElementById('customerId').disabled = false;
});

customerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const editId = document.getElementById('editCustomerId').value;
    const customerId = document.getElementById('customerId').value.trim();
    const customerName = document.getElementById('customerName').value.trim();
    const dob = document.getElementById('customerDob').value.trim();
    
    // Validate DOB format (MMDDYY)
    if (!/^\d{6}$/.test(dob)) {
        alert('Date of Birth must be in MMDDYY format (e.g., 011590)');
        return;
    }
    
    const customerData = {
        customerId: customerId,
        name: customerName,
        customerName: customerName, // Backward compatibility
        dob: dob,
        remedy1: document.getElementById('remedy1').value.trim(),
        remedy2: document.getElementById('remedy2').value.trim(),
        remedy3: document.getElementById('remedy3').value.trim(),
        remedy4: document.getElementById('remedy4').value.trim(),
        remedy5: document.getElementById('remedy5').value.trim()
    };
    
    (async () => {
        try {
            if (editId) {
                // update by backend id if looks like an ObjectId
                const payload = {
                    customerId,
                    name: customerName,
                    dob,
                    remedies: [
                        document.getElementById('remedy1').value.trim(),
                        document.getElementById('remedy2').value.trim(),
                        document.getElementById('remedy3').value.trim(),
                        document.getElementById('remedy4').value.trim(),
                        document.getElementById('remedy5').value.trim()
                    ].filter(r => r)
                };

                // try API update
                try {
                    await updateRemedy(editId, payload);
                    alert('Customer updated successfully!');
                } catch (apiErr) {
                    console.error('Update failed:', apiErr.message);
                    alert('Error updating customer.');
                }
            } else {
                // create
                const payload = {
                    customerId,
                    name: customerName,
                    dob,
                    remedies: [
                        document.getElementById('remedy1').value.trim(),
                        document.getElementById('remedy2').value.trim(),
                        document.getElementById('remedy3').value.trim(),
                        document.getElementById('remedy4').value.trim(),
                        document.getElementById('remedy5').value.trim()
                    ].filter(r => r)
                };

                try {
                    await createRemedy(payload);
                    alert('Customer added successfully!');
                } catch (apiErr) {
                    console.error('Create failed:', apiErr.message);
                    alert('Error creating customer.');
                }
            }

            customerModal.classList.remove('admin-modal--active');
            customerForm.reset();
            if (adminDashboardInstance) {
                adminDashboardInstance.updateStats();
                adminDashboardInstance.renderCustomersTable();
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred while saving customer');
        }
    })();
});

// ============================================
// Delete Customer Modal
// ============================================
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

closeDeleteModal.addEventListener('click', () => {
    deleteModal.classList.remove('admin-modal--active');
});

cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.classList.remove('admin-modal--active');
});

confirmDeleteBtn.addEventListener('click', () => {
    const customerId = deleteModal.dataset.customerId;
    if (customerId) {
        (async () => {
            try {
                await deleteRemedy(customerId);
                alert('Customer deleted successfully!');
            } catch (apiErr) {
                console.error('Delete failed:', apiErr.message);
                alert('Error deleting customer.');
            }
            deleteModal.classList.remove('admin-modal--active');
            if (adminDashboardInstance) {
                adminDashboardInstance.updateStats();
                adminDashboardInstance.renderCustomersTable();
            }
        })();
    }
});

// ============================================
// Initialize on Page Load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in via session token
    if (isAdminLoggedIn()) {
        showDashboard();
    } else {
        hideDashboard();
    }
    
    // Close modals when clicking overlay
    document.querySelectorAll('.admin-modal__overlay').forEach(overlay => {
        overlay.addEventListener('click', function() {
            this.closest('.admin-modal').classList.remove('admin-modal--active');
        });
    });
    
    console.log('Admin Panel initialized');
});
