import axios from "axios";

const api = axios.create({
  baseURL: "https://team-task-manager-production-7cbf.up.railway.app/api",
});

export default api;