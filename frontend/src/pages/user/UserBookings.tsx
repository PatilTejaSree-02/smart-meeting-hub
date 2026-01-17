import { useEffect, useState } from "react";
import { getRooms } from "@/api/roomsApi";
import { cancelBooking, createBooking, getMyBookings } from "@/api/bookingsApi";
import type { Room } from "@/types/room";

type Booking = {
  id: number;
  roomId: number;
  title: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  attendees: number;
  status: string;
};

export default function UserBookings() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // create form
  const [roomId, setRoomId] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [attendees, setAttendees] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const [roomsData, myBookings] = await Promise.all([
        getRooms(),
        getMyBookings(),
      ]);

      setRooms(roomsData);
      setBookings(myBookings);

      if (roomsData.length > 0) setRoomId(roomsData[0].id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!roomId || !bookingDate || !title.trim()) {
      alert("Fill all booking details");
      return;
    }

    try {
      await createBooking({
        roomId,
        title,
        bookingDate,
        startTime,
        endTime,
        attendees,
      });

      alert("Booking created ✅");
      setTitle("");
      setAttendees(1);

      await load();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Booking failed";

      // ✅ This will show when room already booked
      alert(msg);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelBooking(id);
      alert("Booking cancelled ✅");
      await load();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) return <p className="p-6">Loading bookings...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Bookings</h1>

      {/* ✅ BOOK A ROOM */}
      <div className="border rounded p-4 space-y-3">
        <h2 className="font-semibold">Book a Room</h2>

        <select
          className="border p-2 w-full"
          value={roomId}
          onChange={(e) => setRoomId(Number(e.target.value))}
        >
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} (Cap {r.capacity})
            </option>
          ))}
        </select>

        <input
          className="border p-2 w-full"
          placeholder="Booking title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          type="date"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
        />

        <div className="flex gap-2">
          <input
            className="border p-2 w-full"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            className="border p-2 w-full"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <input
          className="border p-2 w-full"
          type="number"
          min={1}
          placeholder="Attendees"
          value={attendees}
          onChange={(e) => setAttendees(Number(e.target.value))}
        />

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Book Room
        </button>
      </div>

      {/* ✅ BOOKING LIST */}
      <div className="space-y-3">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{b.title}</p>
              <p className="text-sm text-gray-600">
                Room #{b.roomId} | {b.bookingDate} | {b.startTime} - {b.endTime}
              </p>
              <p>Status: {b.status}</p>
            </div>

            {b.status !== "cancelled" && (
              <button
                onClick={() => handleCancel(b.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        ))}

        {bookings.length === 0 && <p>No bookings yet.</p>}
      </div>
    </div>
  );
}
