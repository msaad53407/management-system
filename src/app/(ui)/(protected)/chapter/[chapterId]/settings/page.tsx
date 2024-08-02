import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import React from "react";
import EditChapterForm from "./components/EditChapterForm";
import { getChapter } from "@/actions/chapter";
import { notFound } from "next/navigation";
import { ChapterDocument } from "@/models/chapter";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  params: {
    chapterId?: string;
  };
};

const ChapterSettingsPage = async ({ params: { chapterId } }: Props) => {
  if (!chapterId) notFound();

  if (!checkRole(["secretary", "grand-administrator"])) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-3xl font-bold">Unauthorized</h1>
      </main>
    );
  }
  let chapter: ChapterDocument | null = null;
  let errorMessage = "";
  if (checkRole("secretary")) {
    const { data, message } = await getChapter({ secretaryId: auth().userId! });
    chapter = data;
    errorMessage = message;
  } else {
    const { data, message } = await getChapter({ chapterId });
    chapter = data;
    errorMessage = message;
  }

  if (!chapter) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-3xl font-bold">{errorMessage}</h1>
      </main>
    );
  }

  return (
    <main>
      <section className="flex flex-col gap-6 p-4 w-full overflow-x-hidden">
        <Card>
          <CardHeader className="flex items-center justify-between w-full flex-row">
            <h3 className="text-xl font-semibold text-slate-600">
              Edit Chapter: {chapter?.name}
            </h3>
            {/* <Link href={checkRole("secretary")}>
              <Button
                variant={"destructive"}
                className="bg-button-primary hover:bg-button-primary"
              >
                Back
              </Button>
            </Link> */}
          </CardHeader>
          <CardContent>
            <EditChapterForm chapter={chapter} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default ChapterSettingsPage;
