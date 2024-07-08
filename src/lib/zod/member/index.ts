import { z } from "zod";

export const addMemberSchema = z.object({
  userId: z.string().min(30, "User ID is minimum 30 characters long"),
  greeting: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string().optional(),
  zipCode: z.string(),
  petitioner1: z.string().optional(),
  petitioner2: z.string().optional(),
  petitioner3: z.string().optional(),
  memberStatus: z.string().optional(),
});

export const editFormSchema = z.object({
  memberId: z
    .string({
      required_error: "Member ID is required",
    })
    .min(1, "Member ID is requried"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z
    .string({
      required_error: "Middle name is required",
    })
    .min(1, "Middle name is requried"),
  lastName: z.string().min(1, "Last name is required"),
  emailAddress: z
    .string()
    .email("Invalid email address")
    .min(1, "Email address is requried"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is requried"),
  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .min(1, "Phone number is requried"),
  address: z
    .string({ required_error: "Address is required" })
    .min(1, "Address is requried"),
  city: z
    .string({ required_error: "City is required" })
    .min(1, "City is requried"),
  state: z
    .string({ required_error: "State is required" })
    .min(1, "State is requried"),
  zipcode: z
    .string({ required_error: "Zip code is required" })
    .min(1, "Zip code is requried"),
  petitioner1: z
    .string({ required_error: "Petitioner 1 is required" })
    .min(1, "Petitioner 1 is requried"),
  petitioner2: z
    .string({ required_error: "Petitioner 2 is required" })
    .min(1, "Petitioner 2 is requried"),
  petitioner3: z
    .string({ required_error: "Petitioner 3 is required" })
    .min(1, "Petitioner 3 is requried"),
  memberStatus: z
    .string({ required_error: "Member status is required" })
    .min(1, "Member status is requried"),
  chapterOffice: z
    .string({ required_error: "Chapter office is required" })
    .min(1, "Chapter office is requried"),
  grandChapterOffice: z
    .string({
      required_error: "Grand chapter office is required",
    })
    .min(1, "Grand chapter office is requried"),
  memberRank: z
    .string({ required_error: "Member rank is required" })
    .min(1, "Member rank is requried"),
  birthdate: z
    .string({ required_error: "Birthdate is required" })
    .min(1, "Birthdate is requried"),
  initiationDate: z
    .string({ required_error: "Initiation date is required" })
    .min(1, "Initiation date is requried"),
  queenOfTheSouth: z
    .string({
      required_error: "Queen of the South is required",
    })
    .min(1, "Queen of the South is requried"),
  amarant: z
    .string({ required_error: "Amarant is required" })
    .min(1, "Amarant is requried"),
  petitionDate: z
    .string({ required_error: "Petition date is required" })
    .min(1, "Petition date is requried"),
  petitionReceived: z
    .string({
      required_error: "Petition received is required",
    })
    .min(1, "Petition received is requried"),
  demitIn: z
    .string({ required_error: "Demit in is required" })
    .min(1, "Demit in is requried"),
  demitOut: z
    .string({ required_error: "Demit out is required" })
    .min(1, "Demit out is requried"),
  demitToChapter: z
    .string({ required_error: "Demit to chapter is required" })
    .min(1, "Demit to chapter is requried"),
  investigationDate: z
    .string({
      required_error: "Investigation date is required",
    })
    .min(1, "Investigation date is requried"),
  investigationAcceptReject: z
    .string({
      required_error: "Investigation accept/reject is required",
    })
    .min(1, "Investigation accept/reject is requried"),
  enlightenedDate: z
    .string({ required_error: "Enlightened date is required" })
    .min(1, "Enlightened date is requried"),
  droppedDate: z
    .string({ required_error: "Dropped date is required" })
    .min(1, "Dropped date is requried"),
  dropReason: z
    .string({ required_error: "Drop reason is required" })
    .min(1, "Drop reason is requried"),
  suspensionExpelledDate: z
    .string({
      required_error: "Suspension/expulsion date is required",
    })
    .min(1, "Suspension/expulsion date is requried"),
  suspensionExpelledReason: z
    .string({
      required_error: "Suspension/expulsion reason is required",
    })
    .min(1, "Suspension/expulsion reason is requried"),
  reinstatedDate: z
    .string({ required_error: "Reinstated date is required" })
    .min(1, "Reinstated date is requried"),
  dateOfDeath: z
    .string({ required_error: "Date of death is required" })
    .min(1, "Date of death is requried"),
  actualDateOfDeath: z
    .string({
      required_error: "Actual date of death is required",
    })
    .min(1, "Actual date of death is requried"),
  placeOfDeath: z
    .string({ required_error: "Place of death is required" })
    .min(1, "Place of death is requried"),
  emergencyContact: z
    .string({
      required_error: "Emergency contact is required",
    })
    .min(1, "Emergency contact is requried"),
  emergencyContactPhone: z
    .string({
      required_error: "Emergency contact phone is required",
    })
    .min(1, "Emergency contact phone is requried"),
  secretaryNotes: z
    .string({ required_error: "Secretary notes is required" })
    .min(1, "Secretary notes is requried"),
});
