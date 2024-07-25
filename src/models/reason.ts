import mongoose, { Document } from "mongoose";

export interface ReasonDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
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
    },
  },
  { timestamps: true }
);

export const Reason: mongoose.Model<ReasonDocument> =
  mongoose.models.Reason || mongoose.model("Reason", reasonSchema);
