'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import UploadMultiImage from "../services/auth";
import { Spinner, useToast, Stack } from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const EditProductPage = () => {
  const id = useParams();
  const router = useRouter();
  const token = Cookies.get('authToken');
  const [product, setProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    salesPrice: 0,
    mrp: 0,
    category: '',
    images: [], // Array of image objects, each having url and order
    tags: '',
  });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
        images: product.images.map((image, index) => ({
          url: image,
          order: index + 1, // Set default order based on index
        })),
        tags: product.tags.join(', '),
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    let newOrder = parseInt(value, 10);

    // Ensure the order is unique
    const existingOrders = formData.images.map((img) => img.order);
    if (existingOrders.includes(newOrder)) {
      // If the number already exists, find the next available number
      while (existingOrders.includes(newOrder)) {
        newOrder++;
      }
    }

    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = { ...updatedImages[index], [name]: newOrder };
      return { ...prev, images: updatedImages };
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const response = await UploadMultiImage(files);
      const uploadedUrls = response;
      setProduct((prevProduct) => ({
        ...prevProduct,
        images: uploadedUrls,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure images are sorted by order before submitting
    const updatedProduct = {
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()),
      images: formData.images
        .sort((a, b) => a.order - b.order) // Sort by order
        .map((img) => img.url), // Map to only include the URL
    };

    try {
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

      toast({
        title: 'Product Updated',
        description: `${updatedProduct.name} has been updated successfully!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Failed to update product:', err);

      toast({
        title: 'Error Updating Product',
        description: 'There was an issue updating the product. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return; // No destination means the item wasn't dropped

    const reorderedImages = Array.from(formData.images);
    const [removed] = reorderedImages.splice(source.index, 1); // Remove the dragged image
    reorderedImages.splice(destination.index, 0, removed); // Insert it at the new position

    // After the drag, reassign the order values based on the new position
    const updatedImages = reorderedImages.map((image, index) => ({
      ...image,
      order: index + 1, // Reassign order based on new index
    }));

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 text-black flex items-center justify-center">
        <Stack direction="row" spacing={4}>
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        </Stack>
      </div>
    );
  }

  if (!product) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 text-black flex items-center justify-center">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-black mb-6">Update Product</h2>

        {/* Displaying the product details */}
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

        {/* Image List */}
        <label className="block mb-2 font-bold">Images</label>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="image-list" direction="vertical">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {formData.images.map((image, index) => (
                  <Draggable key={image.url} draggableId={image.url} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="mb-2 flex items-center space-x-4"
                      >
                        <img src={image.url} alt={`Image ${image.order}`} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <input
                            type="number"
                            value={index + 1} // Display the current index + 1 as order
                            disabled
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="bg-red-500 text-white rounded-full p-1 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="w-full mb-4"
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
