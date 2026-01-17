import api from "./api";
import { CreateUserRequest, UpdateUserRequest, User } from "@/types/user";

export const getAdminUsers = async (): Promise<User[]> => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const createUser = async (request: CreateUserRequest): Promise<User> => {
  const res = await api.post("/admin/users", request);
  return res.data;
};

export const updateUser = async (
  id: number,
  request: UpdateUserRequest
): Promise<User> => {
  const res = await api.put(`/admin/users/${id}`, request);
  return res.data;
};

export const deactivateUser = async (id: number): Promise<void> => {
  await api.delete(`/admin/users/${id}`);
};
