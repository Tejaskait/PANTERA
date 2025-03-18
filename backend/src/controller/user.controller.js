import { User } from "../models/user.model.js"; // Importing the User model
import { Message } from "../models/message.model.js"; // Importing the Message model

// Controller to fetch all users except the current logged-in user
export const getAllUsers = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId; // Getting the authenticated user's ID
		const users = await User.find({ clerkId: { $ne: currentUserId } }); // Fetching all users except the current user
		res.status(200).json(users); // Sending the filtered list of users as a response
	} catch (error) {
		next(error); // Passing errors to the error-handling middleware
	}
};

// Controller to fetch messages between the current user and another user
export const getMessages = async (req, res, next) => {
	try {
		const myId = req.auth.userId; // Getting the authenticated user's ID
		const { userId } = req.params; // Getting the ID of the other user from the request parameters

		// Fetching messages where the current user is either the sender or receiver
		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId }, // Messages sent by the other user to the current user
				{ senderId: myId, receiverId: userId }, // Messages sent by the current user to the other user
			],
		}).sort({ createdAt: 1 }); // Sorting messages in ascending order (oldest to newest)

		res.status(200).json(messages); // Sending the chat messages as a response
	} catch (error) {
		next(error); // Passing errors to the error-handling middleware
	}
};
