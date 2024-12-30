// routes/reservations.js
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/', reservationController.createBooking);
router.get('/', reservationController.getBookings);
router.delete('/:id', reservationController.cancelBooking);

module.exports = router;