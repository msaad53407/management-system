import mongoose, { Document } from "mongoose";

export interface ChapterOfficeDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const chapterOfficeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const ChapterOffice: mongoose.Model<ChapterOfficeDocument> =
  mongoose.models.ChapterOffice ||
  mongoose.model("ChapterOffice", chapterOfficeSchema);
