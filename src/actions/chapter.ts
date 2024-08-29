"use server";
import { isAuthenticated } from "@/lib/authorization";
import { connectDB } from "@/lib/db";
import { checkRole } from "@/lib/role";
import {
  addChapterSchema,
  addMemberSchema,
  editFormSchema,
  updateChapterSchema,
} from "@/lib/zod/member";
import { Chapter, ChapterDocument } from "@/models/chapter";
import { Due } from "@/models/dues";
import { Member, MemberDocument } from "@/models/member";
import { Roles } from "@/types/globals";
import { auth, clerkClient, User } from "@clerk/nextjs/server";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { createDues } from "./dues";
import { getAllStatuses } from "@/utils/functions";
import { ChapterOffice } from "@/models/chapterOffice";

type GetDistrictParams =
  | { secretaryId: string; chapterId?: never; matronId?: never }
  | { secretaryId?: never; chapterId: string; matronId?: never }
  | { secretaryId?: never; chapterId?: never; matronId: string };

export const getChapterMembers = async (chapterId?: Types.ObjectId) => {
  if (!(await isAuthenticated())) {
    return {
      data: null,
      message: "Unauthorized",
    };
  }
  const userId = auth().userId;
  try {
    await connectDB();
    let members;
    const { data: statuses, message } = await getAllStatuses();

    if (!statuses) {
      return {
        data: null,
        message,
      };
    }
    if (chapterId) {
      members = await Member.find({
        chapterId,
      });

      if (!members || members?.length === 0) {
        return {
          data: null,
          message: "There are currently no members in this Chapter.",
        };
      }

      return {
        data: members,
        message: "Members fetched successfully",
      };
    }

    if (checkRole(["secretary", "worthy-matron"])) {
      let role: Roles | null = null;
      let chapter: ChapterDocument | null;
      if (checkRole("secretary")) {
        chapter = await Chapter.findOne({ secretaryId: userId });
        role = "secretary";
      } else {
        chapter = await Chapter.findOne({ matronId: userId });
        role = "worthy-matron";
      }

      if (!chapter) {
        return {
          data: null,
          message: `You are not ${role} of any chapter`,
        };
      }
      members = await Member.find({
        chapterId: chapter._id,
      });
    } else if (checkRole("member")) {
      const member = await Member.findOne({ userId });
      if (!member) {
        return {
          data: null,
          message: "You are not a member of any chapter",
        };
      }
      // members = await Member.find(
      //   {
      //     $or: [
      //       { chapterId: member.chapterId },
      //       { demitToChapter: member.chapterId },
      //     ],
      //   },
      //   null
      // );
      members = await Member.find({
        chapterId: member.chapterId,
      });
    } else {
      return {
        data: null,
        message: "Unauthorized",
      };
    }

    if (!members || members?.length === 0) {
      return {
        data: null,
        message: "Members not found",
      };
    }

    return {
      data: members,
      message: "Members fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to DB",
    };
  }
};

export const removeMember = async (
  memberId: string
): Promise<
  { data: null; message: string } | { data: MemberDocument; message: string }
> => {
  if (!(await isAuthenticated())) {
    return {
      data: null,
      message: "Unauthorized",
    };
  }

  if (!checkRole("grand-administrator")) {
    return {
      data: null,
      message: "Unauthorized",
    };
  }

  try {
    await connectDB();
    const deletedUser = await clerkClient().users.deleteUser(memberId);
    if (!deletedUser) {
      return {
        data: null,
        message: "Member not found",
      };
    }
    const member = await Member.findOneAndDelete({ userId: memberId });
    if (!member) {
      return {
        data: null,
        message: "Member not found",
      };
    }
    const deletedDues = await Due.deleteMany({ memberId: member._id });

    if (!deletedDues) {
      return {
        data: null,
        message: "Member not found",
      };
    }

    revalidatePath(`/chapter/${member.chapterId}/members`);
    return {
      data: JSON.parse(JSON.stringify(member)),
      message: "Member removed successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to DB",
    };
  }
};

export const addMember = async (_prevState: any, formData: FormData) => {
  if (!(await isAuthenticated())) {
    redirect("/sign-in");
  }
  if (!checkRole(["secretary", "grand-administrator"])) {
    redirect("/chapter/members");
  }

  const { userId, sessionClaims } = auth();
  const role = sessionClaims?.metadata.role!;

  const rawData = Object.fromEntries(formData);

  const { success, data, error } = addMemberSchema(role).safeParse(rawData);

  if (!success) {
    console.error(error);
    return {
      success: false,
      message: error.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    let user: User | null = null;
    try {
      user = await clerkClient().users.createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data?.username,
        emailAddress: [data.email],
        publicMetadata: {
          role: "member",
        },
        passwordHasher: "bcrypt",
        passwordDigest: hashedPassword,
        skipPasswordRequirement: true,
        skipPasswordChecks: true,
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      return {
        message:
          "Error: Provide all required User details or Email or Username may already exist",
        success: false,
      };
    }

    if (!user) {
      return { message: "Error: Could not create user", success: false };
    }
    let chapter;
    if (!data.chapterId) {
      if (checkRole("grand-administrator")) {
        return {
          message: "Error: Please provide Chapter Id",
          success: false,
        };
      }
      chapter = await Chapter.findOne({ secretaryId: userId });
    }

    if (checkRole("grand-administrator")) {
      chapter = await Chapter.findById(new Types.ObjectId(data.chapterId));
      if (!chapter) {
        return {
          message: "Error: Chapter not found",
          success: false,
        };
      }
    }

    const member = await Member.create({
      userId: user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      password: hashedPassword,
      email: data.email,
      photo: user.imageUrl,
      chapterId: data.chapterId
        ? new Types.ObjectId(data.chapterId)
        : new Types.ObjectId(chapter?._id),
      role: (user.publicMetadata?.role as string) || null,
      zipCode: data.zipCode,
      address1: data.address,
      city: data.city,
      state: new Types.ObjectId(data.state) || null,
      status: new Types.ObjectId(data.memberStatus) || null,
      phoneNumber1: data.phoneNumber,
      sponsor1: data.petitioner1 ? new Types.ObjectId(data.petitioner1) : null,
      sponsor2: data.petitioner2 ? new Types.ObjectId(data.petitioner2) : null,
      sponsor3: data.petitioner3 ? new Types.ObjectId(data.petitioner3) : null,
      greeting: data.greeting,
      districtId: new Types.ObjectId(chapter?.districtId) || null,
      duesLeftForYear:
        (12 - new Date().getMonth()) * (chapter?.chpMonDues || 0),
      extraDues: 0,
    });

    if (!member) {
      return {
        message: "Error: Member not added",
        success: false,
      };
    }

    const { data: dues, message } = await createDues(
      member._id,
      chapter?.chpMonDues,
      new Date().getMonth()
    );

    if (!dues) {
      return {
        message: "Error: " + message,
        success: false,
      };
    }

    if (checkRole(["secretary", "member"])) {
      revalidatePath("/chapter/members");
    } else {
      revalidatePath(`/chapter/${data.chapterId}/members`);
    }

    return {
      success: true,
      message: "Successfully added member",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Error Connecting to DB",
      success: false,
    };
  }
};

export const editMember = async (_prevState: any, formData: FormData) => {
  const { userId } = auth();
  const role = auth().sessionClaims?.metadata.role;

  const rawData = Object.fromEntries(formData);
  const editFormSchemaValidation = editFormSchema(role!);
  const { success, data, error } = editFormSchemaValidation.safeParse(rawData);

  if (!success) {
    console.error(JSON.stringify(error));
    return {
      message: error.flatten().fieldErrors,
      success: false,
    };
  }
  if (
    !checkRole(["secretary", "grand-administrator"]) &&
    userId !== data.memberId
  ) {
    redirect("/");
  }
  try {
    await connectDB();

    const treasurerOffice = await ChapterOffice.findOne({
      name: "Treasurer",
    });

    if (!treasurerOffice) {
      return {
        message: "Treasurer office not found",
        success: false,
      };
    }

    if (treasurerOffice._id.toString() === data.chapterOffice) {
      const alreadyExistingTreasurer = await Member.findOne({
        chapterId: new Types.ObjectId(data.chapterId),
        chapterOffice: new Types.ObjectId(treasurerOffice._id),
      });

      if (alreadyExistingTreasurer) {
        return {
          message: "Treasurer already exists in Chapter",
          success: false,
        };
      }
    }

    if (checkRole(["secretary", "grand-administrator"])) {
      const member = await Member.findOneAndUpdate(
        { userId: data.memberId },
        {
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          email: data.emailAddress,
          greeting: data.greeting,
          zipCode: data.zipcode,
          address1: data.address,
          city: data.city,
          state: new Types.ObjectId(data.state) || null,
          phoneNumber1: data.phoneNumber,
          sponsor1: data.petitioner1
            ? new Types.ObjectId(data.petitioner1)
            : null,
          sponsor2: data.petitioner2
            ? new Types.ObjectId(data.petitioner2)
            : null,
          sponsor3: data.petitioner3
            ? new Types.ObjectId(data.petitioner3)
            : null,
          birthDate: data.birthdate ? new Date(data.birthdate) : null,
          initiationDate: data.initiationDate
            ? new Date(data.initiationDate)
            : null,
          queenOfTheSouth: data.queenOfTheSouth
            ? new Date(data.queenOfTheSouth)
            : null,
          amaranthDate: data.amarant ? new Date(data.amarant) : null,
          memberRank: data.memberRank
            ? new Types.ObjectId(data.memberRank)
            : null,
          petitionDate: data.petitionDate ? new Date(data.petitionDate) : null,
          petitionReceivedDate: data.petitionReceived
            ? new Date(data.petitionReceived)
            : null,
          demitInDate: data.demitIn ? new Date(data.demitIn) : null,
          demitOutDate: data.demitOut ? new Date(data.demitOut) : null,
          investigationDate: data.investigationDate
            ? new Date(data.investigationDate)
            : null,
          investigationAcceptOrRejectDate: data.investigationAcceptReject
            ? new Date(data.investigationAcceptReject)
            : null,
          droppedDate: data.droppedDate ? new Date(data.droppedDate) : null,
          emergencyContact: data.emergencyContact,
          secretaryNotes: data.secretaryNotes,
          dateOfDeath: data.dateOfDeath ? new Date(data.dateOfDeath) : null,
          actualDateOfDeath: data.actualDateOfDeath
            ? new Date(data.actualDateOfDeath)
            : null,
          emergencyContactPhone: data.emergencyContactPhone,
          password: data.password,
          dropReason: data.dropReason
            ? new Types.ObjectId(data.dropReason)
            : null,
          expelReason: data.suspensionExpelledReason
            ? new Types.ObjectId(data.suspensionExpelledReason)
            : null,
          expelDate: data.suspensionExpelledDate
            ? new Date(data.suspensionExpelledDate)
            : null,
          dropDate: data.droppedDate ? new Date(data.droppedDate) : null,
          deathDate: data.dateOfDeath ? new Date(data.dateOfDeath) : null,
          actualDeathDate: data.actualDateOfDeath
            ? new Date(data.actualDateOfDeath)
            : null,
          deathPlace: data.placeOfDeath,
          enlightenDate: data.enlightenedDate
            ? new Date(data.enlightenedDate)
            : null,
          queenOfSouthDate: data.queenOfTheSouth
            ? new Date(data.queenOfTheSouth)
            : null,
          chapterOffice: data.chapterOffice
            ? new Types.ObjectId(data.chapterOffice)
            : null,
          grandOffice: data.grandChapterOffice
            ? new Types.ObjectId(data.grandChapterOffice)
            : null,
          rank: data.memberRank ? new Types.ObjectId(data.memberRank) : null,
          reinstatedDate: data.reinstatedDate
            ? new Date(data.reinstatedDate)
            : null,
          status: data.memberStatus
            ? new Types.ObjectId(data.memberStatus)
            : null,
          chapter: data.chapterId ? new Types.ObjectId(data.chapterId) : null,
          demitToChapter: data.demitToChapter
            ? new Types.ObjectId(data.demitToChapter)
            : null,
        },
        {
          new: true,
        }
      );

      if (!member) {
        return {
          message: "Error: Member not found",
          success: false,
        };
      }

      revalidatePath(`/chapter/${data.chapterId}/members`);
      return {
        message: "Member updated successfully",
        success: true,
      };
    }

    const member = await Member.findOneAndUpdate(
      { userId: data.memberId },
      {
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        email: data.emailAddress,
        zipCode: data.zipcode,
        address1: data.address,
        city: data.city,
        state: new Types.ObjectId(data.state) || null,
        phoneNumber1: data.phoneNumber,
        emergencyContact: data.emergencyContact,
        emergencyContactPhone: data.emergencyContactPhone,
      }
    );

    if (!member) {
      return {
        message: "Error: Member not found",
        success: false,
      };
    }

    revalidatePath("/chapter/members");

    return {
      message: "Member updated successfully",
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Error Connecting to DB",
      success: false,
    };
  }
};

export const getChapter = async (params: GetDistrictParams) => {
  try {
    await connectDB();

    if (checkRole("secretary")) {
      if (!("secretaryId" in params) || !params.secretaryId) {
        return {
          data: null,
          message: "Please provide a valid SecretaryId",
        };
      }

      const chapter: ChapterDocument | null = JSON.parse(
        JSON.stringify(
          await Chapter.findOne({ secretaryId: params.secretaryId })
        )
      );

      if (!chapter) {
        return {
          data: null,
          message: "Chapter not found",
        };
      }

      return {
        data: chapter,
        message: "Chapter fetched successfully",
      };
    }
    if (checkRole("worthy-matron")) {
      if (!("matronId" in params) || !params.matronId) {
        return {
          data: null,
          message: "Please provide a valid Worthy Matron Id",
        };
      }

      const chapter: ChapterDocument | null = JSON.parse(
        JSON.stringify(await Chapter.findOne({ matronId: params.matronId }))
      );

      if (!chapter) {
        return {
          data: null,
          message: "Chapter not found",
        };
      }

      return {
        data: chapter,
        message: "Chapter fetched successfully",
      };
    }

    if (!("chapterId" in params) || !params.chapterId) {
      return {
        data: null,
        message: "Please provide a valid ChapterId",
      };
    }

    const chapter: ChapterDocument | null = JSON.parse(
      JSON.stringify(
        await Chapter.findById(new Types.ObjectId(params.chapterId))
      )
    );

    if (!chapter) {
      return {
        data: null,
        message: "Chapter not found",
      };
    }

    return {
      data: chapter,
      message: "Chapter fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to DB",
    };
  }
};

export const addChapter = async (_prevState: any, formData: FormData) => {
  try {
    await connectDB();

    const rawFormData = Object.fromEntries(formData);

    const { success, data, error } = addChapterSchema.safeParse(rawFormData);

    if (!success) {
      console.error(error);
      return {
        message: error.flatten().fieldErrors,
        success: false,
      };
    }

    const hashedPasswordSecretary = await bcrypt.hash(
      data.secretaryPassword,
      10
    );
    const hashedPasswordMatron = await bcrypt.hash(data.matronPassword, 10);

    let secretary: User | null = null;
    let matron: User | null = null;
    try {
      secretary = await clerkClient().users.createUser({
        firstName: data.secretaryFirstName,
        lastName: data.secretaryLastName,
        username: data.secretaryUsername,
        emailAddress: [data.secretaryEmail],
        publicMetadata: {
          role: "secretary",
        },
        passwordHasher: "bcrypt",
        passwordDigest: hashedPasswordSecretary,
        skipPasswordRequirement: true,
        skipPasswordChecks: true,
      });
      matron = await clerkClient().users.createUser({
        firstName: data.matronFirstName,
        lastName: data.matronLastName,
        username: data.matronUsername,
        emailAddress: [data.matronEmail],
        publicMetadata: {
          role: "worthy-matron",
        },
        passwordHasher: "bcrypt",
        passwordDigest: hashedPasswordMatron,
        skipPasswordRequirement: true,
        skipPasswordChecks: true,
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      return {
        message:
          "Error: Provide all required User details or Email or Username may already exist",
        success: false,
      };
    }

    if (!secretary || !matron) {
      return {
        message: "Error: Could not create Secretary or Worthy Matron",
        success: false,
      };
    }

    const chapter = await Chapter.create({
      name: data.name,
      chapterNumber: Number(data.chapterNumber),
      chapterAddress1: data.chapterAddress1,
      chapterAddress2: data.chapterAddress2,
      chapterEmail: data.chapterEmail,
      chapterCity: data.chapterCity,
      chapterState: new Types.ObjectId(data.chapterState),
      chapterZipCode: data.chapterZipCode,
      matronId: matron.id,
      secretaryId: secretary.id,
      chapterChartDate: new Date(data.chapterChartDate),
      districtId: new Types.ObjectId(data.chapterDistrict),
      chapterMeet1: data.chapterMeet1,
      chapterMeet2: data.chapterMeet2,
      chpMonDues: data.chpMonDues,
      chpYrDues: data.chpYrDues,
    });

    if (!chapter) {
      return {
        message: "Error: Could not add Chapter",
        success: false,
      };
    }

    revalidatePath("/chapter");

    return {
      success: true,
      message: "Chapter Added Successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Error Connecting to DB",
      success: false,
    };
  }
};

export const editChapter = async (_prevState: any, formData: FormData) => {
  const { userId } = auth();

  const rawData = Object.fromEntries(formData);
  const { success, data, error } = updateChapterSchema.safeParse(rawData);

  if (!success) {
    console.error(JSON.stringify(error));
    return {
      success: false,
      message: error.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();
    if (checkRole("secretary")) {
      const chapter = await Chapter.findOneAndUpdate(
        { secretaryId: userId },
        {
          chapterAddress1: data.chapterAddress1,
          chapterAddress2: data.chapterAddress2,
          chapterCity: data.chapterCity,
          chapterZip: data.chapterZipCode,
          chapterChartDate: new Date(data.chapterChartDate),
          chapterMeet1: data.chapterMeet1,
          chapterMeet2: data.chapterMeet2,
          chpMonDues: data.chpMonDues,
          chpYrDues: data.chpYrDues,
        },
        {
          new: true,
        }
      );

      if (!chapter) {
        return {
          success: false,
          message: "Error: Chapter not found",
        };
      }
    }

    const chapter = await Chapter.findByIdAndUpdate(
      data.chapterId,
      {
        chapterAddress1: data.chapterAddress1,
        chapterAddress2: data.chapterAddress2,
        chapterCity: data.chapterCity,
        chapterZipCode: data.chapterZipCode,
        chapterEmail: data.chapterEmail,
        chapterChartDate: new Date(data.chapterChartDate),
        chapterMeet1: data.chapterMeet1,
        chapterMeet2: data.chapterMeet2,
        chpMonDues: data.chpMonDues,
        chpYrDues: data.chpYrDues,
        technologyFees: data.chapterTechnologyFees,
      },
      { new: true }
    );

    if (!chapter) {
      return {
        success: false,
        message: "Error: Chapter not found",
      };
    }

    return {
      success: true,
      message: "Chapter Updated",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error Connecting to DB",
    };
  } finally {
    revalidatePath(`/chapter/${data.chapterId}/settings`);
  }
};
