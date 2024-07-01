import mongoose from "mongoose";

const GrandOfficeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const GrandOffice = mongoose.model("GrandOffice", GrandOfficeSchema);
