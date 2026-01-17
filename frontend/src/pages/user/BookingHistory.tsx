import { useEffect, useState } from "react";
import { getMyBookings } from "@/api/bookingsApi";

type Booking = {
  id: number;
  title: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
};

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getMyBookings();
        setBookings(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="p-6">Loading history...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Booking History</h1>

      {bookings.length === 0 ? (
        <p>No history found.</p>
      ) : (
        bookings.map((b) => (
          <div key={b.id} className="border rounded p-4">
            <p className="font-semibold">{b.title}</p>
            <p className="text-sm text-gray-600">
              {b.bookingDate} | {b.startTime} - {b.endTime}
            </p>
            <p>Status: {b.status}</p>
          </div>
        ))
      )}
    </div>
  );
}
