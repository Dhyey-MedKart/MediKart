"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "../config/axios"; // Import the Axios instance
import { useRouter } from "next/navigation";
import { useToast } from '@chakra-ui/react'

interface RegisterFormInputs {
  email: string;
  password: string;
  name: string;
  role: "USER";
}

const RegisterForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast()
  const onSubmit = async (data: RegisterFormInputs) => {
    setError(null); // Reset error state
    try {
      const response = await axios.post("/users/register", data);
      console.log("Registered successfully:", response.data);

      // Navigate to the dashboard on success
      toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      router.push("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h1 className="text-xl font-bold mb-4">Register</h1>

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          {...register("email", { required: "Email is required" })}
          className="w-full p-2 border border-gray-300 rounded mt-1" 
        />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          {...register("password", { required: "Password is required" })}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700">name</label>
        <input
          type="name"
          id="name"
          {...register("name", { required: "name is required" })}
          className="w-full p-2 border border-gray-300 rounded mt-1"
        />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
