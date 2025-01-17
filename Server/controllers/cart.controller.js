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
  console.log(id);
  let userId = req.user.email;
  userId = await prisma.User.findFirst({
    where: { email : userId},
  });
  userId = userId.id; // Assuming the user is authenticated
  try {
    const cartItem = await CartService.removeFromCart(userId,parseInt(id));
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json({ message: "Cart item removed successfully" });
  } catch (error) {
    console.error("Error in removeFromCartController:", error.message);
    res.status(500).json({ message: "Error removing item from cart" });
  }
};

export const clearCartController = async (req, res) => {
  let userId = req.user.email;
  userId = await prisma.User.findFirst({
    where: { email : userId},
  });
  console.log(userId);
  let cart = await prisma.cart.findFirst({
    where: { userId: userId.id },
    include: { items: true },
  });

  for (let item of cart.items) {
    try {
      const cartItem = await CartService.removeFromCart(userId.id,parseInt(item.id));
      if (!cartItem) {
        return;
      }
      
    } catch (error) {
      console.error("Error in removeFromCartController:", error.message);
      res.status(500).json({ message: "Error removing item from cart" });
    }
  }
  res.status(200).json({ message: "Cart item removed successfully" });

};


// Controller to get all cart items for a user
export const getCartItemsController = async (req, res) => {
  let userId = req.user.email;
  userId = await prisma.User.findFirst({
    where: { email : userId},
  });
  userId = userId.id;
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
