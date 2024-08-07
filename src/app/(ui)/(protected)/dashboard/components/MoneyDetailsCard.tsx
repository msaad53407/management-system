import { getChapter } from "@/actions/chapter";
import { getDistrict } from "@/actions/district";
import MoneyDetailsChart from "@/components/charts/MoneyDetailsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { FilterProps } from "@/types/globals";
import { capitalize } from "@/utils";
import { getMonthlyMoneyDetails } from "@/utils/functions";
import { auth } from "@clerk/nextjs/server";
import { Types } from "mongoose";

const MoneyDetailsCard = async ({
  chapterId,
  districtId,
  type,
  month,
  moneyType,
}: FilterProps & { moneyType: "in" | "out" }) => {
  const { userId } = auth();
  let moneyDetails: {
    currentMonthMoneyPaid: number;
    previousMonthMoneyPaid: number;
    currentMonthMoneyTotal: number;
    previousMonthMoneyTotal: number;
    percentageChange: number;
  } | null = null;
  let errorMessage = "";

  if (checkRole("secretary")) {
    const { data: chapter } = await getChapter({
      secretaryId: userId!,
    });
    const { data, message } = await getMonthlyMoneyDetails(
      moneyType,
      {
        chapterId: chapter?._id,
      },
      { month: Number(month) }
    );
    moneyDetails = data;
    errorMessage = message;
  } else if (checkRole("worthy-matron")) {
    const { data: chapter } = await getChapter({ matronId: userId! });
    const { data, message } = await getMonthlyMoneyDetails(
      moneyType,
      {
        chapterId: chapter?._id,
      },
      { month: Number(month) }
    );
    moneyDetails = data;
    errorMessage = message;
  } else if (checkRole("district-deputy")) {
    const { data: district } = await getDistrict({ deputyId: userId! });
    const { data, message } = await getMonthlyMoneyDetails(
      moneyType,
      {
        districtId: district?._id,
      },
      { month: Number(month) }
    );
    moneyDetails = data;
    errorMessage = message;
  } else {
    const { data, message } = await getMonthlyMoneyDetails(
      moneyType,
      type
        ? type === "chapter"
          ? { chapterId: new Types.ObjectId(chapterId) }
          : type === "district"
          ? { districtId: new Types.ObjectId(districtId) }
          : null
        : null,
      { month: Number(month) }
    );
    moneyDetails = data;
    errorMessage = message;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          Money {capitalize(moneyType)} Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        {moneyDetails ? (
          <MoneyDetailsChart data={moneyDetails} date={{ month }} />
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="text-red-500 text-sm font-normal">{errorMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoneyDetailsCard;
