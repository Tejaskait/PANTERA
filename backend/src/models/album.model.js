import mongoose from "mongoose"; // Importing mongoose to define the schema and model.

// Defining the album schema
const albumSchema = new mongoose.Schema(
	{
		// Title of the album (Required)
		title: { type: String, required: true },

		// Artist who created the album (Required)
		artist: { type: String, required: true },

		// URL of the album cover image (Required)
		imageUrl: { type: String, required: true },

		// Year when the album was released (Required)
		releaseYear: { type: Number, required: true },

		// Array of song references (ObjectId) that belong to this album
		// It references the "Song" model to establish a relationship
		songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
	},
	{ timestamps: true } // Automatically adds createdAt and updatedAt timestamps
); 

// Creating and exporting the Album model based on the schema
export const Album = mongoose.model("Album", albumSchema);
