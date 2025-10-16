import axios from "axios";

const api = axios.create({
  baseURL: "/api", // ← Change this to use same origin
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
