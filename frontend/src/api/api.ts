import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===============================
   REQUEST INTERCEPTOR
   - Attach JWT ONLY for protected APIs
   - NEVER attach token to /api/auth/**
================================ */
api.interceptors.request.use(
  (config) => {
    const isAuthRequest =
      config.url?.includes("/api/auth/login") ||
      config.url?.includes("/api/auth/register");

    if (!isAuthRequest) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

/* ===============================
   RESPONSE INTERCEPTOR
   - Handle common HTTP errors
================================ */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          // Unauthorized (invalid credentials / expired token)
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/";
          break;

        case 403:
          // Forbidden (no permission / invalid JWT)
          console.error("Access forbidden:", error.response.data);
          break;

        case 404:
          console.error("Resource not found:", error.response.data);
          break;

        case 500:
          console.error("Server error:", error.response.data);
          break;

        default:
          console.error("API error:", error.response.data);
      }
    } else if (error.request) {
      console.error(
        "Network error - backend may be down:",
        error.message
      );
    } else {
      console.error("Axios error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
