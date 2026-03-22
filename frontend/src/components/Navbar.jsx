import { useAuth } from '../context/AuthContext'

export default function Navbar({ title }) {
  const { user } = useAuth()
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
      <h1 style={{ margin:0, fontSize:20, fontWeight:700, color:'#f1f5f9' }}>{title}</h1>
      <div style={{ fontSize:13, color:'#94a3b8', textTransform:'capitalize' }}>
        {user?.name} · {user?.role}
      </div>
    </div>
  )
}
