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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1); // Pagination state
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [discountFilter, setDiscountFilter] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Selected product for cart
  const [quantity, setQuantity] = useState<number>(1); // Quantity state
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false); // Profile menu dropdown state
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
        setFilteredProducts(response.data.products);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Apply filters
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (categoryFilter ? product.category === categoryFilter : true) &&
      product.salesPrice >= minPrice && product.salesPrice <= maxPrice &&
      (discountFilter ? product.mrp - product.salesPrice >= discountFilter : true)
    );
    setFilteredProducts(filtered);
  }, [searchQuery, categoryFilter, minPrice, maxPrice, discountFilter, products]);

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

  const handleLogout = async () => {
    Cookies.remove("authToken");
    const examplePromise = new Promise((resolve) => {
      setTimeout(() => resolve(200), 1000)
    })
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

  return (
    <div className="flex min-h-screen text-black bg-gray-100">
      {/* Sidebar with Filters */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col p-6">

        <h2 className="text-2xl font-bold mb-6">Filters</h2>
        <div className="space-y-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-black p-2 border rounded-lg w-full"
          >
            <option value="">Select Category</option>
            <option value="Health">Health</option>
            <option value="Beauty">Beauty</option>
            <option value="Fitness">Fitness</option>
          </select>
          <div className="flex space-x-4 text-black">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              placeholder="Min Price"
              className="p-2 border rounded-lg w-full"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              placeholder="Max Price"
              className="p-2 border rounded-lg w-full"
            />
          </div>
          <input
            type="number"
            value={discountFilter}
            onChange={(e) => setDiscountFilter(Number(e.target.value))}
            placeholder="Min Discount"
            className="p-2 border rounded-lg w-full text-black"
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Medikart</h2>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-1/3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        <div className="mb-6">
          {/* Profile section with Select tag */}
          <div className="relative">
            <select
              className="bg-white text-black px-4 py-2 rounded-full w-full mb-3"
              onChange={(e) => {
                const selectedOption = e.target.value;
                if (selectedOption === "profile") {
                  router.push("/profile");
                } else if (selectedOption === "logout") {
                  handleLogout();
                }
                else if (selectedOption === "cart") {
                  router.push("/cart");
                }
                else if (selectedOption === "order") {
                  router.push("/order");
                }
              }}
            >
              <option value="">User Profile</option>
              <option value="profile">Profile</option>
              <option value="cart">Cart</option>
              <option value="order">Orders</option>
              <option value="logout" className="text-red-600">Logout</option>
            </select>
          </div>
        </div>
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
      </div>

      {/* Add to Cart Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Add to Cart</h3>
            <div className="mb-4">
              <p className="text-sm font-semibold">{selectedProduct.name}</p>
              <div className="flex justify-between mt-2">
                <button onClick={() => handleQuantityChange("decrease")} className="px-3 py-1 bg-gray-200 rounded-full">-</button>
                <span className="mx-4">{quantity}</span>
                <button onClick={() => handleQuantityChange("increase")} className="px-3 py-1 bg-gray-200 rounded-full">+</button>
              </div>
            </div>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
              onClick={handleConfirm}
            >
              Confirm
            </button>
            <button
              className="w-full mt-2 bg-gray-300 text-black py-2 rounded-lg"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
