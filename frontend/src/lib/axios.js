import axios from "axios";

const api = axios.create({
  baseURL: "https://univorahomes.onrender.com/api",
  withCredentials: true,
});

export default api;
