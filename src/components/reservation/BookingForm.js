'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SeatGrid } from './SeatGrid';
import { createBooking } from '@/utils/api';
import { useToast } from '@/components/ui/toaster';

export function BookingForm({ onBookingComplete }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(seat => seat !== seatNumber);
      }
      if (prev.length >= 7) return prev;
      return [...prev, seatNumber];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one seat",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await createBooking({ seats: selectedSeats });
      toast({
        title: "Success!",
        description: "Booking completed successfully",
      });
      setSelectedSeats([]);
      onBookingComplete?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SeatGrid
        seats={Array(73).fill(null)}
        selectedSeats={selectedSeats}
        onSeatSelect={handleSeatSelect}
      />
      <div className="flex flex-col space-y-4">
        <p className="text-sm text-gray-600">
          Selected seats: {selectedSeats.length > 0 
            ? selectedSeats.map(s => s + 1).join(', ') 
            : 'None'}
        </p>
        <Button
          onClick={handleSubmit}
          disabled={loading || selectedSeats.length === 0}
          className="w-full"
        >
          {loading ? 'Booking...' : 'Complete Booking'}
        </Button>
      </div>
    </div>
  );
}