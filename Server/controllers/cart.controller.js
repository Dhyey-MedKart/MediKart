import * as CartService from "../services/cart.service.js";
import prisma from "../db/db.js";

// Controller to add an item to the cart
export const addToCartController = async (req, res) => {
  const { productId, quantity } = req.body;
  let userId = req.user.email;
  userId = await prisma.User.findFirst({
    where: { email : userId},
  });
  userId = userId.id;
  try {
    const cartItem = await CartService.addToCart(userId, productId, quantity);
    res.status(200).json({ cartItem });
  } catch (error) {
    console.error("Error in addToCartController:", error.message);
    res.status(500).json({ message: "Error adding item to cart" });
  }
};

// Controller to remove an item from the cart
export const removeFromCartController = async (req, res) => {
  const { id } = req.params;
  try {
    const cartItem = await CartService.removeFromCart(id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json({ message: "Cart item removed successfully" });
  } catch (error) {
    console.error("Error in removeFromCartController:", error.message);
    res.status(500).json({ message: "Error removing item from cart" });
  }
};

// Controller to get all cart items for a user
export const getCartItemsController = async (req, res) => {
  const userId = req.user.id;
  try {
    const cartItems = await CartService.getCartItems(userId);
    res.status(200).json({ cartItems });
  } catch (error) {
    console.error("Error in getCartItemsController:", error.message);
    res.status(500).json({ message: "Error fetching cart items" });
  }
};

// Controller to update quantity of a cart item
export const updateCartItemController = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const cartItem = await CartService.updateCartItem(id, quantity);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json({ cartItem });
  } catch (error) {
    console.error("Error in updateCartItemController:", error.message);
    res.status(500).json({ message: "Error updating cart item" });
  }
};
