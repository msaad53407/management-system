import { getChapter } from "@/actions/chapter";
import { getDistrict } from "@/actions/district";
import MemberDistributionChart from "@/components/charts/MemberDistributionChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { getRegularAndSpecialMembersCount } from "@/utils/functions";
import { auth } from "@clerk/nextjs/server";

const MemberDistributionCard = async () => {
  const { userId } = auth();

  let membersCount: {
    regularMembersCount: number;
    specialMembersCount: number;
  } | null = null;
  let errorMessage = "";

  if (checkRole("secretary")) {
    const { data: chapter } = await getChapter({
      secretaryId: userId!,
    });
    const { data, message } = await getRegularAndSpecialMembersCount({
      chapterId: chapter?._id,
    });
    membersCount = data;
    errorMessage = message;
  } else if (checkRole("worthy-matron")) {
    const { data: chapter } = await getChapter({ matronId: userId! });
    const { data, message } = await getRegularAndSpecialMembersCount({
      chapterId: chapter?._id,
    });
    membersCount = data;
    errorMessage = message;
  } else if (checkRole("district-deputy")) {
    const { data: district } = await getDistrict({ deputyId: userId! });
    const { data, message } = await getRegularAndSpecialMembersCount({
      districtId: district?._id,
    });
    membersCount = data;
    errorMessage = message;
  } else {
    const { data, message } = await getRegularAndSpecialMembersCount(null);
    membersCount = data;
    errorMessage = message;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Member Distribution</CardTitle>
      </CardHeader>
      <CardContent className="size-full">
        {membersCount ? (
          <MemberDistributionChart data={membersCount} />
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="text-red-500 text-sm font-normal">{errorMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberDistributionCard;
