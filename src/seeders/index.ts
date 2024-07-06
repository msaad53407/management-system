"use server";

import { connectDB } from "@/lib/db";
import { seedChapterOffices } from "./chapterOffice";
import { seedGrandOffices } from "./grandOffice";
import { seedRanks } from "./rank";
import { seedReasons } from "./reason";
import { seedStates } from "./state";
import { seedStatuses } from "./status";
import mongoose from "mongoose";
import { seedChapters } from "./chapter";

export async function seedAll() {
  await connectDB();

  await seedStates();
  await seedStatuses();
  await seedRanks();
  await seedReasons();
  await seedChapterOffices();
  await seedGrandOffices();
  await seedChapters();

  console.log("Database seeded successfully");
}
