import axios from "axios";

const axiosInstance = axios.create({
  //   baseURL: "http://localhost:5000/",
  baseURL: "https://chat-app-mern-production-66ad.up.railway.app/",
});

export default axiosInstance;
