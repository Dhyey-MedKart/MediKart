"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
//import { useToast } from "@chakra-ui/react";
import { Spinner, Stack, Center, Box, Button, Image, Text } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

interface Product {
  id: number;
  name: string;
  description: string;
  salesPrice: number;
  mrp: number;
  images: string[];
  tags: string[];
  category: string;
}

interface Props {
  id: number;
}



const ProductPage: React.FC<Props> = () => {
  const { id } = useParams();
  const token = Cookies.get("authToken");
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const router = useRouter();
    const toast = useToast();
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/products/product/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProduct(response.data.product);
      } catch (error) {
        console.error(error);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token]);



  const handleAddToCart = async () => {
     // Initialize the toast
    setAddingToCart(true);
  
    try {
      await axios.post(
        "http://localhost:8000/cart/add-to-cart",
        {
          productId: product?.id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Show success toast
      toast({
        title: "Product Added",
        description: `${product?.name} has been added to your cart.`,
        status: "success",
        duration: 800,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
  
      // Show error toast
      toast({
        title: "Error Adding Product",
        description: "Failed to add product to cart. Please try again.",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        prevIndex === 0 ? product?.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        prevIndex === product?.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Stack direction="row" spacing={4}>
        <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
            />
          <Text>Loading product details...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black flex justify-center items-center py-10">
      {product && (
        <div className="bg-white rounded-lg shadow-md max-w-7xl w-full mx-4 p-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="text-lg font-semibold text-blue-600 mb-6 flex items-center"
          >
            ← Back
          </button>

          {/* Home Button */}
          <div className="flex flex-col md:flex-row items-center justify-center">
            {/* Product Images (Gallery) */}
            <div className="w-full md:w-1/2 relative">
              <div className="flex justify-center items-center">
                {/* Left Arrow Button */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-0 text-white text-3xl p-4 bg-black bg-opacity-50 hover:bg-opacity-75 opacity-0 hover:opacity-100 transition-opacity duration-300"
                >
                  ←
                </button>

                {/* Image Display */}
                <img
                  src={product.images[currentImageIndex] || "/placeholder.png"}
                  alt={product.name}
                  className="object-cover rounded-lg w-full h-80"
                />

                {/* Right Arrow Button */}
                <button
                  onClick={handleNextImage}
                  className="absolute right-0 text-white text-3xl p-4 bg-black bg-opacity-50 hover:bg-opacity-75 opacity-0 hover:opacity-100 transition-opacity duration-300"
                >
                  →
                </button>
              </div>

              {/* All Images Gallery */}
              <div className="mt-4 flex space-x-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer ${
                      currentImageIndex === index ? "border-2 border-blue-600" : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6 flex flex-col justify-between w-full md:w-1/2 mt-6 md:mt-0">
              <div>
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <p className="text-gray-700 mb-4">{product.description}</p>
                <div className="flex items-center space-x-4 mb-4">
                  <p className="text-xl font-semibold text-blue-600">
                    ${product.salesPrice}
                  </p>
                  {product.mrp > product.salesPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      ${product.mrp}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Category: {product.category}
                </p>
                <p className="text-sm text-gray-600">
                  Tags: {product.tags.join(", ")}
                </p>
              </div>

              {/* Add to Cart Section */}
              <div className="mt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded"
                    onClick={() =>
                      setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                    }
                  >
                    -
                  </button>
                  <p className="text-lg">{quantity}</p>
                  <button
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 text-lg w-full"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
