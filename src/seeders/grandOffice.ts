import { connectDB } from "@/lib/db";
import { GrandOffice } from "@/models/grandOffice";
import mongoose from "mongoose";

// Array of ranks to seed
const grandOffices = [
  { name: "Grand Worthy Matron" },
  { name: "Grand Worthy Patron" },
  { name: "Honorary Past Grand Worthy Matron" },
  { name: "Grand Associate Matron" },
  { name: "Grand Associate Patron" },
  { name: "Grand Secretary" },
  { name: "Grand Treasurer" },
  { name: "Grand Conductress" },
  { name: "Grand Associate Conductress" },
  { name: "Grand Chairman of Trustees" },
  { name: "Grand Trustee" },
  { name: "Grand Marshal in the East" },
  { name: "Grand Marshal in the West" },
  { name: "Grand Adah" },
  { name: "Grand Ruth" },
  { name: "Grand Esther" },
  { name: "Grand Martha" },
  { name: "Grand Electa" },
  { name: "Grand Chaplain" },
  { name: "Grand Sentinel" },
  { name: "Grand Warder" },
  { name: "Grand CCFC" },
  { name: "Grand Recorder" },
  { name: "Past Grand Marshal in the East" },
  { name: "Past Grand Marshal in the West" },
  { name: "Grand United States Flag Bearer" },
  { name: "Grand Christian Flag Bearer" },
  { name: "Grand Eastern Star Flag Bearer" },
  { name: "Grand State Flag Bearer" },
  { name: "Grand Lecturer" },
  { name: "Grand Assistant Sentinel" },
  { name: "Grand Administrative Assistant" },
  { name: "Grand Assistant Coordinator - Elections" },
  { name: "Grand Historian" },
  { name: "Grand Nurse" },
  { name: "Grand Security" },
  { name: "Grand Musician - Organist" },
  { name: "Grand Photographer" },
  { name: "Grand Coordinator - Convention" },
  { name: "Grand Assistant Coordinator - Convention" },
  { name: "Grand Attorney" },
  { name: "Grand Youth Sponsor" },
  { name: "Grand Assistant Youth Sponsor" },
  { name: "Grand Youth Secretary" },
  { name: "Grand Assistant Coordinator - Queen Coronation" },
  { name: "Grand Assistant Warder" },
  { name: "Grand Assistant Registrar" },
  { name: "Grand Assistant Nurse" },
  { name: "Grand Coordinator - Annual Returns" },
  { name: "Grand Assistant Coordinator - Annual Returns" },
  { name: "Grand Coordinator - Arts & Crafts" },
  { name: "Grand Assistant Coordinator - Arts & Crafts" },
  { name: "Grand Coordinator - Credentials" },
  { name: "Grand Assistant Coordinator - Credentials" },
  { name: "Grand Usher" },
  { name: "Grand Coordinator - Scholarships" },
  { name: "Grand Hostess" },
  { name: "Grand Webmaster - Souvenir Book" },
  { name: "Grand Youth Fund Board Member" },
  { name: "Grand Co-Coordinator - March for Camp Chicota" },
  { name: "Grand Coordinator - Health Fair" },
  { name: "Grand Royal Matron - Order of Amaranth" },
  { name: "Grand Royal Patron - Order of Amaranth" },
];

// Function to seed the database
export const seedGrandOffices = async () => {
  try {
    // Clear the existing ranks
    await GrandOffice.deleteMany({});

    // Insert the new ranks
    await GrandOffice.insertMany(grandOffices);

    console.log("GrandOffice offices seeded successfully");
  } catch (error) {
    console.error("Error seeding GrandOffice offices:", error);
  } finally {
    console.log("Database connection closed");
  }
};

// Run the seeding function
