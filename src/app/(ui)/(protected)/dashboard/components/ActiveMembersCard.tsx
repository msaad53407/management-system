import { getChapter } from "@/actions/chapter";
import { getDistrict } from "@/actions/district";
import MonthMembersChart from "@/components/charts/MonthMembersChart";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { FilterProps, MonthlyActiveMemberAggregation } from "@/types/globals";
import { getMonthlyActiveMembers } from "@/utils/functions";
import { auth } from "@clerk/nextjs/server";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Types } from "mongoose";

const ActiveMembersCard = async ({
  chapterId,
  districtId,
  type,
}: FilterProps) => {
  const { userId } = auth();

  let activeMembers: MonthlyActiveMemberAggregation | null = null;
  let errorMessage = "";

  if (checkRole("secretary")) {
    const { data: chapter } = await getChapter({
      secretaryId: userId!,
    });
    const { data, message } = await getMonthlyActiveMembers({
      chapterId: chapter?._id,
    });
    activeMembers = data;
    errorMessage = message;
  } else if (checkRole("worthy-matron")) {
    const { data: chapter } = await getChapter({ matronId: userId! });
    const { data, message } = await getMonthlyActiveMembers({
      chapterId: chapter?._id,
    });
    activeMembers = data;
    errorMessage = message;
  } else if (checkRole("district-deputy")) {
    const { data: district } = await getDistrict({ deputyId: userId! });
    const { data, message } = await getMonthlyActiveMembers({
      districtId: district?._id,
    });
    activeMembers = data;
    errorMessage = message;
  } else {
    const { data, message } = await getMonthlyActiveMembers(
      type
        ? type === "chapter"
          ? { chapterId: new Types.ObjectId(chapterId) }
          : { districtId: new Types.ObjectId(districtId) }
        : null
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
          <MonthMembersChart data={activeMembers} />
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="text-red-500 text-sm font-normal">{errorMessage}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm">
        <div className="flex items-center text-black gap-2 font-medium leading-none">
          Trending {(activeMembers?.percentageChange || 0) > 0 ? "up" : "down"}{" "}
          by {activeMembers?.percentageChange}% this month{" "}
          {(activeMembers?.percentageChange || 0) > 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
        </div>
        <div className="leading-none text-black">
          Showing total Active Members for the last 2 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default ActiveMembersCard;
