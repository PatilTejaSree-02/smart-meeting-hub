import api from "./api";

export const getAdminAnalytics = async () => {
  const res = await api.get("/admin/analytics");
  return res.data;
};
