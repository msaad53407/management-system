import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import AddMemberForm from "./components/AddMemberForm";
import { State, StateDocument } from "@/models/state";
import { Status, StatusDocument } from "@/models/status";
import { connectDB } from "@/lib/db";
import { Metadata } from "next";
import { getAllStates, getAllStatuses } from "@/utils/functions";
import { getChapterMembers } from "@/actions/chapter";
import { Types } from "mongoose";
import { MemberDocument } from "@/models/member";

export const metadata: Metadata = {
  title: "Add Member | Management System",
};

const AddMember = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  if (!checkRole(["secretary", "grand-administrator"])) {
    redirect("/");
  }
  const [
    { data: states, message: statesMessage },
    { data: statuses, message: statusesMessage },
    { data: members, message: membersMessage },
  ] = await Promise.all([
    getAllStates(),
    getAllStatuses(true),
    getChapterMembers(
      searchParams?.chapterId
        ? new Types.ObjectId(searchParams.chapterId)
        : undefined
    ),
  ]);

  if (
    !states ||
    states.length === 0 ||
    !statuses ||
    statuses.length === 0 ||
    !members ||
    members.length === 0
  ) {
    return (
      <section className="flex flex-col gap-6 p-4 w-full">
        <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
          {(!states || states.length === 0) && statesMessage}{" "}
          {(!statuses || statuses.length === 0) && statusesMessage}
          {(!members || members.length === 0) && membersMessage}
        </h3>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 p-4 w-full">
      <Card>
        <CardHeader className="flex items-center justify-between w-full flex-row">
          <h3 className="text-xl font-semibold text-slate-600">Add Member</h3>
          <Link
            href={
              searchParams?.chapterId
                ? `/chapter/${searchParams.chapterId}/members`
                : "/chapter/members"
            }
          >
            <Button
              variant={"destructive"}
              className="bg-purple-800 hover:bg-purple-700"
            >
              Back
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <AddMemberForm
            dropdownOptions={{
              state: states,
              memberStatus: statuses,
              petitioners: JSON.parse(
                JSON.stringify(members)
              ) as MemberDocument[],
            }}
            chapterId={searchParams?.chapterId}
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default AddMember;
