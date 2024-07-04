"use server";
import "server-only";
import { Chapter } from "@/models/chapter";

import { connectDB } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Member, MemberDocument } from "@/models/member";
import { checkRole } from "@/lib/role";
import { isAuthenticated } from "@/lib/authorization";
import { revalidatePath } from "next/cache";
import { addMemberSchema, editFormSchema } from "@/lib/zod/member";
import { redirect } from "next/navigation";

export const getChapterMembers = async () => {
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
    if (checkRole("secretary")) {
      const chapter = await Chapter.findOne({ secretaryId: userId });

      if (!chapter) {
        return {
          data: null,
          message: "You are not secretary of any chapter",
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
      members = await Member.find({ chapterId: member.chapterId });
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

  if (!memberId || (!checkRole("secretary") && memberId !== userId)) {
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

export const addMember = async (formData: FormData) => {
  if (!(await isAuthenticated())) {
    return {
      data: null,
      message: "Unauthorized",
    };
  }
  if (!checkRole("secretary")) {
    return {
      data: null,
      message: "Unauthorized",
    };
  }
  const { userId } = auth();
  const rawData = Object.fromEntries(formData);

  const { success, data, error } = addMemberSchema.safeParse(rawData);

  if (!success) {
    console.error(error);
    return {
      data: null,
      message: "Invalid data",
    };
  }

  if (data.userId === userId) {
    return {
      data: null,
      message: "You cannot add yourself as a member",
    };
  }
  let memberAdded: boolean = false;

  try {
    await connectDB();
    const user = await clerkClient.users.getUser(data.userId);

    if (!user) {
      return {
        data: null,
        message: "User not found",
      };
    }

    const chapter = await Chapter.findOne({ secretaryId: userId });

    const member = await Member.create({
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      photo: user.imageUrl,
      chapterId: chapter?._id,
      role: (user.publicMetadata?.role as string) || null,
      zipCode: data.zipCode,
      address1: data.address,
      city: data.city,
      phoneNumber1: data.phoneNumber,
    });

    if (!member) {
      return {
        data: null,
        message: "Member not created",
      };
    }
    revalidatePath("/chapter/members");
    memberAdded = true;
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to DB",
    };
  } finally {
    if (memberAdded) redirect("/chapter/members");
  }
};

export const editMember = async (formData: FormData) => {
  if (!(await isAuthenticated())) {
    return {
      data: null,
      message: "Unauthorized",
    };
  }

  const { userId } = auth();

  const rawData = Object.fromEntries(formData);

  const { success, data, error } = editFormSchema.safeParse(rawData);

  if (!success) {
    console.error(JSON.stringify(error));
    return {
      data: null,
      message: "Invalid data",
    };
  }

  if (!checkRole("secretary") && userId !== data.memberId) {
    return {
      data: null,
      message: "Unauthorized",
    };
  }
  let memberEdited: boolean = false;
  try {
    await connectDB();

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
        state: data.state || null,
        phoneNumber1: data.phoneNumber,
        sponsor1: data.petitioner1,
        sponsor2: data.petitioner2,
        sponsor3: data.petitioner3,
        birthDate: data.birthdate,
        initiationDate: data.initiationDate,
        queenOfTheSouth: data.queenOfTheSouth,
        amaranthDate: data.amarant,
        memberRank: data.memberRank || null,
        petitionDate: data.petitionDate,
        petitionReceivedDate: data.petitionReceived,
        demitInDate: data.demitIn,
        demitOutDate: data.demitOut,
        investigationDate: data.investigationDate,
        investigationAcceptOrRejectDate: data.investigationAcceptReject,
        droppedDate: data.droppedDate,
        emergencyContact: data.emergencyContact,
        secretaryNotes: data.secretaryNotes,
        dateOfDeath: data.dateOfDeath,
        actualDateOfDeath: data.actualDateOfDeath,
        emergencyContactPhone: data.emergencyContactPhone,
        password: data.password,
      },
      {
        new: true,
      }
    );

    if (!member) {
      return {
        data: null,
        message: "Member not found",
      };
    }

    memberEdited = true;
    revalidatePath("/chapter/members");
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to DB",
    };
  } finally {
    if (memberEdited) redirect("/chapter/members");
  }
};
