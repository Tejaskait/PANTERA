import { v2 as cloudinary } from "cloudinary"; // Importing Cloudinary v2 for media uploads

import dotenv from "dotenv"; // Importing dotenv to load environment variables
dotenv.config(); // Loading environment variables from .env file

// Configuring Cloudinary with credentials from environment variables
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
	api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API key
	api_secret: process.env.CLOUDINARY_API_SECRET, // Cloudinary API secret
});

export default cloudinary; // Exporting the configured Cloudinary instance for use in the app
