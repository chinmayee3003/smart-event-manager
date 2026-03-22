const BASE = 'http://localhost:5001/api'

const getToken = () => localStorage.getItem('token')

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
})

const request = async (url, options = {}) => {
  const res = await fetch(`${BASE}${url}`, { ...options, headers: headers() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Something went wrong')
  return data
}

// Auth
export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  me:       ()     => request('/auth/me'),
}

// Events
export const eventsAPI = {
  getAll:     ()       => request('/events'),
  getOne:     (id)     => request(`/events/${id}`),
  create:     (body)   => request('/events',    { method: 'POST',   body: JSON.stringify(body) }),
  update:     (id, b)  => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(b) }),
  delete:     (id)     => request(`/events/${id}`, { method: 'DELETE' }),
  register:   (id)     => request(`/events/${id}/register`,   { method: 'POST' }),
  unregister: (id)     => request(`/events/${id}/register`,   { method: 'DELETE' }),
}

// User
export const userAPI = {
  dashboard:     () => request('/users/dashboard'),
  profile:       () => request('/users/profile'),
  updateProfile: (b) => request('/users/profile', { method: 'PUT', body: JSON.stringify(b) }),
}

// Admin
export const adminAPI = {
  stats:          ()        => request('/admin/stats'),
  users:          ()        => request('/admin/users'),
  updateRole:     (id, role) => request(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  deleteUser:     (id)      => request(`/admin/users/${id}`, { method: 'DELETE' }),
  registrations:  ()        => request('/admin/registrations'),
}
