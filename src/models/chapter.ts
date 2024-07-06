import mongoose, { Document, Types } from "mongoose";

export interface ChapterDocument extends Document {
  _id: Types.ObjectId;
  name?: string;
  chapterNumber?: number;
  chapterAddress1?: string;
  chapterAddress2?: string;
  chapterCity?: string;
  chapterState?: string;
  chapterEmail?: string;
  chapterZipCode?: string;
  chapterChartDate?: Date;
  chapterMeet1?: string;
  chapterMeet2?: string;
  secretaryId?: string;
  districtId?: Types.ObjectId;
  regionId?: Types.ObjectId;
  chpYrDues?: Types.ObjectId;
  chpMonDues?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const chapterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    chapterNumber: {
      type: Number,
    },
    chapterAddress1: {
      type: String,
    },
    chapterAddress2: {
      type: String,
    },
    chapterCity: {
      type: String,
    },
    chapterState: {
      type: String,
    },
    chapterEmail: {
      type: String,
    },
    chapterZipCode: {
      type: String,
    },
    chapterChartDate: {
      type: Date,
    },
    chapterMeet1: {
      type: String,
    },
    chapterMeet2: {
      type: String,
    },
    secretaryId: {
      type: String,
    },
    districtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
    },
    regionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
    },
    chpYrDues: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Due",
    },
    chpMonDues: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Due",
    },
  },
  {
    timestamps: true,
  }
);

export const Chapter: mongoose.Model<ChapterDocument> =
  mongoose.models.Chapter || mongoose.model("Chapter", chapterSchema);
