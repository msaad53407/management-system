import { connectDB } from "@/lib/db";
import { Chapter } from "@/models/chapter";
import mongoose from "mongoose";

// Array of ranks to seed
const chapters = [
  {
    name: "John G. Lewis",
    chapterNumber: "001",
    chapterAddress1: "123 Main St",
    chapterAddress2: "Suite 1",
    chapterCity: "City A",
    chapterEmail: "john.g.lewis@example.com",
    chapterZipCode: "12345",
    chapterChartDate: new Date("2020-01-01"),
    chapterMeet1: "First Monday",
    chapterMeet2: "Third Monday",
    secretaryId: "secretaryId1",
  },
  {
    name: "New Deborah",
    chapterNumber: "002",
    chapterAddress1: "456 Elm St",
    chapterAddress2: "Apt 2",
    chapterCity: "City B",
    chapterEmail: "new.deborah@example.com",
    chapterZipCode: "23456",
    chapterChartDate: new Date("2020-02-01"),
    chapterMeet1: "First Tuesday",
    chapterMeet2: "Third Tuesday",
    secretaryId: "secretaryId2",
  },
  {
    name: "Pride of DeSoto",
    chapterNumber: "003",
    chapterAddress1: "789 Oak St",
    chapterAddress2: "Apt 3",
    chapterCity: "City C",
    chapterEmail: "pride.of.desoto@example.com",
    chapterZipCode: "34567",
    chapterChartDate: new Date("2020-03-01"),
    chapterMeet1: "First Wednesday",
    chapterMeet2: "Third Wednesday",
    secretaryId: "secretaryId3",
  },
  {
    name: "W.L. Carroll",
    chapterNumber: "004",
    chapterAddress1: "101 Pine St",
    chapterAddress2: "",
    chapterCity: "City D",
    chapterEmail: "wl.carroll@example.com",
    chapterZipCode: "45678",
    chapterChartDate: new Date("2020-04-01"),
    chapterMeet1: "First Thursday",
    chapterMeet2: "Third Thursday",
    secretaryId: "secretaryId4",
  },
  {
    name: "East Gate",
    chapterNumber: "005",
    chapterAddress1: "202 Birch St",
    chapterAddress2: "",
    chapterCity: "City E",
    chapterEmail: "east.gate@example.com",
    chapterZipCode: "56789",
    chapterChartDate: new Date("2020-05-01"),
    chapterMeet1: "First Friday",
    chapterMeet2: "Third Friday",
    secretaryId: "secretaryId5",
  },
  {
    name: "Virginia Lewis",
    chapterNumber: "006",
    chapterAddress1: "303 Cedar St",
    chapterAddress2: "Floor 2",
    chapterCity: "City F",
    chapterEmail: "virginia.lewis@example.com",
    chapterZipCode: "67890",
    chapterChartDate: new Date("2020-06-01"),
    chapterMeet1: "First Saturday",
    chapterMeet2: "Third Saturday",
    secretaryId: "secretaryId6",
  },
  {
    name: "Veronica",
    chapterNumber: "007",
    chapterAddress1: "404 Maple St",
    chapterAddress2: "Suite 3",
    chapterCity: "City G",
    chapterEmail: "veronica@example.com",
    chapterZipCode: "78901",
    chapterChartDate: new Date("2020-07-01"),
    chapterMeet1: "First Sunday",
    chapterMeet2: "Third Sunday",
    secretaryId: "secretaryId7",
  },
];

// Function to seed the database
export const seedChapters = async () => {
  try {
    // Clear the existing ranks
    await Chapter.deleteMany({});

    // Insert the new ranks
    await Chapter.insertMany(chapters);

    console.log("Chapters seeded successfully");
  } catch (error) {
    console.error("Error seeding Chapters:", error);
  } finally {
    console.log("Database connection closed");
  }
};

// Run the seeding function
