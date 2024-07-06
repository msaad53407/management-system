import { connectDB } from "@/lib/db";
import { Rank } from "@/models/rank";
import mongoose from "mongoose";

// Array of ranks to seed
const ranks = [
  { name: "Member", description: "Active member of the organization" },
  { name: "Past Matron", description: "Formerly held the position of Matron" },
  { name: "Past Patron", description: "Formerly held the position of Patron" },
  {
    name: "Honorary Past Matron",
    description: "Honorary title given to a past Matron",
  },
  {
    name: "Honorary Past Patron",
    description: "Honorary title given to a past Patron",
  },
];

// Function to seed the database
export const seedRanks = async () => {
  try {
    // Clear the existing ranks
    await Rank.deleteMany({});

    // Insert the new ranks
    await Rank.insertMany(ranks);

    console.log("ranks seeded successfully");
  } catch (error) {
    console.error("Error seeding ranks:", error);
  } finally {
    console.log("Database connection closed");
  }
};

// Run the seeding function

