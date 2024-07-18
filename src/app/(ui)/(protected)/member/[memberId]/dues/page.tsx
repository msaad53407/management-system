import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { connectDB } from "@/lib/db";
import { Due } from "@/models/dues";
import { Member } from "@/models/member";
import { Types } from "mongoose";
import { notFound } from "next/navigation";
import React from "react";
import AddDuesForm from "./components/AddDuesForm";
import { MonthlyDue } from "@/types/globals";
import { capitalize, getMonth } from "@/utils";
import { checkRole } from "@/lib/role";
import { auth } from "@clerk/nextjs/server";

type Props = {
  params: {
    memberId?: Types.ObjectId;
  };
};

type AggregationResult = {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phoneNumber1: string;
  currentMonthDues: MonthlyDue[];
};

const MemberDuesPage = async ({ params: { memberId } }: Props) => {
  if (!memberId) {
    return notFound();
  }

  const { userId } = auth();

  if (!checkRole(["secretary", "grand-administrator"])) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-center">Unauthorized</h1>
      </div>
    );
  }
  try {
    await connectDB();

    // Checking If the user is the secretary of the chapter in which the current member is included.
    if (checkRole("secretary")) {
      //TODO: Temporary
      const memberChapterAggregation = await Member.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(memberId),
          },
        },
        {
          $lookup: {
            from: "chapters",
            localField: "chapterId",
            foreignField: "_id",
            as: "chapter",
          },
        },
      ]);

      if (memberChapterAggregation.length === 0) {
        return notFound();
      }

      if (memberChapterAggregation[0]?.chapter[0]?.secretaryId !== userId) {
        return (
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-3xl font-bold text-center">Unauthorized</h1>
          </div>
        );
      }
    }

    const result = await Member.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(memberId),
        },
      },
      {
        $lookup: {
          from: "dues",
          localField: "_id",
          foreignField: "memberId",
          as: "currentMonthDues",
          pipeline: [
            {
              $match: {
                $and: [
                  {
                    $expr: {
                      $eq: [{ $month: "$dueDate" }, { $month: new Date() }],
                    },
                  },
                  {
                    $expr: {
                      $eq: [{ $year: "$dueDate" }, { $year: new Date() }],
                    },
                  },
                ],
              },
            },
            {
              $project: {
                _id: 1,
                memberId: 1,
                amount: 1,
                totalDues: 1,
                dueDate: 1,
                paymentStatus: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          middleName: 1,
          email: 1,
          phoneNumber1: 1,
          currentMonthDues: 1,
        },
      },
    ]);
    const { currentMonthDues, firstName, lastName, middleName } =
      result[0] as AggregationResult;

    if (!currentMonthDues || currentMonthDues.length === 0) {
      const newDue = await Due.create({
        memberId: new Types.ObjectId(memberId),
        amount: 0,
        dueDate: new Date(),
        paymentStatus: "unpaid",
      });
      currentMonthDues.push({
        _id: newDue._id,
        memberId: newDue.memberId,
        amount: newDue.amount,
        totalDues: newDue.totalDues,
        dueDate: newDue.dueDate,
        paymentStatus: newDue.paymentStatus,
      });
    }

    // Parsing and converting documents to normal js objects.
    const parsedDues = currentMonthDues.map(
      (due) => JSON.parse(JSON.stringify(due)) as MonthlyDue
    );

    return (
      <section className="flex flex-col gap-6 p-4 w-full">
        <Card>
          <CardHeader className="flex items-center justify-between w-full flex-row">
            <h3 className="text-xl font-semibold text-slate-600">
              <span className="text-pink-600">
                {`${capitalize(firstName)} ${capitalize(
                  middleName
                )} ${capitalize(lastName)}`}
                &apos;s
              </span>{" "}
              Dues
            </h3>
            <h3 className="text-xl font-semibold text-slate-600">
              <span className="text-pink-600 capitalize">
                {getMonth(parsedDues[0].dueDate)}&apos;s
              </span>{" "}
              Dues
            </h3>
          </CardHeader>
          <CardContent>
            <AddDuesForm currentMonthDues={parsedDues[0]} />
          </CardContent>
        </Card>
      </section>
    );
  } catch (error) {
    console.error(error);
    <section className="flex flex-col gap-6 p-4 w-full">
      <Card>
        <CardHeader className="flex items-center justify-between w-full flex-row">
          <h3 className="text-xl font-semibold text-slate-600">Edit Member</h3>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Something went wrong</p>
        </CardContent>
      </Card>
    </section>;
  }
};

export default MemberDuesPage;
