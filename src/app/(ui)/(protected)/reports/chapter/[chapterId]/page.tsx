import { getChapterMembers } from "@/actions/chapter";
import ChapterDetailsPDF from "@/components/pdf/ChapterDetails";
import UpcomingBirthdaysPDF from "@/components/pdf/UpcomingBirthdays";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { MemberDocument } from "@/models/member";
import {
  getAllRanks,
  getAllStatuses,
  getChapterFinances,
} from "@/utils/functions";
import { Types } from "mongoose";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chapterId?: Types.ObjectId;
  };
};

const ChapterReports = async ({ params: { chapterId } }: Props) => {
  if (!chapterId) {
    notFound();
  }

  const { data, message } = await getChapterMembers(
    new Types.ObjectId(chapterId)
  );
  const ranks = await getAllRanks();
  const statuses = await getAllStatuses();

  if (!data || !ranks.data || !statuses.data) {
    return (
      <main className="flex flex-col gap-6 p-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Chapter Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 text-center">
              Error: {message} {ranks.message} {statuses.message}
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const parsedData = JSON.parse(JSON.stringify(data)) as MemberDocument[];
  const { data: finances, message: financesMessage } = await getChapterFinances(
    new Types.ObjectId(chapterId),
    {}
  );

  if (!finances) {
    return (
      <main className="flex flex-col gap-6 p-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Chapter Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 text-center">Error: {financesMessage}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-6 p-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle>Chapter Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col w-full gap-2 divide-y-2 divide-slate-200">
            <li className="flex w-full items-center justify-between py-3">
              <h4 className="text-lg text-slate-600 font-normal">
                Chapter Details
              </h4>
              <ChapterDetailsPDF
                finances={finances}
                members={parsedData}
                ranks={ranks.data}
                statuses={statuses.data}
              >
                Download
              </ChapterDetailsPDF>
            </li>
            <li className="flex w-full items-center justify-between py-3">
              <h4 className="text-lg text-slate-600 font-normal">
                Upcoming Birthdays
              </h4>
              <UpcomingBirthdaysPDF>Download</UpcomingBirthdaysPDF>
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
};

export default ChapterReports;
