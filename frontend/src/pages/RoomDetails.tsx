import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getRoomById } from "@/api/roomsApi";
import {
  getBookingsForRoom,
  createBooking,
  Booking,
} from "@/api/bookingsApi";
import { Room } from "@/types/room";

export default function RoomDetails() {
  const { id } = useParams();
  const roomId = Number(id);

  const [room, setRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // TEMP until auth
  const tenantId = 1;
  const userId = 1;

  useEffect(() => {
    Promise.all([
      getRoomById(roomId),
      getBookingsForRoom(roomId, tenantId),
    ]).then(([roomData, bookingData]) => {
      setRoom(roomData);
      setBookings(bookingData);
      setLoading(false);
    });
  }, [roomId]);

  const handleBooking = async () => {
    if (!startTime || !endTime) {
      alert("Select start and end time");
      return;
    }

    if (new Date(startTime) < new Date()) {
      alert("Start time cannot be in the past");
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      alert("End time must be after start time");
      return;
    }

    setBookingLoading(true);

    try {
      await createBooking({
        roomId,
        userId,
        tenantId,
        startTime,
        endTime,
      });

      alert("Room booked successfully!");

      const updated = await getBookingsForRoom(roomId, tenantId);
      setBookings(updated);

      setStartTime("");
      setEndTime("");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!room) return <p>Room not found</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ROOM INFO */}
      <div>
        <h1 className="text-3xl font-bold">{room.name}</h1>
        <p>Location: {room.location}</p>
        <p>Capacity: {room.capacity}</p>
      </div>

      {/* EXISTING BOOKINGS */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">
          Existing Bookings
        </h2>

        {bookings.length === 0 && (
          <p className="text-sm text-gray-500">
            No bookings yet
          </p>
        )}

        <ul className="space-y-2">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="text-sm border rounded px-3 py-2"
            >
              {new Date(b.startTime).toLocaleString()} →{" "}
              {new Date(b.endTime).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      {/* BOOKING FORM */}
      <div className="border rounded-lg p-4 space-y-3">
        <h2 className="text-lg font-semibold">
          Book this room
        </h2>

        <input
          type="datetime-local"
          value={startTime}
          min={new Date().toISOString().slice(0, 16)}
          onChange={(e) => setStartTime(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="datetime-local"
          value={endTime}
          min={startTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border p-2 w-full"
        />

        <button
          onClick={handleBooking}
          disabled={bookingLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {bookingLoading ? "Booking..." : "Book Room"}
        </button>
      </div>
    </div>
  );
}
