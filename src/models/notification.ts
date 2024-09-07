import mongoose from "mongoose";

export interface NotificationDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  title: string;
  message: string;
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification: mongoose.Model<NotificationDocument> =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
