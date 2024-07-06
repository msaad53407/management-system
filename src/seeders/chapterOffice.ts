import { connectDB } from "@/lib/db";
import { ChapterOffice } from "@/models/chapterOffice";
import mongoose from "mongoose";

// Array of ranks to seed
const chapterOffices = [
    { name: 'Worthy Matron' },
    { name: 'Worthy Patron' },
    { name: 'Associate Matron' },
    { name: 'Associate Patron' },
    { name: 'Conductress' },
    { name: 'Associate Conductress' },
    { name: 'Secretary' },
    { name: 'Recording Secretary' },
    { name: 'Treasurer' },
    { name: 'Chairman of Trustees' },
    { name: 'Trustee 1' },
    { name: 'Trustee 2' },
    { name: 'Marshal in the East' },
    { name: 'Marshal in the West' },
    { name: 'Adah' },
    { name: 'Ruth' },
    { name: 'Esther' },
    { name: 'Martha' },
    { name: 'Electa' },
    { name: 'Chaplain' },
    { name: 'Sentinel' },
    { name: 'Warder' }
  ];
  

// Function to seed the database
export const seedChapterOffices = async () => {
  try {
    // Clear the existing ranks
    await ChapterOffice.deleteMany({});

    // Insert the new ranks
    await ChapterOffice.insertMany(chapterOffices);

    console.log("Chapter offices seeded successfully");
  } catch (error) {
    console.error("Error seeding Chapter offices:", error);
  } finally {
    console.log("Database connection closed");
  }
};

// Run the seeding function
