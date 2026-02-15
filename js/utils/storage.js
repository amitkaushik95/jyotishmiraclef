/**
 * Storage adapter — API-backed implementation
 * Exposes the same function names used across the app but performs
 * network calls to the Phase2 backend. Functions return Promises.
 */

import { listRemedies, createRemedy, updateRemedy, deleteRemedy } from './api.js';

// Admin session helpers (use sessionStorage for token/username)
export function isAdminLoggedIn() {
  return !!sessionStorage.getItem('admin_token');
}

export function setAdminLoggedIn(status, username = null) {
  if (status) {
    if (username) sessionStorage.setItem('admin_username', username);
  } else {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_username');
  }
}

// No-op initializer (kept for compatibility)
export function initRemediesDatabase() {
  return Promise.resolve();
}

// List all remedies/customers (wraps API list)
export async function getRemediesDatabase() {
  const list = await listRemedies();
  return Array.isArray(list) ? list : [];
}

// Find by customerId (tries API search)
export async function findCustomerById(customerId) {
  if (!customerId) return null;
  const list = await listRemedies(customerId);
  if (!Array.isArray(list)) return null;
  // Try to match exact customerId first
  const exact = list.find(c => c.customerId === customerId || c._id === customerId);
  return exact || list[0] || null;
}

// Create customer/remedy
export async function addCustomer(customerData) {
  return await createRemedy(customerData);
}

// Update by id or by customerId (resolve to _id)
export async function updateCustomer(idOrCustomerId, data) {
  try {
    // attempt direct update (id)
    return await updateRemedy(idOrCustomerId, data);
  } catch (err) {
    // resolve by searching customerId
    const found = await findCustomerById(idOrCustomerId);
    if (!found) throw err;
    return await updateRemedy(found._id, data);
  }
}

export async function deleteCustomer(idOrCustomerId) {
  try {
    return await deleteRemedy(idOrCustomerId);
  } catch (err) {
    const found = await findCustomerById(idOrCustomerId);
    if (!found) throw err;
    return await deleteRemedy(found._id);
  }
}

export async function searchCustomers(query) {
  if (!query) return [];
  const list = await listRemedies(query);
  return Array.isArray(list) ? list : [];
}

// Admin credential helpers removed — auth is handled by backend. Provide
// a small shim for updateAdminPassword to indicate it's not available.
export function initAdminCredentials() {
  // no local admin credentials anymore
  return Promise.resolve();
}

export function getAdminCredentials() {
  return null;
}

export function updateAdminPassword() {
  throw new Error('updateAdminPassword: use backend API (not implemented)');
}

export default {
  isAdminLoggedIn,
  setAdminLoggedIn,
  initRemediesDatabase,
  getRemediesDatabase,
  findCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers
};
