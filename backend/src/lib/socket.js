import { Server } from "socket.io"; // Importing Socket.IO for real-time communication
import { Message } from "../models/message.model.js"; // Importing Message model for storing messages

// Function to initialize a WebSocket server
export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: "http://localhost:3000", // Allowing requests from the frontend
			credentials: true, // Allowing cookies and authentication headers
		},
	});

	// Maps to track online users and their activities
	const userSockets = new Map(); // { userId: socketId } - Keeps track of connected users
	const userActivities = new Map(); // { userId: activity } - Tracks user activity status

	// Handling new socket connections
	io.on("connection", (socket) => {
		// When a user connects, store their socket ID
		socket.on("user_connected", (userId) => {
			userSockets.set(userId, socket.id); // Map user ID to socket ID
			userActivities.set(userId, "Idle"); // Default activity status

			// Notify all clients that this user is now online
			io.emit("user_connected", userId);

			// Send the list of online users to the newly connected user
			socket.emit("users_online", Array.from(userSockets.keys()));

			// Broadcast updated user activity statuses
			io.emit("activities", Array.from(userActivities.entries()));
		});

		// Handle user activity updates
		socket.on("update_activity", ({ userId, activity }) => {
			console.log("Activity updated:", userId, activity);
			userActivities.set(userId, activity); // Update user activity status
			io.emit("activity_updated", { userId, activity }); // Broadcast update
		});

		// Handle sending messages between users
		socket.on("send_message", async (data) => {
			try {
				const { senderId, receiverId, content } = data;

				// Save the message in the database
				const message = await Message.create({
					senderId,
					receiverId,
					content,
				});

				// Send the message in real-time to the receiver if they're online
				const receiverSocketId = userSockets.get(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("receive_message", message);
				}

				// Confirm message was sent to the sender
				socket.emit("message_sent", message);
			} catch (error) {
				console.error("Message error:", error);
				socket.emit("message_error", error.message);
			}
		});

		// Handle user disconnection
		socket.on("disconnect", () => {
			let disconnectedUserId;

			// Find and remove the disconnected user from tracking maps
			for (const [userId, socketId] of userSockets.entries()) {
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId); // Remove from online users
					userActivities.delete(userId); // Remove activity tracking
					break;
				}
			}

			// Notify all clients that the user has disconnected
			if (disconnectedUserId) {
				io.emit("user_disconnected", disconnectedUserId);
			}
		});
	});
};
