import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Users,
  Building2,
  TrendingUp,
  Plus,
  UserPlus,
  BarChart3,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '@/components/admin/StatsCard';
import { AnalyticsChart } from '@/components/admin/AnalyticsChart';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          toast({
            title: 'Session expired',
            description: 'Please log in again.',
            variant: 'destructive',
          });
          navigate('/'); // redirect to login
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/analytics`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Handle unauthorized or forbidden responses
        if (res.status === 401 || res.status === 403) {
          toast({
            title: 'Unauthorized Access',
            description: 'Your session has expired. Please log in again.',
            variant: 'destructive',
          });
          localStorage.removeItem('token');
          navigate('/');
          return;
        }

        if (!res.ok) throw new Error('Failed to fetch analytics');

        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        toast({
          title: 'Error loading dashboard',
          description:
            'Could not connect to the backend API. Please check your server.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [navigate, toast]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  // Empty or error state
  if (!analytics) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">No data available.</p>
      </div>
    );
  }

  // Prepare chart data
  const weeklyTrendData = Array.isArray(analytics.bookingsByDay)
    ? analytics.bookingsByDay.map((item) => ({
        name: item.day,
        value: item.count,
      }))
    : [];

  const topRoomsData = Array.isArray(analytics.bookingsByRoom)
    ? analytics.bookingsByRoom.map((item) => ({
        name: item.roomName,
        value: item.count,
      }))
    : [];

  // Quick actions
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
          Real-time overview powered by your MySQL database.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Rooms"
          value={analytics.totalRooms}
          icon={Building2}
          change="All operational"
          changeType="positive"
        />
        <StatsCard
          title="Total Users"
          value={analytics.totalUsers}
          icon={Users}
          change="+5 this week"
          changeType="positive"
        />
        <StatsCard
          title="Active Bookings Today"
          value={analytics.activeBookingsToday}
          icon={CalendarDays}
          change="Live from DB"
          changeType="neutral"
        />
        <StatsCard
          title="Avg. Occupancy"
          value={`${analytics.averageOccupancy}%`}
          icon={TrendingUp}
          change="Calculated dynamically"
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
          title="Bookings by Day"
        />
        <AnalyticsChart
          data={topRoomsData}
          type="bar"
          title="Bookings by Room"
        />
      </div>
    </div>
  );
}
