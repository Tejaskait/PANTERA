import { User } from "../models/user.model.js"; // Importing the User model

// Controller for handling authentication callback
export const authCallback = async (req, res, next) => {
	try {
		// Extracting user details from the request body
		const { id, firstName, lastName, imageUrl } = req.body;

		// Checking if the user already exists in the database using Clerk ID
		const user = await User.findOne({ clerkId: id });

		// If user does not exist, create a new user record (Sign-up process)
		if (!user) {
			await User.create({
				clerkId: id, // Storing Clerk authentication ID
				fullName: `${firstName || ""} ${lastName || ""}`.trim(), // Constructing full name
				imageUrl, // Storing profile image URL
			});
		}

		// Responding with a success status
		res.status(200).json({ success: true });
	} catch (error) {
		console.log("Error in auth callback", error);
		next(error); // Passing errors to the error-handling middleware
	}
};
