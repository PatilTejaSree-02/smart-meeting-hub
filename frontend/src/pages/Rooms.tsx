import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRooms } from "@/api/roomsApi";
import { Room } from "@/types/room";

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return <div className="p-6 text-slate-500">Loading rooms...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Meeting Rooms</h1>
        <p className="text-slate-500 text-sm">
          Select a room to view details and book
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => navigate(`/rooms/${room.id}`)}
            className="group cursor-pointer rounded-xl overflow-hidden border bg-white hover:shadow-xl transition"
          >
            <div className="h-40 bg-slate-200 relative">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36"
                alt={room.name}
                className="h-full w-full object-cover group-hover:scale-105 transition"
              />

              <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow">
                {room.capacity} seats
              </div>
            </div>

            <div className="p-4">
              <h2 className="text-lg font-semibold">{room.name}</h2>

              <p className="text-sm text-slate-500 mt-1">
                {room.building || "Office Building"}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-500 mt-3">
                <span>Floor {room.floor ?? "-"}</span>
                <span>•</span>
                <span>Available</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/book/${room.id}`);
                }}
                className="mt-4 w-full rounded-lg bg-teal-600 text-white py-2 text-sm font-semibold hover:bg-teal-700 transition"
              >
                Book Room
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}