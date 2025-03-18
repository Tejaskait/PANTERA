import express from "express"; // Import Express framework
import dotenv from "dotenv"; // Import dotenv to load environment variables
import { clerkMiddleware } from "@clerk/express"; // Clerk middleware for authentication
import fileUpload from "express-fileupload"; // Middleware for handling file uploads
import path from "path"; // Import path module for handling file paths
import cors from "cors"; // CORS middleware to allow cross-origin requests
import fs from "fs"; // Import filesystem module for file operations
import { createServer } from "http"; // Create an HTTP server
import cron from "node-cron"; // Import node-cron for scheduling tasks

import { initializeSocket } from "./lib/socket.js"; // Import WebSocket initializer
import { connectDB } from "./lib/db.js"; // Import database connection function

// Import route handlers
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";

dotenv.config(); // Load environment variables

const __dirname = path.resolve(); // Get current directory path
const app = express(); // Initialize Express app
const PORT = process.env.PORT; // Get the port from environment variables

const httpServer = createServer(app); // Create an HTTP server instance
initializeSocket(httpServer); // Initialize WebSocket functionality

// Enable CORS for frontend connection
app.use(
	cors({
		origin: "http://localhost:3000", // Allow requests from frontend
		credentials: true, // Allow credentials (cookies, authorization headers)
	})
);

app.use(express.json()); // Enable JSON request body parsing
app.use(clerkMiddleware()); // Add authentication to `req` object via Clerk middleware

// Configure file upload middleware
app.use(
	fileUpload({
		useTempFiles: true, // Enable temporary file storage
		tempFileDir: path.join(__dirname, "tmp"), // Temporary file storage directory
		createParentPath: true, // Create directory if it doesn’t exist
		limits: {
			fileSize: 10 * 1024 * 1024, // Set file size limit to 10MB
		},
	})
);

// **Cron Job: Cleanup temporary files every hour**
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
	if (fs.existsSync(tempDir)) {
		fs.readdir(tempDir, (err, files) => {
			if (err) {
				console.log("Error reading temp directory:", err);
				return;
			}
			for (const file of files) {
				fs.unlink(path.join(tempDir, file), (err) => {}); // Delete each file
			}
		});
	}
});

// **API Route Handlers**
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

// **Serve Frontend in Production**
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist"))); // Serve frontend files
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html")); // Send frontend index.html for any unmatched route
	});
}

// **Error Handling Middleware**
app.use((err, req, res, next) => {
	res.status(500).json({
		message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message, // Hide error details in production
	});
});

// **Start Server & Connect to Database**
httpServer.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
	connectDB(); // Connect to MongoDB
});
