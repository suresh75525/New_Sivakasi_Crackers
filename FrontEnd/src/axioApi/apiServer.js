import axios from "axios";

const axioApi = axios.create({
  baseURL: "http://localhost:5000/api", // change to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axioApi;