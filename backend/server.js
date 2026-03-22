const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRoutes    = require('./routes/auth');
const eventRoutes   = require('./routes/events');
const userRoutes    = require('./routes/users');
const adminRoutes   = require('./routes/admin');

const app  = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth',   authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users',  userRoutes);
app.use('/api/admin',  adminRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: '🎓 Smart Campus API is running' }));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
