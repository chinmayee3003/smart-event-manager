const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const setup = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(100) NOT NULL,
        email      VARCHAR(150) UNIQUE NOT NULL,
        password   VARCHAR(255) NOT NULL,
        role       VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student','organizer','admin')),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id          SERIAL PRIMARY KEY,
        title       VARCHAR(200) NOT NULL,
        description TEXT,
        category    VARCHAR(50),
        date        DATE NOT NULL,
        time        VARCHAR(20),
        venue       VARCHAR(150),
        capacity    INTEGER DEFAULT 100,
        image_emoji VARCHAR(10) DEFAULT '📅',
        tags        TEXT[],
        status      VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming','completed','cancelled')),
        organizer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `);

    // Registrations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
        event_id   INTEGER REFERENCES events(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, event_id)
      );
    `);

    console.log('✅ All tables created successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Setup failed:', err.message);
    process.exit(1);
  }
};

setup();
