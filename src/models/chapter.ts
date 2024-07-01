import mongoose from "mongoose";

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

export const Chapter =
  mongoose.models.Chapter || mongoose.model("Chapter", chapterSchema);
