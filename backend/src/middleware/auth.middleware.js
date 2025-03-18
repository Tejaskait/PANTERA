import { clerkClient } from "@clerk/express"; // Import Clerk authentication client

// Middleware to protect routes (ensure user is authenticated)
export const protectRoute = async (req, res, next) => {
	// Check if user is authenticated by verifying if req.auth.userId exists
	if (!req.auth.userId) {
		return res.status(401).json({ message: "Unauthorized - you must be logged in" });
	}
	next(); // If authenticated, proceed to the next middleware or route handler
};

// Middleware to enforce admin-only access
export const requireAdmin = async (req, res, next) => {
	try {
		// Fetch the current user's details from Clerk
		const currentUser = await clerkClient.users.getUser(req.auth.userId);
		
		// Check if the user's email matches the admin email set in environment variables
		const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

		if (!isAdmin) {
			return res.status(403).json({ message: "Unauthorized - you must be an admin" });
		}

		next(); // If user is an admin, allow access to the next middleware or route
	} catch (error) {
		next(error); // Pass any errors to the global error handler
	}
};
