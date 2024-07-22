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

  const { data, message } = await getAllMemberDropdownOptions(params.memberId);

  if (!data) {
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
                className="bg-purple-800 hover:bg-purple-700"
              >
                Back
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold text-slate-600">{message}</h2>
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
              className="bg-purple-800 hover:bg-purple-700"
            >
              Back
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <EditMemberForm
            member={data.member}
            dropdownOptions={data.dropdownOptions}
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default EditMember;
