import { getChapter } from "@/actions/chapter";
import { getDistrict } from "@/actions/district";
import NewMembersGrowthChart from "@/components/charts/NewMembersGrowthChart";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { MonthlyMemberGrowthAggregation } from "@/types/globals";
import { getMonthlyMemberGrowth } from "@/utils/functions";
import { auth } from "@clerk/nextjs/server";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Types } from "mongoose";

interface BaseProps {
  type?: never;
  chapterId?: never;
  districtId?: never;
}

interface ChapterProps {
  type: "chapter";
  chapterId: string;
  districtId?: never;
}

interface DistrictProps {
  type: "district";
  districtId: string;
  chapterId?: never;
}

type Props = BaseProps | ChapterProps | DistrictProps;

const NewMembersCard = async ({ type, chapterId, districtId }: Props) => {
  const { userId } = auth();

  let memberGrowth: MonthlyMemberGrowthAggregation | null = null;
  let errorMessage = "";

  if (checkRole("secretary")) {
    const { data: chapter } = await getChapter({
      secretaryId: userId!,
    });
    const { data, message } = await getMonthlyMemberGrowth({
      chapterId: chapter?._id,
    });
    memberGrowth = data;
    errorMessage = message;
  } else if (checkRole("worthy-matron")) {
    const { data: chapter } = await getChapter({ matronId: userId! });
    const { data, message } = await getMonthlyMemberGrowth({
      chapterId: chapter?._id,
    });
    memberGrowth = data;
    errorMessage = message;
  } else if (checkRole("district-deputy")) {
    const { data: district } = await getDistrict({ deputyId: userId! });
    const { data, message } = await getMonthlyMemberGrowth({
      districtId: district?._id,
    });
    memberGrowth = data;
    errorMessage = message;
  } else {
    const { data, message } = await getMonthlyMemberGrowth(
      type
        ? type === "chapter"
          ? { chapterId: new Types.ObjectId(chapterId) }
          : { districtId: new Types.ObjectId(districtId) }
        : null
    );
    memberGrowth = data;
    errorMessage = message;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">New Members Growth</CardTitle>
      </CardHeader>
      <CardContent>
        {memberGrowth ? (
          <NewMembersGrowthChart data={memberGrowth} />
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="text-red-500 text-sm font-normal">{errorMessage}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm">
        <div className="flex items-center text-black gap-2 font-medium leading-none">
          Trending {(memberGrowth?.percentageChange || 0) > 0 ? "up" : "down"}{" "}
          by {memberGrowth?.percentageChange}% this month{" "}
          {(memberGrowth?.percentageChange || 0) > 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
        </div>
        <div className="leading-none text-black">
          Showing total new members for the last 2 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default NewMembersCard;
