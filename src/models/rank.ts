import mongoose, { Document } from "mongoose";

export interface RankDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const rankSchema = new mongoose.Schema(
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

export const Rank:mongoose.Model<RankDocument> = mongoose.models.Rank || mongoose.model("Rank", rankSchema);
