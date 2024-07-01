import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    greeting: {
      type: String,
      required: true,
      enum: {
        values: ["Sis.", "Bro."],
        message: "{VALUE} is not supported",
      },
    },
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [/\S+@\S+\.\S+/, "Please enter a valid email address."],
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters long."],
      validate: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      ],
    },
    phoneNumber1: {
      type: String,
      required: true,
    },
    phoneNumber2: {
      type: String,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    birthPlace: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    chapterOffice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChapterOffice",
      required: true,
    },
    grandOffice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GrandOffice",
      required: true,
    },
    rank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rank",
      required: true,
    },
    dropReason: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reason",
    },
    dropDate: {
      type: Date,
    },
    expelReason: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reason",
    },
    expelDate: {
      type: Date,
    },
    suspendReason: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reason",
    },
    suspendDate: {
      type: Date,
    },
    deathDate: {
      type: Date,
    },
    actualDeathDate: {
      type: Date,
    },
    deathPlace: {
      type: Date,
    },
    secretaryNotes: {
      type: String,
    },
    enlightenDate: {
      type: Date,
    },
    demitInDate: {
      type: Date,
    },
    demitOutDate: {
      type: Date,
    },
    demitToChapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
    },
    investigationDate: {
      type: Date,
    },
    investigationAcceptOrRejectDate: {
      type: Date,
    },
    sponsor1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    sponsor2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    sponsor3: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    petitionDate: {
      type: Date,
    },
    petitionReceivedDate: {
      type: Date,
    },
    initiationDate: {
      type: Date,
    },
    amaranthDate: {
      type: Date,
    },
    queenOfSouthDate: {
      type: Date,
    },
    districtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
    regionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: true,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    spouseName: {
      type: String,
    },
    spousePhone: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Member =
  mongoose.models.Member || mongoose.model("Member", memberSchema);
