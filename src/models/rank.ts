import mongoose from "mongoose";

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

export const Rank = mongoose.models.Rank || mongoose.model("Rank", rankSchema);
