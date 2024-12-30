import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class TrainReservation {
  constructor() {
    this.totalSeats = 80;
    this.seatsPerRow = 7;
    this.lastRowSeats = 3;
    this.seats = new Array(this.totalSeats).fill(null);
  }

  getSeatPosition(seatNumber) {
    const row = Math.floor(seatNumber / this.seatsPerRow);
    const col = seatNumber % this.seatsPerRow;
    if (row === 11 && col >= this.lastRowSeats) {
      return null;
    }
    return { row, col };
  }

  getLinearPosition(row, col) {
    if (row === 11 && col >= this.lastRowSeats) {
      return null;
    }
    return row * this.seatsPerRow + col;
  }

  findConsecutiveSeats(count) {
    for (let row = 0; row < 11; row++) {
      const rowStart = row * this.seatsPerRow;
      const rowEnd = row === 11 ? rowStart + this.lastRowSeats : rowStart + this.seatsPerRow;
      let consecutive = 0;
      let startSeat = -1;

      for (let seat = rowStart; seat < rowEnd; seat++) {
        if (this.seats[seat] === null) {
          if (consecutive === 0) startSeat = seat;
          consecutive++;
          if (consecutive === count) {
            return Array.from({ length: count }, (_, i) => startSeat + i);
          }
        } else {
          consecutive = 0;
        }
      }
    }
    return null;
  }

  findNearestAvailableSeats(count) {
    const availableSeats = [];
    for (let i = 0; i < this.totalSeats; i++) {
      const pos = this.getSeatPosition(i);
      if (pos && this.seats[i] === null) {
        availableSeats.push(i);
      }
    }

    if (availableSeats.length < count) return null;

    let minSpread = Infinity;
    let bestSeats = null;

    for (let i = 0; i <= availableSeats.length - count; i++) {
      const spread = availableSeats[i + count - 1] - availableSeats[i];
      if (spread < minSpread) {
        minSpread = spread;
        bestSeats = availableSeats.slice(i, i + count);
      }
    }

    return bestSeats;
  }

  bookSeats(count) {
    if (count < 1 || count > 7) {
      return { success: false, message: "You can only book between 1 and 7 seats." };
    }

    let seatsToBook = this.findConsecutiveSeats(count);
    let priorityUsed = "one row";

    if (!seatsToBook) {
      seatsToBook = this.findNearestAvailableSeats(count);
      priorityUsed = "nearest available";
    }

    if (seatsToBook) {
      const bookedPositions = [];
      seatsToBook.forEach(seatNum => {
        this.seats[seatNum] = "X";
        const pos = this.getSeatPosition(seatNum);
        bookedPositions.push(`Row ${pos.row + 1}, Seat ${pos.col + 1}`);
      });

      return {
        success: true,
        message: `Seats booked successfully (${priorityUsed})`,
        seats: bookedPositions,
        seatNumbers: seatsToBook
      };
    } else {
      return {
        success: false,
        message: "Not enough seats available to fulfill your request."
      };
    }
  }

  resetSeats() {
    this.seats = new Array(this.totalSeats).fill(null);
    return { success: true, message: "All seats have been reset." };
  }

  getAllSeats() {
    return this.seats;
  }
}

const TrainReservationUI = () => {
  const [reservation] = useState(() => new TrainReservation());
  const [seats, setSeats] = useState([]);
  const [seatCount, setSeatCount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    const storedSeats = JSON.parse(localStorage.getItem('trainSeats'));
    if (storedSeats) {
      reservation.seats = storedSeats;
      setSeats([...reservation.getAllSeats()]);
    }

    // Uncomment the backend code below to fetch data if needed
    /*
    const fetchBookingDetails = async () => {
      try {
        const bookingDetails = await getBookings();
        if (bookingDetails.success) {
          const bookedSeats = bookingDetails.seats;
          bookedSeats.forEach(seatNumber => {
            reservation.seats[seatNumber] = 'X';
          });
          setSeats([...reservation.getAllSeats()]);
          setBookedSeats(bookedSeats);
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    fetchBookingDetails();
    */
  }, []);

  const handleBooking = async () => {
    try {
      setLoading(true);
      setError('');

      const count = parseInt(seatCount);
      if (isNaN(count)) {
        setError('Please enter a valid number');
        return;
      }

      const result = reservation.bookSeats(count);
      if (!result.success) {
        setError(result.message);
        toast.error(result.message);
        return;
      }

      // Uncomment to use backend for booking
      /*
      await createBooking({
        seats: result.seatNumbers,
        seatCount: count
      });
      */

      setSeats([...reservation.getAllSeats()]);
      setBookedSeats(result.seats);
      setMessage(result.message);
      toast.success('Booking confirmed!');
      
      // Store updated seat information in localStorage
      localStorage.setItem('trainSeats', JSON.stringify(reservation.seats));
    } catch (err) {
      setError(err.message || 'Failed to book seats');
      toast.error('Booking failed');
    } finally {
      setLoading(false);
      setSeatCount('');
    }
  };

  const handleReset = () => {
    const result = reservation.resetSeats();
    setSeats([...reservation.getAllSeats()]);
    setMessage(result.message);
    setBookedSeats([]);
    setError('');
    setSeatCount('');
    
    // Clear localStorage when resetting
    localStorage.removeItem('trainSeats');
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      // Simulate canceling booking locally
      const updatedSeats = reservation.seats;
      updatedSeats[bookingId] = null;
      setSeats([...updatedSeats]);
      toast.success('Booking cancelled');
    } catch (error) {
      toast.error('Error cancelling booking');
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="p-8 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Train Seat Layout</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset All
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array(80).fill(null).map((_, index) => {
                const row = Math.floor(index / 7);
                const col = index % 7;
                if (row === 11 && col >= 3) return null;

                const isBooked = seats[index] === 'X';

                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg
                      flex items-center justify-center
                      text-sm font-medium transition-all
                      ${isBooked
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-muted rounded"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-destructive/10 text-destructive rounded"></div>
                <span className="text-sm">Booked</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-4">Booking Options</h3>
            <div>
              <Input
                value={seatCount}
                onChange={(e) => setSeatCount(e.target.value)}
                type="number"
                placeholder="Enter number of seats"
                min="1"
                max="7"
              />
            </div>
            <Button
              variant="outline"
              size="lg"
              className="mt-4 w-full"
              onClick={handleBooking}
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Book Seats'}
            </Button>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            {message && <p className="mt-4 text-sm text-green-600">{message}</p>}

            <div className="mt-6">
              <h4 className="text-lg font-semibold">Booked Seats</h4>
              <ul className="list-disc ml-6 mt-2">
                {bookedSeats.map((seat, index) => (
                  <li key={index} className="flex justify-between items-center my-2">
                    {seat}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelBooking(index)}
                    >
                      Cancel
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <ToastContainer />
    </div>
  );
};

export default TrainReservationUI;
