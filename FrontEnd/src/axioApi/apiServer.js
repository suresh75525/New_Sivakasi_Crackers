import axios from "axios";

const axioApi = axios.create({
  // baseURL: "http://3.6.230.244:5000/api",
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axioApi;
