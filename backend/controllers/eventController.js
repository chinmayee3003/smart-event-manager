const pool = require('../config/db');

// GET /api/events
const getAllEvents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, u.name AS organizer_name,
        (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) AS registered
      FROM events e
      LEFT JOIN users u ON e.organizer_id = u.id
      ORDER BY e.date ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/events/:id
const getEvent = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, u.name AS organizer_name,
        (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) AS registered
      FROM events e
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE e.id = $1
    `, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Event not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/events
const createEvent = async (req, res) => {
  const { title, description, category, date, time, venue, capacity, image_emoji, tags } = req.body;
  if (!title || !date || !venue)
    return res.status(400).json({ message: 'Title, date, and venue are required' });

  try {
    const result = await pool.query(
      `INSERT INTO events (title, description, category, date, time, venue, capacity, image_emoji, tags, organizer_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [title, description, category, date, time, venue, capacity || 100, image_emoji || '📅', tags || [], req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/events/:id
const updateEvent = async (req, res) => {
  const { title, description, category, date, time, venue, capacity, image_emoji, tags, status } = req.body;
  try {
    const check = await pool.query('SELECT organizer_id FROM events WHERE id=$1', [req.params.id]);
    if (!check.rows.length) return res.status(404).json({ message: 'Event not found' });
    if (req.user.role !== 'admin' && check.rows[0].organizer_id !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to edit this event' });

    const result = await pool.query(
      `UPDATE events SET title=$1,description=$2,category=$3,date=$4,time=$5,
       venue=$6,capacity=$7,image_emoji=$8,tags=$9,status=$10 WHERE id=$11 RETURNING *`,
      [title, description, category, date, time, venue, capacity, image_emoji, tags, status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/events/:id
const deleteEvent = async (req, res) => {
  try {
    const check = await pool.query('SELECT organizer_id FROM events WHERE id=$1', [req.params.id]);
    if (!check.rows.length) return res.status(404).json({ message: 'Event not found' });
    if (req.user.role !== 'admin' && check.rows[0].organizer_id !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to delete this event' });

    await pool.query('DELETE FROM events WHERE id=$1', [req.params.id]);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/events/:id/register
const registerForEvent = async (req, res) => {
  try {
    const event = await pool.query(
      `SELECT e.capacity,
        (SELECT COUNT(*) FROM registrations r WHERE r.event_id=e.id) AS registered
       FROM events e WHERE e.id=$1`, [req.params.id]
    );
    if (!event.rows.length) return res.status(404).json({ message: 'Event not found' });
    if (parseInt(event.rows[0].registered) >= event.rows[0].capacity)
      return res.status(400).json({ message: 'Event is fully booked' });

    await pool.query(
      'INSERT INTO registrations (user_id, event_id) VALUES ($1,$2)',
      [req.user.id, req.params.id]
    );
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Already registered for this event' });
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/events/:id/register
const unregisterFromEvent = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM registrations WHERE user_id=$1 AND event_id=$2',
      [req.user.id, req.params.id]
    );
    res.json({ message: 'Unregistered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllEvents, getEvent, createEvent, updateEvent, deleteEvent, registerForEvent, unregisterFromEvent };
