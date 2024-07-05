import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import EditMemberForm from "./components/EditMember";
import { Member, MemberDocument } from "@/models/member";

const EditMember = async ({ params }: { params: { memberId?: string } }) => {
  // TODO Check if secretary is of the same chapter whose member is being edited.
  const { userId } = auth();

  if (
    !params.memberId ||
    (!checkRole("secretary") && params.memberId !== userId)
  )
    redirect("/");
  let member: MemberDocument;
  try {
    member = JSON.parse(
      JSON.stringify(await Member.findOne({ userId: params.memberId }))
    );

    if (!member) {
      redirect("/chapter/members");
    }
  } catch (error) {
    console.error(error);
    return (
      <section className="flex flex-col gap-6 p-4 w-full">
        <Card>
          <CardHeader className="flex items-center justify-between w-full flex-row">
            <h3 className="text-xl font-semibold text-slate-600">
              Edit Member
            </h3>
            <Link href="/chapter/members">
              <Button
                variant={"destructive"}
                className="bg-purple-800 hover:bg-purple-700"
              >
                Back
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">Something went wrong</p>
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
          <Link href="/chapter/members">
            <Button
              variant={"destructive"}
              className="bg-purple-800 hover:bg-purple-700"
            >
              Back
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <EditMemberForm memberId={params.memberId} member={member} />
        </CardContent>
      </Card>
    </section>
  );
};

export default EditMember;
