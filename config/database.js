// server/config/database.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

// Example .env file for server
/*
DB_USER=your_username
DB_HOST=localhost
DB_NAME=train_reservation
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
*/