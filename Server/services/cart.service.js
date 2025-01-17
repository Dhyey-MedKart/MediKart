import prisma from "../db/db.js";

// Service to add an item to the cart
export const addToCart = async (userId, productId, quantity) => {
  try {
    // Step 1: Check if the user has an existing cart
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    // Step 2: Create a new cart if none exists
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          total: 0,
        },
      });
    }

    // Step 3: Check if the product is already in the cart
    let cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (cartItem) {
      // Step 4: Update quantity if product exists
      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity: cartItem.quantity + quantity,
        },
      });
    } else {
      // Step 5: Add product to the cart if not present
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error("Product not found.");
      }

      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    // Step 6: Recalculate and update the cart total
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });

    const newTotal = cartItems.reduce(
      (sum, item) => sum + item.product.salesPrice * item.quantity,
      0
    );

    await prisma.cart.update({
      where: { id: cart.id },
      data: { total: newTotal },
    });

    return { message: "Product added to cart successfully.", cart };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add product to cart.");
  }
};
// Service to remove an item from the cart
export const removeFromCart = async (userId,id) => {
  try {
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });
    const cartItem = await prisma.cartItem.delete({
      where: {id: id },
    });
    // You can return a success message or the deleted item, depending on the use case
    return { message: "Item removed from cart successfully", cartItem };
  } catch (error) {
    // Log the error more gracefully
    console.error("Error in removeFromCart:", error?.message || error);
    
    // Provide a more user-friendly error message
    throw new Error("Error removing item from cart: " + (error?.message || "Unknown error"));
  }
};

// Service to get all cart items for a user
export const getCartItems = async (userId) => {
  try {
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });
    console.log(cart);
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.userId },
      include: { product: true }, // You can include the product details if needed
    });
    return cartItems;
  } catch (error) {
    console.error("Error in getCartItems:", error.message);
    throw new Error("Error fetching cart items: " + error.message);
  }
};
