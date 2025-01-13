import { validationResult } from "express-validator";
import * as UserService from "../services/user.service.js";

export const createUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await UserService.createUser(req.body);
        const { password, ...userWithoutPassword } = user;

        res.status(201).send({ user: userWithoutPassword });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: error.message });
    }
};

export const loginUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const { user, token } = await UserService.loginUser({ email, password });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).send({ user, token });
    } catch (error) {
        console.error(error.message);
        res.status(401).send({ error: error.message });
    }
};

export const logOutController = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error logging out" });
    }
};

export const getAllUsersController = async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json(users); // Respond with the list of users
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching users(Controller)" });
    }
};

export const getUserProfileController = async (req, res) => {
    try {
        const userId = req.user.id; // Make sure the user is authenticated and this ID exists
        const user = await UserService.getUserProfile(userId); // Call the service function

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { password, ...userWithoutPassword } = user; // Don't return the password
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user profile" });
    }
};
