import { useEffect, useState } from "react";
import {
  getAdminRooms,
  createRoom,
  deactivateRoom,
  updateRoom,
} from "@/api/adminRoomsApi";
import { Room } from "@/types/room";

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);

  // Create Room Form
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [floor, setFloor] = useState(1);
  const [building, setBuilding] = useState("");

  // Edit Room Popup
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Edit fields
  const [editName, setEditName] = useState("");
  const [editCapacity, setEditCapacity] = useState(0);
  const [editFloor, setEditFloor] = useState(1);
  const [editBuilding, setEditBuilding] = useState("");

  const loadRooms = async () => {
    const data = await getAdminRooms();
    setRooms(data);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  // ✅ CREATE ROOM
  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Room name required");
      return;
    }

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

  // ✅ DEACTIVATE ROOM
  const handleDeactivate = async (id: number) => {
    await deactivateRoom(id);
    loadRooms();
  };

  // ✅ OPEN EDIT POPUP
  const openEdit = (room: Room) => {
    setSelectedRoom(room);
    setEditName(room.name);
    setEditCapacity(room.capacity);
    setEditFloor(room.floor);
    setEditBuilding(room.building || "");
    setEditOpen(true);
  };

  // ✅ SAVE EDIT
  const handleSaveEdit = async () => {
    if (!selectedRoom) return;

    await updateRoom(selectedRoom.id, {
      name: editName,
      capacity: editCapacity,
      floor: editFloor,
      building: editBuilding,
    });

    setEditOpen(false);
    setSelectedRoom(null);
    loadRooms();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin – Manage Rooms</h1>

      {/* ✅ ADD ROOM */}
      <div className="border p-4 mb-6 rounded">
        <h2 className="font-semibold mb-3">Add New Room</h2>

        <div className="flex flex-wrap gap-2">
          <input
            className="border p-2 rounded"
            placeholder="Room Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />

          <input
            className="border p-2 rounded"
            type="number"
            placeholder="Floor"
            value={floor}
            onChange={(e) => setFloor(Number(e.target.value))}
          />

          <input
            className="border p-2 rounded"
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
      </div>

      {/* ✅ ROOMS LIST */}
      <div className="space-y-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">{room.name}</h3>
              <p className="text-sm text-gray-600">
                Building {room.building}, Floor {room.floor} – Capacity{" "}
                {room.capacity}
              </p>
              <p className="text-sm">
                Status:{" "}
                <b className={room.isActive ? "text-green-600" : "text-red-600"}>
                  {room.isActive ? "Active" : "Inactive"}
                </b>
              </p>
            </div>

            <div className="flex gap-2">
              {/* ✅ EDIT BUTTON */}
              <button
                onClick={() => openEdit(room)}
                className="bg-gray-800 text-white px-3 py-1 rounded"
              >
                Edit Room
              </button>

              {/* ✅ DEACTIVATE */}
              {room.isActive && (
                <button
                  onClick={() => handleDeactivate(room.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Deactivate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ EDIT POPUP */}
      {editOpen && selectedRoom && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-[450px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Room</h2>

            <div className="space-y-3">
              <input
                className="border p-2 w-full rounded"
                placeholder="Room Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />

              <input
                className="border p-2 w-full rounded"
                type="number"
                placeholder="Capacity"
                value={editCapacity}
                onChange={(e) => setEditCapacity(Number(e.target.value))}
              />

              <input
                className="border p-2 w-full rounded"
                type="number"
                placeholder="Floor"
                value={editFloor}
                onChange={(e) => setEditFloor(Number(e.target.value))}
              />

              <input
                className="border p-2 w-full rounded"
                placeholder="Building"
                value={editBuilding}
                onChange={(e) => setEditBuilding(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
