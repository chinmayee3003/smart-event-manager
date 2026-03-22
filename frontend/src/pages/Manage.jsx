import { useEffect, useState } from 'react'
import { apiGetEvents, apiCreateEvent, apiDeleteEvent } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Badge from '../components/Badge'

const EMPTY = { title: '', description: '', category: 'Technology', date: '', time: '', venue: '', capacity: 100, image_emoji: '📅', tags: '' }
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export default function Manage({ showToast }) {
  const { user } = useAuth()
  const [events, setEvents]     = useState([])
  const [form, setForm]         = useState(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)

  useEffect(() => {
    apiGetEvents()
      .then(evs => setEvents(user.role === 'admin' ? evs : evs.filter(e => e.organizer_id === user.id)))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), capacity: Number(form.capacity) }
      const created = await apiCreateEvent(payload)
      setEvents(p => [created, ...p])
      setForm(EMPTY); setShowForm(false)
      showToast('✅ Event created!')
    } catch (err) { showToast(err.message, 'error') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return
    try {
      await apiDeleteEvent(id)
      setEvents(p => p.filter(e => e.id !== id))
      showToast('Event deleted.')
    } catch (err) { showToast(err.message, 'error') }
  }

  if (loading) return <div className="spinner-wrap"><div className="spinner"/></div>

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Events</h1>
          <p className="page-subtitle">{events.length} events</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ Create Event'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>New Event</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="grid-2">
              <div className="form-group">
                <label>Event Title *</label>
                <input className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ cursor: 'pointer' }}>
                  {['Technology','Cultural','Business','Sports','Workshop','Academic'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input className="input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input className="input" type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Venue *</label>
                <input className="input" value={form.venue} onChange={e => setForm(p => ({ ...p, venue: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input className="input" type="number" min={1} value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Emoji Icon</label>
                <input className="input" value={form.image_emoji} onChange={e => setForm(p => ({ ...p, image_emoji: e.target.value }))} placeholder="📅" />
              </div>
              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input className="input" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="AI, Hackathon, Tech" />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="input" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ resize: 'vertical' }} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving} style={{ alignSelf: 'flex-start' }}>
              {saving ? 'Creating…' : 'Create Event'}
            </button>
          </form>
        </div>
      )}

      {/* Events list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {events.length === 0
          ? <div className="empty"><div className="empty-icon">📋</div><p>No events yet. Create one above!</p></div>
          : events.map(e => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: '14px 18px' }}>
                <span style={{ fontSize: 24 }}>{e.image_emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{e.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{fmtDate(e.date)} · {e.venue} · {e.registered}/{e.capacity} registered</div>
                </div>
                {e.category && <Badge label={e.category} />}
                <button className="btn btn-danger" onClick={() => handleDelete(e.id)}>Delete</button>
              </div>
            ))
        }
      </div>
    </>
  )
}
