import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Vite сам проксит на backend
  withCredentials: true,
});

export default api;