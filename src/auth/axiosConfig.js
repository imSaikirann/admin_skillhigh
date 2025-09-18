import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

axios.defaults.baseURL = apiUrl;
axios.defaults.withCredentials = true;

// Add token to headers automatically
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;
