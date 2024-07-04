import mongoose, { Document } from "mongoose";

export interface ReasonDocument extends Document {
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const reasonSchema = new mongoose.Schema(
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

export const Reason: mongoose.Model<ReasonDocument> =
  mongoose.models.Reason || mongoose.model("Reason", reasonSchema);
