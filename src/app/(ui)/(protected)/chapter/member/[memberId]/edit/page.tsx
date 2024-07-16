import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import EditMemberForm from "./components/EditMemberForm";
import { Member, MemberDocument } from "@/models/member";
import { StateDocument } from "@/models/state";
import { StatusDocument } from "@/models/status";
import { ChapterOfficeDocument } from "@/models/chapterOffice";
import { GrandOfficeDocument } from "@/models/grandOffice";
import { RankDocument } from "@/models/rank";
import { ReasonDocument } from "@/models/reason";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Member | Management System",
};

type AggregationResult = {
  _id?: mongoose.Types.ObjectId;
  member?: MemberDocument;
  allStates?: StateDocument[];
  allStatuses?: StatusDocument[];
  allChapterOffices?: ChapterOfficeDocument[];
  allGrandOffices?: GrandOfficeDocument[];
  allRanks?: RankDocument[];
  allReasons?: ReasonDocument[];
};

const EditMember = async ({
  params,
  searchParams,
}: {
  params: { memberId?: string };
  searchParams?: { [key: string]: string | undefined };
}) => {
  // TODO Check if secretary is of the same chapter whose member is being edited.
  //TODO Try to implement Aggregation so that we can get states in one query
  const { userId } = auth();
  const chapterId = searchParams?.chapterId;
  if (
    !params.memberId ||
    (!checkRole(["secretary", "grand-administrator"]) &&
      params.memberId !== userId)
  )
    redirect("/");

  try {
    await connectDB();
    const result = await Member.aggregate([
      {
        $match: {
          userId: params.memberId,
        },
      },
      {
        $lookup: {
          from: "states", // collection name for states
          pipeline: [
            { $match: {} },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
          as: "allStates",
        },
      },
      {
        $lookup: {
          from: "status",
          pipeline: [
            { $match: {} },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
          as: "allStatuses",
        },
      },
      {
        $lookup: {
          from: "chapteroffices",
          pipeline: [
            { $match: {} },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
          as: "allChapterOffices",
        },
      },
      {
        $lookup: {
          from: "grandoffices",
          pipeline: [
            { $match: {} },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
          as: "allGrandOffices",
        },
      },
      {
        $lookup: {
          from: "ranks",
          pipeline: [
            { $match: {} },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
          as: "allRanks",
        },
      },
      {
        $lookup: {
          from: "reasons",
          pipeline: [
            { $match: {} },
            { $project: { _id: 1, name: 1, description: 1 } },
          ],
          as: "allReasons",
        },
      },
      {
        $project: {
          member: {
            _id: "$_id",
            userId: "$userId",
            role: "$role",
            greeting: "$greeting",
            firstName: "$firstName",
            middleName: "$middleName",
            lastName: "$lastName",
            status: "$status",
            email: "$email",
            photo: "$photo",
            password: "$password",
            phoneNumber1: "$phoneNumber1",
            phoneNumber2: "$phoneNumber2",
            address1: "$address1",
            address2: "$address2",
            city: "$city",
            state: "$state",
            zipCode: "$zipCode",
            birthPlace: "$birthPlace",
            birthDate: "$birthDate",
            chapterOffice: "$chapterOffice",
            grandOffice: "$grandOffice",
            rank: "$rank",
            dropReason: "$dropReason",
            dropDate: "$dropDate",
            expelReason: "$expelReason",
            expelDate: "$expelDate",
            suspendReason: "$suspendReason",
            suspendDate: "$suspendDate",
            deathDate: "$deathDate",
            actualDeathDate: "$actualDeathDate",
            deathPlace: "$deathPlace",
            secretaryNotes: "$secretaryNotes",
            enlightenDate: "$enlightenDate",
            demitInDate: "$demitInDate",
            demitOutDate: "$demitOutDate",
            demitToChapter: "$demitToChapter",
            investigationDate: "$investigationDate",
            investigationAcceptOrRejectDate: "$investigationAcceptOrRejectDate",
            sponsor1: "$sponsor1",
            sponsor2: "$sponsor2",
            sponsor3: "$sponsor3",
            petitionDate: "$petitionDate",
            petitionReceivedDate: "$petitionReceivedDate",
            initiationDate: "$initiationDate",
            amaranthDate: "$amaranthDate",
            queenOfSouthDate: "$queenOfSouthDate",
            districtId: "$districtId",
            regionId: "$regionId",
            chapterId: "$chapterId",
            spouseName: "$spouseName",
            spousePhone: "$spousePhone",
            emergencyContact: "$emergencyContact",
            emergencyContactPhone: "$emergencyContactPhone",
          },
          allStates: 1,
          allStatuses: 1,
          allChapterOffices: 1,
          allGrandOffices: 1,
          allRanks: 1,
          allReasons: 1,
        },
      },
    ]);

    if (!result || result.length === 0) {
      redirect("/chapter/members");
    }

    const {
      member,
      allStatuses,
      allStates,
      allChapterOffices,
      allGrandOffices,
      allRanks,
      allReasons,
    } = result[0] as AggregationResult;

    const dropdownOptions = {
      state: JSON.parse(JSON.stringify(allStates)) as
        | StateDocument[]
        | undefined,
      memberStatus: JSON.parse(JSON.stringify(allStatuses)) as
        | StatusDocument[]
        | undefined,
      chapterOffice: JSON.parse(JSON.stringify(allChapterOffices)) as
        | ChapterOfficeDocument[]
        | undefined,
      grandChapterOffice: JSON.parse(JSON.stringify(allGrandOffices)) as
        | GrandOfficeDocument[]
        | undefined,
      memberRank: JSON.parse(JSON.stringify(allRanks)) as
        | RankDocument[]
        | undefined,
      reasons: JSON.parse(JSON.stringify(allReasons)) as
        | ReasonDocument[]
        | undefined,
    };
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
            <EditMemberForm
              member={JSON.parse(JSON.stringify(member))}
              dropdownOptions={dropdownOptions}
            />
          </CardContent>
        </Card>
      </section>
    );
  } catch (error) {
    console.error(error);
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
            <p className="text-red-600">Something went wrong</p>
          </CardContent>
        </Card>
      </section>
    );
  }
};

export default EditMember;
