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
            $eq: [{ $month: "$dueDate" }, new Date().getMonth() + 2],
          },
        },
      ],
    });
    console.log(due, "1");

    if (!due) return;
    console.log("2");

    if (due.paymentStatus === "paid") return;
    console.log("3");

    if (due.amount === due.totalDues) {
      due.paymentStatus = "paid";
      due.datePaid = new Date();
      await due.save();

      console.log("4");

      return;
    }

    if (member.extraDues === 0) {
      due.paymentStatus = "overdue";
      await due.save();

      console.log("5");
      
      return;
    }
    
    const amountDifference = due.totalDues - due.amount;
    
    if ((member.extraDues || 0) < amountDifference) {
      console.log("here");
      due.amount += member.extraDues || 0;
      member.extraDues = 0;
      due.paymentStatus = "overdue";
      await Promise.all([member.save(), due.save()]);
      console.log("6");
      return;
    }
    
    member.extraDues = (member.extraDues || 0) - amountDifference;
    due.amount += amountDifference;
    due.paymentStatus = "paid";
    due.datePaid = new Date();
    
    await Promise.all([member.save(), due.save()]);
    console.log("7");
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
