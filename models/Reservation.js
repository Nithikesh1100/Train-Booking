// models/Reservation.js

const db = require('../config/database');

class Reservation {
    static async create({ userId, seats, status }) {
      const query = `
        INSERT INTO reservations (user_id, seats, status)
        VALUES ($1, $2, $3)
        RETURNING id, user_id, seats, status, booking_date
      `;
      const values = [userId, seats, status];
      const result = await db.query(query, values);
      
      // Update seats table
      const seatUpdates = seats.map(seatNumber => {
        return db.query(
          'UPDATE seats SET is_occupied = TRUE, reservation_id = $1 WHERE seat_number = $2',
          [result.rows[0].id, seatNumber]
        );
      });
      await Promise.all(seatUpdates);
  
      return result.rows[0];
    }
  
    static async findByUserId(userId) {
      const query = `
        SELECT * FROM reservations 
        WHERE user_id = $1 
        ORDER BY booking_date DESC
      `;
      const result = await db.query(query, [userId]);
      return result.rows;
    }
  
    static async findById(id) {
      const query = 'SELECT * FROM reservations WHERE id = $1';
      const result = await db.query(query, [id]);
      return result.rows[0];
    }
  
    static async update(id, { status }) {
      const query = `
        UPDATE reservations
        SET status = $1
        WHERE id = $2
        RETURNING *
      `;
      const result = await db.query(query, [status, id]);
      return result.rows[0];
    }
  
    static async checkSeatsAvailability(seats) {
      const query = `
        SELECT seat_number FROM seats 
        WHERE seat_number = ANY($1) AND is_occupied = TRUE
      `;
      const result = await db.query(query, [seats]);
      return result.rows.map(row => row.seat_number);
    }
  }
  
  module.exports = { Reservation };