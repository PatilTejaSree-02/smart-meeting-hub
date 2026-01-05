import api from "./api";
import { DashboardStats } from "@/types/dashboard";

export const getDashboardStats = async (
  tenantId: number
): Promise<DashboardStats> => {
  const response = await api.get(`/api/dashboard/stats?tenantId=${tenantId}`);
  return response.data;
};
