'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Cookies from "js-cookie";

const EditProductPage = () => {
  const id = useParams();
  const router = useRouter();
  const token = Cookies.get("authToken");
  const [product, setProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    salesPrice: 0,
    mrp: 0,
    category: '',
    images: [],
    tags: '',
  });
  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/products/product/${id.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const productData = response.data.product;
          setProduct(productData);
        })
        .catch((err) => {
          console.error('Failed to fetch product:', err);
        });
    }
  }, [id, token]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        salesPrice: product.salesPrice,
        mrp: product.mrp,
        category: product.category,
        images: product.images, // Array of image URLs
        tags: product.tags.join(', '),
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProduct = {
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()),
    };

    try {
      // Optional: Upload new images
      if (newImages.length > 0) {
        const uploadData = new FormData();
        newImages.forEach((file) => uploadData.append('images', file));
        const uploadResponse = await axios.post(
          'http://localhost:8000/products/upload-images',
          uploadData,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
        updatedProduct.images = [...updatedProduct.images, ...uploadResponse.data.imageUrls];
      }

      await axios.put(`http://localhost:8000/products/update-product/${id.id}`, updatedProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Product updated successfully!');
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Failed to update product:', err);
      alert('Error updating product');
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 text-black flex items-center justify-center">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-black mb-6">Update Product</h2>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="salesPrice"
          placeholder="Sales Price"
          value={formData.salesPrice}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="mrp"
          placeholder="MRP"
          value={formData.mrp}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <label className="block mb-2 font-bold">Images</label>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative">
              <img src={image} alt={`Image ${index}`} className="w-full h-20 object-cover rounded" />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
