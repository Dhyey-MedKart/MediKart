"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useToast } from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get("authToken");
        if (!token) {
          setError("Authorization token is missing. Please log in.");
          return;
        }

        const response = await axios.get("http://localhost:8000/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user profile. Please try again.");
        toast({
          title: "Error",
          description: "Unable to fetch profile details.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [toast]);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 mt-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-black mb-6">Your Profile</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            value={user.name}
            disabled
            className="w-full p-3 border rounded bg-gray-100 text-gray-700"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full p-3 border rounded bg-gray-100 text-gray-700"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Role</label>
          <input
            type="text"
            value={user.role}
            disabled
            className="w-full p-3 border rounded bg-gray-100 text-gray-700"
          />
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">User From</label>
          <input
            type="text"
            value={user.createdAt}
            disabled
            className="w-full p-3 border rounded bg-gray-100 text-gray-700"
          />
  
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-3 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
