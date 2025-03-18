import { Router } from "express"; // Import Express Router
import { 
    checkAdmin, 
    createAlbum, 
    createSong, 
    deleteAlbum, 
    deleteSong 
} from "../controller/admin.controller.js"; // Import admin-related controllers
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js"; // Import authentication middleware

const router = Router(); // Create a new router instance

// Apply authentication and admin check middleware to all routes in this router
router.use(protectRoute, requireAdmin);

// Route to check if the user is an admin
router.get("/check", checkAdmin);

// Route to create a new song
router.post("/songs", createSong);

// Route to delete a song by ID
router.delete("/songs/:id", deleteSong);

// Route to create a new album
router.post("/albums", createAlbum);

// Route to delete an album by ID
router.delete("/albums/:id", deleteAlbum);

export default router; // Export the router for use in the main server file
