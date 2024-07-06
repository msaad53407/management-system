import { connectDB } from "@/lib/db";
import { Reason } from "@/models/reason";
import mongoose from "mongoose";

// Array of statuses to seed
const reasons = [
  {
    name: "Non Payment of Dues",
    description: "Failure to pay membership dues",
  },
  {
    name: "UnMasonic Conduct",
    description: "Behavior that is not in line with Masonic principles",
  },
  {
    name: "Member Request",
    description: "Resignation or other request from the member",
  },
  { name: "Other", description: "Any other reason not specified" },
];


// Function to seed the database
export const seedReasons = async () => {
  try {
    // Clear the existing reasons
    await Reason.deleteMany({});

    // Insert the new reasons
    await Reason.insertMany(reasons);

    console.log("reasons seeded successfully");
  } catch (error) {
    console.error("Error seeding reasons:", error);
  } finally {
    console.log("Database connection closed");
  }
};

// Run the seeding function

