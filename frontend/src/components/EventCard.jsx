import { useState } from 'react'
import { eventsAPI } from '../services/api'
import Badge from './Badge'

const CAT_COLORS = {
  Technology:'#6366f1', Cultural:'#f59e0b', Business:'#10b981',
  Sports:'#ef4444', Workshop:'#8b5cf6', Academic:'#3b82f6',
}

const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })

export default function EventCard({ event, isRegistered, onRegisterChange, showToast }) {
  const [loading, setLoading] = useState(false)
  const color  = CAT_COLORS[event.category] || '#6366f1'
  const total  = parseInt(event.registered) || 0
  const pct    = Math.round((total / event.capacity) * 100)
  const isFull = total >= event.capacity
  const isDone = event.status === 'completed'
  const barColor = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#10b981'

  const handleRegister = async () => {
    setLoading(true)
    try {
      if (isRegistered) {
        await eventsAPI.unregister(event.id)
        showToast?.('Unregistered successfully')
      } else {
        await eventsAPI.register(event.id)
        showToast?.(`✅ Registered for "${event.title}"!`)
      }
      onRegisterChange?.()
    } catch (err) {
      showToast?.(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: 'linear-gradient(145deg,#0f172a,#1e293b)',
      border: '1px solid #1e293b', borderRadius: 16, padding: 22,
      display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 12px 40px ${color}22` }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
    >
      <div style={{ position:'absolute', top:0, right:0, width:120, height:120, background:`radial-gradient(circle,${color}18 0%,transparent 70%)`, pointerEvents:'none' }} />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <span style={{ fontSize: 36 }}>{event.image_emoji || '📅'}</span>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', justifyContent:'flex-end' }}>
          <Badge label={event.category} color={color} />
          {isDone && <Badge label="Completed" color="#64748b" />}
          {isFull && !isDone && <Badge label="Full" color="#ef4444" />}
        </div>
      </div>

      <div>
        <h3 style={{ margin:0, fontSize:17, fontWeight:800, color:'#f1f5f9' }}>{event.title}</h3>
        <p style={{ margin:'6px 0 0', fontSize:13, color:'#94a3b8', lineHeight:1.5 }}>{event.description}</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, fontSize:12, color:'#94a3b8' }}>
        {[['📅', fmtDate(event.date)], ['⏰', event.time], ['📍', event.venue], ['👤', event.organizer_name]].map(([icon, val]) => (
          <div key={val} style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span>{icon}</span><span>{val || '—'}</span>
          </div>
        ))}
      </div>

      {event.tags?.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
          {event.tags.map(t => (
            <span key={t} style={{ background:'#0f172a', color:'#64748b', border:'1px solid #334155', borderRadius:6, padding:'2px 8px', fontSize:11 }}>#{t}</span>
          ))}
        </div>
      )}

      <div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'#94a3b8', marginBottom:4 }}>
          <span>{total}/{event.capacity} registered</span>
          <span style={{ color:barColor, fontWeight:700 }}>{pct}%</span>
        </div>
        <div style={{ height:5, background:'#1e293b', borderRadius:99 }}>
          <div style={{ height:'100%', width:`${pct}%`, background:barColor, borderRadius:99, transition:'width 0.6s ease' }} />
        </div>
      </div>

      <button
        onClick={handleRegister}
        disabled={isFull || isDone || loading}
        className="btn"
        style={{
          background: isRegistered ? '#10b98122' : isDone || isFull ? '#1e293b' : `linear-gradient(135deg,${color},${color}99)`,
          color: isRegistered ? '#10b981' : isDone || isFull ? '#475569' : '#fff',
          cursor: isFull || isDone ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Please wait…' : isRegistered ? '✓ Registered — click to cancel' : isDone ? 'Event Ended' : isFull ? 'Fully Booked' : 'Register Now →'}
      </button>
    </div>
  )
}
