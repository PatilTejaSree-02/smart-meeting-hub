import { useEffect, useState } from "react";
import api from "@/api/api";

type Booking = {
  id: number;
  title: string;
  roomName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  attendees: number;
  status: string;
};

export default function UserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: number) => {
    try {
      await api.delete(`/bookings/${id}`);

      setBookings((prev) =>
        prev.filter((booking) => booking.id !== id)
      );

      alert("Booking cancelled successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">My Bookings</h1>

      <p className="text-gray-500 mb-6">
        View and manage your room bookings.
      </p>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Room</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Start</th>
                <th className="p-3 border">End</th>
                <th className="p-3 border">Attendees</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="p-3 border">{booking.title}</td>

                  <td className="p-3 border">
                    {booking.roomName}
                  </td>

                  <td className="p-3 border">
                    {booking.bookingDate}
                  </td>

                  <td className="p-3 border">
                    {booking.startTime}
                  </td>

                  <td className="p-3 border">
                    {booking.endTime}
                  </td>

                  <td className="p-3 border">
                    {booking.attendees}
                  </td>

                  <td className="p-3 border">
                    {booking.status}
                  </td>

                  <td className="p-3 border">
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}