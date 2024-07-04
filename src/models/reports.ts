import mongoose, { Document } from "mongoose";

export interface ReportsDocument extends Document {
  reportFormat: string;
  savedReports: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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

export const Reports: mongoose.Model<ReportsDocument> =
  mongoose.models.Reports || mongoose.model("Reports", reportsSchema);
