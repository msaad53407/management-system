import DetailsTable from "@/components/DetailsTable";
import { Button } from "@/components/ui/button";
import { checkRole } from "@/lib/role";
import { DistrictDocument } from "@/models/district";
import { getAllDistricts } from "@/utils/functions";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Districts | Management System",
};

const DistrictPage = async () => {
  if (!checkRole(["grand-administrator", "grand-officer"])) {
    return (
      <section className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-slate-600 text-2xl">Unauthorized</h1>
      </section>
    );
  }

  const { data: districts } = await getAllDistricts();

  if (!districts || districts.length === 0) {
    return (
      <section className="flex flex-col gap-6 p-4 w-full">
        <div className="flex flex-row items-center justify-between w-full">
          <h3 className="text-xl font-semibold text-slate-600">
            All Districts
          </h3>
          {checkRole(["grand-administrator"]) && (
            <Link href={`/district/add`}>
              <Button
                variant={"destructive"}
                className="bg-button-primary hover:bg-button-primary"
              >
                Add District
              </Button>
            </Link>
          )}
        </div>
        <div className="flex flex-col items-center gap-4 w-full">
          <h3 className="text-xl font-semibold text-slate-600">
            There are currently no Districts setup.
          </h3>
        </div>
      </section>
    );
  }
  const parsedDistricts = JSON.parse(
    JSON.stringify(districts)
  ) as DistrictDocument[];

  return (
    <section className="flex flex-col gap-6 p-4 w-full">
      <div className="flex flex-row items-center justify-between w-full">
        <h3 className="text-xl font-semibold text-slate-600">All Districts</h3>
        {checkRole(["grand-administrator"]) && (
          <Link href={`/district/add`}>
            <Button
              variant={"destructive"}
              className="bg-button-primary hover:bg-button-primary"
            >
              Add District
            </Button>
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-4 w-full">
        <DetailsTable type="district" districts={parsedDistricts} />
      </div>
    </section>
  );
};

export default DistrictPage;
