import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:8000",  // Use NEXT_PUBLIC_ prefix for client-side env variables
//   headers: {
//     "Authorization": `Bearer ${localStorage.getItem("token")}`
//   }
// });



// export default axiosInstance;

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // Replace with your backend base URL
  withCredentials: true, // Ensures cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
