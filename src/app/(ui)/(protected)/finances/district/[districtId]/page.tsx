import FinancesDetailsTable from "@/components/FinancesDetailsTable";
import { checkRole } from "@/lib/role";
import { Types } from "mongoose";
import { notFound } from "next/navigation";
import React from "react";

const DistrictFinances = ({
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

  return (
    <section className="flex flex-col gap-6 p-4 w-full">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-xl font-semibold text-slate-600">
          District Finances
        </h3>
      </div>
      <FinancesDetailsTable
        finances={{ type: "district", districtId }}
        date={{ month: Number(month), year: Number(year) }}
      />
    </section>
  );
};

export default DistrictFinances;
