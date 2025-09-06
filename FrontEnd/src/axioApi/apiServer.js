import axios from "axios";

const axioApi = axios.create({
  baseURL: "https://jayavardhencracker.com/api",
  // baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axioApi;
