import { Router } from "express"; // Import Express Router
import { getAlbumById, getAllAlbums } from "../controller/album.controller.js"; // Import album-related controllers

const router = Router(); // Create a new router instance

// Route to fetch all albums
router.get("/", getAllAlbums);

// Route to fetch a specific album by its ID
router.get("/:albumId", getAlbumById);

export default router; // Export the router for use in the main server file
