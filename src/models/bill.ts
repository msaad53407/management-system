import mongoose from "mongoose";

export type BillDocument = {
  _id: mongoose.Types.ObjectId;
  chapterId: mongoose.Types.ObjectId;
  amount: number;
  date: Date;
  payee: string;
  onAccountOf: string;
  wmApproval: "Pending" | "Approved" | "Declined";
  treasurerReview: "Pending" | "Reviewed";
  workflowStarted: boolean;
};

const billSchema = new mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    payee: {
      type: String,
      required: true,
    },
    onAccountOf: {
      type: String,
      required: true,
    },
    wmApproval: {
      type: String,
      enum: {
        values: ["Pending", "Approved", "Declined"],
      },
      default: "Pending",
    },
    treasurerReview: {
      type: String,
      enum: {
        values: ["Pending", "Reviewed"],
      },
      default: "Pending",
    },
    workflowStarted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Bill: mongoose.Model<BillDocument> =
  mongoose.models.Bill || mongoose.model("Bill", billSchema);
