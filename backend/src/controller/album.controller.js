import { Album } from "../models/album.model.js"; // Importing the Album model

// Controller to fetch all albums
export const getAllAlbums = async (req, res, next) => {
	try {
		const albums = await Album.find(); // Fetching all albums from the database
		res.status(200).json(albums); // Sending the albums as a response
	} catch (error) {
		next(error); // Passing errors to the error-handling middleware
	}
};

// Controller to fetch a single album by its ID
export const getAlbumById = async (req, res, next) => {
	try {
		const { albumId } = req.params; // Extracting albumId from request parameters

		// Finding the album by its ID and populating the 'songs' field with referenced song data
		const album = await Album.findById(albumId).populate("songs");

		// If album is not found, return a 404 error
		if (!album) {
			return res.status(404).json({ message: "Album not found" });
		}

		res.status(200).json(album); // Sending the album details as a response
	} catch (error) {
		next(error); // Passing errors to the error-handling middleware
	}
};
