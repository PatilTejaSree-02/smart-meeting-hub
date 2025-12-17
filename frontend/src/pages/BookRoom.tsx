import { useState } from "react";
import api from "../services/api";

const BookRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const bookRoom = async () => {
    try {
      await api.post("/bookings", {
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

      <input placeholder="Room ID" onChange={(e) => setRoomId(e.target.value)} />
      <input type="date" onChange={(e) => setDate(e.target.value)} />
      <input type="time" onChange={(e) => setStart(e.target.value)} />
      <input type="time" onChange={(e) => setEnd(e.target.value)} />

      <button onClick={bookRoom}>Book</button>
    </div>
  );
};

export default BookRoom;
