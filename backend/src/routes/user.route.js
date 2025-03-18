import { Router } from "express"; // Import Express Router
import { protectRoute } from "../middleware/auth.middleware.js"; // Import authentication middleware
import { getAllUsers, getMessages } from "../controller/user.controller.js"; // Import user-related controllers

const router = Router(); // Create a new router instance

// Route to get all users (excluding the current authenticated user)
router.get("/", protectRoute, getAllUsers);

// Route to fetch messages between the authenticated user and a specific user
router.get("/messages/:userId", protectRoute, getMessages);

export default router; // Export the router for use in the main server file
