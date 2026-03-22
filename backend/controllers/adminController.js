const pool = require('../config/db');

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM users WHERE role='student') AS total_students,
        (SELECT COUNT(*) FROM users WHERE role='organizer') AS total_organizers,
        (SELECT COUNT(*) FROM events) AS total_events,
        (SELECT COUNT(*) FROM events WHERE status='upcoming') AS upcoming_events,
        (SELECT COUNT(*) FROM registrations) AS total_registrations
    `);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.email, u.role, u.created_at,
        (SELECT COUNT(*) FROM registrations r WHERE r.user_id=u.id) AS registrations_count
      FROM users u ORDER BY u.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
  const { role } = req.body;
  const validRoles = ['student', 'organizer', 'admin'];
  if (!validRoles.includes(role))
    return res.status(400).json({ message: 'Invalid role' });
  try {
    const result = await pool.query(
      'UPDATE users SET role=$1 WHERE id=$2 RETURNING id,name,email,role',
      [role, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/registrations
const getAllRegistrations = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id, u.name AS user_name, u.email, e.title AS event_title,
        e.date, e.venue, r.created_at
      FROM registrations r
      JOIN users u ON r.user_id=u.id
      JOIN events e ON r.event_id=e.id
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats, getAllUsers, updateUserRole, deleteUser, getAllRegistrations };
