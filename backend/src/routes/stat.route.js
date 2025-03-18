import { Router } from "express"; // Import Express Router
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js"; // Import authentication middleware
import { getStats } from "../controller/stat.controller.js"; // Import statistics controller

const router = Router(); // Create a new router instance

// Route to fetch platform statistics (only accessible to admins)
router.get("/", protectRoute, requireAdmin, getStats);

export default router; // Export the router for use in the main server file
