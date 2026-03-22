import { createContext, useContext, useState, useEffect } from 'react'
import { eventsAPI } from '../services/api'

const EventContext = createContext(null)

export const EventProvider = ({ children }) => {
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const data = await eventsAPI.getAll()
      setEvents(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvents() }, [])

  const createEvent = async (body) => {
    const ev = await eventsAPI.create(body)
    setEvents(prev => [...prev, ev])
    return ev
  }

  const updateEvent = async (id, body) => {
    const ev = await eventsAPI.update(id, body)
    setEvents(prev => prev.map(e => e.id === id ? ev : e))
    return ev
  }

  const deleteEvent = async (id) => {
    await eventsAPI.delete(id)
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  return (
    <EventContext.Provider value={{ events, loading, error, fetchEvents, createEvent, updateEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  )
}

export const useEvents = () => useContext(EventContext)
