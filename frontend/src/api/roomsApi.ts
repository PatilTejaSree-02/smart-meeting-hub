import api from "./api";
import { Room } from "@/types/room";

// ✅ GET ALL ACTIVE ROOMS for logged in tenant (tenant comes from JWT)
export const getRooms = async (): Promise<Room[]> => {
  const res = await api.get("/rooms");
  return res.data;
};

// ✅ GET ROOM BY ID
export const getRoomById = async (id: number): Promise<Room> => {
  const res = await api.get(`/rooms/${id}`);
  return res.data;
};
