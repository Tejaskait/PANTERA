import { Song } from "../models/song.model.js"; // Importing the Song model

// Controller to fetch all songs sorted by creation date (newest first)
export const getAllSongs = async (req, res, next) => {
	try {
		// Sorting songs by createdAt field in descending order (-1) to get newest first
		const songs = await Song.find().sort({ createdAt: -1 });
		res.json(songs); // Sending the sorted list of songs as a response
	} catch (error) {
		next(error); // Passing errors to the error-handling middleware
	}
};

// Controller to fetch 6 random featured songs
export const getFeaturedSongs = async (req, res, next) => {
	try {
		// Using MongoDB's aggregation pipeline to select 6 random songs
		const songs = await Song.aggregate([
			{
				$sample: { size: 6 }, // Selecting 6 random documents
			},
			{
				$project: {
					_id: 1, // Including only necessary fields
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs); // Sending the random featured songs
	} catch (error) {
		next(error); // Passing errors to the error-handling middleware
	}
};

// Controller to fetch 4 random "Made for You" songs
export const getMadeForYouSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 }, // Selecting 4 random songs
			},
			{
				$project: {
					_id: 1, // Including only relevant fields
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs); // Sending the list of recommended songs
	} catch (error) {
		next(error);
	}
};

// Controller to fetch 4 random trending songs
export const getTrendingSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 }, // Selecting 4 random songs
			},
			{
				$project: {
					_id: 1, // Including only necessary fields
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs); // Sending the list of trending songs
	} catch (error) {
		next(error);
	}
};
