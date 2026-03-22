const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, role = 'student' } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (exists.rows.length) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id,name,email,role',
      [name, email, hashed, role]
    );
    const user = result.rows[0];
    res.status(201).json({ user, token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });

    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser, token: generateToken(safeUser) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
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

module.exports = { register, login, getMe };
