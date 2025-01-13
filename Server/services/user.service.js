import bcrypt from "bcryptjs";
import prisma from "../db/db.js";
import jwt from "jsonwebtoken";

export const createUser = async ({ email, password, name, role }) => {
    if (!email || !password || !name) {
        throw new Error("Email, password, and name are required");
    }
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new Error("Email is already in use");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || "USER",
            },
        });

        return user;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        const { password: _, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany({
            include: {
               // Include related products
                cartItems: {
                    include: {
                        product: true, // Include product details in cart items
                    },
                },
                orders: {
                    include: {
                        items: {
                            include: {
                                product: true, // Include product details in orders
                            },
                        },
                    },
                },
            },
        });
        return users;
    } catch (error) {
        throw new Error("Error fetching users: " + error.message);
    }
};

export const getUserProfile = async (userId) => {
  try {
      const user = await prisma.user.findUnique({
          where: { id: userId },
      });

      if (!user) {
          throw new Error("User not found");
      }

      return user;
  } catch (error) {
      throw new Error("Error fetching user profile: " + error.message);
  }
};


