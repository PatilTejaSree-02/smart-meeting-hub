import { useState, useMemo, useEffect } from 'react';
import { CalendarDays, Clock, TrendingUp } from 'lucide-react';
import { RoomCard } from '@/components/rooms/RoomCard';
import { RoomFilters } from '@/components/rooms/RoomFilters';
import { BookingModal } from '@/components/booking/BookingModal';
import { StatsCard } from '@/components/admin/StatsCard';
import { useAuth } from '@/contexts/AuthContext';
import { Room, RoomFilter } from '@/types';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filters, setFilters] = useState<RoomFilter>({});
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch rooms and bookings
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomsResponse, bookingsResponse] = await Promise.all([
          api.get('/rooms'),
          api.get('/bookings')
        ]);
        
        // Transform backend room data to frontend Room type
        const transformedRooms = roomsResponse.data.map((room: any) => ({
          id: room.id.toString(),
          name: room.name,
          capacity: room.capacity,
          floor: room.floor,
          amenities: room.amenities || [],
          image: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1497366216548' : '1497366811353'}-37526070297c?w=800&q=80`,
          isActive: room.active !== undefined ? room.active : true,
          description: room.description || '',
        }));
        
        setRooms(transformedRooms);
        setBookings(bookingsResponse.data);
      } catch (error: any) {
        console.error('Failed to fetch data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load rooms and bookings',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (filters.capacity && room.capacity < filters.capacity) return false;
      if (filters.floor && room.floor !== filters.floor) return false;
      if (!room.isActive) return false;
      return true;
    });
  }, [rooms, filters]);

  const userBookings = bookings.filter((b) => b.userId === parseInt(user?.id || '0'));
  const upcomingBookings = userBookings.filter(
    (b) => new Date(b.bookingDate) >= new Date() && b.status !== 'cancelled'
  );

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (booking: {
    roomId: string;
    date: string;
    startTime: string;
    endTime: string;
    title: string;
    attendees: number;
  }) => {
    try {
      await api.post('/bookings', {
        roomId: parseInt(booking.roomId),
        title: booking.title,
        bookingDate: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
      });

      toast({
        title: 'Booking confirmed!',
        description: `Your room has been booked successfully.`,
      });

      // Refresh bookings
      const response = await api.get('/bookings');
      setBookings(response.data);
      
      setIsBookingModalOpen(false);
    } catch (error: any) {
      console.error('Booking error:', error);
      
      let errorMessage = 'Could not create booking';
      if (error.response?.status === 409) {
        errorMessage = 'Room already booked for this time slot';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : errorMessage;
      }
      
      toast({
        title: 'Booking failed',
        description: errorMessage,
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
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl lg:text-3xl font-bold">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Find and book the perfect meeting room for your next meeting.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Available Rooms"
          value={rooms.filter((r) => r.isActive).length}
          icon={CalendarDays}
          change="All rooms operational"
          changeType="positive"
        />
        <StatsCard
          title="Your Upcoming Bookings"
          value={upcomingBookings.length}
          icon={Clock}
          change={upcomingBookings.length > 0 ? 'Next one today' : 'No upcoming meetings'}
          changeType={upcomingBookings.length > 0 ? 'neutral' : 'neutral'}
        />
        <StatsCard
          title="Total Bookings This Month"
          value={userBookings.length}
          icon={TrendingUp}
          change="+12% from last month"
          changeType="positive"
        />
      </div>

      {/* Filters */}
      <RoomFilters filters={filters} onFilterChange={setFilters} />

      {/* Room grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg">
            Available Rooms
            <span className="text-muted-foreground font-normal ml-2">
              ({filteredRooms.length} rooms)
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room, index) => (
            <div
              key={room.id}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <RoomCard
                room={room}
                isAvailable={room.isActive}
                onBook={() => handleBookRoom(room)}
              />
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12 bg-card rounded-xl">
            <p className="text-muted-foreground">
              No rooms match your current filters.
            </p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        room={selectedRoom}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
}
