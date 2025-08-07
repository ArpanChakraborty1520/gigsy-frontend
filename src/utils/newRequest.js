import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://gigsy-backend.onrender.com/api", // ✅ Add /api here
  withCredentials: true, // ✅ Required for sending cookies
});

export default newRequest;
