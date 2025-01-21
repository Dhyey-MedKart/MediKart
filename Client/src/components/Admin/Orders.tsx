"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useToast } from '@chakra-ui/react'


const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const toast = useToast(); // Initialize toast

  useEffect(() => {
    const fetchOrders = async () => {
      const toastId = toast({
        title: "Fetching Orders...",
        description: "Please wait while we retrieve the orders.",
        status: "loading",
        duration: null, // Keep the toast visible until it's updated
        isClosable: true,
      });
      try {
        const token = Cookies.get("authToken");

        // Show a loading toast while fetching orders
        

        const response = await axios.get("http://localhost:8000/orders/all-order", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data); // Directly set the response data

        // Update the toast to indicate success
        toast.update(toastId, {
          title: "Orders Fetched Successfully",
          description: "The orders have been loaded.",
          status: "success",
          duration: 800,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        setError("Failed to fetch orders. Please try again later.");

        // Show an error toast
        toast.update(toastId,{
          title: "Error Fetching Orders",
          description: error.response?.data?.message || "An error occurred while retrieving orders.",
          status: "error",
          duration: 1500,
          isClosable: true,
        });
      } finally {
        setLoading(false); // Stop the loading state regardless of the outcome
      }
    };

    fetchOrders();
  }, [toast]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const confirmUpdate = window.confirm(
      `Are you sure you want to update the status to ${newStatus}?`
    );

    if (!confirmUpdate) return;

    try {
      const token = Cookies.get("authToken");
      await axios.put(
        `http://localhost:8000/orders/update-order-status/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Order status updated to ${newStatus}!`);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update the order status. Please try again.");
    }
  };

  const handleGoHome = () => {
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Order Management</h1>
        <button
          onClick={handleGoHome}
          className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Home
        </button>
      </header>

      <main className="px-6 py-8">
        {loading ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : orders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-lg font-bold mb-2">Order #{order.id}</h2>
                <p className="text-sm text-gray-600">
                  <strong>User ID:</strong> {order.userId}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-bold text-sm px-2 py-1 rounded-full ${
                      order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-600"
                        : order.status === "CONFIRMED"
                        ? "bg-green-100 text-green-600"
                        : order.status === "DELIVERED"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <div className="mt-4">
                  <h3 className="text-md font-bold mb-2">Order Items</h3>
                  <ul className="list-disc ml-5 space-y-2">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        <span className="font-bold">Product ID: {item.productId}</span>{" "}
                        - Qty: {item.quantity}, Price: ${item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <p className="text-lg font-bold">Total: ${order.total.toFixed(2)}</p>
                  <div className="space-x-2">
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "CONFIRMED")}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        Confirm
                      </button>
                    )}
                    {order.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "DELIVERED")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No orders found.</p>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Medikart Admin. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default AdminOrderPage;
