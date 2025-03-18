import mongoose from "mongoose"; // Importing mongoose to define the schema and model.

// Defining the song schema
const songSchema = new mongoose.Schema(
	{
		// Title of the song (Required)
		title: {
			type: String,
			required: true,
		},

		// Artist who performed the song (Required)
		artist: {
			type: String,
			required: true,
		},

		// URL of the song's cover image (Required)
		imageUrl: {
			type: String,
			required: true,
		},

		// URL of the song's audio file (Required)
		audioUrl: {
			type: String,
			required: true,
		},

		// Duration of the song in seconds (Required)
		duration: {
			type: Number,
			required: true,
		},

		// Reference to the album this song belongs to (Optional)
		// Links to the "Album" model
		albumId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Album",
			required: false,
		},
	},
	{ timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Creating and exporting the Song model based on the schema
export const Song = mongoose.model("Song", songSchema);
