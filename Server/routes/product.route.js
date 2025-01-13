import express from "express";
import * as ProductController from "../controllers/product.controller.js";
import * as AuthMiddleware from "../middleware/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

// Route to add a product
router.post(
  "/create-product",
  AuthMiddleware.authUser,
  [
    body("name").isString().notEmpty(),
    body("wsCode").isString().notEmpty(), // Changed from 'wscode' to match your schema
    body("salesPrice").isFloat({ min: 0 }).notEmpty(),
    body("mrp").isFloat({ min: 0 }).notEmpty(),
    body("packageSize").isFloat({ min: 0 }).notEmpty(), // packageSize should be a float, not string
    body("images").isArray().optional(), // Image URLs should be an array
    body("tags").isArray().optional(), // Tags should be an array
    body("category").isString().notEmpty(),
  ],
  ProductController.createProductController
);

// Route to delete a product
router.delete(
  "/delete-product/:id",
  AuthMiddleware.authUser,
  ProductController.deleteProductController
);

// Route to get a single product
router.get(
  "/product/:id",
  AuthMiddleware.authUser,
  ProductController.getProductController
);

// Route to get all products
router.get(
  "/all-products",
  AuthMiddleware.authUser,
  ProductController.getAllProductsController
);

// Route to update a product
router.put(
  "/update-product/:id",
  AuthMiddleware.authAdmin,
  [
    body("name").optional().isString(),
    body("wsCode").optional().isString(),
    body("salesPrice").optional().isFloat({ min: 0 }),
    body("mrp").optional().isFloat({ min: 0 }),
    body("packageSize").optional().isFloat({ min: 0 }),
    body("images").optional().isArray(),
    body("tags").optional().isArray(),
    body("category").optional().isString(),
  ],
  ProductController.updateProductController
);

export default router;
