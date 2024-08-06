import { getChapter } from "@/actions/chapter";
import { getDistrict } from "@/actions/district";
import MonthMembersChart from "@/components/charts/MonthMembersChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { FilterProps, MonthlyActiveMemberAggregation } from "@/types/globals";
import { getMonthlyActiveMembers } from "@/utils/functions";
import { auth } from "@clerk/nextjs/server";
import { Types } from "mongoose";

const ActiveMembersCard = async ({
  chapterId,
  districtId,
  type,
  month,
}: FilterProps) => {
  const { userId } = auth();

  let activeMembers: MonthlyActiveMemberAggregation | null = null;
  let errorMessage = "";

  if (checkRole("secretary")) {
    const { data: chapter } = await getChapter({
      secretaryId: userId!,
    });
    const { data, message } = await getMonthlyActiveMembers(
      {
        chapterId: chapter?._id,
      },
      { month: Number(month) }
    );
    activeMembers = data;
    errorMessage = message;
  } else if (checkRole("worthy-matron")) {
    const { data: chapter } = await getChapter({ matronId: userId! });
    const { data, message } = await getMonthlyActiveMembers(
      {
        chapterId: chapter?._id,
      },
      {
        month: Number(month),
      }
    );
    activeMembers = data;
    errorMessage = message;
  } else if (checkRole("district-deputy")) {
    const { data: district } = await getDistrict({ deputyId: userId! });
    const { data, message } = await getMonthlyActiveMembers(
      {
        districtId: district?._id,
      },
      {
        month: Number(month),
      }
    );
    activeMembers = data;
    errorMessage = message;
  } else {
    const { data, message } = await getMonthlyActiveMembers(
      type
        ? type === "chapter"
          ? { chapterId: new Types.ObjectId(chapterId) }
          : type === "district"
          ? { districtId: new Types.ObjectId(districtId) }
          : null
        : null,
      { month: Number(month) }
    );
    activeMembers = data;
    errorMessage = message;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Active Members</CardTitle>
      </CardHeader>
      <CardContent>
        {activeMembers ? (
          <MonthMembersChart data={activeMembers} date={{ month }} />
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="text-red-500 text-sm font-normal">{errorMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveMembersCard;
