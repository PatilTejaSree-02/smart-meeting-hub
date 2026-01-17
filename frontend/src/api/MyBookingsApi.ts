import api from "./api";

export const getMyBookings = async () => {
  const res = await api.get("/bookings"); // already returns logged-in user bookings
  return res.data;
};
