import { connectDB } from "@/lib/db";
import { Status } from "@/models/status";
import mongoose from "mongoose";

// Array of statuses to seed
const statuses = [
  { name: "Petitioner", description: "" },
  { name: "Regular", description: "" },
  { name: "Special", description: "" },
  { name: "Demit", description: "" },
  { name: "Dropped", description: "" },
  { name: "Suspended", description: "" },
  { name: "Expelled", description: "" },
  { name: "Deceased", description: "" },
];

// Function to seed the database
export const seedStatuses = async () => {
  try {
    // Clear the existing statuses
    await Status.deleteMany({});

    // Insert the new statuses
    await Status.insertMany(statuses);

    console.log("Statuses seeded successfully");
  } catch (error) {
    console.error("Error seeding statuses:", error);
  } finally {
    console.log("Database connection closed");
  }
};

// Run the seeding function
