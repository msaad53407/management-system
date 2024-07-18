"use server";

import { connectDB } from "@/lib/db";
import { checkRole } from "@/lib/role";
import { updateDuesSchema } from "@/lib/zod/member";
import { Due } from "@/models/dues";
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

    const { memberId, amount, dueDate, paymentStatus } = data;

    const updatedDue = await Due.findOneAndUpdate(
      { memberId },
      {
        amount: Number(amount),
        dueDate,
        paymentStatus,
      },
      { new: true }
    );

    if (!updatedDue) {
      return {
        message: "Due not found",
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
