import mongoose from "mongoose";

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

export const Status =
  mongoose.models.Status || mongoose.model("Status", statusSchema);
