const pool = require('../config/db');

// GET /api/users/dashboard  — student's personal dashboard
const getDashboard = async (req, res) => {
  try {
    const registrations = await pool.query(`
      SELECT e.*, r.created_at AS registered_at
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.user_id = $1
      ORDER BY e.date ASC
    `, [req.user.id]);

    const stats = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM registrations WHERE user_id=$1) AS total_registered,
        (SELECT COUNT(*) FROM registrations r JOIN events e ON r.event_id=e.id
         WHERE r.user_id=$1 AND e.status='upcoming') AS upcoming_count,
        (SELECT COUNT(*) FROM registrations r JOIN events e ON r.event_id=e.id
         WHERE r.user_id=$1 AND e.status='completed') AS attended_count
    `, [req.user.id]);

    res.json({ registrations: registrations.rows, stats: stats.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id,name,email,role,created_at FROM users WHERE id=$1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name=$1 WHERE id=$2 RETURNING id,name,email,role',
      [name, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboard, getProfile, updateProfile };
