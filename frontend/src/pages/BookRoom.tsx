import { useEffect, useState } from "react";
import api from "@/api/api";

interface Room {
  id: number;
  name: string;
}

export default function BookRoom() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    api.get("/rooms")
      .then(res => setRooms(res.data))
      .catch(() => alert("Failed to load rooms"));
  }, []);

  const bookRoom = async () => {
    try {
      await api.post("/api/bookings", {
        roomId: Number(roomId),
        title: "Meeting",
        bookingDate: date,
        startTime: start,
        endTime: end,
      });

      alert("Booking successful");
    } catch (err: any) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div>
      <h2>Book Room</h2>

      <select value={roomId} onChange={e => setRoomId(e.target.value)}>
        <option value="">Select Room</option>
        {rooms.map(r => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      <input type="date" onChange={e => setDate(e.target.value)} />
      <input type="time" onChange={e => setStart(e.target.value)} />
      <input type="time" onChange={e => setEnd(e.target.value)} />

      <button onClick={bookRoom}>Book</button>
    </div>
  );
}
