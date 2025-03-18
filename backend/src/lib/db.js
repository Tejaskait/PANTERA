import mongoose from "mongoose"; // Importing Mongoose for MongoDB connection

// Function to establish a connection to MongoDB
export const connectDB = async () => {
	try {
		// Connecting to MongoDB using the URI stored in environment variables
		const conn = await mongoose.connect(process.env.MONGODB_URI);

		// Logging the successful connection message along with the host
		console.log(`Connected to MongoDB ${conn.connection.host}`);
	} catch (error) {
		// Logging an error message if the connection fails
		console.log("Failed to connect to MongoDB", error);

		// Exiting the process with a failure status code (1) to indicate an error
		process.exit(1);
	}
};
