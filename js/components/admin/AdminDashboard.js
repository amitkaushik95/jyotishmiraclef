/**
 * Admin Dashboard Component
 * Enhanced admin panel with search functionality
 */

import {
    addCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    isAdminLoggedIn,
    setAdminLoggedIn
} from '../../utils/storage.js';

import { listRemedies } from '../../utils/api.js';

export class AdminDashboard {
    constructor() {
        this.customersTableBody = null;
        this.searchInput = null;
        this.customers = [];
        this.init();
    }

    init() {
        // Check authentication
        if (!isAdminLoggedIn()) {
            window.location.href = 'admin.html';
            return;
        }

        this.customersTableBody = document.getElementById('customersTableBody');
        this.searchInput = document.getElementById('searchCustomers');
        
        this.updateStats();
        this.loadAndRender();
        this.setupSearch();
        this.setupEventListeners();
    }

    async loadAndRender() {
        try {
            const list = await listRemedies();
            this.customers = Array.isArray(list) ? list : [];
            this.renderCustomersTable();
            this.updateStats();
        } catch (err) {
            console.error('Failed to fetch customers:', err.message);
            this.customers = [];
            this.renderCustomersTable();
            this.updateStats();
        }
    }

    setupSearch() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length > 0) {
                    // try API search first
                    (async () => {
                        try {
                            const results = await listRemedies(query);
                            this.renderCustomersTable(results);
                        } catch (err) {
                            const results = await searchCustomers(query);
                            this.renderCustomersTable(Array.isArray(results) ? results : []);
                        }
                    })();
                } else {
                    this.renderCustomersTable();
                }
            });
        }
    }

    setupEventListeners() {
        // Add customer button
        const addBtn = document.getElementById('addCustomerBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddCustomerModal());
        }

        // Export data button
        const exportBtn = document.getElementById('exportDataBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                setAdminLoggedIn(false);
                window.location.href = 'admin.html';
            });
        }
    }

    updateStats() {
        const database = this.customers || [];
        const totalCustomers = database.length;
        const totalRemedies = database.reduce((count, customer) => {
            const remedies = customer.remedies || [
                customer.remedy1,
                customer.remedy2,
                customer.remedy3,
                customer.remedy4,
                customer.remedy5
            ].filter(r => r && r.trim());
            return count + remedies.length;
        }, 0);

        const totalCustomersEl = document.getElementById('totalCustomers');
        const totalRemediesEl = document.getElementById('totalRemedies');

        if (totalCustomersEl) totalCustomersEl.textContent = totalCustomers;
        if (totalRemediesEl) totalRemediesEl.textContent = totalRemedies;
    }

    renderCustomersTable(customers = null) {
        if (!this.customersTableBody) return;

        const database = customers ?? this.customers ?? [];
        
        if (database.length === 0) {
            this.customersTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px; color: var(--color-gray);">
                        No customers found. Click "Add New Customer" to get started.
                    </td>
                </tr>
            `;
            return;
        }
        
        this.customersTableBody.innerHTML = database.map(customer => {
            const remedies = customer.remedies || [
                customer.remedy1,
                customer.remedy2,
                customer.remedy3,
                customer.remedy4,
                customer.remedy5
            ].filter(r => r && r.trim());
            
            const remedyCount = remedies.length;
            
            return `
                <tr>
                    <td><strong>${customer.customerId}</strong></td>
                    <td>${customer.name || customer.customerName}</td>
                    <td>${customer.dob}</td>
                    <td>
                        <span class="admin-table__remedies-count">${remedyCount} Remedy${remedyCount !== 1 ? 'ies' : ''}</span>
                    </td>
                    <td>
                        <div class="admin-table__actions">
                            <button class="admin-table__btn admin-table__btn--edit" onclick="window.adminDashboard.editCustomer('${(customer.customerId || '').replace(/'/g, "\\'")}')">
                                Edit
                            </button>
                            <button class="admin-table__btn admin-table__btn--delete" onclick="window.adminDashboard.confirmDeleteCustomer('${(customer.customerId || '').replace(/'/g, "\\'")}', '${(customer._id || '').toString().replace(/'/g, "\\'")}')">
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    editCustomer(customerId) {
        // This will be handled by the admin.html page's existing modal system
        if (window.editCustomer) {
            window.editCustomer(customerId);
        }
    }

    confirmDeleteCustomer(customerId) {
        // This will be handled by the admin.html page's existing modal system
        if (window.confirmDeleteCustomer) {
            window.confirmDeleteCustomer(customerId);
        }
    }

    showAddCustomerModal() {
        // This will be handled by the admin.html page's existing modal system
        const addBtn = document.getElementById('addCustomerBtn');
        if (addBtn) {
            addBtn.click();
        }
    }

    exportData() {
        const database = this.customers || [];
        const dataStr = JSON.stringify(database, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `remedies-database-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}
