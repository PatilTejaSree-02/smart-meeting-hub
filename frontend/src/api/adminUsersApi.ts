import api from "./api";
import { User, CreateUserRequest, UpdateUserRequest } from "@/types/user";

export const getAdminUsers = async (
  tenantId: number
): Promise<User[]> => {
  const response = await api.get(`/api/admin/users?tenantId=${tenantId}`);
  return response.data;
};

export const createUser = async (
  request: CreateUserRequest
): Promise<User> => {
  const response = await api.post("/api/admin/users", request);
  return response.data;
};

export const updateUser = async (
  id: number,
  request: UpdateUserRequest
): Promise<User> => {
  const response = await api.put(`/api/admin/users/${id}`, request);
  return response.data;
};

export const deactivateUser = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/users/${id}`);
};
