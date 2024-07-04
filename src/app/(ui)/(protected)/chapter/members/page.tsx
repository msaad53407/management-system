import { getChapterMembers } from "@/actions/chapter";
import DetailsTable from "@/components/DetailsTable";
import { Button } from "@/components/ui/button";
import { checkRole } from "@/lib/role";
import { MemberDocument } from "@/models/member";
import Link from "next/link";
import React from "react";

const ChapterMembers = async () => {
  const { data, message } = await getChapterMembers();

  const parsedData: MemberDocument[] | null = JSON.parse(JSON.stringify(data));
  return (
    <section className="flex flex-col gap-6 p-4 w-full">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-xl font-semibold text-slate-600">Member Roster</h3>
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
        <DetailsTable members={parsedData} />
      ) : (
        <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
          {message}
        </h3>
      )}
    </section>
  );
};

export default ChapterMembers;
