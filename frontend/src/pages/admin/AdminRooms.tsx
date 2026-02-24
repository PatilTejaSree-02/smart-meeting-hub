import { useEffect, useState } from "react";
import {
  getAdminRooms,
  createRoom,
  deactivateRoom,
  updateRoom,
} from "@/api/adminRoomsApi";
import { Room } from "@/types/room";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);

  // ✅ Create Room Modal
  const [createOpen, setCreateOpen] = useState(false);

  // ✅ Create Room Fields
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [floor, setFloor] = useState(1);
  const [building, setBuilding] = useState("");

  // ✅ NEW: Image Upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // ✅ Edit Room Popup
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // ✅ Edit Fields
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

  // ✅ UPLOAD IMAGE
  const handleUploadPhoto = async () => {
    try {
      if (!imageFile) {
        alert("Please select an image first");
        return;
      }
      setUploading(true);
      const url = await uploadToCloudinary(imageFile);
      setImageUrl(url);
      alert("Photo uploaded ✅");
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

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
      imageUrl, // ✅ added
    });

    // reset
    setName("");
    setCapacity(0);
    setFloor(1);
    setBuilding("");

    setImageFile(null);
    setImageUrl("");

    setCreateOpen(false);
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
      {/* ✅ PAGE HEADER */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Admin – Manage Rooms
          </h1>
          <p className="text-slate-500 mt-1">
            Add, update, and manage meeting rooms
          </p>
        </div>

        {/* ✅ ADD ROOM BUTTON */}
        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition flex items-center gap-2 shadow-sm"
        >
          <span className="text-lg">+</span> Add Room
        </button>
      </div>

      {/* ✅ ROOMS LIST */}
      <div className="space-y-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border border-slate-200 bg-white p-5 rounded-2xl flex justify-between items-center shadow-sm"
          >
            <div>
              <h3 className="font-semibold text-lg text-slate-900">
                {room.name}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Building {room.building}, Floor {room.floor} – Capacity{" "}
                {room.capacity}
              </p>

              <p className="text-sm mt-2">
                Status:{" "}
                <b
                  className={
                    room.isActive ? "text-green-600" : "text-red-600"
                  }
                >
                  {room.isActive ? "Active" : "Inactive"}
                </b>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEdit(room)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
              >
                Edit Room
              </button>

              {room.isActive && (
                <button
                  onClick={() => handleDeactivate(room.id)}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                >
                  Deactivate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ CREATE ROOM MODAL */}
      {createOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Add Room</h2>
                <p className="text-sm text-slate-500">Fill room details</p>
              </div>

              <button
                onClick={() => setCreateOpen(false)}
                className="h-10 w-10 rounded-xl hover:bg-slate-100 transition flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition"
                  placeholder="Room Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Building
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition"
                  placeholder="Building"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Capacity
                  </label>
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition"
                    type="number"
                    placeholder="Capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Floor
                  </label>
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition"
                    type="number"
                    placeholder="Floor"
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* ✅ PHOTO UPLOAD (OPTIONAL) */}
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Room Photo (optional)
                </label>

                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setImageFile(file);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2"
                  />

                  <button
                    type="button"
                    disabled={!imageFile || uploading}
                    onClick={handleUploadPhoto}
                    className="rounded-xl bg-slate-900 text-white px-4 py-2 font-semibold hover:bg-slate-800 transition disabled:opacity-60"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>

                {imageUrl && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-500 mb-2">
                      Preview:
                    </p>
                    <img
                      src={imageUrl}
                      alt="preview"
                      className="h-28 w-full object-cover rounded-xl border border-slate-200"
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition font-semibold"
                >
                  Close
                </button>

                <button
                  onClick={handleCreate}
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ EDIT POPUP */}
      {editOpen && selectedRoom && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Edit Room</h2>
                <p className="text-sm text-slate-500">Update room details</p>
              </div>

              <button
                onClick={() => setEditOpen(false)}
                className="h-10 w-10 rounded-xl hover:bg-slate-100 transition flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Building
                </label>
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition"
                  value={editBuilding}
                  onChange={(e) => setEditBuilding(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Capacity
                  </label>
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition"
                    type="number"
                    value={editCapacity}
                    onChange={(e) => setEditCapacity(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Floor
                  </label>
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition"
                    type="number"
                    value={editFloor}
                    onChange={(e) => setEditFloor(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition font-semibold"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveEdit}
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
