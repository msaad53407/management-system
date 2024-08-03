import { getChapterMembers } from "@/actions/chapter";
import DetailsTable from "@/components/DetailsTable";
import { Button } from "@/components/ui/button";
import { checkRole } from "@/lib/role";
import { MemberDocument } from "@/models/member";
import { RankDocument } from "@/models/rank";
import { StatusDocument } from "@/models/status";
import { getAllRanks, getAllStatuses } from "@/utils/functions";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Chapter Members | Management System",
};

const ChapterMembers = async () => {
  if (checkRole(["grand-administrator", "grand-officer", "district-deputy"])) {
    redirect("/chapter");
  }

  const [
    { data: members, message: membersMessage },
    { data: ranks, message: ranksMessage },
    { data: statuses, message: statusesMessage },
  ] = await Promise.all([getChapterMembers(), getAllRanks(), getAllStatuses(true)]);

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
        <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
          {(!members || members.length === 0) && membersMessage}{" "}
          {(!ranks || ranks.length === 0) && ranksMessage}{" "}
          {(!statuses || statuses.length === 0) && statusesMessage}
        </h3>
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
        {checkRole("secretary") && (
          <Link href="/chapter/member/add">
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
