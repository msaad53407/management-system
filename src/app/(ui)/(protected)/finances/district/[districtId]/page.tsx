import DuesChart from "@/components/charts/DuesChart";
import DateForm from "@/components/DateForm";
import FinancesDetailsTable from "@/components/FinancesDetailsTable";
import { checkRole } from "@/lib/role";
import { getMonthName } from "@/utils";
import { getDelinquentDues, getDistrictFinances } from "@/utils/functions";
import { Types } from "mongoose";
import { notFound } from "next/navigation";
import React from "react";

const DistrictFinances = async ({
  params: { districtId },
  searchParams: { month, year },
}: {
  params: { districtId?: Types.ObjectId };
  searchParams: { month?: string; year?: string };
}) => {
  if (!districtId) {
    return notFound();
  }

  if (!checkRole(["grand-administrator", "grand-officer", "district-deputy"])) {
    return (
      <section className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-slate-600 text-2xl">Unauthorized</h1>
      </section>
    );
  }

  const { data: DistrictFinances, message: districtMessage } =
    await getDistrictFinances(districtId, {
      month: Number(month),
      year: Number(year),
    });

  const { data, message: duesMessage } = await getDelinquentDues({
    districtId,
  });

  return (
    <section className="flex flex-col gap-6 p-4 w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-xl font-semibold text-slate-600">
            District Finances
          </h3>
          <DateForm />
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DistrictFinances ? (
            <DuesChart
              duesType="paid"
              month={getMonthName(month)}
              year={new Date().getFullYear().toString()}
              paidDues={DistrictFinances.paidDues}
              totalDues={DistrictFinances.totalDues}
            />
          ) : (
            <h3 className="text-slate-600 text-2xl text-center">
              {districtMessage}
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
        finances={{ type: "district", districtId }}
        date={{ month: Number(month), year: Number(year) }}
      />
    </section>
  );
};

export default DistrictFinances;
