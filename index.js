// server/index.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const reservationRoutes = require('./routes/reservations');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reservations', authenticateToken, reservationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});