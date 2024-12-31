// controllers/reservationController.js
const { Reservation } = require('../models/Reservation');

const reservationController = {
  async createBooking(req, res) {
    try {
      const { seats } = req.body;
      const userId = req.user.userId;

      // Validate seats array
      if (!Array.isArray(seats) || seats.length === 0 || seats.length > 7) {
        return res.status(400).json({ 
          error: 'Invalid seats selection. Must book between 1 and 7 seats.' 
        });
      }

      // Check if seats are available
      const unavailableSeats = await Reservation.checkSeatsAvailability(seats);
      if (unavailableSeats.length > 0) {
        return res.status(400).json({
          error: `Seats ${unavailableSeats.join(', ')} are already booked`
        });
      }

      // Create reservation
      const reservation = await Reservation.create({
        userId,
        seats,
        status: 'active'
      });

      res.status(201).json({
        message: 'Booking successful',
        reservation
      });
    } catch (error) {
      console.error('Booking error:', error);
      res.status(500).json({ error: 'Error creating booking' });
    }
  },

  async getBookings(req, res) {
    try {
      const userId = req.user.userId;
      // Fetch bookings for the logged-in user
      const bookings = await Reservation.findByUserId(userId);
      
      // Return all bookings
      res.json(bookings);
    } catch (error) {
      console.error('Get bookings error:', error);
      res.status(500).json({ error: 'Error fetching bookings' });
    }
  },

  async cancelBooking(req, res) {
    try {
      const userId = req.user.userId;
      
      // Reset (cancel) all bookings for the current user
      const affectedRows = await Reservation.updateMany(
        { userId, status: 'active' }, // Only target active bookings
        { status: 'cancelled' } // Update status to cancelled
      );

      // If no bookings were found to cancel
      if (affectedRows === 0) {
        return res.status(404).json({ error: 'No active bookings found to cancel' });
      }

      res.json({ message: 'All bookings have been reset (cancelled) successfully' });
    } catch (error) {
      console.error('Cancel booking error:', error);
      res.status(500).json({ error: 'Error resetting all bookings' });
    }
  }
};

module.exports = reservationController;
