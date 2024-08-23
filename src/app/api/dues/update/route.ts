import { connectDB } from "@/lib/db";
import { Due } from "@/models/dues";
import { Member, MemberDocument } from "@/models/member";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

async function updateDues(member: MemberDocument) {
  try {
    const due = await Due.findOne({
      $and: [
        { memberId: new Types.ObjectId(member._id) },
        {
          $expr: {
            $eq: [{ $month: "$dueDate" }, new Date().getMonth() + 1],
          },
        },
      ],
    });

    if (!due) return;

    if (due.paymentStatus === "paid") return;

    if (due.amount === due.totalDues) {
      due.paymentStatus = "paid";
      await due.save();
      return;
    }

    if (member.extraDues === 0) {
      due.paymentStatus = "overdue";
      await due.save();
      return;
    }

    const amountDifference = due.totalDues - due.amount;

    if ((member.extraDues || 0) < amountDifference) {
      due.amount += member.extraDues || 0;
      member.extraDues = 0;
      due.paymentStatus = "overdue";
      await Promise.all([member.save(), due.save()]);
      return;
    }

    member.extraDues = (member.extraDues || 0) - amountDifference;
    due.amount += amountDifference;
    due.paymentStatus = "paid";

    await Promise.all([member.save(), due.save()]);
  } catch (error) {
    console.error(`Error updating dues for member ${member._id}:`, error);
  }
}

export async function GET() {
  try {
    await connectDB();

    const members = await Member.find({});

    await Promise.all(members.map(updateDues));

    return NextResponse.json("success", { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
