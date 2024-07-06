import { Roles } from "@/types/globals";
import mongoose, { Document } from "mongoose";

export interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  clerkId: string;
  username?: string;
  avatar?: string;
  role?: Roles;
  createdAt?: Date;
  updatedAt?: Date;
}

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
    avatar: {
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

export const User: mongoose.Model<UserDocument> = mongoose.models.User || mongoose.model("User", userSchema);
