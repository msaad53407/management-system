"use server";

import { connectDB } from "@/lib/db";
import { addBillSchema, updateBillSchema } from "@/lib/zod/member";
import { Bill } from "@/models/bill";
import { Chapter } from "@/models/chapter";
import { clerkClient } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

const resend = new Resend(resendApiKey);

export const addBill = async (_prevState: any, formData: FormData) => {
  const rawData = Object.fromEntries(formData);
  const { success, data, error } = addBillSchema.safeParse(rawData);

  if (!success) {
    return {
      data: null,
      success: false,
      message: error?.flatten().fieldErrors,
    };
  }
  try {
    await connectDB();

    const bill = await Bill.create({
      chapterId: new Types.ObjectId(data.chapterId),
      amount: data.amount,
      date: data.date,
      payee: data.payee,
      onAccountOf: data.onAccountOf,
    });

    if (!bill) {
      return {
        data: null,
        success: false,
        message: "Bill not created",
      };
    }

    return {
      data: bill,
      success: true,
      message: "Bill created successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      success: false,
      message: "Error Connecting to DB",
    };
  } finally {
    revalidatePath(`/ledger/chapter/${data.chapterId}`);
  }
};

export const updateBills = async (_prevState: any, formData: FormData) => {
  const rawData = Object.fromEntries(formData);

  const { success, data, error } = updateBillSchema.safeParse(rawData);

  if (!success) {
    return {
      data: null,
      success: false,
      message: error?.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();

    const bill = await Bill.findByIdAndUpdate(
      new Types.ObjectId(data.billId),
      {
        chapterId: new Types.ObjectId(data.chapterId),
        amount: data.amount,
        date: data.date,
        payee: data.payee,
        onAccountOf: data.onAccountOf,
      },
      { new: true }
    );

    if (!bill) {
      return {
        data: null,
        success: false,
        message: "Bill not updated",
      };
    }

    return {
      data: bill,
      success: true,
      message: "Bill updated successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      success: false,
      message: "Error Connecting to DB",
    };
  } finally {
    revalidatePath(`/ledger/chapter/${data.chapterId}`);
  }
};

export const voidBill = async (billId: string | Types.ObjectId) => {
  let chapterId: Types.ObjectId | null = null;
  try {
    await connectDB();
    const bill = await Bill.findByIdAndDelete(new Types.ObjectId(billId));
    if (!bill) {
      return {
        data: null,
        success: false,
        message: "Bill not found",
      };
    }
    chapterId = bill.chapterId;
    return {
      data: bill,
      success: true,
      message: "Bill deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      success: false,
      message: "Error Connecting to DB",
    };
  } finally {
    revalidatePath(`/ledger/chapter/${chapterId}`);
  }
};

export const startBillWorkflow = async (billId: string | Types.ObjectId) => {
  let chapterId: Types.ObjectId | null = null;
  try {
    await connectDB();

    const bill = await Bill.findById(new Types.ObjectId(billId));

    if (!bill) {
      return {
        success: false,
        message: "Bill not found",
      };
    }

    chapterId = bill.chapterId;
    const chapter = await Chapter.findById(new Types.ObjectId(bill.chapterId));

    if (!chapter) {
      return {
        success: false,
        message: "This bill does not belong to a chapter",
      };
    }

    const worthyMatronId = chapter.matronId;
    const secretaryId = chapter.secretaryId;

    const worthyMatron = await clerkClient().users.getUser(worthyMatronId!);
    const secretary = await clerkClient().users.getUser(secretaryId!);

    if (!worthyMatron) {
      return {
        success: false,
        message: "No Worthy Matron found for this chapter",
      };
    }

    if (!secretary) {
      return {
        success: false,
        message: "No Secretary found for this chapter",
      };
    }

    const { error } = await resend.emails.send({
      from: secretary.emailAddresses?.[0]?.emailAddress,
      subject: "Bill Approval",
      to: worthyMatron.emailAddresses?.[0]?.emailAddress,
      //   cc: , send to Grand Administrator as well.
      react: "Bill Approval",
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Approval Email sent to Worthy Matron successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error Connecting to DB",
    };
  } finally {
    revalidatePath(`/ledger/chapter/${chapterId}`);
  }
};

export const approveBill = async (billId: string | Types.ObjectId) => {
  let chapterId: Types.ObjectId | null = null;
  try {
    await connectDB();

    const bill = await Bill.findById(new Types.ObjectId(billId));

    if (!bill) {
      return {
        success: false,
        message: "Bill not found",
      };
    }

    chapterId = bill.chapterId;
    const chapter = await Chapter.findById(new Types.ObjectId(bill.chapterId));

    if (!chapter) {
      return {
        success: false,
        message: "This bill does not belong to a chapter",
      };
    }
    const secretaryId = chapter.secretaryId;
    const secretary = await clerkClient().users.getUser(secretaryId!);
    if (!secretary) {
      return {
        success: false,
        message: "No Secretary found for this chapter",
      };
    }

    const { error } = await resend.emails.send({
      from: secretary.emailAddresses?.[0]?.emailAddress,
      subject: "Bill Approval",
      to: bill.onAccountOf,
      //   cc: , send to Grand Administrator as well.
      react: "Bill Approval",
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    bill.wmApproval = "Approved";
    bill.treasurerReview = "Reviewed";
    await bill.save();

    return {
      success: true,
      message: "Review Email sent to Treasurer successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error Connecting to DB",
    };
  } finally {
    revalidatePath(`/ledger/chapter/${chapterId}`);
  }
};
