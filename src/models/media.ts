import mongoose from "mongoose";

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

export const Media =
  mongoose.models.Media || mongoose.model("Media", mediaSchema);
