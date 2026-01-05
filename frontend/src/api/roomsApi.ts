import api from "./api";
import { Room } from "@/types/room";

// GET ALL ROOMS (USER)
export const getRooms = async (tenantId: number): Promise<Room[]> => {
  const response = await api.get(`/api/rooms?tenantId=${tenantId}`);
  return response.data;
};

// GET ROOM BY ID
export const getRoomById = async (id: number): Promise<Room> => {
  const response = await api.get(`/api/rooms/${id}`);
  return response.data;
};
