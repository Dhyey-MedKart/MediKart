"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";


async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const AdminDashboard = () => {
  const userEmail = Cookies.get("userEmail");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [profileData, setProfileData] = useState<any>(null); // For storing profile data
  const [profileModalOpen, setProfileModalOpen] = useState(false); // Modal visibility state
  const router = useRouter();
  const toast = useToast();

  interface Product {
    id: number;
    name: string;
    wsCode: string;
    salesPrice: number;
    mrp: number;
    packageSize: string;
    tags: string[];
    category: string;
    images: string[]; // Added images array
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
        console.log(error);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.wsCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditProduct = (productId: number) => {
    // Navigate to the edit product page
    router.push(`edit-product/${productId}`);
  };

  const handleLogout = async () => {
    Cookies.remove("authToken");
    const examplePromise = new Promise((resolve) => {
      setTimeout(() => resolve(200), 1000)
    })

    // Will display the loading toast until the promise is either resolved
    // or rejected.
    toast.promise(examplePromise, {
      success: { title: 'Logged Out', description: 'Visit again' },
      error: { title: 'Rejected', description: 'Something wrong' },
      loading: { title: 'Logging Out', description: 'Please wait' },
    })
    await sleep(1000);
    router.push("/login");
    await sleep(1000);
    toast.closeAll();
  };

  const handleProfileDropdown = async () => {
    router.push("../profile");
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="min-h-screen text-black bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/admin/order")}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-200"
            >
              Orders
            </button>

            <button
                className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-200"
                onClick={() => {
                  router.push("/admin/users");
                }}
              >
                Users
              </button>
              
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <Image
                  src="/profile-icon.png"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                  width={32}
                  height={32}
                />
                <span className="font-medium">{userEmail}</span>
              </button>
              {profileDropdown && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 animate-fade-in"
                >
                  <button
                    className="text-black block w-full text-left px-4 py-2 hover:bg-gray-200"
                    onClick={handleProfileDropdown}
                  >
                    Profile
                  </button>
                  <button
                    className="text-black block w-full text-left px-4 py-2 hover:bg-gray-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {/* Add Product Button */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by product name or WS code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => router.push("../add-product")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>

        {/* Product List - Table View */}
        {loading ? (
          <p className="text-gray-600">Loading products...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : currentProducts.length > 0 ? (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2 border">Image</th>
                <th className="px-4 py-2 border">Product Name</th>
                <th className="px-4 py-2 border">WS Code</th>
                <th className="px-4 py-2 border">Sales Price</th>
                <th className="px-4 py-2 border">MRP</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Tags</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-100 ">
                  <td className="px-4 py-2 border">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      width={80}
                      height={80}
                      onClick={() => router.push(`/Product/${product.id}`)}
                    />
                  </td>
                  <td className="px-4 py-2 border" onClick={() => router.push(`/Product/${product.id}`)}>{product.name}</td>
                  <td className="px-4 py-2 border" onClick={() => router.push(`/Product/${product.id}`)}>{product.wsCode}</td>
                  <td className="px-4 py-2 border" onClick={() => router.push(`/Product/${product.id}`)}>${product.salesPrice}</td>
                  <td className="px-4 py-2 border" onClick={() => router.push(`/Product/${product.id}`)}>${product.mrp}</td>
                  <td className="px-4 py-2 border" onClick={() => router.push(`/Product/${product.id}`)}>{product.category}</td>
                  <td className="px-4 py-2 border" onClick={() => router.push(`/Product/${product.id}`)}>{product.tags.join(", ")}</td>
                  <td className="px-4 py-2 border">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-700"
                      onClick={() => handleEditProduct(product.id)}
                    >
                      Edit Product
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No products found.</p>
        )}
      </main>

      {/* Profile Modal */}
      {profileModalOpen && profileData && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <button
              onClick={() => setProfileModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4">User Profile</h2>
            <div className="space-y-4">
              <p><strong>Name:</strong> {profileData.name}</p>
              <p><strong>Email:</strong> {profileData.email}</p>
              <p><strong>Role:</strong> {profileData.role}</p>
              <p><strong>Created At:</strong> {new Date(profileData.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(profileData.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Medikart Admin. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
