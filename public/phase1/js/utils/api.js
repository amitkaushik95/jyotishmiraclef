/**
 * Simple API client to communicate with Phase2 backend
 */

const API_BASE = (window.JYOTISH_API_BASE || 'http://localhost:5000').replace(/\/$/, '');

export async function fetchRemediesByQuery(q) {
  try {
    const url = `${API_BASE}/api/remedies${q ? '?q=' + encodeURIComponent(q) : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('API fetch failed:', err.message);
    throw err;
  }
}

export async function loginAdmin(creds) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Login failed:', err.message);
    return null;
  }

}

export async function forgotPassword(payload) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/forgot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.warn('forgotPassword failed:', err.message);
    throw err;
  }
}

export async function resetPassword(payload) {
  try {
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.warn('resetPassword failed:', err.message);
    throw err;
  }
}

export async function changePassword(payload) {
  try {
    const token = sessionStorage.getItem('admin_token');
    const res = await fetch(`${API_BASE}/api/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.warn('changePassword failed:', err.message);
    throw err;
  }
}

function authHeaders(token) {
  const t = token || sessionStorage.getItem('admin_token');
  return t ? { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export async function listRemedies(q) {
  try {
    const url = `${API_BASE}/api/remedies${q ? '?q=' + encodeURIComponent(q) : ''}`;
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to list remedies');
    return await res.json();
  } catch (err) {
    console.warn('listRemedies error:', err.message);
    throw err;
  }
}

export async function createRemedy(data) {
  try {
    const res = await fetch(`${API_BASE}/api/remedies`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Create failed');
    return await res.json();
  } catch (err) {
    console.warn('createRemedy error:', err.message);
    throw err;
  }
}

export async function updateRemedy(id, data) {
  try {
    const res = await fetch(`${API_BASE}/api/remedies/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Update failed');
    return await res.json();
  } catch (err) {
    console.warn('updateRemedy error:', err.message);
    throw err;
  }
}

export async function deleteRemedy(id) {
  try {
    const res = await fetch(`${API_BASE}/api/remedies/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Delete failed');
    return await res.json();
  } catch (err) {
    console.warn('deleteRemedy error:', err.message);
    throw err;
  }

