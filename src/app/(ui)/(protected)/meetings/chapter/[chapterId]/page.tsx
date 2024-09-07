import { getChapter } from "@/actions/chapter";
import MeetingDetailsDocument from "@/components/pdf/MeetingDetails";
import PrintButton from "@/components/PrintButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { getChapterMeetings } from "@/utils/functions";
import {
  FileTextIcon,
  HistoryIcon,
  LucideEdit,
  NotebookIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: {
    chapterId?: string;
  };
};

const ChapterMeetingPage = async ({ params: { chapterId } }: Props) => {
  if (!chapterId) notFound();

  const chapterPromise = getChapter({ chapterId });

  const meetingsPromise = getChapterMeetings(chapterId);

  const [{ data: chapter }, { data: meetings, message: meetingsMessage }] =
    await Promise.all([chapterPromise, meetingsPromise]);

  if (!meetings) {
    return (
      <main className="flex min-h-screen flex-col items-center gap-10 p-4">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-lg sm:text-2xl font-medium">
            {chapter ? `${chapter.name} Meetings` : "Chapter Meetings"}
          </h2>
          <Link
            href={`/meetings/chapter/${chapterId}/add`}
            className="p-3 bg-button-primary text-white rounded-xl"
          >
            Add Meeting
          </Link>
        </div>
        <h1 className="text-3xl font-bold">{meetingsMessage}</h1>
      </main>
    );
  }

  const getDocTypeIcon = (docType: "history" | "notes" | "minutes") => {
    switch (docType) {
      case "history":
        return <HistoryIcon className="h-4 w-4" />;
      case "notes":
        return <NotebookIcon className="h-4 w-4" />;
      case "minutes":
        return <FileTextIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen flex-col gap-4 items-center p-6">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-lg sm:text-2xl font-medium">
          {chapter ? `${chapter.name} Meetings` : "Chapter Meetings"}
        </h2>
        {checkRole(["secretary", "grand-administrator"]) && (
          <Link
            href={`/meetings/chapter/${chapterId}/add`}
            className="p-3 bg-button-primary text-white rounded-xl"
          >
            Add Meeting
          </Link>
        )}
      </div>
      <div className="w-full grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {meetings.map((meeting, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row gap-3 items-center justify-between space-y-0">
              <CardTitle className="text-lg font-bold">
                {new Date(meeting.meetingDate).toLocaleDateString()}
              </CardTitle>
              <div className="flex flex-col gap-2">
                <Badge
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  {getDocTypeIcon(meeting.meetingDocType)}
                  <span className="capitalize">{meeting.meetingDocType}</span>
                </Badge>
                <div className="flex items-center gap-2 justify-center">
                  <Link
                    href={`/meetings/edit/${meeting._id}`}
                    className="border rounded-xl p-1"
                  >
                    <LucideEdit className="h-5 w-5" />
                  </Link>
                  <PrintButton
                    className="rounded-xl p-1 h-fit"
                    printerClassName="h-5 w-5 mr-0"
                    document={
                      <MeetingDetailsDocument
                        data={JSON.parse(JSON.stringify(meeting))}
                      />
                    }
                  />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default ChapterMeetingPage;
