import { getChapterMembers } from "@/actions/chapter";
import DetailsTable from "@/components/DetailsTable";
import { Button } from "@/components/ui/button";
import { checkRole } from "@/lib/role";
import { Chapter } from "@/models/chapter";
import { District } from "@/models/district";
import { MemberDocument } from "@/models/member";
import { Rank } from "@/models/rank";
import { Status } from "@/models/status";
import { auth } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const ChapterMembers = async ({
  params,
}: {
  params: { chapterId?: Types.ObjectId };
}) => {
  if (!params.chapterId) {
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

  try {
    if (checkRole("district-deputy")) {
      const district = await District.findOne({ deputyId: userId });

      if (!district) {
        return (
          <section className="flex flex-col gap-6 p-4 w-full">
            <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
              You are not assigned to any District.
            </h3>
          </section>
        );
      }

      const chapter = await Chapter.findById(params.chapterId);

      if (chapter?.districtId?.toString() !== district._id.toString()) {
        return (
          <section className="flex flex-col gap-6 p-4 w-full">
            <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
              This Chapter is not included in your District.
            </h3>
          </section>
        );
      }
    }

    const { data, message } = await getChapterMembers(params.chapterId);

    const parsedData = JSON.parse(JSON.stringify(data));

    const ranks = JSON.parse(JSON.stringify(await Rank.find({})));
    const statuses = JSON.parse(JSON.stringify(await Status.find({})));
    return (
      <section className="flex flex-col gap-6 p-4 w-full">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-xl font-semibold text-slate-600">
            Member Roster
          </h3>
          {checkRole("secretary") && (
            <Link href="/chapter/member/add">
              <Button
                variant={"destructive"}
                className="bg-purple-800 hover:bg-purple-700"
              >
                Add Member
              </Button>
            </Link>
          )}
        </div>
        {parsedData ? (
          <DetailsTable
            members={parsedData}
            ranks={ranks}
            statuses={statuses}
          />
        ) : (
          <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
            {message}
          </h3>
        )}
      </section>
    );
  } catch (error) {
    console.error(error);
    return (
      <section className="flex flex-col gap-6 p-4 w-full">
        <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
          Something went wrong
        </h3>
      </section>
    );
  }
};

export default ChapterMembers;
