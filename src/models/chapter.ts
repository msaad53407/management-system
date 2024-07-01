import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    chapterNumber: {
      type: Number,
      required: true,
    },
    chapterAddress1: {
      type: String,
      required: true,
    },
    chapterAddress2: {
      type: String,
    },
    chapterCity: {
      type: String,
      required: true,
    },
    chapterState: {
      type: String,
      required: true,
    },
    chapterEmail: {
      type: String,
      required: true,
    },
    chapterZipCode: {
      type: String,
      required: true,
    },
    chapterChartDate: {
      type: Date,
      required: true,
    },
    chapterMeet1: {
      type: String,
    },
    chapterMeet2: {
      type: String,
    },
    secretaryId: {
      type: String,
      required: true,
    },
    districtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
    regionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: true,
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
