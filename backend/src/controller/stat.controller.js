import { Album } from "../models/album.model.js"; // Importing the Album model
import { Song } from "../models/song.model.js"; // Importing the Song model
import { User } from "../models/user.model.js"; // Importing the User model

// Controller to get various statistics about songs, albums, users, and unique artists
export const getStats = async (req, res, next) => {
	try {
		// Using Promise.all to run multiple database queries in parallel for efficiency
		const [totalSongs, totalAlbums, totalUsers, uniqueArtists] = await Promise.all([
			Song.countDocuments(), // Counting total number of songs
			Album.countDocuments(), // Counting total number of albums
			User.countDocuments(), // Counting total number of users

			// Aggregation pipeline to count unique artists from both songs and albums
			Song.aggregate([
				{
					$unionWith: {
						coll: "albums", // Merging the albums collection with songs
						pipeline: [],
					},
				},
				{
					$group: {
						_id: "$artist", // Grouping by artist to find unique names
					},
				},
				{
					$count: "count", // Counting the unique artist names
				},
			]),
		]);

		// Sending the statistics as a response
		res.status(200).json({
			totalAlbums,
			totalSongs,
			totalUsers,
			totalArtists: uniqueArtists[0]?.count || 0, // Handling cases where there are no artists
		});
	} catch (error) {
		next(error); // Passing errors to the error-handling middleware
	}
};
