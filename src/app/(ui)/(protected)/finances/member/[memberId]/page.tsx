import DuesChart from "@/components/charts/DuesChart";
import DateForm from "@/components/DateForm";
import { Card, CardHeader } from "@/components/ui/card";
import { getMonth, getMonthName } from "@/utils";
import { getMemberFinances } from "@/utils/functions";
import { Types } from "mongoose";
import { notFound } from "next/navigation";
import React from "react";

const MemberFinances = async ({
  params: { memberId },
  searchParams: { month, year },
}: {
  params: { memberId?: Types.ObjectId };
  searchParams: { month?: string; year?: string };
}) => {
  if (!memberId) {
    return notFound();
  }

  const { data, message } = await getMemberFinances(
    {
      month: Number(month),
      year: Number(year),
    },
    memberId
  );

  if (!data || Array.isArray(data)) {
    return (
      <main className="flex flex-col gap-4 items-center justify-center h-screen">
        <h1 className="text-slate-600 text-2xl">{message}</h1>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-4 w-full`p-4 min-h-screen">
      <section className="w-full">
        <Card>
          <CardHeader className="flex items-center justify-between w-full flex-row">
            <h3 className="text-xl capitalize font-semibold text-pink-600">
              {data.firstName + " " + data?.middleName !== null &&
                data.middleName + " " + data.lastName}{" "}
              <span className="text-slate-600">Finances</span>
            </h3>
            <DateForm />
          </CardHeader>
        </Card>
      </section>
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DuesChart
          duesType="paid"
          paidDues={data.paidDues}
          totalDues={data.totalDues}
          month={getMonthName(month)}
          year={year || new Date().getFullYear().toString()}
        />
        <DuesChart
          duesType="total"
          totalDues={data.totalDues}
          month={getMonthName(month)}
          year={year || new Date().getFullYear().toString()}
        />
      </section>
    </main>
  );
};

export default MemberFinances;
