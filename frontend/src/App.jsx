import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import MyEvents from './pages/MyEvents'
import ManageEvents from './pages/ManageEvents'
import AdminPanel from './pages/AdminPanel'
import { useState } from 'react'

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { user } = useAuth()
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*"         element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', maxHeight: '100vh' }}>
        <Routes>
          <Route path="/dashboard"  element={<Dashboard showToast={showToast} />} />
          <Route path="/events"     element={<Events showToast={showToast} />} />
          <Route path="/my-events"  element={<MyEvents />} />
          <Route path="/manage"     element={
            <ProtectedRoute roles={['organizer','admin']}>
              <ManageEvents showToast={showToast} />
            </ProtectedRoute>
          } />
          <Route path="/admin"      element={
            <ProtectedRoute roles={['admin']}>
              <AdminPanel showToast={showToast} />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      {toast && <div className={`toast ${toast.type === 'error' ? 'error' : ''}`}>{toast.msg}</div>}
    </div>
  )
}
