import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/dashboard', label: 'Dashboard',     icon: '⚡', roles: ['student','organizer','admin'] },
  { to: '/events',    label: 'Events',        icon: '📅', roles: ['student','organizer','admin'] },
  { to: '/my-events', label: 'My Events',     icon: '🎫', roles: ['student','organizer','admin'] },
  { to: '/manage',    label: 'Manage Events', icon: '⚙️', roles: ['organizer','admin'] },
  { to: '/admin',     label: 'Admin Panel',   icon: '🛡️', roles: ['admin'] },
]

const ROLE_ICON = { student: '🎓', organizer: '🗂️', admin: '🛡️' }

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: '#050d1a',
      borderRight: '1px solid #1e293b', padding: '24px 14px',
      display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0,
    }}>
      <div style={{ padding: '0 8px 22px', borderBottom: '1px solid #1e293b', marginBottom: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CampusHub
        </div>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 2, fontFamily: 'monospace' }}>Event Management</div>
      </div>

      {NAV.filter(n => n.roles.includes(user?.role)).map(n => (
        <NavLink key={n.to} to={n.to} style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: isActive ? 'linear-gradient(135deg,#6366f122,#a78bfa11)' : 'transparent',
          color: isActive ? '#a78bfa' : '#64748b',
          fontWeight: isActive ? 700 : 500, fontSize: 13,
          borderLeft: isActive ? '2px solid #a78bfa' : '2px solid transparent',
          transition: 'all 0.15s',
        })}>
          <span>{n.icon}</span>{n.label}
        </NavLink>
      ))}

      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
            {ROLE_ICON[user?.role]}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: '#475569', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', marginTop: 8, fontSize: 13 }}>
          Sign out
        </button>
      </div>
    </aside>
  )
}
