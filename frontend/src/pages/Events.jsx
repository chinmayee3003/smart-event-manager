import { useState, useEffect } from 'react'
import { useEvents } from '../context/EventContext'
import { userAPI } from '../services/api'
import EventCard from '../components/EventCard'
import Navbar from '../components/Navbar'

const CATS = ['All','Technology','Cultural','Business','Sports','Workshop','Academic']

export default function Events({ showToast }) {
  const { events, loading, fetchEvents } = useEvents()
  const [cat, setCat]         = useState('All')
  const [search, setSearch]   = useState('')
  const [myRegs, setMyRegs]   = useState([])

  const loadRegs = () => userAPI.dashboard().then(d => setMyRegs(d.registrations.map(e=>e.id))).catch(()=>{})

  useEffect(() => { loadRegs() }, [])

  const filtered = events.filter(e =>
    (cat === 'All' || e.category === cat) &&
    (e.title.toLowerCase().includes(search.toLowerCase()) || (e.description||'').toLowerCase().includes(search.toLowerCase()))
  )

  const handleChange = () => { fetchEvents(); loadRegs() }

  return (
    <div className="page">
      <Navbar title="Browse Events" />

      <div style={{ display:'flex', gap:12, marginBottom:16, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search events…" style={{ flex:1, minWidth:200 }} />
      </div>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
        {CATS.map(c => (
          <button key={c} onClick={()=>setCat(c)} className="btn" style={{
            padding:'6px 16px', borderRadius:99, fontSize:12, fontWeight:600,
            background: cat===c ? '#6366f1' : '#1e293b',
            color: cat===c ? '#fff' : '#64748b',
          }}>{c}</button>
        ))}
      </div>

      {loading
        ? <div style={{ textAlign:'center', color:'#64748b', padding:60 }}>Loading events…</div>
        : filtered.length === 0
          ? <div className="empty-state"><div className="icon">🔍</div><p>No events found</p></div>
          : <div className="grid-2">
              {filtered.map(e => (
                <EventCard key={e.id} event={e} isRegistered={myRegs.includes(e.id)} onRegisterChange={handleChange} showToast={showToast} />
              ))}
            </div>
      }
    </div>
  )
}
