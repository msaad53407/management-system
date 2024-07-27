import { getChapter } from "@/actions/chapter";
import { getDistrict } from "@/actions/district";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { BirthdayAggregationResult } from "@/types/globals";
import { formatDate, getMonth } from "@/utils";
import { getMembersBirthdays } from "@/utils/functions";
import { auth } from "@clerk/nextjs/server";

const MemberBirthdaysCard = async () => {
  const { userId } = auth();

  let birthdays: BirthdayAggregationResult[] | null = null;
  let errorMessage = "";

  if (checkRole("secretary")) {
    const { data: chapter } = await getChapter({
      secretaryId: userId!,
    });
    const { data, message } = await getMembersBirthdays({
      chapterId: chapter?._id,
    });
    birthdays = data;
    if (!birthdays) {
      errorMessage = message;
    }
  } else if (checkRole("worthy-matron")) {
    const { data: chapter } = await getChapter({ matronId: userId! });
    const { data, message } = await getMembersBirthdays({
      chapterId: chapter?._id,
    });
    birthdays = data;
    if (!birthdays) {
      errorMessage = message;
    }
  } else if (checkRole("district-deputy")) {
    const { data: district } = await getDistrict({ deputyId: userId! });
    const { data, message } = await getMembersBirthdays({
      districtId: district?._id,
    });
    birthdays = data;
    if (!birthdays) {
      errorMessage = message;
    }
  } else {
    const { data, message } = await getMembersBirthdays(null);
    birthdays = data;
    if (!birthdays) {
      errorMessage = message;
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Member Birthdays</CardTitle>
        <CardTitle className="text-sm">{getMonth(new Date())}</CardTitle>
      </CardHeader>
      <CardContent className="size-full">
        {!birthdays || birthdays.length === 0 ? (
          <div className="w-full flex items-center justify-center">
            <p className="text-red-500 text-sm font-normal">
              {errorMessage || "No Upcoming Birthdays"}
            </p>
          </div>
        ) : (
          <div className="w-full border border-slate-600 divide-y divide-slate-600 rounded-lg">
            {birthdays.map(
              ({ _id, firstName, middleName, lastName, birthDate }) => (
                <article key={_id?.toString()} className="p-2">
                  <p className="text-sm font-semibold text-slate-600">
                    {firstName} {middleName && middleName} {lastName} -{" "}
                    {formatDate(birthDate)}
                  </p>
                </article>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberBirthdaysCard;
