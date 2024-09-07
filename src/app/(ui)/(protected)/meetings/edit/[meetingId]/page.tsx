import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import EditMeetingForm from "./components/EditMeetingForm";
import { getMeeting } from "@/utils/functions";
import { notFound } from "next/navigation";
import { ChapterDocument } from "@/models/chapter";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { checkRole } from "@/lib/role";
import { getChapter } from "@/actions/chapter";

type Props = {
  params: {
    meetingId?: string;
  };
};

const ChapterMeetingEditPage = async ({ params: { meetingId } }: Props) => {
  if (!meetingId) notFound();

  const { data, message } = await getMeeting(meetingId);

  if (!data) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{message}</CardTitle>
          </CardHeader>
        </Card>
      </main>
    );
  }

  let chapter: ChapterDocument | null = null;
  let errorMessage = "";

  const userId = auth().userId;

  if (checkRole("secretary")) {
    const { data, message } = await getChapter({
      secretaryId: userId!,
    });
    chapter = data;
    if (!chapter) errorMessage = message;
  } else if (checkRole("worthy-matron")) {
    const { data: rawData, message } = await getChapter({
      matronId: userId!,
    });
    chapter = rawData;
    if (!chapter) errorMessage = message;
  } else {
    const { data: rawData, message } = await getChapter({
      chapterId: data.chapterId.toString(),
    });
    chapter = rawData;
    if (!chapter) errorMessage = message;
  }

  if (!chapter) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{errorMessage}</CardTitle>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const chapterMatron = await clerkClient().users.getUser(chapter.matronId!);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Edit Meeting</CardTitle>
        </CardHeader>
        <CardContent>
          <EditMeetingForm
            meeting={JSON.parse(JSON.stringify(data))}
            matron={JSON.parse(JSON.stringify(chapterMatron))}
            chapter={JSON.parse(JSON.stringify(chapter))}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default ChapterMeetingEditPage;
