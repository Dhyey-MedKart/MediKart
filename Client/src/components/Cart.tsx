"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
//import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";

const Cart = () => {
  interface CartItem {
    id: number;
    product: {
      name: string;
      id: number;
      wsCode: string;
      packageSize: string;
      salesPrice: number;
      images: string[];
    };
    quantity: number;
  }

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isConfirmPopupVisible, setIsConfirmPopupVisible] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Get the auth token from cookies
        const token = Cookies.get("authToken");
        if (!token) {
          setError("Authorization token is missing. Please log in.");
          return;
        }

        // Fetch cart items
        const response = await axios.get("http://localhost:8000/cart/cart-items", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(response.data.cartItems);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch cart items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemove = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        setError("Authorization token is missing. Please log in.");
        return;
      }

      await axios.post(
        "http://localhost:8000/cart/add-to-cart",
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update quantity. Please try again later.");
    }
  };

  const handleConfirmOrder = () => {
    // Redirect to the order page
    window.location.href = "/order";
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.product.salesPrice * item.quantity,
    0
  );

  return (
    <div className="min-h-screen text-black bg-gray-100">
      <header className="bg-blue-600 text-white py-4 px-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </header>
      <main className="px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-600 text-center">Loading cart items...</p>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : cartItems.length > 0 ? (
          <>
            <div className="col-span-2">
              <div className="grid grid-cols-1 gap-6">
                {cartItems.map((item: CartItem) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Image
                        src={item.product.images[0]} // Display the first image
                        alt={item.product.name}
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />
                      <div className="ml-4">
                        <h3 className="text-lg font-bold">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">WS Code: {item.product.wsCode}</p>
                        <p className="text-sm text-gray-600">Package: {item.product.packageSize}</p>
                        <p className="text-sm text-gray-600">Price: ${item.product.salesPrice}</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="px-2 py-1 bg-gray-200 rounded-lg"
                          >
                            -
                          </button>
                          <span className="mx-2 text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="px-2 py-1 bg-gray-200 rounded-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-600 font-bold hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Billing Summary</h2>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-800">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%):</span>
                <span className="text-gray-800">${(totalAmount * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold mt-4">
                <span>Total:</span>
                <span>${(totalAmount * 1.1).toFixed(2)}</span>
              </div>
              <button
                onClick={() => setIsConfirmPopupVisible(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 block text-center"
              >
                Proceed to Checkout
              </button>
            </div>

            {isConfirmPopupVisible && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h3 className="text-xl font-bold mb-4">Confirm Your Order</h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to confirm this order? The total amount is ${
                      (totalAmount * 1.1).toFixed(2)
                    }.
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setIsConfirmPopupVisible(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmOrder}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-600 text-center">Your cart is empty.</p>
        )}
      </main>
    </div>
  );
};

export default Cart;
