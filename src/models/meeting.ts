import mongoose from "mongoose";

export interface MeetingDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  chapterId: mongoose.Types.ObjectId;
  meetingDate: Date;
  meetingDoc: string;
  meetingDocType: "minutes" | "history" | "notes";
}

const meetingSchema = new mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    meetingDate: {
      type: Date,
      required: true,
    },
    meetingDoc: {
      type: String,
      required: true,
    },
    meetingDocType: {
      type: String,
      enum: {
        values: ["minutes", "history", "notes"],
      },
      default: "minutes",
    },
  },
  { timestamps: true }
);

export const Meeting: mongoose.Model<MeetingDocument> =
  mongoose.models.Meeting || mongoose.model("Meeting", meetingSchema);
