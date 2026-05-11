import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/api";

interface Room {
  id: number;
  name: string;
}

export default function BookRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState<string>("");

  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [attendees, setAttendees] = useState("");

  // 🔹 Fetch rooms
  useEffect(() => {
    api.get("/rooms")
      .then((res) => {
        setRooms(res.data);

        // If coming from /book/:id → auto select
        if (id) {
          setRoomId(id);
        }
      })
      .catch(() => alert("Failed to load rooms"));
  }, [id]);

  // 🔹 Selected room object
  const selectedRoom = rooms.find(r => r.id === Number(roomId));

  // 🔹 Booking function
  const bookRoom = async () => {
    if (!roomId || !date || !start || !end || !attendees) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.post("/bookings", {
        roomId: Number(roomId),
        title: "Meeting",
        bookingDate: date,
        startTime: start,
        endTime: end,
        attendees: Number(attendees),
      });

      alert("Booking successful");

      // ✅ Reset form
      setDate("");
      setStart("");
      setEnd("");
      setAttendees("");

      // If NOT coming from /book/:id → reset room dropdown
      if (!id) {
        setRoomId("");
      }

      // OPTIONAL: redirect to bookings page
      // navigate("/bookings");

    } catch (err: any) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-xl">

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-center mb-6">
          Book Room
        </h1>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5 border">

          {/* ROOM SELECT OR DISPLAY */}
          {!id ? (
            <div>
              <label className="text-sm text-slate-500 block mb-1">
                Select Room
              </label>
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Choose room</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="bg-slate-50 border rounded-xl p-4">
              <p className="text-sm text-slate-500">Selected Room</p>
              <p className="text-lg font-semibold text-slate-800">
                {selectedRoom?.name || "Loading..."}
              </p>
            </div>
          )}

          {/* DATE */}
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              Select Date
            </label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* TIME */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-500 block mb-1">
                Start Time
              </label>
              <input
                type="time"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-slate-500 block mb-1">
                End Time
              </label>
              <input
                type="time"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          {/* ATTENDEES */}
          <div>
            <label className="text-sm text-slate-500 block mb-1">
              Number of Attendees
            </label>
            <input
              type="number"
              placeholder="Enter number of attendees"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={bookRoom}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-md"
          >
            Book Room
          </button>

        </div>
      </div>
    </div>
  );
}