import { Router } from "express"; // Import Express Router
import { 
    getAllSongs, 
    getFeaturedSongs, 
    getMadeForYouSongs, 
    getTrendingSongs 
} from "../controller/song.controller.js"; // Import song-related controllers

import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js"; // Import authentication middleware

const router = Router(); // Create a new router instance

// Route to fetch all songs (only accessible to admins)
router.get("/", protectRoute, requireAdmin, getAllSongs);

// Route to fetch featured songs (publicly accessible)
router.get("/featured", getFeaturedSongs);

// Route to fetch personalized "Made For You" songs (publicly accessible)
router.get("/made-for-you", getMadeForYouSongs);

// Route to fetch trending songs (publicly accessible)
router.get("/trending", getTrendingSongs);

export default router; // Export the router for use in the main server file
