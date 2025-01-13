import prisma from "../db/db.js";

// Service to add an item to the cart
export const addToCart = async (userId, productId, quantity) => {
  try {
    const existingCartItem = await prisma.cartItem.findFirst({
      where: { userId, productId },
    });

    if (existingCartItem) {
      // If the product is already in the cart, update the quantity
      return await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      // Add a new cart item if not already in the cart
      return await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });
    }
  } catch (error) {
    console.error("Error in addToCart:", error.message);
    throw new Error("Error adding item to cart: " + error.message);
  }
};

// Service to remove an item from the cart
export const removeFromCart = async (id) => {
  try {
    const cartItem = await prisma.cartItem.delete({
      where: { id: parseInt(id) },
    });
    return cartItem;
  } catch (error) {
    console.error("Error in removeFromCart:", error.message);
    throw new Error("Error removing item from cart: " + error.message);
  }
};

// Service to get all cart items for a user
export const getCartItems = async (userId) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }, // You can include the product details if needed
    });
    return cartItems;
  } catch (error) {
    console.error("Error in getCartItems:", error.message);
    throw new Error("Error fetching cart items: " + error.message);
  }
};

// Service to update the quantity of a cart item
export const updateCartItem = async (id, quantity) => {
  try {
    const cartItem = await prisma.cartItem.update({
      where: { id: parseInt(id) },
      data: { quantity },
    });
    return cartItem;
  } catch (error) {
    console.error("Error in updateCartItem:", error.message);
    throw new Error("Error updating cart item: " + error.message);
  }
};
