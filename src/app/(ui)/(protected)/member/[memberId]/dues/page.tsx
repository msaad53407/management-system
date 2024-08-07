import DateForm from "@/components/DateForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { connectDB } from "@/lib/db";
import { checkRole } from "@/lib/role";
import { Member } from "@/models/member";
import { MonthlyDue } from "@/types/globals";
import { capitalize, getMonth } from "@/utils";
import { getMonthlyDues } from "@/utils/functions";
import { auth } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import { notFound } from "next/navigation";
import AddDuesForm from "./components/AddDuesForm";

type Props = {
  params: {
    memberId?: Types.ObjectId;
  };
  searchParams: {
    month?: number;
    year?: number;
  };
};

const MemberDuesPage = async ({
  params: { memberId },
  searchParams: { month, year },
}: Props) => {
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

    const { data, message } = await getMonthlyDues(memberId, { month, year });

    if (!data) {
      console.error(message);
      return (
        <section className="flex flex-col gap-6 p-4 w-full">
          <Card>
            <CardHeader className="flex items-center justify-between w-full flex-row">
              <h3 className="text-xl font-semibold text-slate-600">
                Update Dues
              </h3>
              <DateForm hardRefresh />
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{message}</p>
            </CardContent>
          </Card>
        </section>
      );
    }

    return (
      <section className="flex flex-col gap-4 p-4 w-full">
        <div className="w-full flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-slate-600 font-bold text-base">
              Dues left to Pay: {data.duesLeftForYear}$
            </p>
            <p className="text-slate-600 font-bold text-base">
              Extra Dues: {data?.extraDues || 0}
            </p>
          </div>
          <DateForm hardRefresh />
        </div>
        {data.monthlyDues.map((monthlyDues: MonthlyDue) => (
          <Card key={monthlyDues._id.toString()}>
            <CardHeader className="flex items-center justify-between w-full flex-row">
              <h3 className="text-xl font-semibold text-slate-600">
                <span className="text-pink-600">
                  {`${capitalize(data.firstName)} ${capitalize(
                    data.middleName || ""
                  )} ${capitalize(data.lastName)}`}
                  &apos;s
                </span>{" "}
                Dues
              </h3>
              <h3 className="text-xl font-semibold text-slate-600">
                <span className="text-pink-600 capitalize">
                  {getMonth(monthlyDues.dueDate)}&apos;s
                </span>{" "}
                Dues
              </h3>
            </CardHeader>
            <CardContent>
              <AddDuesForm
                currentMonthDues={JSON.parse(JSON.stringify(monthlyDues))}
              />
            </CardContent>
          </Card>
        ))}
      </section>
    );
  } catch (error) {
    console.error(error);
    <section className="flex flex-col gap-6 p-4 w-full">
      <Card>
        <CardHeader className="flex items-center justify-between w-full flex-row">
          <h3 className="text-xl font-semibold text-slate-600">Update Dues</h3>
          <DateForm hardRefresh />
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Something went wrong</p>
        </CardContent>
      </Card>
    </section>;
  }
};

export default MemberDuesPage;
