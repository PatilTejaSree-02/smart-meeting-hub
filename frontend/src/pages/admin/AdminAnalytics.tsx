import { useEffect, useState } from 'react';
import api from '@/services/api';
import { CalendarDays, Users, Building2, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { AnalyticsChart } from '@/components/admin/AnalyticsChart';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    api.get('/admin/analytics')
      .then(res => setAnalytics(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!analytics) return <p>Loading analytics...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="Total Bookings" value={analytics.totalBookings} icon={CalendarDays} />
        <StatsCard title="Active Rooms" value={analytics.totalRooms} icon={Building2} />
        <StatsCard title="Registered Users" value={analytics.totalUsers} icon={Users} />
        <StatsCard title="Avg. Occupancy" value={`${analytics.averageOccupancy}%`} icon={TrendingUp} />
      </div>

      {analytics.bookingsByRoom.length > 0 && (
        <AnalyticsChart
          data={analytics.bookingsByRoom.map((r:any)=>({
            name: r.roomName,
            value: r.count
          }))}
          type="bar"
          title="Bookings by Room"
        />
      )}
    </div>
  );
}
