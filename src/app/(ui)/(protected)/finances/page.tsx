import DuesChart from "@/components/charts/DuesChart";
import DateForm from "@/components/DateForm";
import FinancesDetailsTable from "@/components/FinancesDetailsTable";
import { checkRole } from "@/lib/role";
import { getMonthName } from "@/utils";
import { getDelinquentDues, getSystemFinances } from "@/utils/functions";
import React from "react";

type Props = {
  searchParams: {
    month?: string;
    year?: string;
  };
};

const AllFinances = async ({ searchParams: { month, year } }: Props) => {
  if (!checkRole(["grand-administrator", "grand-officer"])) {
    return (
      <section className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-slate-600 text-2xl">Unauthorized</h1>
      </section>
    );
  }

  const { data: allFinances, message: financesMessage } =
    await getSystemFinances({
      month: Number(month),
      year: Number(year),
    });

  const { data, message: duesMessage } = await getDelinquentDues(null);

  return (
    <section className="flex flex-col gap-6 p-4 w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-xl font-semibold text-slate-600">All Finances</h3>
          <DateForm />
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allFinances ? (
            <DuesChart
              duesType="paid"
              month={getMonthName(month)}
              year={new Date().getFullYear().toString()}
              paidDues={allFinances.finances.reduce(
                (acc, curr) => acc + curr.paidDues,
                0
              )}
              totalDues={allFinances.finances.reduce(
                (acc, curr) => acc + curr.totalDues,
                0
              )}
            />
          ) : (
            <h3 className="text-slate-600 text-2xl text-center">
              {financesMessage}
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
        finances={{ type: "all" }}
        date={{ month: Number(month), year: Number(year) }}
      />
    </section>
  );
};

export default AllFinances;
