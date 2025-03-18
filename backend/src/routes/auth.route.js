import { Router } from "express"; // Import Express Router
import { authCallback } from "../controller/auth.controller.js"; // Import authentication callback controller

const router = Router(); // Create a new router instance

// Route to handle authentication callback (e.g., user login/signup via Clerk)
router.post("/callback", authCallback);

export default router; // Export the router for use in the main server file
