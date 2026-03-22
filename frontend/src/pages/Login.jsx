import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#020817' }}>
      <div style={{ width:'100%', maxWidth:400, padding:24 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:48 }}>🎓</div>
          <h1 style={{ fontSize:28, fontWeight:900, background:'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginTop:8 }}>
            CampusHub
          </h1>
          <p style={{ color:'#64748b', fontSize:14, marginTop:6 }}>Sign in to your account</p>
        </div>

        <div className="card">
          <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {error && <div style={{ background:'#ef444422', border:'1px solid #ef444444', borderRadius:8, padding:'10px 14px', color:'#ef4444', fontSize:13 }}>{error}</div>}
            <div>
              <label style={{ display:'block', fontSize:12, color:'#94a3b8', marginBottom:6 }}>Email</label>
              <input type="email" placeholder="you@college.edu" value={form.email} onChange={e => setForm(p=>({...p, email:e.target.value}))} required />
            </div>
            <div>
              <label style={{ display:'block', fontSize:12, color:'#94a3b8', marginBottom:6 }}>Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p=>({...p, password:e.target.value}))} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop:8 }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
        <p style={{ textAlign:'center', marginTop:16, fontSize:13, color:'#64748b' }}>
          No account? <Link to="/register" style={{ color:'#a78bfa', fontWeight:600 }}>Register here</Link>
        </p>
      </div>
    </div>
  )
}
