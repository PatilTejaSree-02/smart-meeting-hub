import { useEffect, useState } from "react";
import api from "../services/api";

interface Room {
  id: number;
  name: string;
  capacity: number;
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    api.get("/rooms")
      .then((res) => setRooms(res.data))
      .catch(() => alert("Failed to load rooms"));
  }, []);

  return (
    <div>
      <h2>Rooms</h2>

      {rooms.map((room) => (
        <div key={room.id}>
          <b>{room.name}</b> — Capacity: {room.capacity}
        </div>
      ))}
    </div>
  );
};

export default Rooms;
