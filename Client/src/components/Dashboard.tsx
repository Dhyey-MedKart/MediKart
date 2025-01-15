"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
//import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const userEmail = Cookies.get('userEmail');
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  interface Product {
    name: string;
    wsCode: string;
    salesPrice: number;
    mrp: number;
    packageSize: string;
    tags: string[];
    category: string;
    images: string[];
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        //const cookiesList = await Cookies();
        const token = Cookies.get('authToken');
        const response = await axios.get("http://localhost:8000/products/all-products", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token from the cookie in the Authorization header
          },
        });
        
        setProducts(response.data.products);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handlePageChange(arg0: number): void {
    console.log(arg0);
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen text-black bg-gray-100">
      <header className="bg-blue-600 text-white py-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Medikart</h1>
          <div className="flex items-center space-x-4">
            <p className="text-sm font-bold">
              Logged in as: <span className="font-medium">{userEmail}</span>
            </p>
            <button
              onClick={() => router.push("/cart")}
              className="relative p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
              <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
              🛒
            </button>
          </div>
        </div>
      </header>
  
      <main className="px-6 py-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        {loading ? (
          <p className="text-gray-600">Loading products...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                    width={500}
                    height={500}
                  />
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-sm text-gray-600">WS Code: {product.wsCode}</p>
                  <p className="text-sm text-gray-600">Sales Price: ${product.salesPrice}</p>
                  <p className="text-sm text-gray-600">MRP: ${product.mrp}</p>
                  <p className="text-sm text-gray-600">Package Size: {product.packageSize}</p>
                  <p className="text-sm text-gray-600">Tags: {product.tags.join(", ")}</p>
                  <p className="text-sm text-gray-600">Category: {product.category}</p>
                  <button
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 w-full"
                    onClick={() => alert(`${product.name} added to cart`)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
  
            {/* Pagination */}
            <div className="mt-6 flex justify-center space-x-2">
              {Array.from({ length: Math.ceil(filteredProducts.length / 10) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-lg ${4 === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-600">No products match your search.</p>
        )}
      </main>
  
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Medikart. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
  
};

export default Dashboard;
