import { useEffect, useState } from "react";
import { getAdminRooms, createRoom, deactivateRoom } from "@/api/adminRoomsApi";
import { Room } from "@/types/room";

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [floor, setFloor] = useState(1);
  const [building, setBuilding] = useState("");

  const loadRooms = async () => {
    const data = await getAdminRooms();
    setRooms(data);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleCreate = async () => {
    await createRoom({
      name,
      capacity,
      floor,
      building,
    });

    setName("");
    setCapacity(0);
    setFloor(1);
    setBuilding("");
    loadRooms();
  };

  const handleDeactivate = async (id: number) => {
    await deactivateRoom(id);
    loadRooms();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin – Manage Rooms</h1>

      {/* Create */}
      <div className="border p-4 mb-6 rounded">
        <input
          className="border p-2 mr-2"
          placeholder="Room Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 mr-2"
          type="number"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
        />

        <input
          className="border p-2 mr-2"
          type="number"
          placeholder="Floor"
          value={floor}
          onChange={(e) => setFloor(Number(e.target.value))}
        />

        <input
          className="border p-2 mr-2"
          placeholder="Building"
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Room
        </button>
      </div>

      {/* List */}
      {rooms.map((room) => (
        <div key={room.id} className="border p-4 mb-2 rounded flex justify-between">
          <div>
            <h3 className="font-semibold">{room.name}</h3>
            <p>
              Building {room.building}, Floor {room.floor} – Capacity {room.capacity}
            </p>
            <p>Status: {room.isActive ? "Active" : "Inactive"}</p>
          </div>

          {room.isActive && (
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
  );
}
