import mongoose, { Types, Document } from "mongoose";

export interface DistrictDocument extends Document {
  _id: Types.ObjectId;
  deputy_id: Types.ObjectId;
  districtCharterDate: Date;
  districtMeet1: string;
  districtMeet2: string;
  region_id: Types.ObjectId;
  districtYrDues: Types.ObjectId;
  districtMonDues: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const districtSchema = new mongoose.Schema(
  {
    deputyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deputy",
      required: true,
    },
    districtCharterDate: {
      type: Date,
      required: true,
    },
    districtMeet1: {
      type: String,
      required: true,
    },
    districtMeet2: {
      type: String,
      required: true,
    },
    regionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: true,
    },
    districtYrDues: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Due",
      required: true,
    },
    districtMonDues: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Due",
      required: true,
    },
  },

  { timestamps: true }
);

export const District: mongoose.Model<DistrictDocument> =
  mongoose.models.District || mongoose.model("District", districtSchema);
