import { useEffect, useState } from "react";
import {
  CalendarDays,
  Users,
  Building2,
  TrendingUp,
  Plus,
  UserPlus,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { StatsCard } from "@/components/admin/StatsCard";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { getAdminAnalytics } from "@/api/AdminAnalyticsApi";
import { getMyProfile } from "@/api/userApi";
import { getMyBookings } from "@/api/MyBookingsApi";

type AdminProfile = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  role: string;
  status: string;
};

type Booking = {
  id: number;
  roomId: number;
  title: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [analytics, setAnalytics] = useState<any>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      const [analyticsRes, profileRes, bookingsRes] = await Promise.all([
        getAdminAnalytics(),
        getMyProfile(),
        getMyBookings(),
      ]);

      setAnalytics(analyticsRes);
      setProfile(profileRes);

      // show only upcoming confirmed bookings
      const upcoming = (bookingsRes || []).filter(
        (b: Booking) => b.status === "confirmed"
      );
      setMyBookings(upcoming);
    } catch (err) {
      console.error(err);
      toast({
        title: "Dashboard error",
        description: "Failed to load admin dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">No analytics data available.</p>
      </div>
    );
  }

  // Prepare chart data
  const weeklyTrendData = Array.isArray(analytics.bookingsByDay)
    ? analytics.bookingsByDay.map((item: any) => ({
        name: item.day,
        value: item.count,
      }))
    : [];

  const topRoomsData = Array.isArray(analytics.bookingsByRoom)
    ? analytics.bookingsByRoom.map((item: any) => ({
        name: item.roomName,
        value: item.count,
      }))
    : [];

  const quickActions = [
    {
      icon: Plus,
      label: "Add Room",
      description: "Create a new meeting room",
      onClick: () => navigate("/admin/rooms"),
      variant: "accent" as const,
    },
    {
      icon: UserPlus,
      label: "Add User",
      description: "Register a new user",
      onClick: () => navigate("/admin/users"),
      variant: "secondary" as const,
    },
    {
      icon: BarChart3,
      label: "View Analytics",
      description: "See detailed reports",
      onClick: () => navigate("/admin/analytics"),
      variant: "secondary" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold">
          Admin Dashboard
        </h1>
      </div>

      {/* ✅ Admin Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Admin Profile</CardTitle>
          <CardDescription>Logged in admin details</CardDescription>
        </CardHeader>

        <CardContent>
          {profile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {profile.firstName} {profile.lastName}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {profile.email}
              </p>
              <p>
                <span className="font-semibold">Department:</span>{" "}
                {profile.department}
              </p>
              <p>
                <span className="font-semibold">Role:</span> {profile.role}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">Profile not available.</p>
          )}
        </CardContent>
      </Card>

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
          change="From DB"
          changeType="neutral"
        />
        <StatsCard
          title="Bookings Today"
          value={analytics.bookingsToday}
          icon={CalendarDays}
          change="Live"
          changeType="neutral"
        />
        <StatsCard
          title="Avg. Occupancy"
          value={`${analytics.occupancyRate?.toFixed(1) || 0}%`}
          icon={TrendingUp}
          change="Calculated"
          changeType="positive"
        />
      </div>

      {/* ✅ My bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">My Bookings</CardTitle>
          <CardDescription>Upcoming confirmed bookings</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {myBookings.length === 0 ? (
            <p className="text-muted-foreground">No upcoming bookings.</p>
          ) : (
            myBookings.slice(0, 5).map((b) => (
              <div
                key={b.id}
                className="border rounded-lg p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{b.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Room #{b.roomId} • {b.bookingDate} • {b.startTime} -{" "}
                    {b.endTime}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/admin/bookings")}
                >
                  View
                </Button>
              </div>
            ))
          )}

          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate("/admin/bookings")}
          >
            Go to Bookings Page
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Quick Actions</CardTitle>
          <CardDescription>Common admin tasks</CardDescription>
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart data={weeklyTrendData} type="line" title="Bookings by Day" />
        <AnalyticsChart data={topRoomsData} type="bar" title="Bookings by Room" />
      </div>
    </div>
  );
}
