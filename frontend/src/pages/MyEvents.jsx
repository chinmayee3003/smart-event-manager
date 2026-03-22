import { useEffect, useState } from 'react'
import { userAPI } from '../services/api'
import EventCard from '../components/EventCard'
import Navbar from '../components/Navbar'

export default function MyEvents({ showToast }) {
  const [regs, setRegs]     = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    userAPI.dashboard()
      .then(d => setRegs(d.registrations))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  return (
    <div className="page">
      <Navbar title="My Events" />
      <p className="page-sub">All events you have registered for.</p>

      {loading
        ? <div style={{ textAlign:'center', color:'#64748b', padding:60 }}>Loading…</div>
        : regs.length === 0
          ? <div className="empty-state">
              <div className="icon">🎫</div>
              <p>You haven't registered for any events yet.</p>
            </div>
          : <div className="grid-2">
              {regs.map(e => (
                <EventCard key={e.id} event={e} isRegistered={true} onRegisterChange={load} showToast={showToast} />
              ))}
            </div>
      }
    </div>
  )
}
