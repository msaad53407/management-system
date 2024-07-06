import mongoose, { Document } from "mongoose";


export interface StatusDocument extends Document {
  _id: mongoose.Types.ObjectId;
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
    },
  },
  { timestamps: true }
);

export const Status: mongoose.Model<StatusDocument> =
  mongoose.models.Status || mongoose.model("Status", statusSchema);
