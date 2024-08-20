import { getChapter, getChapterMembers } from "@/actions/chapter";
import { getDistrict } from "@/actions/district";
import DetailsTable from "@/components/DetailsTable";
import { Button } from "@/components/ui/button";
import { checkRole } from "@/lib/role";
import { MemberDocument } from "@/models/member";
import { RankDocument } from "@/models/rank";
import { StatusDocument } from "@/models/status";
import { getAllRanks, getAllStatuses } from "@/utils/functions";
import { auth } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Chapter Members | Management System",
};

const ChapterMembers = async ({
  params: { chapterId },
}: {
  params: { chapterId?: Types.ObjectId };
}) => {
  if (!chapterId) {
    return (
      <section className="flex flex-col gap-6 p-4 w-full">
        <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
          Chapter Id not found. Please provide a valid Chapter Id.
        </h3>
      </section>
    );
  }

  const { userId } = auth();
  if (checkRole(["secretary", "member", "worthy-matron"])) {
    redirect("/chapter/members");
  }

  if (checkRole("district-deputy")) {
    const { data: district } = await getDistrict({
      deputyId: userId!,
    });

    if (!district) {
      return (
        <section className="flex flex-col gap-6 p-4 w-full">
          <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
            You are not assigned to any District.
          </h3>
        </section>
      );
    }
    const { data: chapter, message } = await getChapter({
      chapterId: chapterId.toString(),
    });

    if (!chapter) {
      return (
        <section className="flex flex-col gap-6 p-4 w-full">
          <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
            {message}
          </h3>
        </section>
      );
    }

    if (chapter.districtId?.toString() !== district._id.toString()) {
      return (
        <section className="flex flex-col gap-6 p-4 w-full">
          <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
            This Chapter is not included in your District.
          </h3>
        </section>
      );
    }
  }

  const [
    { data: members, message: membersMessage },
    { data: ranks, message: ranksMessage },
    { data: statuses, message: statusesMessage },
  ] = await Promise.all([
    getChapterMembers(chapterId),
    getAllRanks(),
    getAllStatuses(),
  ]);

  if (
    !members ||
    members.length === 0 ||
    !ranks ||
    ranks.length === 0 ||
    !statuses ||
    statuses.length === 0
  ) {
    return (
      <section className="flex flex-col gap-6 p-4 w-full">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-xl font-semibold text-slate-600">
            Member Roster
          </h3>
          {checkRole(["secretary", "grand-administrator"]) && (
            <Link href={`/chapter/member/add?chapterId=${chapterId}`}>
              <Button
                variant={"destructive"}
                className="bg-button-primary hover:bg-button-primary"
              >
                Add Member
              </Button>
            </Link>
          )}
        </div>
        <div className="flex flex-col items-center gap-6 p-4 w-full">
          <h3 className="text-xl font-semibold text-slate-600">
            {(!members || members.length === 0) && membersMessage}
            {(!ranks || ranks.length === 0) && ranksMessage}
            {(!statuses || statuses.length === 0) && statusesMessage}
          </h3>
        </div>
      </section>
    );
  }

  const parsedMembers = JSON.parse(JSON.stringify(members)) as MemberDocument[];

  const parsedRanks = JSON.parse(JSON.stringify(ranks)) as RankDocument[];
  const parsedStatuses = JSON.parse(
    JSON.stringify(statuses)
  ) as StatusDocument[];


  return (
    <section className="flex flex-col gap-6 p-4 w-full">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-xl font-semibold text-slate-600">Member Roster</h3>
        {checkRole(["secretary", "grand-administrator"]) && (
          <Link href={`/chapter/member/add?chapterId=${chapterId}`}>
            <Button
              variant={"destructive"}
              className="bg-button-primary hover:bg-button-primary"
            >
              Add Member
            </Button>
          </Link>
        )}
      </div>
      <DetailsTable
        type="member"
        members={parsedMembers}
        ranks={parsedRanks}
        statuses={parsedStatuses}
      />
    </section>
  );
};

export default ChapterMembers;
