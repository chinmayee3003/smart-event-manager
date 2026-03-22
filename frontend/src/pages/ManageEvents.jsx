import { useState } from 'react'
import { useEvents } from '../context/EventContext'
import Badge from '../components/Badge'
import Navbar from '../components/Navbar'

const CAT_COLORS = { Technology:'#6366f1',Cultural:'#f59e0b',Business:'#10b981',Sports:'#ef4444',Workshop:'#8b5cf6',Academic:'#3b82f6' }
const CATS = ['Technology','Cultural','Business','Sports','Workshop','Academic']
const EMPTY = { title:'', description:'', category:'Technology', date:'', time:'', venue:'', capacity:100, image_emoji:'📅', tags:'' }

export default function ManageEvents({ showToast }) {
  const { events, createEvent, deleteEvent } = useEvents()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [loading, setLoading]   = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createEvent({ ...form, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) })
      showToast?.('✅ Event created successfully!')
      setForm(EMPTY)
      setShowForm(false)
    } catch (err) {
      showToast?.(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return
    try {
      await deleteEvent(id)
      showToast?.('Event deleted')
    } catch (err) {
      showToast?.(err.message, 'error')
    }
  }

  return (
    <div className="page">
      <Navbar title="Manage Events" />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <p style={{ color:'#64748b', fontSize:14 }}>Create and manage your events.</p>
        <button onClick={()=>setShowForm(v=>!v)} className="btn btn-primary">
          {showForm ? '✕ Cancel' : '+ New Event'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom:24 }}>
          <h3 style={{ fontSize:15, fontWeight:700, marginBottom:18 }}>Create New Event</h3>
          <form onSubmit={handleCreate} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div style={{ gridColumn:'1/-1' }}>
              <label style={{ display:'block', fontSize:12, color:'#94a3b8', marginBottom:6 }}>Event Title *</label>
              <input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required placeholder="Tech Fest 2026" />
            </div>
            <div>
              <label style={{ display:'block', fontSize:12, color:'#94a3b8', marginBottom:6 }}>Date *</label>
              <input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} required />
            </div>
            <div>
              <label style={{ display:'block', fontSize:12, color:'#94a3b8', marginBottom:6 }}>Time</label>
              <input type="time" value={form.time} onChange={e=>setForm(p=>({...p,time:e.target.value}))} />
            </div>
            <div>
              <label style={{ display:'block', fontSize:12, color:'#94a3b8', marginBottom:6 }}>Venue *</label>
              <input value={form.venue} onChange={e=>setForm(p=>({...p,venue:e.target.value}))} required placeholder="Main Auditorium" />
            </div>
            <div>
              <label style={{ display:'block', fontSize:12, color:'#94a3b8', marginBottom:6 }}>Capacity</label>
              <input type="number" value={form.capacity} onChange={e=>setForm(p=>({...p,capacity:e.target.value}))} min={1} />
            </div>
            <div>
              <label style={{ display:'block', fontSize:12, color:'#94a3b8', marginBottom:6 }}>Category</label>
              <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                {CATS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontSize:12, color:'#94a3b8', marginBottom:6 }}>Emoji Icon</label>
              <input value={form.image_emoji} onChange={e=>setForm(p=>({...p,image_emoji:e.target.value}))} placeholder="📅" style={{ maxWidth:80 }} />
            </div>
            <div style={{ gridColumn:'1/-1' }}>
              <label style={{ display:'block', fontSize:12, color:'#94a3b8', marginBottom:6 }}>Tags (comma separated)</label>
              <input value={form.tags} onChange={e=>setForm(p=>({...p,tags:e.target.value}))} placeholder="AI, Hackathon, Robotics" />
            </div>
            <div style={{ gridColumn:'1/-1' }}>
              <label style={{ display:'block', fontSize:12, color:'#94a3b8', marginBottom:6 }}>Description</label>
              <textarea rows={3} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="Tell students what this event is about…" style={{ resize:'vertical' }} />
            </div>
            <div style={{ gridColumn:'1/-1' }}>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%' }}>
                {loading ? 'Creating…' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>All Events</h3>
        {events.length === 0
          ? <div className="empty-state" style={{ padding:'40px 20px' }}><div className="icon">📅</div><p>No events yet.</p></div>
          : events.map(e => (
            <div key={e.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 14px', background:'#0f172a', borderRadius:10, marginBottom:8 }}>
              <span style={{ fontSize:22 }}>{e.image_emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600 }}>{e.title}</div>
                <div style={{ fontSize:12, color:'#64748b' }}>{new Date(e.date).toLocaleDateString()} · {e.venue} · {e.registered||0}/{e.capacity} registered</div>
              </div>
              <Badge label={e.category} color={CAT_COLORS[e.category]||'#6366f1'} />
              <button onClick={()=>handleDelete(e.id)} className="btn btn-danger" style={{ padding:'6px 14px', fontSize:12 }}>Delete</button>
            </div>
          ))
        }
      </div>
    </div>
  )
}
