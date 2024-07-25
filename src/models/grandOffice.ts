import mongoose, { Document } from "mongoose";

export interface GrandOfficeDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
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
    },
  },
  { timestamps: true }
);

export const GrandOffice: mongoose.Model<GrandOfficeDocument> =
  mongoose.models.GrandOffice ||
  mongoose.model("GrandOffice", GrandOfficeSchema);
