"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";

const Cart = () => {
  interface CartItem {
    id: number;
    product: {
      name: string;
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

  const handleCheckout = () => {
    alert("Proceeding to checkout!");
    // Add navigation to checkout page or order summary
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
      <main className="px-6 py-8">
        {loading ? (
          <p className="text-gray-600 text-center">Loading cart items...</p>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : cartItems.length > 0 ? (
          <>
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
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
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
            <div className="mt-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Total: ${totalAmount.toFixed(2)}</h2>
              <Link
                href="/order"
                onClick={handleCheckout}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-center">Your cart is empty.</p>
        )}
      </main>
    </div>
  );
};

export default Cart;
