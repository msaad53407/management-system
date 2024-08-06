import { Roles } from "@/types/globals";
import mongoose from "mongoose";
import { Document, Types } from "mongoose";

export interface MemberDocument extends Document {
  _id: Types.ObjectId;
  userId: string;
  status?: Types.ObjectId;
  greeting?: "Sis." | "Bro.";
  role?: Roles;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  photo?: string;
  password?: string;
  phoneNumber1?: string;
  phoneNumber2?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: Types.ObjectId;
  zipCode?: string;
  birthPlace?: string;
  birthDate?: Date;
  chapterOffice?: Types.ObjectId;
  grandOffice?: Types.ObjectId;
  rank?: Types.ObjectId;
  dropReason?: Types.ObjectId;
  dropDate?: Date;
  expelReason?: Types.ObjectId;
  expelDate?: Date;
  suspendReason?: Types.ObjectId;
  suspendDate?: Date;
  deathDate?: Date;
  actualDeathDate?: Date;
  deathPlace?: string;
  secretaryNotes?: string;
  enlightenDate?: Date;
  demitInDate?: Date;
  demitOutDate?: Date;
  demitToChapter?: Types.ObjectId;
  investigationDate?: Date;
  investigationAcceptOrRejectDate?: Date;
  sponsor1?: Types.ObjectId;
  sponsor2?: Types.ObjectId;
  sponsor3?: Types.ObjectId;
  petitionDate?: Date;
  petitionReceivedDate?: Date;
  initiationDate?: Date;
  amaranthDate?: Date;
  queenOfSouthDate?: Date;
  districtId?: Types.ObjectId;
  regionId?: Types.ObjectId;
  chapterId?: Types.ObjectId;
  extraDues?: number;
  duesLeftForYear?: number;
  spouseName?: string;
  spousePhone?: string;
  emergencyContact?: string;
  emergencyContactPhone?: string;
  reinstatedDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: null,
    },
    role: {
      type: String,
      enum: {
        values: [
          "grand-administrator",
          "grand-officer",
          "worthy-matron",
          "member",
          "district-deputy",
          "secretary",
        ],
        message: "{VALUE} is not supported",
      },
      default: null,
    },
    greeting: {
      type: String,
      enum: {
        values: ["Sis.", "Bro."],
        message: "{VALUE} is not supported",
      },
      default: null,
    },
    firstName: {
      type: String,
      default: null,
    },
    middleName: {
      type: String,
      default: null,
    },
    extraDues: {
      type: Number,
      default: 0,
    },
    duesLeftForYear: {
      type: Number,
      default: 0,
    },
    lastName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      validate: [/\S+@\S+\.\S+/, "Please enter a valid email address."],
      default: null,
    },
    photo: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      minLength: [6, "Password must be at least 6 characters long."],
      default: null,
    },
    phoneNumber1: {
      type: String,
      default: null,
    },
    phoneNumber2: {
      type: String,
      default: null,
    },
    address1: {
      type: String,
      default: null,
    },
    address2: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    status: {
      type: Types.ObjectId,
      ref: "Status",
      default: null,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      default: null,
    },
    zipCode: {
      type: String,
      default: null,
    },
    birthPlace: {
      type: String,
      default: null,
    },
    birthDate: {
      type: Date,
      default: null,
    },
    chapterOffice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChapterOffice",
      default: null,
    },
    grandOffice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GrandOffice",
      default: null,
    },
    rank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rank",
      default: null,
    },
    dropReason: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reason",
      default: null,
    },
    dropDate: {
      type: Date,
      default: null,
    },
    expelReason: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reason",
      default: null,
    },
    expelDate: {
      type: Date,
      default: null,
    },
    suspendReason: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reason",
      default: null,
    },
    suspendDate: {
      type: Date,
      default: null,
    },
    deathDate: {
      type: Date,
      default: null,
    },
    actualDeathDate: {
      type: Date,
      default: null,
    },
    deathPlace: {
      type: String,
      default: null,
    },
    secretaryNotes: {
      type: String,
      default: null,
    },
    enlightenDate: {
      type: Date,
      default: null,
    },
    reinstatedDate: {
      type: Date,
      default: null,
    },
    demitInDate: {
      type: Date,
      default: null,
    },
    demitOutDate: {
      type: Date,
      default: null,
    },
    demitToChapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      default: null,
    },
    investigationDate: {
      type: Date,
      default: null,
    },
    investigationAcceptOrRejectDate: {
      type: Date,
      default: null,
    },
    sponsor1: {
      type: Types.ObjectId,
      ref: "Member",
      default: null,
    },
    sponsor2: {
      type: Types.ObjectId,
      ref: "Member",
      default: null,
    },
    sponsor3: {
      type: Types.ObjectId,
      ref: "Member",
      default: null,
    },
    petitionDate: {
      type: Date,
      default: null,
    },
    petitionReceivedDate: {
      type: Date,
      default: null,
    },
    initiationDate: {
      type: Date,
      default: null,
    },
    amaranthDate: {
      type: Date,
      default: null,
    },
    queenOfSouthDate: {
      type: Date,
      default: null,
    },
    districtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      default: null,
    },
    regionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      default: null,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      default: null,
    },
    spouseName: {
      type: String,
      default: null,
    },
    spousePhone: {
      type: String,
      default: null,
    },
    emergencyContact: {
      type: String,
      default: null,
    },
    emergencyContactPhone: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const Member: mongoose.Model<MemberDocument> =
  mongoose.models.Member || mongoose.model("Member", memberSchema);
