"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  wsCode: string;
  salesPrice: number;
  mrp: number;
  packageSize: string;
  tags: string[];
  category: string;
  images: string[];
}

const ITEMS_PER_PAGE = 12; // Number of products per page

const Dashboard: React.FC = () => {
  const userEmail = Cookies.get("userEmail");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1); // Pagination state
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = Cookies.get("authToken");
        const response = await axios.get("http://localhost:8000/products/all-products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data.products);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.wsCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination details
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex min-h-screen text-black bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Medikart</h2>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 px-4">
            <li>
              <button
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => router.push("/admin/dashboard")}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => router.push("/order")}
              >
                Orders
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => router.push("/cart")}
              >
                Cart
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => {
                  Cookies.remove("authToken");
                  router.push("/login");
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </header>

        {/* Product Grid */}
        <main className="p-6">
          {loading ? (
            <p className="text-gray-600">Loading products...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white p-3 rounded-lg shadow hover:shadow-lg transition-transform duration-300 transform hover:scale-105"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                      width={400}
                      height={400}
                    />
                    <h3 className="text-md font-bold mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">WS Code: {product.wsCode}</p>
                    <p className="text-sm text-gray-600">Sales Price: ${product.salesPrice}</p>
                    <button className="mt-3 bg-blue-600 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-700 w-full">
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
              {/* Pagination Controls */}
              <div className="flex justify-center items-center space-x-4 mt-6">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-600">No products match your search.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
