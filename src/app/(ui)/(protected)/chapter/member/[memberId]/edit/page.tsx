import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import EditMemberForm from "./components/EditMember";
import { Member, MemberDocument } from "@/models/member";
import { State, StateDocument } from "@/models/state";
import { Status, StatusDocument } from "@/models/status";
import { ChapterOffice, ChapterOfficeDocument } from "@/models/chapterOffice";
import { GrandOffice, GrandOfficeDocument } from "@/models/grandOffice";
import { Rank, RankDocument } from "@/models/rank";
import { Reason, ReasonDocument } from "@/models/reason";

const EditMember = async ({ params }: { params: { memberId?: string } }) => {
  // TODO Check if secretary is of the same chapter whose member is being edited.
  //TODO Try to implement Aggregation so that we can get states in one query
  const { userId } = auth();

  if (
    !params.memberId ||
    (!checkRole("secretary") && params.memberId !== userId)
  )
    redirect("/");
  let member: MemberDocument;
  let states: StateDocument[];
  let statuses: StatusDocument[];
  let chapterOffices: ChapterOfficeDocument[];
  let grandOffice: GrandOfficeDocument[];
  let ranks: RankDocument[];
  let reasons: ReasonDocument[];

  try {
    member = JSON.parse(
      JSON.stringify(await Member.findOne({ userId: params.memberId }))
    );

    states = JSON.parse(JSON.stringify(await State.find({})));

    statuses = JSON.parse(JSON.stringify(await Status.find({})));

    chapterOffices = JSON.parse(JSON.stringify(await ChapterOffice.find({})));

    grandOffice = JSON.parse(JSON.stringify(await GrandOffice.find({})));

    ranks = JSON.parse(JSON.stringify(await Rank.find({})));

    reasons = JSON.parse(JSON.stringify(await Reason.find({})));

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

  const dropdownOptions = {
    state: states,
    memberStatus: statuses,
    chapterOffice: chapterOffices,
    grandChapterOffice: grandOffice,
    memberRank: ranks,
    reasons
  };
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
          <EditMemberForm member={member} dropdownOptions={dropdownOptions}/>
        </CardContent>
      </Card>
    </section>
  );
};

export default EditMember;
