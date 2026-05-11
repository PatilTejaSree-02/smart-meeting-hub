import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getRoomById } from "@/api/roomsApi";
import {
  getBookingsForRoom,
  createBooking,
  Booking,
} from "@/api/bookingsApi";
import api from "@/api/api"; // ✅ for reschedule call
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

  // ✅ NEW: reschedule state
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      getRoomById(roomId),
      getBookingsForRoom(roomId),
    ]).then(([roomData, bookingData]) => {
      setRoom(roomData);
      setBookings(bookingData);
      setLoading(false);
    });
  }, [roomId]);

  // ✅ CREATE BOOKING
  const handleBooking = async () => {
    if (!startTime || !endTime) {
      alert("Select start and end time");
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
        title: "Meeting",
        bookingDate: startTime.split("T")[0],
        startTime,
        endTime,
        attendees: 1,
      });

      alert("Room booked successfully!");

      refreshBookings();
      resetForm();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  // ✅ RESCHEDULE BOOKING
  const handleReschedule = async () => {
    if (!editingBookingId) return;

    try {
      await api.put(`/bookings/${editingBookingId}/reschedule`, {
        bookingDate: startTime.split("T")[0],
        startTime,
        endTime,
      });

      alert("Booking rescheduled!");

      setEditingBookingId(null);
      refreshBookings();
      resetForm();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Reschedule failed");
    }
  };

  // ✅ LOAD BOOKINGS AGAIN
  const refreshBookings = async () => {
    const updated = await getBookingsForRoom(roomId);
    setBookings(updated);
  };

  // ✅ RESET FORM
  const resetForm = () => {
    setStartTime("");
    setEndTime("");
  };

  if (loading) return <p>Loading...</p>;
  if (!room) return <p>Room not found</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* ROOM INFO */}
      <div>
        <h1 className="text-3xl font-bold">{room.name}</h1>

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
              className="text-sm border rounded px-3 py-2 flex justify-between items-center"
            >
              <div>
                {new Date(b.startTime).toLocaleString()} →{" "}
                {new Date(b.endTime).toLocaleString()}
              </div>

              {/* ✅ RESCHEDULE BUTTON */}
              <button
                onClick={() => {
                  setEditingBookingId(b.id);
                  setStartTime(b.startTime);
                  setEndTime(b.endTime);
                }}
                className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
              >
                Reschedule
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* BOOKING / RESCHEDULE FORM */}
      <div className="border rounded-lg p-4 space-y-3">
        <h2 className="text-lg font-semibold">
          {editingBookingId ? "Reschedule Booking" : "Book this room"}
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
          onClick={editingBookingId ? handleReschedule : handleBooking}
          disabled={bookingLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingBookingId
            ? "Update Booking"
            : bookingLoading
            ? "Booking..."
            : "Book Room"}
        </button>
      </div>
    </div>
  );
}