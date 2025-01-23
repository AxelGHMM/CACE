import axios from "axios";

// Lee la baseURL desde las variables de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Utiliza VITE_API_BASE_URL del entorno
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
