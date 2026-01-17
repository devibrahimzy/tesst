// lib/api.ts
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: centralize error handling
api.interceptors.response.use(
  (response) => response, // pass successful responses
  (error: AxiosError<{ message?: string }>) => {
    // Extract server error message if available
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
    // Reject with a clean Error object
    return Promise.reject(new Error(message));
  }
);

export default api;
