import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export async function listRemedies(q) {
  const url = `${API_BASE}/api/remedies${q ? '?q=' + encodeURIComponent(q) : ''}`
  const res = await axios.get(url)
  return res.data
}

export async function login(creds) {
  const res = await axios.post(`${API_BASE}/api/auth/login`, creds)
  return res.data
}
