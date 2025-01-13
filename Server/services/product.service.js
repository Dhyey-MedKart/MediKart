import prisma from "../db/db.js";

// Add a new product
export const addProduct = async ({ name, wsCode, salesPrice, mrp, packageSize, images = [], tags, category}) => {
  console.log("Received data in addProduct:", {
    name,
    wsCode,
    salesPrice,
    mrp,
    packageSize,
    images,
    tags,
    category,
  });

  if (!name || !wsCode || !salesPrice || !mrp || !packageSize || !category) {
    throw new Error("Missing required product fields.");
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        wsCode,
        salesPrice,
        mrp,
        packageSize,
        images,
        tags,
        category,
      },
    });

    return product;
  } catch (error) {
    console.error("Error in addProduct:", error);
    throw new Error("Error adding product: " + error.message);
  }
};


// Delete a product by ID
export const deleteProduct = async (id) => {
    try {
        const product = await prisma.product.delete({
            where: { id: parseInt(id) },
        });
        return product;
    } catch (error) {
        console.error("Error in deleteProduct:", error.message);
        throw new Error("Error deleting product: " + error.message);
    }
};

// Get a product by ID
export const getProductById = async (id) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
        });

        if (!product) {
            throw new Error("Product not found");
        }

        return product;
    } catch (error) {
        console.error("Error in getProductById:", error.message);
        throw new Error("Error fetching product: " + error.message);
    }
};

// Get all products
export const getAllProducts = async () => {
    try {
        const products = await prisma.product.findMany();
        return products;
    } catch (error) {
        console.error("Error in getAllProducts:", error.message);
        throw new Error("Error fetching products: " + error.message);
    }
};

// Update a product by ID
export const updateProduct = async (id, updates) => {
    try {
        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: updates,
        });
        return product;
    } catch (error) {
        console.error("Error in updateProduct:", error.message);
        throw new Error("Error updating product: " + error.message);
    }
};
