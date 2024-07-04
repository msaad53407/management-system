import mongoose, { Document } from "mongoose";

export interface GrandOfficeDocument extends Document {
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const GrandOfficeSchema = new mongoose.Schema(
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

export const GrandOffice: mongoose.Model<GrandOfficeDocument> =
  mongoose.models.GrandOffice ||
  mongoose.model("GrandOffice", GrandOfficeSchema);
