import { useEffect, useState } from "react";
import { getMyProfile, MeResponse } from "@/api/userApi";
import { getMyBookings, Booking } from "@/api/bookingsApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function UserDashboard() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);

      const profile = await getMyProfile();
      const bookingData = await getMyBookings();

      setMe(profile);
      setBookings(bookingData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  if (!me) {
    return <p className="p-6">No user data found.</p>;
  }

  /* ================= ANALYTICS ================= */

  const totalBookings = bookings.length;

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.bookingDate) >= new Date()
  ).length;

  const cancelledBookings = bookings.filter(
    (b) => b.status === "CANCELLED"
  ).length;

  const totalHoursBooked = bookings.reduce((acc, booking) => {
    const start = Number(booking.startTime.split(":")[0]);
    const end = Number(booking.endTime.split(":")[0]);
    return acc + (end - start);
  }, 0);

  /* ================= CHART DATA ================= */

  const chartData = [
    {
      name: "Bookings",
      value: totalBookings,
    },
    {
      name: "Upcoming",
      value: upcomingBookings,
    },
    {
      name: "Cancelled",
      value: cancelledBookings,
    },
  ];

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          Welcome, {me.firstName} 👋
        </h1>

        <p className="text-gray-500 mt-1">
          Here's an overview of your meeting activity.
        </p>
      </div>

      {/* PROFILE CARD */}

      <div className="bg-white shadow rounded-xl p-6 border">
        <div className="space-y-2">
          <p><b>Name:</b> {me.firstName} {me.lastName}</p>
          <p><b>Email:</b> {me.email}</p>
          <p><b>Department:</b> {me.department}</p>
          <p><b>Role:</b> {me.role}</p>
        </div>
      </div>

      {/* ANALYTICS CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-blue-500 text-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold">Total Bookings</h2>
          <p className="text-4xl font-bold mt-3">
            {totalBookings}
          </p>
        </div>

        <div className="bg-green-500 text-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold">Upcoming</h2>
          <p className="text-4xl font-bold mt-3">
            {upcomingBookings}
          </p>
        </div>

        <div className="bg-purple-500 text-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold">Hours Booked</h2>
          <p className="text-4xl font-bold mt-3">
            {totalHoursBooked}
          </p>
        </div>

        <div className="bg-red-500 text-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold">Cancelled</h2>
          <p className="text-4xl font-bold mt-3">
            {cancelledBookings}
          </p>
        </div>

      </div>

      {/* CHART */}

      <div className="bg-white shadow rounded-xl p-6 border">

        <h2 className="text-xl font-bold mb-6">
          Booking Analytics
        </h2>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* UPCOMING BOOKINGS */}

      <div className="bg-white shadow rounded-xl p-6 border">

        <h2 className="text-xl font-bold mb-4">
          Upcoming Meetings
        </h2>

        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full border">

              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-3">Title</th>
                  <th className="border p-3">Room</th>
                  <th className="border p-3">Date</th>
                  <th className="border p-3">Time</th>
                  <th className="border p-3">Status</th>
                </tr>
              </thead>

              <tbody>

                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking.id}>

                    <td className="border p-3">
                      {booking.title}
                    </td>

                    <td className="border p-3">
                      {booking.roomName}
                    </td>

                    <td className="border p-3">
                      {booking.bookingDate}
                    </td>

                    <td className="border p-3">
                      {booking.startTime} - {booking.endTime}
                    </td>

                    <td className="border p-3">
                      {booking.status}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}