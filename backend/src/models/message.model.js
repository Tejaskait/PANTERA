import mongoose from "mongoose"; // Importing mongoose to define the schema and model.

// Defining the message schema
const messageSchema = new mongoose.Schema(
	{
		// ID of the sender (Clerk user ID, required)
		senderId: { type: String, required: true },

		// ID of the receiver (Clerk user ID, required)
		receiverId: { type: String, required: true },

		// Content of the message (Required)
		content: { type: String, required: true },
	},
	{ timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Creating and exporting the Message model based on the schema
export const Message = mongoose.model("Message", messageSchema);
