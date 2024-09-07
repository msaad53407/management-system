"use server"
//This File exports server side functions. Do not export functions from this file just to be able to import them in another file. Any function exported from this file becomes a POST API endpoint;

import { connectDB } from "@/lib/db";
import { seedChapterOffices } from "./chapterOffice";
import { seedGrandOffices } from "./grandOffice";
import { seedRanks } from "./rank";
import { seedReasons } from "./reason";
import { seedStates } from "./state";
import { seedStatuses } from "./status";

export async function seedAll() {
  await connectDB();

  await seedStates();
  await seedStatuses();
  await seedRanks();
  await seedReasons();
  await seedChapterOffices();
  await seedGrandOffices();
  // await seedChapters();

  console.log("Database seeded successfully");
}
