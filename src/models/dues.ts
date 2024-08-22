import mongoose, { Types, Document } from "mongoose";

export interface DueDocument extends Document {
  _id: Types.ObjectId;
  memberId: Types.ObjectId;
  amount: number;
  totalDues: number;
  dueDate: Date;
  paymentStatus: "unpaid" | "paid" | "overdue";
  datePaid?: Date;
  receiptNo?: string;
  balanceForward?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

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
    totalDues: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    datePaid: {
      type: Date,
    },
    receiptNo: {
      type: String,
    },
    balanceForward: {
      type: Number,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "overdue"],
      default: "unpaid",
      required: true,
    },
  },
  { timestamps: true }
);

export const Due: mongoose.Model<DueDocument> =
  mongoose.models.Due || mongoose.model("Due", duesSchema);
