import { getChapter } from "@/actions/chapter";
import { getDistrict } from "@/actions/district";
import MembersGrowthChart from "@/components/charts/MembersGrowthChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { CurrentYearMemberGrowthAggregation } from "@/types/globals";
import { getCurrentYearMemberGrowth } from "@/utils/functions";
import { auth } from "@clerk/nextjs/server";

const MemberGrowthCard = async () => {
  const { userId } = auth();

  let memberGrowth: CurrentYearMemberGrowthAggregation | null = null;
  let errorMessage = "";

  if (checkRole("secretary")) {
    const { data: chapter } = await getChapter({
      secretaryId: userId!,
    });
    const { data, message } = await getCurrentYearMemberGrowth({
      chapterId: chapter?._id,
    });
    memberGrowth = data;
    errorMessage = message;
  } else if (checkRole("worthy-matron")) {
    const { data: chapter } = await getChapter({ matronId: userId! });
    const { data, message } = await getCurrentYearMemberGrowth({
      chapterId: chapter?._id,
    });
    memberGrowth = data;
    errorMessage = message;
  } else if (checkRole("district-deputy")) {
    const { data: district } = await getDistrict({ deputyId: userId! });
    const { data, message } = await getCurrentYearMemberGrowth({
      districtId: district?._id,
    });
    memberGrowth = data;
    errorMessage = message;
  } else {
    const { data, message } = await getCurrentYearMemberGrowth(null);
    memberGrowth = data;
    errorMessage = message;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">New Members Growth</CardTitle>
      </CardHeader>
      <CardContent className="size-full">
        {memberGrowth ? (
          <MembersGrowthChart data={memberGrowth} />
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="text-red-500 text-sm font-normal">{errorMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberGrowthCard;
