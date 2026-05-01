import axios from "axios";

const api = axios.create({
  baseURL: "https://team-task-manager-production-7cbf.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;