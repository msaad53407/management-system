import DateForm from "@/components/DateForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { connectDB } from "@/lib/db";
import { checkRole } from "@/lib/role";
import { Member } from "@/models/member";
import { getYearlyDues } from "@/utils/functions";
import { auth } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import { notFound } from "next/navigation";
import DuesTable from "./components/DuesTable";

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

    const { data, message } = await getYearlyDues(memberId);

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
          <header className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-pink-600">
                {data.firstName} {data.lastName}
              </span>{" "}
              Dues - {new Date().getFullYear()}
            </h1>
          </header>
          <DateForm hardRefresh />
        </div>
        <DuesTable duesData={JSON.parse(JSON.stringify(data))} />
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
