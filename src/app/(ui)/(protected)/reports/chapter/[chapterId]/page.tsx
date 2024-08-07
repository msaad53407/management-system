import { ChapterReportsDownloadLink } from "@/components/pdf/ChapterReport";
import UpcomingBirthdaysPDF from "@/components/pdf/UpcomingBirthdays";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllChapters,
  getAllRanks,
  getAllStatuses,
  getChapterReport,
  getMembersBirthdays,
} from "@/utils/functions";
import { Types } from "mongoose";
import { notFound } from "next/navigation";

type Props = {
  params: {
    chapterId?: Types.ObjectId;
  };
};

const ChapterReports = async ({ params: { chapterId } }: Props) => {
  if (!chapterId) {
    notFound();
  }

  const [
    { data: members, message: membersMessage },
    { data: ranks, message: ranksMessage },
    { data: report, message: reportMessage },
    { data: statuses, message: statusesMessage },
    { data: chapters, message: chaptersMessage },
  ] = await Promise.all([
    getMembersBirthdays({ chapterId: chapterId }),
    getAllRanks(),
    getChapterReport(chapterId.toString()),
    getAllStatuses(),
    getAllChapters(),
  ]);

  const birthdaysNotAvailable =
    !members || members.length === 0 || !ranks || ranks.length === 0;

  const reportNotAvailable =
    !report ||
    !statuses ||
    statuses.length === 0 ||
    !chapters ||
    chapters.length === 0;

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
              {!reportNotAvailable ? (
                <ChapterReportsDownloadLink
                  data={{
                    report: JSON.parse(JSON.stringify(report)),
                    statuses: JSON.parse(JSON.stringify(statuses)),
                    chapters: JSON.parse(JSON.stringify(chapters)),
                  }}
                />
              ) : (
                <div>Not Available</div>
              )}
            </li>
            <li className="flex w-full items-center justify-between py-3">
              <h4 className="text-lg text-slate-600 font-normal">
                Upcoming Birthdays
              </h4>
              {!birthdaysNotAvailable ? (
                <UpcomingBirthdaysPDF
                  ranks={JSON.parse(JSON.stringify(ranks))}
                  upcomingBirthdays={members}
                >
                  Upcoming Birthdays
                </UpcomingBirthdaysPDF>
              ) : (
                <div>Not Available</div>
              )}
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
};

export default ChapterReports;
