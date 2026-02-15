/**
 * Simple API client to communicate with Phase2 backend
 */

function getApiBase() {
  if (typeof window === 'undefined') return 'http://localhost:5000';
  const explicit = window.JYOTISH_API_BASE;
  if (explicit !== undefined && explicit !== null && String(explicit).trim() !== '') {
    return String(explicit).replace(/\/$/, '');
  }
  try {
    if (window.location && window.location.port === '5000') return '';
  } catch (e) {}
  return 'http://localhost:5000';
}

export async function fetchRemediesByQuery(q) {
  const API_BASE = getApiBase();
  const url = `${API_BASE}/api/remedies${q ? '?q=' + encodeURIComponent(q) : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network response was not ok');
  const data = await res.json();
  return data;
}

/** Returns { success: true, token } or { success: false, error: 'network'|'invalid', message? } */
export async function loginAdmin(creds) {
  const API_BASE = getApiBase();
  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds)
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return { success: true, token: data.token };
    return { success: false, error: 'invalid', message: data.message || 'Invalid credentials' };
  } catch (err) {
    console.warn('Login failed:', err.message);
    return { success: false, error: 'network', message: err.message || 'Cannot reach server. Is the backend running on port 5000?' };
  }
}

export async function forgotPassword(payload) {
  const API_BASE = getApiBase();
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
  const API_BASE = getApiBase();
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
  const API_BASE = getApiBase();
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
  const API_BASE = getApiBase();
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
  const API_BASE = getApiBase();
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
  const API_BASE = getApiBase();
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
  const API_BASE = getApiBase();
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
}

/** Submit consultation request (saves to MongoDB) */
export async function submitConsultation(data) {
  const API_BASE = getApiBase();
  const res = await fetch(`${API_BASE}/api/consultations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      dob: data.dob,
      time: data.time,
      place: data.place,
      mobile: data.mobile,
      email: data.email,
      query: data.query
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to submit consultation');
  }
  return await res.json();
}
