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

    if (!due) return "No due found";

    if (due.paymentStatus === "paid") return "Dues already paid";

    if (due.amount === due.totalDues) {
      due.paymentStatus = "paid";
      due.datePaid = new Date();
      await due.save();

      return "Dues Already paid, status changed to paid";
    }

    if (member.extraDues === 0) {
      due.paymentStatus = "overdue";
      await due.save();

      return "No balance to pay dues from, status changed to overdue";
    }

    const amountDifference = due.totalDues - due.amount;

    if ((member.extraDues || 0) < amountDifference) {
      due.amount += member.extraDues || 0;
      due.balanceForward =
        (member.duesLeftForYear || 0) - (member.extraDues || 0);
      member.duesLeftForYear =
        (member.duesLeftForYear || 0) - (member.extraDues || 0);
      member.extraDues = 0;
      due.paymentStatus = "overdue";
      await Promise.all([member.save(), due.save()]);

      return `Balance insufficient, status changed to overdue 
      Due Amount: ${due.amount}\nBalance Forward: ${due.balanceForward}\nDues Left For Year: ${member.duesLeftForYear}\nExtra Dues: ${member.extraDues}`;
    }
    console.log("Balance Forward", member.duesLeftForYear! - amountDifference);
    member.extraDues = (member.extraDues || 0) - amountDifference;
    due.amount += amountDifference;
    member.duesLeftForYear = (member.duesLeftForYear || 0) - amountDifference;
    due.balanceForward = (member.duesLeftForYear || 0) - amountDifference;
    due.paymentStatus = "paid";
    due.datePaid = new Date();

    await Promise.all([member.save(), due.save()]);
    return "Dues updated successfully";
  } catch (error) {
    console.error(`Error updating dues for member ${member._id}:`, error);
    return "Error updating dues for member " + member._id;
  }
}

export async function GET() {
  try {
    await connectDB();

    const members = await Member.find({});

    const results = await Promise.all(members.map(updateDues));

    return NextResponse.json(results.join(", "), { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
