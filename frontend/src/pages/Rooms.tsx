import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRooms } from "@/api/roomsApi";
import { Room } from "@/types/room";

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // TEMP until auth
  const tenantId = 1;

  useEffect(() => {
    getRooms(tenantId)
      .then(setRooms)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading rooms...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Meeting Rooms</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border rounded-lg p-4 cursor-pointer hover:shadow"
            onClick={() => navigate(`/rooms/${room.id}`)}
          >
            <h2 className="text-lg font-semibold">{room.name}</h2>
            <p className="text-sm text-gray-500">{room.location}</p>
            <p className="mt-2">Capacity: {room.capacity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
