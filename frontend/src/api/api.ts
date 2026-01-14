import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

/**
 * Attach JWT token automatically to every request
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


const getTenantFromEmail = (email: string) => {
  const domain = email.split("@")[1];   // globex.com
  return domain.split(".")[0];          // globex
};

export const login = async (email: string, password: string) => {
  const tenant = getTenantFromEmail(email);

  // store tenant for later use (optional but useful)
  localStorage.setItem("tenant", tenant);

  const res = await api.post("/auth/login", {
    email,
    password,
    tenant,
  });

  return res.data;
};

export default api;
