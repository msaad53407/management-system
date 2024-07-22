"use server";

import { connectDB } from "@/lib/db";
import { checkRole } from "@/lib/role";
import { updateDuesSchema } from "@/lib/zod/member";
import { Due } from "@/models/dues";
import { Member } from "@/models/member";
import { Types } from "mongoose";
import { redirect } from "next/navigation";

export async function updateDues(_prevState: any, formData: FormData) {
  let shouldRedirect = false;
  try {
    const rawValues = Object.fromEntries(formData);

    const { success, data, error } = updateDuesSchema.safeParse(rawValues);

    if (!success) {
      return {
        message: error.flatten().fieldErrors,
      };
    }

    await connectDB();

    const { memberId, amount, dueDate, paymentStatus, totalDues } = data;

    const extraDues =
      Number(amount) > Number(totalDues)
        ? Number(amount) - Number(totalDues)
        : 0;

    if (!!extraDues) {
      const updatedMember = await Member.findByIdAndUpdate(memberId, {
        extraDues,
      });

      if (!updatedMember) {
        return {
          message: "Could not top up extra Dues above monthly Dues.",
        };
      }
    }
    const updatedDue = await Due.findOneAndUpdate(
      { memberId },
      {
        totalDues: Number(totalDues),
        amount: !!extraDues ? Number(totalDues) : Number(amount),
        dueDate,
        paymentStatus,
      },
      { new: true }
    );

    if (!updatedDue) {
      return {
        message: "Dues not found",
      };
    }

    shouldRedirect = true;
  } catch (error) {
    console.error(error);
    return {
      message: "Error Connecting to Database",
    };
  } finally {
    if (shouldRedirect) {
      if (checkRole("secretary")) redirect("/chapters/members");
      if (checkRole("grand-administrator")) redirect("/chapter");
    }
  }
}

export async function createDue(memberId: Types.ObjectId) {
  try {
    await connectDB();
    const newDue = await Due.create({
      memberId,
      amount: 0,
      totalDues: 0,
      dueDate: new Date(),
      paymentStatus: "unpaid",
    });

    if (!newDue) {
      return {
        data: null,
        message: "Error Creating Due",
      };
    }

    return {
      data: newDue,
      message: "Due Created",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}
