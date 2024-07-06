import mongoose, { Document } from "mongoose";

export interface StateDocument extends Document {
  _id: mongoose.Types.ObjectId;
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
    },
  },
  { timestamps: true }
);

export const State:mongoose.Model<StateDocument> =
  mongoose.models.State || mongoose.model("State", StateSchema);
