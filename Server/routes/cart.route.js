import express from "express";
import * as CartController from "../controllers/cart.controller.js";
import * as AuthMiddleware from "../middleware/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

// Route to add an item to the cart
router.post(
  "/add-to-cart",
  AuthMiddleware.authUser,
  [
    body("productId").isInt({ min: 1 }),
    body("quantity").isInt({ min: 1 }),
  ],
  CartController.addToCartController
);

router.delete("/clear-cart", AuthMiddleware.authUser, CartController.clearCartController);

// Route to remove an item from the cart
router.delete("/remove-from-cart/:id", AuthMiddleware.authUser, CartController.removeFromCartController);

// Route to get all cart items for a user
router.get("/cart-items", AuthMiddleware.authUser, CartController.getCartItemsController);

// Route to update quantity of a cart item
router.put(
  "/update-cart-item/:id",
  AuthMiddleware.authUser,
  [
    body("quantity").isInt({ min: 1 }),
  ],
  CartController.updateCartItemController
);

export default router;
