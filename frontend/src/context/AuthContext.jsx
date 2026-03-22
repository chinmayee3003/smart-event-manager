import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authAPI.me()
        .then(setUser)
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const data = await authAPI.login({ email, password })
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  const register = async (name, email, password, role) => {
    const data = await authAPI.register({ name, email, password, role })
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#020817', color:'#94a3b8', fontSize:14 }}>
      Loading CampusHub...
    </div>
  )

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
