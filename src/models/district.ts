import mongoose, { Types, Document } from "mongoose";

export interface DistrictDocument extends Document {
  _id: Types.ObjectId;
  deputyId?: string;
  name?: string;
  districtCharterDate?: Date;
  districtMeet1?: string;
  districtMeet2?: string;
  regionId?: Types.ObjectId;
  districtYrDues?: Types.ObjectId;
  districtMonDues?: Types.ObjectId;
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Due",
    },
    districtMonDues: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Due",
    },
  },

  { timestamps: true }
);

export const District: mongoose.Model<DistrictDocument> =
  mongoose.models.District || mongoose.model("District", districtSchema);
