import api from "./api";
import { Room } from "@/types/room";

export interface CreateOrUpdateRoomRequest {
  name: string;
  location: string;
  capacity: number;
  tenantId: number;
}

export const getAdminRooms = async (
  tenantId: number
): Promise<Room[]> => {
  const response = await api.get(`/api/admin/rooms?tenantId=${tenantId}`);
  return response.data;
};

export const createRoom = async (
  request: CreateOrUpdateRoomRequest
): Promise<Room> => {
  const response = await api.post("/api/admin/rooms", request);
  return response.data;
};

export const updateRoom = async (
  id: number,
  request: CreateOrUpdateRoomRequest
): Promise<Room> => {
  const response = await api.put(`/api/admin/rooms/${id}`, request);
  return response.data;
};

export const deactivateRoom = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/rooms/${id}`);
};
