import api from "./api";

export type Booking = {
  id: number;
  tenantId: number;
  roomId: number;
  userId: number;
  title: string;
  bookingDate: string;  // yyyy-MM-dd
  startTime: string;    // HH:mm
  endTime: string;      // HH:mm
  attendees: number;
  status: string;
};

// ✅ My bookings for logged in user
export const getMyBookings = async (): Promise<Booking[]> => {
  const res = await api.get("/bookings");
  return res.data;
};

// ✅ Create booking (userId + tenantId automatically from backend token)
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

// ✅ Cancel booking
export const cancelBooking = async (id: number) => {
  await api.delete(`/bookings/${id}`);
};
