import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
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

export const User = mongoose.model("User", userSchema);
