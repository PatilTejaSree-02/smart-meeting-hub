import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
      
      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error('Access forbidden:', error.response.data);
      }
      
      // Handle 404 Not Found
      if (error.response.status === 404) {
        console.error('Resource not found:', error.response.data);
      }
      
      // Handle 500 Internal Server Error
      if (error.response.status === 500) {
        console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - backend may be down:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
