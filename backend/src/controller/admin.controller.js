import { Song } from "../models/song.model.js"; // Importing the Song model
import { Album } from "../models/album.model.js"; // Importing the Album model
import cloudinary from "../lib/cloudinary.js"; // Importing Cloudinary for file uploads

// Helper function to upload files to Cloudinary
const uploadToCloudinary = async (file) => {
	try {
		// Uploading the file to Cloudinary with automatic resource type detection
		const result = await cloudinary.uploader.upload(file.tempFilePath, {
			resource_type: "auto",
		});
		return result.secure_url; // Returning the uploaded file's secure URL
	} catch (error) {
		console.log("Error in uploadToCloudinary", error);
		throw new Error("Error uploading to cloudinary");
	}
};

// Controller to create a new song
export const createSong = async (req, res, next) => {
	try {
		// Checking if both audio and image files are provided
		if (!req.files || !req.files.audioFile || !req.files.imageFile) {
			return res.status(400).json({ message: "Please upload all files" });
		}

		// Extracting song details from the request body
		const { title, artist, albumId, duration } = req.body;
		const audioFile = req.files.audioFile;
		const imageFile = req.files.imageFile;

		// Uploading audio and image files to Cloudinary
		const audioUrl = await uploadToCloudinary(audioFile);
		const imageUrl = await uploadToCloudinary(imageFile);

		// Creating a new Song document
		const song = new Song({
			title,
			artist,
			audioUrl,
			imageUrl,
			duration,
			albumId: albumId || null, // Setting albumId if provided
		});

		// Saving the song to the database
		await song.save();

		// If the song belongs to an album, update the album's songs array
		if (albumId) {
			await Album.findByIdAndUpdate(albumId, {
				$push: { songs: song._id },
			});
		}

		res.status(201).json(song); // Responding with the created song
	} catch (error) {
		console.log("Error in createSong", error);
		next(error);
	}
};

// Controller to delete a song
export const deleteSong = async (req, res, next) => {
	try {
		const { id } = req.params;

		// Finding the song to check if it belongs to an album
		const song = await Song.findById(id);

		// If the song belongs to an album, remove it from the album's songs array
		if (song.albumId) {
			await Album.findByIdAndUpdate(song.albumId, {
				$pull: { songs: song._id },
			});
		}

		// Deleting the song from the database
		await Song.findByIdAndDelete(id);

		res.status(200).json({ message: "Song deleted successfully" });
	} catch (error) {
		console.log("Error in deleteSong", error);
		next(error);
	}
};

// Controller to create a new album
export const createAlbum = async (req, res, next) => {
	try {
		// Extracting album details from the request body
		const { title, artist, releaseYear } = req.body;
		const { imageFile } = req.files;

		// Uploading the album cover image to Cloudinary
		const imageUrl = await uploadToCloudinary(imageFile);

		// Creating a new Album document
		const album = new Album({
			title,
			artist,
			imageUrl,
			releaseYear,
		});

		// Saving the album to the database
		await album.save();

		res.status(201).json(album); // Responding with the created album
	} catch (error) {
		console.log("Error in createAlbum", error);
		next(error);
	}
};

// Controller to delete an album
export const deleteAlbum = async (req, res, next) => {
	try {
		const { id } = req.params;

		// Deleting all songs associated with the album
		await Song.deleteMany({ albumId: id });

		// Deleting the album itself
		await Album.findByIdAndDelete(id);

		res.status(200).json({ message: "Album deleted successfully" });
	} catch (error) {
		console.log("Error in deleteAlbum", error);
		next(error);
	}
};

// Dummy admin check function
export const checkAdmin = async (req, res, next) => {
	res.status(200).json({ admin: true });
};
