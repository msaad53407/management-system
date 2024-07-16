import { getChapterMembers } from "@/actions/chapter";
import DetailsTable from "@/components/DetailsTable";
import { Button } from "@/components/ui/button";
import { checkRole } from "@/lib/role";
import { MemberDocument } from "@/models/member";
import { Rank } from "@/models/rank";
import { Status } from "@/models/status";
import { Metadata } from "next";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Chapter Members | Management System",
};

const ChapterMembers = async () => {
  if (checkRole(["grand-administrator", "grand-officer", "district-deputy"])) {
    redirect("/chapter", RedirectType.push);
  }

  try {
    const { data, message } = await getChapterMembers();

    const parsedData: MemberDocument[] | null = JSON.parse(
      JSON.stringify(data)
    );

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
