import mongoose, { Document } from "mongoose";
import { Types } from "mongoose";

export interface PaymentDocument extends Document {
  _id: Types.ObjectId;
  member_id: Types.ObjectId;
  paymentType: string;
  amount: number;
  paymentDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Payment: mongoose.Model<PaymentDocument> =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
