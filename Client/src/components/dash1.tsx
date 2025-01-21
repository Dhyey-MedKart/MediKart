"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react"; // Import useToast from Chakra UI

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


async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1); // Pagination state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Selected product for cart
  const [quantity, setQuantity] = useState<number>(1); // Quantity state
  const router = useRouter();
  const toast = useToast(); // Initialize useToast hook

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

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true); // Open the modal to select quantity
  };

  const handleQuantityChange = (operation: "increase" | "decrease") => {
    setQuantity((prevQuantity) =>
      operation === "increase" ? prevQuantity + 1 : prevQuantity > 1 ? prevQuantity - 1 : 1
    );
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

  const handleConfirm = async () => {
    if (selectedProduct) {
      try {
        const token = Cookies.get("authToken");
        const response = await axios.post(
          "http://localhost:8000/cart/add-to-cart",
          {
            productId: selectedProduct.id,
            quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data); // Handle success (e.g., show a success message)

        // Show a success toast when the product is added to the cart
        toast({
          title: "Added to Cart",
          description: `${selectedProduct.name} has been added to your cart!`,
          status: "success",
          duration: 800,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        setError("Failed to add to cart. Please try again later.");
      } finally {
        setIsModalOpen(false); // Close the modal after confirming
      }
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
                onClick={() => router.push("/dashboard")}
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
                onClick={handleLogout}
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
                      onClick={() => router.push(`/Product/${product.id}`)}
                    />
                    <h3 className="text-md font-bold mb-1" onClick={() => router.push(`/Product/${product.id}`)}>{product.name}</h3>
                    <p className="text-sm text-gray-600" onClick={() => router.push(`/Product/${product.id}`)}>WS Code: {product.wsCode}</p>
                    <p className="text-sm text-gray-600" onClick={() => router.push(`/Product/${product.id}`)}>Sales Price: ${product.salesPrice}</p>
                    <button
                      className="mt-3 bg-blue-600 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-700 w-full"
                      onClick={() => handleAddToCart(product)}
                    >
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

        {/* Quantity Modal */}
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="text-xl font-bold mb-4">Select Quantity</h3>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("increase")}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  +
                </button>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
