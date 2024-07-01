import mongoose from "mongoose";

const reportsSchema = new mongoose.Schema(
  {
    reportFormat: {
      type: String,
      required: true,
    },
    savedReports: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Reports = mongoose.model("Reports", reportsSchema)