import axios from "axios";

const axioApi = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "http://api.srigoldencrackers.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axioApi;