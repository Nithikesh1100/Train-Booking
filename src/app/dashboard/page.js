'use client';

import { useEffect, useState } from 'react';
import { BookingForm } from '@/components/reservation/BookingForm';
import { BookingHistory } from '@/components/reservation/BookingHistory';
import TrainReservationUI from '@/components/reservation/TrainReservationUI';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { getBookings } from '@/utils/api';

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);  // Loading state for fetching data
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getBookings();
        if (data && data.success) {
          setBookings(data.seats);  // Assuming the API response has a `seats` array with booking details
          console.log(data.seats);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-foreground mb-8">Dashboard</h1>

        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-foreground/90 mb-6">
              Book Train Seats
            </h2>
            <TrainReservationUI />
          </Card>

          {loading ? (
            <div className="text-center">Loading booking history...</div>
          ) : bookings.length > 0 ? (
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-foreground/90 mb-6">
                Booking History
              </h2>
              <BookingHistory bookings={bookings} />
            </Card>
          ) : (
            <div className="text-center text-muted">No bookings found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
