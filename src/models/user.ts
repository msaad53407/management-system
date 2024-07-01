import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: { unique: true },
    },
    clerkId: {
      type: String,
      required: true,
      index: { unique: true },
    },
    username: {
      type: String,
    },
    role: {
      type: String,
      enum: {
        values: [
          "grand-administrator",
          "grand-officer",
          "worthy-matron",
          "member",
          "district-deputy",
          "secretary",
        ],
        message: "{VALUE} is not supported",
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
