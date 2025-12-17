import { CalendarDays, Users, Building2, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { AnalyticsChart } from '@/components/admin/AnalyticsChart';
import { mockAnalytics } from '@/data/mockData';

export default function AdminAnalytics() {
  const bookingsByRoomData = mockAnalytics.bookingsByRoom.map((item) => ({
    name: item.roomName.split(' ')[0],
    value: item.count,
  }));

  const bookingsByDayData = mockAnalytics.bookingsByDay.map((item) => ({
    name: item.day,
    value: item.count,
  }));

  const peakHoursData = mockAnalytics.peakHours.map((item) => ({
    name: item.hour,
    value: item.count,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor room usage, booking trends, and workspace efficiency.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Bookings"
          value={mockAnalytics.totalBookings}
          icon={CalendarDays}
          change="+23% from last month"
          changeType="positive"
        />
        <StatsCard
          title="Active Rooms"
          value={mockAnalytics.totalRooms}
          icon={Building2}
          change="All operational"
          changeType="positive"
        />
        <StatsCard
          title="Registered Users"
          value={mockAnalytics.totalUsers}
          icon={Users}
          change="+5 this week"
          changeType="positive"
        />
        <StatsCard
          title="Avg. Occupancy"
          value={`${mockAnalytics.averageOccupancy}%`}
          icon={TrendingUp}
          change="+8% from last month"
          changeType="positive"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          data={bookingsByRoomData}
          type="bar"
          title="Bookings by Room"
        />
        <AnalyticsChart
          data={bookingsByDayData}
          type="line"
          title="Bookings by Day of Week"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          data={peakHoursData}
          type="bar"
          title="Peak Booking Hours"
        />
        <AnalyticsChart
          data={bookingsByRoomData}
          type="pie"
          title="Room Utilization Distribution"
        />
      </div>
    </div>
  );
}
