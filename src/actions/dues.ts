"use server";

import { connectDB } from "@/lib/db";
import { updateDuesSchema } from "@/lib/zod/member";
import { Due } from "@/models/dues";
import { Member } from "@/models/member";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateDues(formData: z.infer<typeof updateDuesSchema>) {
  const { success, data, error } = updateDuesSchema.safeParse(formData);

  if (!success) {
    return {
      message: "Invalid data",
      fieldErrors: error.flatten().fieldErrors,
      success: false,
    };
  }
  const {
    memberId,
    amount,
    dueDate,
    totalDues,
    dueId,
    datePaid,
    receiptNo,
    balanceForward,
  } = data;

  try {
    await connectDB();

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

    const oldDue = await Due.findById(new Types.ObjectId(dueId));

    if (!oldDue) {
      return {
        message: "Error: Dues not found",
        success: false,
      };
    }

    const previousAmount = oldDue.amount;

    const amountDifference = Number(amount) - Number(previousAmount);

    const updatedDue = await Due.findByIdAndUpdate(
      new Types.ObjectId(dueId),
      {
        totalDues: Number(totalDues),
        amount: Number(amount),
        dueDate,
        datePaid,
        balanceForward: balanceForward - amountDifference,
        receiptNo,
      },
      { new: true }
    );

    if (!updatedDue) {
      return {
        message: "Error: Dues not found",
        success: false,
      };
    }

    await Member.findByIdAndUpdate(
      memberId,
      {
        $inc: {
          duesLeftForYear: -amountDifference,
        },
      },
      {
        new: true,
      }
    );

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
  } finally {
    revalidatePath(`/member/${memberId}/dues`);
  }
}

export async function createDues(
  memberId: Types.ObjectId,
  totalDues?: number,
  currentMonth?: number
) {
  try {
    await connectDB();
    const months = Array<number>(12 - (currentMonth || 0)).fill(0);
    const newDues = await Due.create(
      months.map((_, i) => ({
        memberId: new Types.ObjectId(memberId),
        amount: 0,
        totalDues: totalDues || 10,
        dueDate: new Date(
          new Date().getFullYear(),
          (currentMonth || 0) + i,
          25
        ),
        paymentStatus: "unpaid",
      }))
    );

    if (!newDues || newDues.length === 0) {
      return {
        data: null,
        message:
          "Error Creating Dues, Create manually by Visiting member's Dues page.",
      };
    }

    return {
      data: newDues,
      message: "Dues Created",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to Database",
    };
  }
}
