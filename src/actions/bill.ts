"use server";

import { connectDB } from "@/lib/db";
import { addBillSchema, updateBillSchema } from "@/lib/zod/member";
import { Bill } from "@/models/bill";
import { Chapter } from "@/models/chapter";
import { clerkClient } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import BillApprovalEmail from "@/components/emailTemplates/BillApproval";
import BillReviewEmail from "@/components/emailTemplates/BillReview";
import { Member } from "@/models/member";
import { ChapterOffice } from "@/models/chapterOffice";

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
      from: `Secretary ${chapter.name} <delivered@resend.dev>`,
      subject: "Bill Approval Request",
      to: "msmuhammadsaad78@gmail.com",
      //   cc: , send to Grand Administrator as well.
      react: BillApprovalEmail({
        approvalLink: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/ledger/chapter/${chapterId}`,
        billAmount: bill.amount,
        billDate: bill.date,
        chapterNumber: chapter.chapterNumber,
        onAccountOf: bill.onAccountOf,
        payee: bill.payee,
        worthyMatronName: worthyMatron.firstName + " " + worthyMatron.lastName,
      }),
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    bill.workflowStarted = true;
    await bill.save();

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
    const [chapter, treasurerOffice] = await Promise.all([
      Chapter.findById(new Types.ObjectId(bill.chapterId)),
      ChapterOffice.findOne({
        name: "Treasurer",
      }),
    ]);

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

    if (!treasurerOffice) {
      return {
        success: false,
        message: "No Office found for Treasurer",
      };
    }

    const treasurer = await Member.findOne({
      chapterId: new Types.ObjectId(chapterId),
      chapterOffice: new Types.ObjectId(treasurerOffice._id),
    });

    if (!treasurer) {
      return {
        success: false,
        message: "No Treasurer found for this chapter",
      };
    }

    if (!treasurer.email) {
      return {
        success: false,
        message: "Treasurer email not found",
      };
    }

    const { error } = await resend.emails.send({
      from: `Secretary ${chapter.name} <delivered@resend.dev>`,
      subject: "Bill Review Request",
      to: treasurer.email,
      //   cc: , send to Grand Administrator as well.
      react: BillReviewEmail({
        billAmount: bill.amount,
        billDate: bill.date,
        chapterNumber: chapter.chapterNumber,
        onAccountOf: bill.onAccountOf,
        payee: bill.payee,
        treasurerName: treasurer.firstName + " " + treasurer.lastName,
      }),
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
