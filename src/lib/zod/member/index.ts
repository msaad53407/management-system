import { Roles } from "@/types/globals";
import { z } from "zod";

export const addMemberSchema = z.object({
  greeting: z.enum(["Sis.", "Bro."], {
    required_error: "Greeting is required",
  }),
  chapterId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
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

export const editFormSchema = (role: Roles) =>
  z.object({
    memberId: z
      .string({
        required_error: "Member ID is required",
      })
      .min(1, "Member ID is required"),
    chapterId: z.string(),
    greeting: z.enum(["Sis.", "Bro."], {
      required_error: "Greeting is required",
    }),
    firstName: z.string().min(1, "First name is required"),
    middleName: z
      .string({
        required_error: "Middle name is required",
      })
      .min(1, "Middle name is required"),
    lastName: z.string().min(1, "Last name is required"),
    emailAddress: z
      .string()
      .email("Invalid email address")
      .min(1, "Email address is required"),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required"),
    phoneNumber: z
      .string({ required_error: "Phone number is required" })
      .min(1, "Phone number is required"),
    address: z
      .string({ required_error: "Address is required" })
      .min(1, "Address is required"),
    city: z
      .string({ required_error: "City is required" })
      .min(1, "City is required"),
    state: z
      .string({ required_error: "State is required" })
      .min(1, "State is required"),
    zipcode: z
      .string({ required_error: "Zip code is required" })
      .min(1, "Zip code is required"),
    petitioner1: ["secretary", "grand-administrator"].includes(role)
      ? z
          .string({ required_error: "Petitioner 1 is required" })
          .min(1, "Petitioner 1 is required")
      : z.string().optional(),
    petitioner2: ["secretary", "grand-administrator"].includes(role)
      ? z
          .string({ required_error: "Petitioner 2 is required" })
          .min(1, "Petitioner 2 is required")
      : z.string().optional(),
    petitioner3: ["secretary", "grand-administrator"].includes(role)
      ? z
          .string({ required_error: "Petitioner 3 is required" })
          .min(1, "Petitioner 3 is required")
      : z.string().optional(),
    memberStatus: ["secretary", "grand-administrator"].includes(role)
      ? z
          .string({ required_error: "Member status is required" })
          .min(1, "Member status is required")
      : z.string().optional(),
    chapterOffice: ["secretary", "grand-administrator"].includes(role)
      ? z
          .string({ required_error: "Chapter office is required" })
          .min(1, "Chapter office is required")
      : z.string().optional(),
    grandChapterOffice: z.string().optional(),
    memberRank: ["secretary", "grand-administrator"].includes(role)
      ? z
          .string({ required_error: "Member rank is required" })
          .min(1, "Member rank is required")
      : z.string().optional(),
    birthdate: ["secretary", "grand-administrator"].includes(role)
      ? z
          .string({ required_error: "Birthdate is required" })
          .min(1, "Birthdate is required")
      : z.string().optional(),
    initiationDate: ["secretary", "grand-administrator"].includes(role)
      ? z
          .string({ required_error: "Initiation date is required" })
          .min(1, "Initiation date is required")
      : z.string().optional(),
    queenOfTheSouth: z.string().optional(),
    amarant: z.string().optional(),
    petitionDate: z.string().optional(),
    petitionReceived: z.string().optional(),
    demitIn: z.string().optional(),
    demitOut: z.string().optional(),
    demitToChapter: z.string().optional(),
    investigationDate: z.string().optional(),
    investigationAcceptReject: z.string().optional(),
    enlightenedDate: z.string().optional(),
    droppedDate: z.string().optional(),
    dropReason: z.string().optional(),
    suspensionExpelledDate: z.string().optional(),
    suspensionExpelledReason: z.string().optional(),
    reinstatedDate: z.string().optional(),
    dateOfDeath: z.string().optional(),
    actualDateOfDeath: z.string().optional(),
    placeOfDeath: z.string().optional(),
    emergencyContact: z
      .string({
        required_error: "Emergency contact is required",
      })
      .min(1, "Emergency contact is required"),
    emergencyContactPhone: z
      .string({
        required_error: "Emergency contact phone is required",
      })
      .min(1, "Emergency contact phone is required"),
    secretaryNotes: z.string().optional(),
  });

export const addDistrictSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, "Name is required"),
  districtCharterDate: z
    .string({
      required_error: "District charter date is required",
    })
    .min(1, "District charter date should be in the future"),
  districtMeet1: z
    .string({
      required_error: "District meet 1 is required",
    })
    .min(1, "District meet 1 is required"),
  districtMeet2: z
    .string({
      required_error: "District meet 2 is required",
    })
    .min(1, "District meet 2 is required"),
  firstName: z
    .string({
      required_error: "First name is required",
    })
    .min(1, "First name is required"),
  lastName: z
    .string({
      required_error: "Last name is required",
    })
    .min(1, "Last name is required"),
  username: z
    .string({
      required_error: "Username is required",
    })
    .min(1, "Username is required"),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Email is invalid")
    .min(1, "Email is required"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(1, "Password is required"),
});

export const addChapterSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, "Name is required"),
  chapterNumber: z
    .string({
      required_error: "Chapter number is required",
    })
    .min(1, "Chapter number is required"),
  chapterAddress1: z
    .string({
      required_error: "Address 1 is required",
    })
    .min(1, "Address 1 is required"),
  chapterAddress2: z.string(),
  chapterCity: z
    .string({
      required_error: "City is required",
    })
    .min(1, "City is required"),
  chapterState: z
    .string({
      required_error: "State is required",
    })
    .min(1, "State is required"),
  chapterDistrict: z
    .string({
      required_error: "District is required",
    })
    .min(1, "District is required"),
  chapterEmail: z
    .string({
      required_error: "Email is required",
    })
    .email("Email is invalid")
    .min(1, "Email is required"),
  chapterZipCode: z
    .string({
      required_error: "Zip code is required",
    })
    .min(1, "Zip code is required"),
  chapterChartDate: z
    .string({
      required_error: "Chart date is required",
    })
    .min(1, "Chart date is required"),
  chapterMeet1: z
    .string({
      required_error: "Meet 1 is required",
    })
    .min(1, "Meet 1 is required"),
  chapterMeet2: z.string(),
  chpMonDues: z
    .string({
      required_error: "Monthly dues is required",
    })
    .min(1, "Monthly dues is required"),
  chpYrDues: z
    .string({
      required_error: "Yearly dues is required",
    })
    .min(1, "Yearly dues is required"),
  secretaryFirstName: z
    .string({
      required_error: "First name is required",
    })
    .min(1, "First name is required"),
  secretaryLastName: z
    .string({
      required_error: "Last name is required",
    })
    .min(1, "Last name is required"),
  secretaryEmail: z
    .string({
      required_error: "Email is required",
    })
    .email("Email is invalid")
    .min(1, "Email is required"),
  secretaryUsername: z
    .string({
      required_error: "Username is required",
    })
    .min(1, "Username is required"),
  secretaryPassword: z
    .string({
      required_error: "Password is required",
    })
    .min(1, "Password is required"),
  matronFirstName: z
    .string({
      required_error: "First name is required",
    })
    .min(1, "First name is required"),
  matronLastName: z
    .string({
      required_error: "Last name is required",
    })
    .min(1, "Last name is required"),
  matronEmail: z
    .string({
      required_error: "Email is required",
    })
    .email("Email is invalid")
    .min(1, "Email is required"),
  matronUsername: z
    .string({
      required_error: "Username is required",
    })
    .min(1, "Username is required"),
  matronPassword: z.string({
    required_error: "Password is required",
  }),
});

export const updateChapterSchema = z.object({
  chapterAddress1: z
    .string({
      required_error: "Address 1 is required",
    })
    .min(1, "Address 1 is required"),
  chapterAddress2: z.string(),
  chapterCity: z
    .string({
      required_error: "City is required",
    })
    .min(1, "City is required"),
  chapterEmail: z
    .string({
      required_error: "Email is required",
    })
    .email("Email is invalid")
    .min(1, "Email is required"),
  chapterZipCode: z
    .string({
      required_error: "Zip code is required",
    })
    .min(1, "Zip code is required"),
  chapterChartDate: z
    .string({
      required_error: "Chart date is required",
    })
    .min(1, "Chart date is required"),
  chapterMeet1: z
    .string({
      required_error: "Meet 1 is required",
    })
    .min(1, "Meet 1 is required"),
  chapterMeet2: z
    .string({
      required_error: "Meet 2 is required",
    })
    .min(1, "Meet 2 is required"),
  chpMonDues: z
    .string({
      required_error: "Monthly dues is required",
    })
    .min(1, "Monthly dues is required"),
  chpYrDues: z
    .string({
      required_error: "Yearly dues is required",
    })
    .min(1, "Yearly dues is required"),
  chapterId: z
    .string({
      required_error: "Chapter ID is required",
    })
    .min(1, "Chapter ID is required"),
});

export const updateDuesSchema = z.object({
  memberId: z
    .string({
      required_error: "Member ID is required",
    })
    .min(1, "Member ID is required"),
  amount: z
    .string({
      required_error: "Amount is required",
    })
    .min(1, "Amount is required"),
  totalDues: z
    .string({
      required_error: "Total Dues are required",
    })
    .min(1, "Total Dues are required"),
  dueDate: z
    .string({
      required_error: "Due date is required",
    })
    .min(1, "Due date is required"),
  paymentStatus: z.enum(["unpaid", "paid", "overdue"], {
    required_error: "Payment status is required",
  }),
});

export const dateFormSchema = z.object({
  month: z
    .string({ required_error: "Month is required" })
    .min(1, "Month is required"),
  year: z
    .string({ required_error: "Year is required" })
    .min(1, "Year is required"),
});
