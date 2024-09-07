import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import AddMeetingForm from "./components/AddMeetingForm";
import { getChapter } from "@/actions/chapter";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { ChapterDocument } from "@/models/chapter";
import { checkRole } from "@/lib/role";
import UnauthorizedAccess from "@/components/UnauthorizedAccess";

type Props = {
  params: {
    chapterId?: string;
  };
};

const ChapterMeetingAddPage = async ({ params: { chapterId } }: Props) => {
  if (!chapterId) notFound();
  if (!checkRole(["secretary", "grand-administrator"])) {
    return <UnauthorizedAccess title="Unauthorized" />;
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
  }

  if (checkRole("grand-administrator")) {
    const { data, message } = await getChapter({ chapterId });
    chapter = data;
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
          <CardTitle>Add Meeting</CardTitle>
        </CardHeader>
        <CardContent>
          <AddMeetingForm
            chapter={JSON.parse(JSON.stringify(chapter))}
            matron={JSON.parse(JSON.stringify(chapterMatron))}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default ChapterMeetingAddPage;
