import mongoose, { Document } from "mongoose";


export interface StatusDocument extends Document {
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const statusSchema = new mongoose.Schema(
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

export const Status: mongoose.Model<StatusDocument> =
  mongoose.models.Status || mongoose.model("Status", statusSchema);
