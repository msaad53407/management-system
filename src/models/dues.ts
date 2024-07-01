import mongoose from "mongoose";

const duesSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Due = mongoose.models.Due || mongoose.model("Due", duesSchema);
