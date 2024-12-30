'use client';
import { motion } from 'framer-motion';
import { formatDate } from '@/utils/dates';

export function BookingHistory({ bookings }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No bookings found</p>
      ) : (
        bookings.map((booking, index) => (
          <motion.div
            key={booking.id}
            variants={item}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
            
                <p className="font-medium">
                  Booking #{booking.id}
                </p>
                <div className="mt-1 text-sm text-gray-600">
                  <p>Seats: {booking.seats.map(seat => seat + 1).join(', ')}</p>
                  <p>Date: {formatDate(booking.booking_date)}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                booking.status === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {booking.status}
              </span>
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}