import axios from "axios";

// ✅ Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

// ✅ Attach JWT token automatically to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Extract tenant from email
const getTenantFromEmail = (email: string) => {
  const domain = email.split("@")[1];   // example: globex.com
  return domain.split(".")[0];          // result: globex
};

// ✅ LOGIN FUNCTION
export const login = async (email: string, password: string) => {
  const tenant = getTenantFromEmail(email);

  // optional but useful
  localStorage.setItem("tenant", tenant);

  const res = await api.post("/auth/login", {
    email,
    password,
    tenant,
  });

  // ✅ STORE TOKEN (MOST IMPORTANT FIX)
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};

// ✅ LOGOUT FUNCTION (optional but recommended)
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("tenant");
  window.location.href = "/"; // redirect to login/home
};

export default api;