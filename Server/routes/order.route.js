import express from "express";
import * as OrderController from "../controllers/order.controller.js";
import * as AuthMiddleware from "../middleware/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

// Route to place an order
router.post(
  "/place-order",
  AuthMiddleware.authUser,
  [
    body("items").isArray().notEmpty(),
    body("items.*.productId").isInt(),
    body("items.*.quantity").isInt({ min: 1 }),
  ],
  OrderController.placeOrderController
);

// Route to get orders by user
router.get("/my-orders", AuthMiddleware.authUser, OrderController.getOrdersByUserController);

// Route to get a single order
router.get("/order/:id", AuthMiddleware.authUser, OrderController.getOrderController);


router.get("/all-order", AuthMiddleware.authAdmin, OrderController.getAllOrderController);
// Route to update an order status (for admin)
router.put(
  "/update-order-status/:id",
  AuthMiddleware.authUser,
  
  OrderController.updateOrderStatusController
);

export default router;
