import api from "./api";

/* ================= TYPES ================= */

export type Booking = {
  id: number;
  roomId: number;          // still useful internally
  roomName: string;        // ✅ NEW (for UI)
  title: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  attendees: number;
  status: string;
};

/* ================= USER BOOKINGS ================= */

// ✅ Get logged-in user's bookings
export const getMyBookings = async (): Promise<Booking[]> => {
  const res = await api.get("/bookings");
  return res.data;
};

/* ================= ROOM BOOKINGS ================= */

// ✅ Get bookings for a specific room (used in RoomDetails)
export const getBookingsForRoom = async (
  roomId: number
): Promise<Booking[]> => {
  const res = await api.get(`/bookings/room/${roomId}`);
  return res.data;
};

/* ================= CREATE ================= */

export const createBooking = async (payload: {
  roomId: number;
  title: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  attendees: number;
}) => {
  const res = await api.post("/bookings", payload);
  return res.data;
};

/* ================= RESCHEDULE ================= */

export const rescheduleBooking = async (
  bookingId: number,
  payload: {
    bookingDate: string;
    startTime: string;
    endTime: string;
  }
) => {
  const res = await api.put(`/bookings/${bookingId}/reschedule`, payload);
  return res.data;
};

/* ================= CANCEL ================= */

export const cancelBooking = async (id: number) => {
  await api.delete(`/bookings/${id}`);
};