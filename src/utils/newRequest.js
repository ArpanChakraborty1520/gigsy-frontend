import axios from "axios";

// Axios instance with credentials support for JWT cookies
const newRequest = axios.create({
  baseURL: "http://localhost:5000/api",  // ✅ Update this if your backend URL is different
  withCredentials: true,                  // ✅ Important for sending cookies with requests
});

export default newRequest;
