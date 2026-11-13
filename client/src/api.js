import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// attach the token to every request if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// helper to get a readable error message from a failed request
export const getErrorMessage = (err) => {
  return err.response?.data?.message || "Something went wrong, try again";
};

export default api;
