import mongoose from "mongoose"; // Importing mongoose to define the schema and model.

// Defining the user schema
const userSchema = new mongoose.Schema(
    {
        // Full name of the user (Required)
        fullName: {
            type: String,
            required: true,
        },

        // Profile image URL of the user (Required)
        imageUrl: {
            type: String,
            required: true,
        },

        // Unique Clerk authentication ID for the user (Required)
        clerkId: {
            type: String,
            required: true,
            unique: true, // Ensures each Clerk ID is unique
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Creating and exporting the User model based on the schema
export const User = mongoose.model("User", userSchema);
