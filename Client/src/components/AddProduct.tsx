"use client";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import UploadMultiImage from "../services/auth";
const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    wsCode: "",
    salesPrice: "",
    mrp: "",
    packageSize: "",
    images: [] as string[], // URLs instead of File objects
    tags: "",
    category: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);

        // Upload the files and get the responses
        const response = await UploadMultiImage(files);
        console.log(response);
        // Assuming `UploadMultiImage` returns an array of Cloudinary URLs
        const uploadedUrls = response;

        // Update the product state with the actual Cloudinary URLs
        setProduct((prevProduct) => ({
            ...prevProduct,
            images: uploadedUrls,
        }));

        console.log("Uploaded URLs:", uploadedUrls);
    }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      // Get the auth token from cookies
      const token = Cookies.get("authToken");
      if (!token) {
        setError("Authorization token is missing. Please log in.");
        return;
      }

      // Convert tags from a comma-separated string to an array
      const formattedTags = product.tags.split(",").map((tag) => tag.trim());

      // Construct the payload
      const payload = {
        name: product.name,
        wsCode: product.wsCode,
        salesPrice: parseFloat(product.salesPrice),
        mrp: parseFloat(product.mrp),
        packageSize: parseInt(product.packageSize, 10),
        images: product.images,
        tags: formattedTags,
        category: product.category,
      };

      // Make the POST request
      const response = await axios.post("http://localhost:8000/products/create-product", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        setSuccessMessage(`Product "${product.name}" added successfully!`);
        setProduct({
          name: "",
          wsCode: "",
          salesPrice: "",
          mrp: "",
          packageSize: "",
          images: [],
          tags: "",
          category: "",
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to add the product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black flex items-center justify-center">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-black mb-6">Add New Product</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="wsCode"
          placeholder="WS Code"
          value={product.wsCode}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="salesPrice"
          placeholder="Sales Price"
          value={product.salesPrice}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="mrp"
          placeholder="MRP"
          value={product.mrp}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="packageSize"
          placeholder="Package Size"
          value={product.packageSize}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="w-full mb-4"
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          value={product.tags}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
