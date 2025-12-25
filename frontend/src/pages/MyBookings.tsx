import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingTable } from '@/components/booking/BookingTable';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';

export default function MyBookings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/bookings');
        // Transform backend booking data
        const transformedBookings = response.data.map((booking: any) => ({
          id: booking.id.toString(),
          roomId: booking.roomId.toString(),
          userId: booking.userId.toString(),
          date: booking.bookingDate,
          startTime: booking.startTime,
          endTime: booking.endTime,
          title: booking.title,
          attendees: 1, // Default if not provided
          status: booking.status,
          createdAt: new Date(booking.createdAt || Date.now()),
        }));
        setBookings(transformedBookings);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load bookings',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [toast]);

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.date) >= new Date() && b.status !== 'cancelled'
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.date) < new Date() || b.status === 'cancelled'
  );

  const handleCancelBooking = async (bookingId: string) => {
    try {
      // You'll need to implement a cancel endpoint in your backend
      await api.delete(`/bookings/${bookingId}`);
      
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        )
      );
      
      toast({
        title: 'Booking cancelled',
        description: 'Your booking has been successfully cancelled.',
      });
    } catch (error: any) {
      console.error('Failed to cancel booking:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to cancel booking',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold">
            My Bookings
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your room reservations.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{bookings.length} total bookings</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming" className="gap-2">
            Upcoming
            <span className="h-5 min-w-[20px] rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center px-1.5">
              {upcomingBookings.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="past">Past & Cancelled</TabsTrigger>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="animate-fade-in">
          <BookingTable
            bookings={upcomingBookings}
            onCancel={handleCancelBooking}
          />
        </TabsContent>

        <TabsContent value="past" className="animate-fade-in">
          <BookingTable bookings={pastBookings} />
        </TabsContent>

        <TabsContent value="all" className="animate-fade-in">
          <BookingTable
            bookings={bookings}
            onCancel={handleCancelBooking}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
