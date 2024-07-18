import mongoose, { Types, Document } from "mongoose";

export interface DueDocument extends Document {
  _id: Types.ObjectId;
  memberId: Types.ObjectId;
  amount: number;
  dueDate: Date;
  paymentStatus: "unpaid" | "paid" | "overdue";
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
    dueDate: {
      type: Date,
      required: true,
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
