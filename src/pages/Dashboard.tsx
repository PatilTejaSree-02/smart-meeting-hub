import { useState, useMemo } from 'react';
import { CalendarDays, Clock, TrendingUp } from 'lucide-react';
import { RoomCard } from '@/components/rooms/RoomCard';
import { RoomFilters } from '@/components/rooms/RoomFilters';
import { BookingModal } from '@/components/booking/BookingModal';
import { StatsCard } from '@/components/admin/StatsCard';
import { mockRooms, mockBookings } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Room, RoomFilter } from '@/types';

export default function Dashboard() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<RoomFilter>({});
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const filteredRooms = useMemo(() => {
    return mockRooms.filter((room) => {
      if (filters.capacity && room.capacity < filters.capacity) return false;
      if (filters.floor && room.floor !== filters.floor) return false;
      return true;
    });
  }, [filters]);

  const userBookings = mockBookings.filter((b) => b.userId === user?.id);
  const upcomingBookings = userBookings.filter(
    (b) => new Date(b.date) >= new Date() && b.status !== 'cancelled'
  );

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (booking: {
    roomId: string;
    date: string;
    startTime: string;
    endTime: string;
    title: string;
    attendees: number;
  }) => {
    console.log('Booking confirmed:', booking);
    // In a real app, this would make an API call
  };

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
          value={mockRooms.filter((r) => r.isActive).length}
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
