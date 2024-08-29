import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import EditMeetingForm from "./components/EditMeetingForm";
import { getMeeting } from "@/utils/functions";
import { notFound } from "next/navigation";

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Edit Meeting</CardTitle>
        </CardHeader>
        <CardContent>
          <EditMeetingForm meeting={JSON.parse(JSON.stringify(data))} />
        </CardContent>
      </Card>
    </main>
  );
};

export default ChapterMeetingEditPage;
