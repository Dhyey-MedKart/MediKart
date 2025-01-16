"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = Cookies.get("authToken");
        const response = await axios.get("http://localhost:8000/orders/all-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data.orders);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleConfirmOrder = async (orderId) => {
    try {
      const token = Cookies.get("authToken");
      await axios.put(
        `http://localhost:8000/orders/update-order-status/${orderId}`,
        { status: "CONFIRMED" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order status updated to CONFIRMED!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "CONFIRMED" } : order
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to confirm the order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6">
        <h1 className="text-2xl font-bold">Admin Order Management</h1>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {loading ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-lg font-bold mb-2">Order #{order.id}</h2>
                <p className="text-sm text-gray-600">
                  <strong>Customer Name:</strong> {order.customerName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {order.customerEmail}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-bold ${
                      order.status === "PENDING"
                        ? "text-yellow-500"
                        : order.status === "CONFIRMED"
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Order Date:</strong> {new Date(order.date).toLocaleString()}
                </p>

                {/* Order Items */}
                <div className="mt-4">
                  <h3 className="text-md font-bold mb-2">Order Items</h3>
                  <ul className="list-disc ml-5 space-y-2">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        <span className="font-bold">{item.productName}</span> - Qty:{" "}
                        {item.quantity}, Price: ${item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <p className="text-lg font-bold">
                    Total: ${order.totalPrice.toFixed(2)}
                  </p>
                  {order.status === "PENDING" && (
                    <button
                      onClick={() => handleConfirmOrder(order.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Confirm Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No orders found.</p>
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

export default AdminOrderPage;
