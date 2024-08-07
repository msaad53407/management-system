import { ChapterReportsDownloadLink } from "@/components/pdf/ChapterReport";
import {
  getAllChapters,
  getAllStatuses,
  getChapterReport,
} from "@/utils/functions";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await clerkClient().users.getUser(userId);

  const [{ data }, { data: statuses }, { data: chapters }] = await Promise.all([
    getChapterReport("668924b8b970bc1f93711ebc"),
    getAllStatuses(),
    getAllChapters(),
  ]);

  if (!data || !statuses || !chapters) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen overflow-y-auto">
        <h1 className="text-3xl font-semibold text-slate-600">
          Welcome to Management System{" "}
          <span className="text-pink-600">{user.fullName}</span>
        </h1>
      </div>
    );
  }
  // console.log(JSON.stringify(statuses, null, 2));

  return (
    // <div className="w-full flex items-center justify-center min-h-screen overflow-y-auto">
    //   <h1 className="text-3xl font-semibold text-slate-600">
    //     Welcome to Management System{" "}
    //     <span className="text-pink-600">{user.fullName}</span>
    //   </h1>
    // </div>
    <>
      <ChapterReportsDownloadLink
        data={{
          report: JSON.parse(JSON.stringify(data)),
          statuses: JSON.parse(JSON.stringify(statuses)),
          chapters: JSON.parse(JSON.stringify(chapters)),
        }}
      />
    </>
  );
}
