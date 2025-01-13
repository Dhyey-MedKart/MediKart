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

