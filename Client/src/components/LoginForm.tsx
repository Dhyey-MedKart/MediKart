"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "../config/axios"; // Import the Axios instance
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { useToast } from '@chakra-ui/react'

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast()
  const onSubmit = async (data: LoginFormInputs) => {
    setError(null); // Reset error state
    const toastId = toast({
      title: 'Authorizing...',
      description: 'Please wait while we log you in.',
      status: 'loading',
      duration: null, // Ensure the toast stays until updated
      isClosable: true,
    });
    try {
      // Show loading toast while the API call is in progress
      
  
      const response = await axios.post('/users/login', data);
  
      // If successful, update the toast and proceed
      toast.update(toastId, {
        title: 'Login Successful',
        description: `Welcome back, ${response.data.user.name}!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
  
      // Store cookies for authentication
      Cookies.set('authToken', response.data.token, { expires: 7, secure: true });
      Cookies.set('userEmail', response.data.user.name, { expires: 7, secure: true });
  
      // Redirect based on the user's role
      if (response.data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      // Display error toast
      toast.update(toastId,{
        title: 'Login Failed',
        description: err.response?.data?.message || 'An error occurred while logging in.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h1 className="text-xl font-bold mb-4">Login</h1>

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

      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
