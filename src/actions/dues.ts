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
  let {
    memberId,
    amount,
    dueDate,
    totalDues,
    dueId,
    datePaid,
    receiptNo,
    balanceForward,
    paymentStatus,
  } = data;

  try {
    await connectDB();

    const member = await Member.findById(new Types.ObjectId(memberId));

    if (!member) {
      return {
        message: "Error: Member not found",
        success: false,
      };
    }

    // //Handle case if amount is less than total Dues and we have balance in member's account to pay from.
    // if (amount < totalDues) {
    //   if ((member.extraDues || 0) > 0) {
    //     const extraDues = member.extraDues;
    //     totalDues - amount

    //     const updatedDue = await Due.findByIdAndUpdate(
    //       new Types.ObjectId(dueId),
    //       {
    //         memberBalance: member.extraDues,
    //       },
    //       { new: true }
    //     );
    //   }
    // }

    const extraDues = amount > totalDues ? amount - totalDues : 0;

    if (extraDues) {
      const updatedMember = await Member.findByIdAndUpdate(memberId, {
        extraDues,
      });

      if (!updatedMember) {
        return {
          message: "Error: Could not top up extra Dues above monthly Dues.",
          success: false,
        };
      }
      amount = totalDues;
    }

    const oldDue = await Due.findById(new Types.ObjectId(dueId));

    if (!oldDue) {
      return {
        message: "Error: Dues not found",
        success: false,
      };
    }

    if (paymentStatus === "paid" && amount < totalDues) {
      return {
        message:
          "Error: Cannot set payment status to paid if paid dues are less than total Dues",
        success: false,
      };
    }

    const previousAmount = oldDue.amount;

    const amountDifference = amount - previousAmount;

    const updatedDue = await Due.findByIdAndUpdate(
      new Types.ObjectId(dueId),
      {
        totalDues: totalDues,
        amount: amount,
        dueDate,
        datePaid,
        balanceForward: balanceForward - amountDifference,
        memberBalance: extraDues,
        paymentStatus,
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
