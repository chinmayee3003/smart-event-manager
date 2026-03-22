import { useEffect, useState } from 'react'
import { adminAPI } from '../services/api'
import Navbar from '../components/Navbar'

export default function AdminPanel({ showToast }) {
  const [stats, setStats]   = useState(null)
  const [users, setUsers]   = useState([])
  const [regs, setRegs]     = useState([])
  const [tab, setTab]       = useState('stats')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminAPI.stats(), adminAPI.users(), adminAPI.registrations()])
      .then(([s, u, r]) => { setStats(s); setUsers(u); setRegs(r) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleRole = async (id, role) => {
    try {
      const updated = await adminAPI.updateRole(id, role)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: updated.role } : u))
      showToast?.('Role updated')
    } catch (err) { showToast?.(err.message, 'error') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await adminAPI.deleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      showToast?.('User deleted')
    } catch (err) { showToast?.(err.message, 'error') }
  }

  const TABS = ['stats','users','registrations']

  return (
    <div className="page">
      <Navbar title="Admin Panel" />

      <div style={{ display:'flex', gap:8, marginBottom:24 }}>
        {TABS.map(t => (
          <button key={t} onClick={()=>setTab(t)} className="btn" style={{
            padding:'8px 18px', borderRadius:99, fontSize:13, fontWeight:600,
            background: tab===t ? '#6366f1' : '#1e293b',
            color: tab===t ? '#fff' : '#64748b', textTransform:'capitalize'
          }}>{t}</button>
        ))}
      </div>

      {loading && <div style={{ color:'#64748b', textAlign:'center', padding:60 }}>Loading…</div>}

      {!loading && tab === 'stats' && stats && (
        <div>
          <div className="grid-4" style={{ marginBottom:24 }}>
            {[
              { label:'Total Users',        value:stats.total_users,         color:'#6366f1' },
              { label:'Students',           value:stats.total_students,      color:'#10b981' },
              { label:'Organizers',         value:stats.total_organizers,    color:'#f59e0b' },
              { label:'Total Events',       value:stats.total_events,        color:'#a78bfa' },
              { label:'Upcoming Events',    value:stats.upcoming_events,     color:'#3b82f6' },
              { label:'Total Registrations',value:stats.total_registrations, color:'#ef4444' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ background:`${s.color}15`, border:`1px solid ${s.color}33` }}>
                <div style={{ fontSize:28, fontWeight:900, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:12, color:'#64748b', marginTop:6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && tab === 'users' && (
        <div className="card">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Registrations</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight:600 }}>{u.name}</td>
                  <td style={{ color:'#94a3b8' }}>{u.email}</td>
                  <td>
                    <select value={u.role} onChange={e=>handleRole(u.id, e.target.value)} style={{ width:'auto', padding:'4px 8px', fontSize:12 }}>
                      <option value="student">Student</option>
                      <option value="organizer">Organizer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ textAlign:'center', color:'#94a3b8' }}>{u.registrations_count}</td>
                  <td>
                    <button onClick={()=>handleDelete(u.id)} className="btn btn-danger" style={{ padding:'4px 12px', fontSize:12 }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'registrations' && (
        <div className="card">
          <table>
            <thead><tr><th>Student</th><th>Email</th><th>Event</th><th>Date</th><th>Venue</th></tr></thead>
            <tbody>
              {regs.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight:600 }}>{r.user_name}</td>
                  <td style={{ color:'#94a3b8' }}>{r.email}</td>
                  <td>{r.event_title}</td>
                  <td style={{ color:'#94a3b8' }}>{new Date(r.date).toLocaleDateString()}</td>
                  <td style={{ color:'#94a3b8' }}>{r.venue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
