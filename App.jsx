import React, { useEffect, useState } from 'react'
import { listRemedies, login } from './api/remedies'

export default function App() {
  const [remedies, setRemedies] = useState([])
  const [q, setQ] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  useEffect(() => {
    load();
  }, [])

  async function load() {
    const data = await listRemedies();
    setRemedies(data || [])
  }

  async function doLogin(e) {
    e.preventDefault();
    const f = new FormData(e.target);
    const username = f.get('username');
    const password = f.get('password');
    const res = await login({ username, password });
    if (res && res.token) {
      localStorage.setItem('token', res.token);
      setToken(res.token);
      alert('Logged in');
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>JyotishMiracle Phase2 (React)</h1>
      {!token && (
        <form onSubmit={doLogin} style={{ marginBottom: 20 }}>
          <input name="username" placeholder="username" defaultValue="admin" />{' '}
          <input name="password" placeholder="password" defaultValue="admin123" />{' '}
          <button>Login</button>
        </form>
      )}

      <div style={{ marginBottom: 12 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customerId or name" />{' '}
        <button onClick={load}>Refresh</button>
      </div>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Remedies</th>
          </tr>
        </thead>
        <tbody>
          {remedies.map(r => (
            <tr key={r._id}>
              <td>{r.customerId}</td>
              <td>{r.name}</td>
              <td>{(r.remedies || []).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
