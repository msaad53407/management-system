import FinancesDetailsTable from "@/components/FinancesDetailsTable";
import { checkRole } from "@/lib/role";
import React from "react";

type Props = {
  searchParams: {
    month?: string;
    year?: string;
  };
};

const AllFinances = ({ searchParams: { month, year } }: Props) => {
  if (!checkRole(["grand-administrator", "grand-officer"])) {
    return (
      <section className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-slate-600 text-2xl">Unauthorized</h1>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 p-4 w-full">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-xl font-semibold text-slate-600">All Finances</h3>
      </div>
      <FinancesDetailsTable
        finances={{ type: "all" }}
        date={{ month: Number(month), year: Number(year) }}
      />
    </section>
  );
};

export default AllFinances;
