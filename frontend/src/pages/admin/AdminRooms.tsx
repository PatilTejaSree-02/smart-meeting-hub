import { useEffect, useState } from "react";
import {
  getAdminRooms,
  createRoom,
  updateRoom,
  deactivateRoom,
} from "@/api/adminRoomsApi";
import { Room } from "@/types/room";

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(0);

  const tenantId = 1; // REAL tenant, no mock data

  const loadRooms = () => {
    getAdminRooms(tenantId).then(setRooms);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleCreate = async () => {
    await createRoom({
      name,
      location,
      capacity,
      tenantId,
    });

    setName("");
    setLocation("");
    setCapacity(0);
    loadRooms();
  };

  const handleDeactivate = async (id: number) => {
    await deactivateRoom(id);
    loadRooms();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin – Manage Rooms</h1>

      {/* CREATE ROOM */}
      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Add New Room</h2>

        <input
          className="border p-2 mr-2"
          placeholder="Room Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 mr-2"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          className="border p-2 mr-2"
          type="number"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
        />

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Room
        </button>
      </div>

      {/* ROOM LIST */}
      <div className="space-y-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{room.name}</h3>
              <p className="text-sm text-gray-500">
                {room.location} · Capacity {room.capacity}
              </p>
              <p className="text-sm">
                Status: {room.active ? "Active" : "Inactive"}
              </p>
            </div>

            {room.active && (
              <button
                onClick={() => handleDeactivate(room.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Deactivate
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
