import api from "./api";

export type MeResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  role: string;
  status: string;
};

export const getMyProfile = async (): Promise<MeResponse> => {
  const res = await api.get("/users/me");
  return res.data;
};
