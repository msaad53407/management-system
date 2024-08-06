import { ChapterReportsDownloadLink } from "@/components/pdf/ChapterReport";
import UpcomingBirthdaysPDF from "@/components/pdf/UpcomingBirthdays";
import { ChapterDocument } from "@/models/chapter";
import {
  getAllChapters,
  getAllRanks,
  getAllStatuses,
  getChapterReport,
  getMembersBirthdays,
} from "@/utils/functions";
import React from "react";

type Props = {
  chapter: ChapterDocument;
};

const ChapterReportsRow = async ({ chapter }: Props) => {
  const [
    { data: members, message: membersMessage },
    { data: ranks, message: ranksMessage },
    { data: report, message: reportMessage },
    { data: statuses, message: statusesMessage },
    { data: chapters, message: chaptersMessage },
  ] = await Promise.all([
    getMembersBirthdays({ chapterId: chapter._id }),
    getAllRanks(),
    getChapterReport(chapter.id),
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
    <div className="flex gap-3 flex-col md:flex-row">
      {!birthdaysNotAvailable ? (
        <UpcomingBirthdaysPDF
          ranks={JSON.parse(JSON.stringify(ranks))}
          upcomingBirthdays={members}
        >
          Upcoming Birthdays
        </UpcomingBirthdaysPDF>
      ) : null}
      {!reportNotAvailable ? (
        <ChapterReportsDownloadLink
          data={{
            report: JSON.parse(JSON.stringify(report)),
            statuses: JSON.parse(JSON.stringify(statuses)),
            chapters: JSON.parse(JSON.stringify(chapters)),
          }}
        />
      ) : null}
      {birthdaysNotAvailable && reportNotAvailable && (
        <p className="text-red-500 text-center">No Reports Available</p>
      )}
    </div>
  );
};

export default ChapterReportsRow;
