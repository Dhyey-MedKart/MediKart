import { Router } from "express"
import * as UserController from "../controllers/user.controller.js"
import { body, check } from "express-validator";
import * as AuthMiddleware from "../middleware/authMiddleware.js";
const router = Router();

// User registration
router.post(
  "/register",
  
    body("email").isEmail().withMessage("Email is not valid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("name")
      .notEmpty()
      .withMessage("Name is required"),
    body("role")
      .optional()
      .isIn(["USER", "ADMIN"])
      .withMessage("Role must be either USER or ADMIN"),
  UserController.createUserController
);

// User login
router.post(
  "/login",
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  UserController.loginUserController
);

// User logout
router.get("/logout", AuthMiddleware.authUser, UserController.logOutController);

// Fetch all users (Admin only)
router.get(
  "/all-users",
  AuthMiddleware.authUser,
  AuthMiddleware.authAdmin,
  UserController.getAllUsersController
);

// Fetch user profile
router.get(
  "/profile",
  AuthMiddleware.authUser,
  UserController.getUserProfileController
);

export default router;
