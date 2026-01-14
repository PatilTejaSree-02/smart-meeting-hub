import api from "./api";
import { Room } from "@/types/room";

export const getAdminRooms = async () => {
  const res = await api.get("/admin/rooms");
  return res.data;
};

export const createRoom = async (room: Partial<Room>) => {
  const res = await api.post("/admin/rooms", room);
  return res.data;
};

export const deactivateRoom = async (id: number) => {
  await api.delete(`/admin/rooms/${id}`);
};
