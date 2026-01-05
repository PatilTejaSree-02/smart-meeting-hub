import { useEffect, useState } from "react";
import { getDashboardStats } from "@/api/dashboardApi";
import { DashboardStats } from "@/types/dashboard";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TEMP: real tenantId, no mock data
    getDashboardStats(1)
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!stats) return <p>No dashboard data</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-sm text-gray-500">Total Rooms</h2>
          <p className="text-3xl font-bold">{stats.totalRooms}</p>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-sm text-gray-500">Total Bookings</h2>
          <p className="text-3xl font-bold">{stats.totalBookings}</p>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-sm text-gray-500">Active Bookings (Now)</h2>
          <p className="text-3xl font-bold">{stats.activeBookingsToday}</p>
        </div>
      </div>
    </div>
  );
}
