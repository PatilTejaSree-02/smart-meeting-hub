import { CalendarDays, Users, Building2, TrendingUp, Plus, UserPlus, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '@/components/admin/StatsCard';
import { AnalyticsChart } from '@/components/admin/AnalyticsChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockAnalytics } from '@/data/mockData';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const weeklyTrendData = mockAnalytics.weeklyTrend.map((item) => ({
    name: item.week,
    value: item.count,
  }));

  const quickActions = [
    {
      icon: Plus,
      label: 'Add Room',
      description: 'Create a new meeting room',
      onClick: () => navigate('/admin/rooms'),
      variant: 'accent' as const,
    },
    {
      icon: UserPlus,
      label: 'Add User',
      description: 'Register a new user',
      onClick: () => navigate('/admin/users'),
      variant: 'secondary' as const,
    },
    {
      icon: BarChart3,
      label: 'View Analytics',
      description: 'See detailed reports',
      onClick: () => navigate('/admin/analytics'),
      variant: 'secondary' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of room management system and quick actions.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Rooms"
          value={mockAnalytics.totalRooms}
          icon={Building2}
          change="All operational"
          changeType="positive"
        />
        <StatsCard
          title="Total Users"
          value={mockAnalytics.totalUsers}
          icon={Users}
          change="+5 this week"
          changeType="positive"
        />
        <StatsCard
          title="Active Bookings Today"
          value={mockAnalytics.activeBookingsToday}
          icon={CalendarDays}
          change="Real-time data"
          changeType="neutral"
        />
        <StatsCard
          title="Avg. Occupancy"
          value={`${mockAnalytics.averageOccupancy}%`}
          icon={TrendingUp}
          change="+8% from last month"
          changeType="positive"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant}
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={action.onClick}
              >
                <action.icon className="h-6 w-6" />
                <div className="text-center">
                  <p className="font-medium">{action.label}</p>
                  <p className="text-xs opacity-80">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Trends Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          data={weeklyTrendData}
          type="line"
          title="Booking Trends (Weekly)"
        />
        <AnalyticsChart
          data={mockAnalytics.bookingsByRoom.slice(0, 5).map(item => ({
            name: item.roomName.split(' ')[0],
            value: item.count,
          }))}
          type="bar"
          title="Top Rooms by Bookings"
        />
      </div>
    </div>
  );
}
