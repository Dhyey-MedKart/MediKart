import * as ProductService from "../services/product.service.js";
import prisma from "../db/db.js";
// Controller to delete a product
export const deleteProductController = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductService.deleteProduct(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProductController:", error.message);
    res.status(500).json({ message: "Error deleting product" });
  }
};

// Controller to get a single product
export const getProductController = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductService.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.error("Error in getProductController:", error.message);
    res.status(500).json({ message: "Error fetching product" });
  }
};

// Controller to get all products
export const getAllProductsController = async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();
    res.status(200).json({ products });
  } catch (error) {
    console.log("Error in getAllProductsController:", error.message);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Controller to update a product
export const updateProductController = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const product = await ProductService.updateProduct(id, updates);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.log("Error in updateProductController:", error.message);
    res.status(500).json({ message: "Error updating product" });
  }
};

// Controller to create a product
export const createProductController = async (req, res) => {
  const { name, wsCode, salesPrice, mrp, packageSize, images, tags, category} = req.body; // Assuming `req.user` contains the authenticated user data
  let userId = req.user.email;
  
  userId = await prisma.User.findFirst({
    where: { email : userId},
  });
  userId = userId.id;
  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const product = await ProductService.addProduct({
      name,
      wsCode,
      salesPrice,
      mrp,
      packageSize,
      images,
      tags,
      category,
    });

    res.status(201).json({ product });
  } catch (error) {
    console.error("Error in createProductController:", error.message);
    res.status(500).json({ message: "Error creating product" });
  }
};

