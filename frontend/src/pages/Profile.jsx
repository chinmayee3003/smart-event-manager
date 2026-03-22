import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiUpdateProfile } from '../services/api'

export default function Profile({ showToast }) {
  const { user, login } = useAuth()
  const [name, setName]     = useState(user?.name || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const updated = await apiUpdateProfile({ name })
      login({ ...user, name: updated.name }, localStorage.getItem('token'))
      showToast('✅ Profile updated!')
    } catch (err) { showToast(err.message, 'error') }
    finally { setSaving(false) }
  }

  const roleColor = { student: '#6366f1', organizer: '#10b981', admin: '#ef4444' }
  const color = roleColor[user?.role] || '#6366f1'

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
      </div>

      <div style={{ maxWidth: 480 }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: `${color}22`, border: `2px solid ${color}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 900, color,
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{user?.name}</div>
              <div style={{ fontSize: 12, color, textTransform: 'capitalize', marginTop: 2 }}>{user?.role}</div>
            </div>
          </div>

          {/* Read-only info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-group">
              <label>Email</label>
              <input className="input" value={user?.email} disabled style={{ opacity: 0.6 }} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input className="input" value={user?.role} disabled style={{ opacity: 0.6, textTransform: 'capitalize' }} />
            </div>
          </div>

          {/* Editable */}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label>Display Name</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving} style={{ alignSelf: 'flex-start' }}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
