import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'
import { userAPI } from '../services/api'
import Navbar from '../components/Navbar'

const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })

export default function Dashboard() {
  const { user } = useAuth()
  const { events } = useEvents()
  const [dash, setDash] = useState(null)

  useEffect(() => {
    userAPI.dashboard().then(setDash).catch(console.error)
  }, [])

  const upcoming = events.filter(e => e.status === 'upcoming').length

  return (
    <div className="page">
      <Navbar title="Dashboard" />

      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontSize:26, fontWeight:900, marginBottom:4 }}>Welcome back, {user?.name}! 👋</h2>
        <p style={{ color:'#64748b', fontSize:14 }}>Here's what's happening on campus.</p>
      </div>

      <div className="grid-4" style={{ marginBottom:28 }}>
        {[
          { label:'Upcoming Events',   value: upcoming,                          color:'#6366f1', icon:'📅' },
          { label:'My Registrations',  value: dash?.stats?.total_registered||0,  color:'#10b981', icon:'🎫' },
          { label:'Events Attended',   value: dash?.stats?.attended_count||0,    color:'#f59e0b', icon:'✅' },
          { label:'Upcoming for me',   value: dash?.stats?.upcoming_count||0,    color:'#a78bfa', icon:'🔔' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ background:`${s.color}15`, border:`1px solid ${s.color}33` }}>
            <div style={{ fontSize:28 }}>{s.icon}</div>
            <div style={{ fontSize:32, fontWeight:900, color:s.color, marginTop:8 }}>{s.value}</div>
            <div style={{ fontSize:12, color:'#64748b', marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>🔔 My Upcoming Events</h3>
        {!dash?.registrations?.filter(e=>e.status==='upcoming').length
          ? <div className="empty-state" style={{ padding:'40px 20px' }}>
              <div className="icon">🎫</div>
              <p>You haven't registered for any events yet.</p>
            </div>
          : dash.registrations.filter(e=>e.status==='upcoming').map(e => (
            <div key={e.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 14px', background:'#1e293b', borderRadius:10, marginBottom:8 }}>
              <span style={{ fontSize:22 }}>{e.image_emoji || '📅'}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600 }}>{e.title}</div>
                <div style={{ fontSize:12, color:'#64748b' }}>{fmtDate(e.date)} · {e.venue}</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
