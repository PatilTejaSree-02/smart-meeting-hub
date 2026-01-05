import api from "./api";

export interface Booking {
  id: number;
  roomId: number;
  startTime: string;
  endTime: string;
  status: string;
}

export const getBookingsForRoom = async (
  roomId: number,
  tenantId: number
): Promise<Booking[]> => {
  const response = await api.get(
    `/api/bookings/room/${roomId}?tenantId=${tenantId}`
  );
  return response.data;
};

export const createBooking = async (request: {
  roomId: number;
  userId: number;
  tenantId: number;
  startTime: string;
  endTime: string;
}) => {
  return api.post("/api/bookings", request);
};
