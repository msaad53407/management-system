"use server";

import { connectDB } from "@/lib/db";
import { checkRole } from "@/lib/role";
import { updateDuesSchema } from "@/lib/zod/member";
import { Due } from "@/models/dues";
import { Member } from "@/models/member";
import { Types } from "mongoose";
import { redirect } from "next/navigation";

export async function updateDues(_prevState: any, formData: FormData) {
  try {
    const rawValues = Object.fromEntries(formData);

    const { success, data, error } = updateDuesSchema.safeParse(rawValues);

    if (!success) {
      return {
        message: error.flatten().fieldErrors,
        success: false,
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
          message: "Error: Could not top up extra Dues above monthly Dues.",
          success: false,
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
        message: "Error: Dues not found",
        success: false,
      };
    }

    return {
      success: true,
      message: "Dues Updated Successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Error Connecting to Database",
      success: false,
    };
  }
}

export async function createDue(memberId: Types.ObjectId, totalDues?: number) {
  try {
    await connectDB();
    const newDue = await Due.create({
      memberId,
      amount: 0,
      totalDues: totalDues || 10,
      dueDate: new Date(),
      paymentStatus: "unpaid",
    });

    if (!newDue) {
      return {
        data: null,
        message:
          "Error Creating Due, Create manually by Visiting member's Dues page.",
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
