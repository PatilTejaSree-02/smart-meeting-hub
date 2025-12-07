import { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingTable } from '@/components/booking/BookingTable';
import { mockBookings } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function MyBookings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState(
    mockBookings.filter((b) => b.userId === user?.id)
  );

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.date) >= new Date() && b.status !== 'cancelled'
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.date) < new Date() || b.status === 'cancelled'
  );

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      )
    );
    toast({
      title: 'Booking cancelled',
      description: 'Your booking has been successfully cancelled.',
    });
  };

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
