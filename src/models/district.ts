import mongoose, { Types, Document } from "mongoose";

export interface DistrictDocument extends Document {
  _id: Types.ObjectId;
  deputyId?: string;
  name?: string;
  districtCharterDate?: Date;
  districtMeet1?: string;
  districtMeet2?: string;
  regionId?: Types.ObjectId;
  districtYrDues?: number;
  districtMonDues?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const districtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    deputyId: {
      type: String,
    },
    districtCharterDate: {
      type: Date,
    },
    districtMeet1: {
      type: String,
    },
    districtMeet2: {
      type: String,
    },
    regionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
    },
    districtYrDues: {
      type: Number,
      default: 0,
    },
    districtMonDues: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

export const District: mongoose.Model<DistrictDocument> =
  mongoose.models.District || mongoose.model("District", districtSchema);
