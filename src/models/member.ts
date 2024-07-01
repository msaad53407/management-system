import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    greeting: {
      type: String,
      enum: {
        values: ["Sis.", "Bro."],
        message: "{VALUE} is not supported",
      },
    },
    firstName: {
      type: String,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      validate: [/\S+@\S+\.\S+/, "Please enter a valid email address."],
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      minLength: [6, "Password must be at least 6 characters long."],
      validate: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      ],
    },
    phoneNumber1: {
      type: String,
    },
    phoneNumber2: {
      type: String,
    },
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
    },
    zipCode: {
      type: String,
    },
    birthPlace: {
      type: String,
    },
    birthDate: {
      type: Date,
    },
    chapterOffice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChapterOffice",
    },
    grandOffice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GrandOffice",
    },
    rank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rank",
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
    },
    regionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
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
