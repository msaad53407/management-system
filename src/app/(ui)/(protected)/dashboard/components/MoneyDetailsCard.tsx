import { getChapter } from "@/actions/chapter";
import { getDistrict } from "@/actions/district";
import MoneyDetailsChart from "@/components/charts/MoneyDetailsChart";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { FilterProps } from "@/types/globals";
import { capitalize } from "@/utils";
import { getMonthlyMoneyDetails } from "@/utils/functions";
import { auth } from "@clerk/nextjs/server";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Types } from "mongoose";
import React from "react";

const MoneyDetailsCard = async ({
  chapterId,
  districtId,
  type,
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
    const { data, message } = await getMonthlyMoneyDetails(moneyType, {
      chapterId: chapter?._id,
    });
    moneyDetails = data;
    errorMessage = message;
  } else if (checkRole("worthy-matron")) {
    const { data: chapter } = await getChapter({ matronId: userId! });
    const { data, message } = await getMonthlyMoneyDetails(moneyType, {
      chapterId: chapter?._id,
    });
    moneyDetails = data;
    errorMessage = message;
  } else if (checkRole("district-deputy")) {
    const { data: district } = await getDistrict({ deputyId: userId! });
    const { data, message } = await getMonthlyMoneyDetails(moneyType, {
      districtId: district?._id,
    });
    moneyDetails = data;
    errorMessage = message;
  } else {
    const { data, message } = await getMonthlyMoneyDetails(
      moneyType,
      type
        ? type === "chapter"
          ? { chapterId: new Types.ObjectId(chapterId) }
          : { districtId: new Types.ObjectId(districtId) }
        : null
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
          <MoneyDetailsChart data={moneyDetails} />
        ) : (
          <div className="w-full flex items-center justify-center">
            <p className="text-red-500 text-sm font-normal">{errorMessage}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 text-sm">
        <div className="flex items-center text-black gap-2 font-medium leading-none">
          Trending {(moneyDetails?.percentageChange || 0) > 0 ? "up" : "down"}{" "}
          by {moneyDetails?.percentageChange}% this month{" "}
          {(moneyDetails?.percentageChange || 0) > 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
        </div>
        <div className="leading-none text-black">
          Showing Money {capitalize(moneyType)} Details for the last 2 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default MoneyDetailsCard;
