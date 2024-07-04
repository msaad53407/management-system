import mongoose, { Document } from "mongoose";

export interface StateDocument extends Document {
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
} 

const StateSchema = new mongoose.Schema(
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

export const State:mongoose.Model<StateDocument> =
  mongoose.models.State || mongoose.model("State", StateSchema);
