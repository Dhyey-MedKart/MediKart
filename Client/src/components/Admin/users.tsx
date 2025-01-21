"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";

const AllUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast(); // Initialize toast

  useEffect(() => {
    const fetchUsers = async () => {
      const toastId = toast({
        title: "Fetching Users...",
        description: "Please wait while we load the user data.",
        status: "loading",
        duration: null, // Keep toast until updated
        isClosable: true,
      });
      try {
        const token = Cookies.get("authToken");

        // Show a loading toast


        const response = await axios.get("http://localhost:8000/users/all-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data);

        // Update the toast to success
        toast.update(toastId, {
          title: "Users Fetched Successfully",
          description: "All users have been loaded.",
          status: "success",
          duration: 600,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        setError("Failed to fetch users. Please try again later.");

        // Show an error toast
        toast.update(toastId,{
          title: "Error Fetching Users",
          description: error.response?.data?.message || "Unable to load user data.",
          status: "error",
          duration: 1500,
          isClosable: true,
        });
      } finally {
        setLoading(false); // Stop the loading state regardless of the outcome
      }
    };

    fetchUsers();
  }, [toast]);

  const handleRoleChange = async (userId: number, currentRole: string) => {
    const newRole = currentRole === "USER" ? "ADMIN" : "USER"; // Toggle the role

    try {
      const token = Cookies.get("authToken");

      // Show a loading toast
      const toastId = toast({
        title: "Updating Role...",
        description: `Changing role to ${newRole}. Please wait.`,
        status: "loading",
        duration: null, // Keep toast until updated
        isClosable: true,
      });

      await axios.put(
        `http://localhost:8000/users/update-profile`,
        { id: userId, role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the local users state with the new role
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      // Update the toast to success
      toast.update(toastId, {
        title: "Role Updated Successfully",
        description: `User role changed to ${newRole}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      setError("Failed to update role. Please try again later.");

      // Show an error toast
      toast({
        title: "Error Updating Role",
        description: error.response?.data?.message || "Unable to update user role.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="min-h-screen text-black bg-gray-100">

        <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Users</h1>
        <button
                className="w-auto text-right px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => router.push("/admin/dashboard")}
              >
                Dashboard
              </button>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {loading ? (
          <p className="text-gray-600">Loading users...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : users.length > 0 ? (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{user.name}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">{user.role}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleRoleChange(user.id, user.role)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
                    >
                      Change Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No users found.</p>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Medikart Admin. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default AllUsers;
