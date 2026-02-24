import { useEffect, useState } from "react";
import { getAdminAnalytics } from "@/api/AdminAnalyticsApi";

type BookingByDay = { day: string; count: number };
type BookingByRoom = { roomName: string; count: number };

type AnalyticsResponse = {
  totalRooms: number;
  totalUsers: number;
  totalBookings: number;
  bookingsToday: number;
  occupancyRate: number;
  bookingsByDay: BookingByDay[];
  bookingsByRoom: BookingByRoom[];
};

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await getAdminAnalytics();
      setData(res);
    } catch (err) {
      console.error("Analytics API error:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) return <p className="p-6">Loading analytics...</p>;
  if (!data) return <p className="p-6">No analytics data found.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Analytics</h1>

      {/* ✅ Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded p-4">
          <h2 className="font-semibold">Total Rooms</h2>
          <p className="text-xl">{data.totalRooms ?? 0}</p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold">Total Users</h2>
          <p className="text-xl">{data.totalUsers ?? 0}</p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold">Total Bookings</h2>
          <p className="text-xl">{data.totalBookings ?? 0}</p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold">Bookings Today</h2>
          <p className="text-xl">{data.bookingsToday ?? 0}</p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold">Avg Occupancy</h2>
          <p className="text-xl">
            {Number(data?.occupancyRate ?? 0).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* ✅ Booking By Day */}
      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">Bookings By Day</h2>
        {(data.bookingsByDay ?? []).length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          <ul className="list-disc pl-6">
            {(data.bookingsByDay ?? []).map((b, idx) => (
              <li key={idx}>
                {b.day}: {b.count}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ✅ Booking By Room */}
      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">Bookings By Room</h2>
        {(data.bookingsByRoom ?? []).length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          <ul className="list-disc pl-6">
            {(data.bookingsByRoom ?? []).map((b, idx) => (
              <li key={idx}>
                {b.roomName}: {b.count}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
