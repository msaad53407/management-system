import mongoose from "mongoose";

const chapterOfficeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ChapterOffice =
  mongoose.models.ChapterOffice ||
  mongoose.model("ChapterOffice", chapterOfficeSchema);
