"use server";
import { Chapter, ChapterDocument } from "@/models/chapter";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import { auth, clerkClient, User } from "@clerk/nextjs/server";
import { Member, MemberDocument } from "@/models/member";
import { checkRole } from "@/lib/role";
import { isAuthenticated } from "@/lib/authorization";
import { revalidatePath } from "next/cache";
import { addMemberSchema, editFormSchema } from "@/lib/zod/member";
import { redirect } from "next/navigation";
import { Types } from "mongoose";
import { Roles } from "@/types/globals";

type GetDistrictParams =
  | { secretaryId: string; chapterId?: never }
  | { secretaryId?: never; chapterId: string };

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

    if (chapterId) {
      members = await Member.find({ chapterId });

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
      members = await Member.find({ chapterId: chapter._id });
    } else if (checkRole("member")) {
      const member = await Member.findOne({ userId });
      if (!member) {
        return {
          data: null,
          message: "You are not a member of any chapter",
        };
      }
      members = await Member.find({ chapterId: member.chapterId }, null, {
        sort: { createdAt: -1 },
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

  const { userId } = auth();

  if (
    !memberId ||
    (!checkRole(["secretary", "grand-administrator"]) && memberId !== userId)
  ) {
    return {
      data: null,
      message: "Unauthorized",
    };
  }

  try {
    await connectDB();
    const member = await Member.findOneAndDelete({ userId: memberId });
    if (!member) {
      return {
        data: null,
        message: "Member not found",
      };
    }
    revalidatePath("/chapter/members");
    revalidatePath("/chapter/[chapterId]/members");
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
  const { userId } = auth();
  const rawData = Object.fromEntries(formData);

  const { success, data, error } = addMemberSchema.safeParse(rawData);

  if (!success) {
    console.error(error);
    return {
      message: error.flatten().fieldErrors,
    };
  }

  let shouldRedirect: boolean = false;

  try {
    await connectDB();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    let user: User | null = null;
    try {
      user = await clerkClient().users.createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
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
          "Provide all required User details or Email or Username may already exist",
      };
    }

    if (!user) {
      return { message: "User not found" };
    }
    let chapter;
    if (!data.chapterId) {
      if (checkRole("grand-administrator")) {
        return {
          message: "Please provide Chapter Id",
        };
      }
      chapter = await Chapter.findOne({ secretaryId: userId });
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
        : chapter?._id,
      role: (user.publicMetadata?.role as string) || null,
      zipCode: data.zipCode,
      address1: data.address,
      city: data.city,
      state: new Types.ObjectId(data.state) || null,
      status: data.memberStatus,
      phoneNumber1: data.phoneNumber,
      sponsor1: data.petitioner1,
      sponsor2: data.petitioner2,
      sponsor3: data.petitioner3,
      greeting: data.greeting,
    });

    if (!member) {
      return {
        message: "Member not added",
      };
    }

    shouldRedirect = true;
    if (checkRole(["secretary", "member"])) {
      revalidatePath("/chapter/members");
    } else {
      revalidatePath(`/chapter/${data.chapterId}/members`);
    }
  } catch (error) {
    console.error(error);
    return {
      message: "Error Connecting to DB",
    };
  } finally {
    if (shouldRedirect) {
      if (checkRole(["member", "secretary"])) {
        redirect("/chapter/members");
      } else {
        redirect(`/chapter/${data.chapterId}/members`);
      }
    }
  }
};

export const editMember = async (_prevState: any, formData: FormData) => {
  if (!(await isAuthenticated())) {
    redirect("/sign-in");
  }

  const { userId } = auth();
  const role = auth().sessionClaims?.metadata.role;

  const rawData = Object.fromEntries(formData);
  const editFormSchemaValidation = editFormSchema(role!);
  const { success, data, error } = editFormSchemaValidation.safeParse(rawData);

  if (!success) {
    console.error(JSON.stringify(error));
    return {
      message: error.flatten().fieldErrors,
    };
  }

  if (
    !checkRole(["secretary", "grand-administrator"]) &&
    userId !== data.memberId
  ) {
    redirect("/");
  }
  let shouldRedirect: boolean = false;
  try {
    await connectDB();
    if (checkRole(["secretary", "grand-administrator"])) {
      const member = await Member.findOneAndUpdate(
        checkRole("secretary")
          ? { userId: data.memberId }
          : { chapterId: new Types.ObjectId(data.chapterId) },
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
          sponsor1: data.petitioner1,
          sponsor2: data.petitioner2,
          sponsor3: data.petitioner3,
          birthDate: data.birthdate ? new Date(data.birthdate) : null,
          initiationDate: data.initiationDate
            ? new Date(data.initiationDate)
            : null,
          queenOfTheSouth: data.queenOfTheSouth
            ? new Date(data.queenOfTheSouth)
            : null,
          amaranthDate: data.amarant ? new Date(data.amarant) : null,
          memberRank: data.memberRank || null,
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
          dropReason: new Types.ObjectId(data.dropReason) || null,
          expelReason:
            new Types.ObjectId(data.suspensionExpelledReason) || null,
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
          chapterOffice: new Types.ObjectId(data.chapterOffice) || null,
          grandOffice: new Types.ObjectId(data.grandChapterOffice) || null,
          rank: new Types.ObjectId(data.memberRank) || null,
          reinstatedDate: data.reinstatedDate
            ? new Date(data.reinstatedDate)
            : null,
          status: new Types.ObjectId(data.memberStatus) || null,
        },
        {
          new: true,
        }
      );

      if (!member) {
        return {
          message: "Member not found",
        };
      }
      shouldRedirect = true;
      revalidatePath(`/chapter/${data.chapterId}/members`);
      return;
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
        message: "Member not found",
      };
    }

    shouldRedirect = true;
    revalidatePath("/chapter/members");
  } catch (error) {
    console.error(error);
    return {
      message: "Error Connecting to DB",
    };
  } finally {
    if (shouldRedirect) {
      if (checkRole(["member", "secretary"])) {
        redirect("/chapter/members");
      } else {
        redirect(`/chapter/${data.chapterId}/members`);
      }
    }
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

    if (!("chapterId" in params) || !params.chapterId) {
      return {
        data: null,
        message: "Please provide a valid ChapterId",
      };
    }

    const chapter: ChapterDocument | null = JSON.parse(
      JSON.stringify(await Chapter.findById(params.chapterId))
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
