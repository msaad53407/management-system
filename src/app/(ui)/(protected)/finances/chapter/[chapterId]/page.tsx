import DuesChart from "@/components/charts/DuesChart";
import DateForm from "@/components/DateForm";
import FinancesDetailsTable from "@/components/FinancesDetailsTable";
import { checkRole } from "@/lib/role";
import { getMonthName } from "@/utils";
import { getChapterFinances, getDelinquentDues } from "@/utils/functions";
import { Types } from "mongoose";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: { chapterId?: Types.ObjectId };
  searchParams: {
    month?: string;
    year?: string;
  };
};

const ChapterFinances = async ({
  params: { chapterId },
  searchParams: { month, year },
}: Props) => {
  if (!chapterId) {
    return notFound();
  }

  if (checkRole("member")) {
    return (
      <section className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-slate-600 text-2xl">Unauthorized</h1>
      </section>
    );
  }

  const { data: ChapterFinances, message: chapterMessage } =
    await getChapterFinances(chapterId, {
      month: Number(month),
      year: Number(year),
    });

  const { data, message: duesMessage } = await getDelinquentDues({ chapterId });

  return (
    <section className="flex flex-col gap-6 p-4 w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-xl font-semibold text-slate-600">
            Chapter Finances
          </h3>
          <DateForm />
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ChapterFinances ? (
            <DuesChart
              duesType="paid"
              month={getMonthName(month)}
              year={new Date().getFullYear().toString()}
              paidDues={ChapterFinances.paidDues}
              totalDues={ChapterFinances.totalDues}
            />
          ) : (
            <h3 className="text-slate-600 text-2xl text-center">
              {chapterMessage}
            </h3>
          )}
          {data ? (
            <DuesChart
              duesType="delinquent"
              month={getMonthName(month)}
              year={new Date().getFullYear().toString()}
              totalDues={(data?.delinquentDues || 0) * 4}
              delinquentDues={data?.delinquentDues || 0}
            />
          ) : (
            <h3 className="text-slate-600 text-2xl text-center">
              {duesMessage}
            </h3>
          )}
        </div>
      </div>
      <FinancesDetailsTable
        finances={{ type: "chapter", chapterId }}
        date={{ month: Number(month), year: Number(year) }}
      />
    </section>
  );
};

export default ChapterFinances;
