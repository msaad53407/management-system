import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import React from "react";
import EditMemberForm from "./components/EditMemberForm";
import { Metadata } from "next";
import { getAllMemberDropdownOptions } from "@/utils/functions";
import { getChapterMembers } from "@/actions/chapter";
import { Types } from "mongoose";

export const metadata: Metadata = {
  title: "Edit Member | Management System",
};

const EditMember = async ({
  params,
  searchParams,
}: {
  params: { memberId?: string };
  searchParams?: { [key: string]: string | undefined };
}) => {
  if (!params.memberId) notFound();

  const { userId } = auth();
  const chapterId = searchParams?.chapterId;
  if (
    !params.memberId ||
    (!checkRole(["secretary", "grand-administrator"]) &&
      params.memberId !== userId)
  )
    redirect("/");

  const [
    { data: dropdownOptions, message: optionsMessage },
    { data: chapterMembers, message: membersMessage },
  ] = await Promise.all([
    getAllMemberDropdownOptions(params.memberId),
    getChapterMembers(new Types.ObjectId(chapterId)),
  ]);

  if (!dropdownOptions || !chapterMembers) {
    return (
      <section className="flex flex-col gap-6 p-4 w-full">
        <Card>
          <CardHeader className="flex items-center justify-between w-full flex-row">
            <h3 className="text-xl font-semibold text-slate-600">
              Edit Member
            </h3>
            <Link
              href={
                chapterId ? `/chapter/${chapterId}/members` : "/chapter/members"
              }
            >
              <Button
                variant={"destructive"}
                className="bg-button-primary hover:bg-button-primary"
              >
                Back
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold text-slate-600">
              {!dropdownOptions && optionsMessage}
              {!chapterMembers && membersMessage}
            </h2>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 p-4 w-full">
      <Card>
        <CardHeader className="flex items-center justify-between w-full flex-row">
          <h3 className="text-xl font-semibold text-slate-600">Edit Member</h3>
          <Link
            href={
              chapterId ? `/chapter/${chapterId}/members` : "/chapter/members"
            }
          >
            <Button
              variant={"destructive"}
              className="bg-button-primary hover:bg-button-primary"
            >
              Back
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <EditMemberForm
            member={dropdownOptions.member}
            dropdownOptions={{
              ...dropdownOptions.dropdownOptions,
              petitioners: chapterMembers,
            }}
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default EditMember;
