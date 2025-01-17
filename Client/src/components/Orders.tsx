"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
interface Order {
  id: string;
  date: string;
  items: { name: string; quantity: number }[];
  totalAmount: number;
  status: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();


  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const authToken = Cookies.get("authToken");

      if (!authToken) {
        setError("Authentication token is missing. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const formattedOrders = response.data.orders.map((order) => ({
          id: order.id,
          date: new Date(order.createdAt).toLocaleDateString(),
          items: order.items.map((item: { productId: number; quantity: number }) => ({
            name: item.productId, // Replace with a product name lookup if available
            quantity: item.quantity,
          })),
          totalAmount: order.total,
          status: order.status,
        }));
        setOrders(formattedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleGoHome = () => {
    router.push("/dashboard");  // Navigate to the admin dashboard
  };


  return (
    <div className="min-h-screen text-black bg-gray-100">

        <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <button
          onClick={handleGoHome}  // Trigger navigation when clicked
          className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Home
        </button>
      </header>
      <main className="px-6 py-8">
        {loading ? (
          <p className="text-center text-gray-600">Loading your orders...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-lg shadow"
              >
                <h2 className="text-lg font-bold mb-2">Order ID: {order.id}</h2>
                <p className="text-sm text-gray-600">
                  Date: {order.date}
                </p>
                <ul className="mt-2 text-sm text-gray-600">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity} x {item.name}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-sm text-gray-600">
                  Total: ${order.totalAmount.toFixed(2)}
                </p>
                <p
                  className={`mt-2 font-bold ${
                    order.status === "DELIVERED"
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  Status: {order.status}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No orders yet.</p>
        )}
      </main>
    </div>
  );
};

export default Orders;
