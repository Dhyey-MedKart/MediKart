// services/authService.ts
import axios from "../config/axios";

export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await axios.post("/users/login", credentials);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("An error occurred while logging in.");
    }
  }

}; 

function setError(message: string) {
  console.error(message);
  throw new Error("Function not implemented.");
}


export const uploadToCloudinary = async (file) => {
  try {
      const formData = new FormData();
      formData.append("file", file); // The image file
      formData.append("upload_preset", "crud"); // Replace with your upload preset from Cloudinary
      formData.append("cloud_name", "dfizmtemg"); // Replace with your Cloudinary cloud name
      
      const response = await axios.post(
          `https://api.cloudinary.com/v2/dfizmtemg/image/upload`, // Replace 'your_cloud_name'
          formData
      );
      console.log(response.data.secure_url);
      // The response will contain the URL of the uploaded image
      return response.data.secure_url;
  } catch (error) {
      throw new Error(
          error.response?.data?.message || error.message || "Failed to upload image to Cloudinary"
      );
  }
};

export default uploadToCloudinary;