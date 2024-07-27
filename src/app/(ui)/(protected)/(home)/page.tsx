import { getChapterMembers } from "@/actions/chapter";
import { ChapterMemberDetails } from "@/components/pdf/ChapterReport";
import { MemberDocument } from "@/models/member";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await clerkClient().users.getUser(userId);

  const { data: members } = await getChapterMembers();

  if (!members || members.length === 0) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen overflow-y-auto">
        <h1 className="text-3xl font-semibold text-slate-600">
          Welcome to Management System{" "}
          <span className="text-pink-600">{user.fullName}</span>
        </h1>
      </div>
    );
  }

  const parsedMembers = JSON.parse(JSON.stringify(members)) as MemberDocument[];

  return (
    // <div className="w-full flex items-center justify-center min-h-screen overflow-y-auto">
    //   <h1 className="text-3xl font-semibold text-slate-600">
    //     Welcome to Management System{" "}
    //     <span className="text-pink-600">{user.fullName}</span>
    //   </h1>
    // </div>
    <ChapterMemberDetails members={parsedMembers} />
  );
}
