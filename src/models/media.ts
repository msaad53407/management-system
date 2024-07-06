import mongoose, { Document, Types } from "mongoose";

export interface MediaDocument extends Document {
  _id: Types.ObjectId;
  mediaType: string;
  filePath: string;
  relatedEvent: string;
  chapter_id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const mediaSchema = new mongoose.Schema(
  {
    mediaType: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    relatedEvent: {
      type: String,
      required: true,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
  },
  { timestamps: true }
);

export const Media: mongoose.Model<MediaDocument> =
  mongoose.models.Media || mongoose.model("Media", mediaSchema);
