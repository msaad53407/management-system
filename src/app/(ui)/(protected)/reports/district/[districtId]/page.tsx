import DistrictDetailsPDF from "@/components/pdf/DistrictDetails";
import UpcomingBirthdaysPDF from "@/components/pdf/UpcomingBirthdays";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { ChapterDocument } from "@/models/chapter";
import {
  getAllChaptersByDistrict,
  getAllRanks,
  getAllStatuses,
  getDistrictFinances,
} from "@/utils/functions";
import { Types } from "mongoose";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: {
    districtId?: Types.ObjectId;
  };
};

const DistrictReports = async ({ params: { districtId } }: Props) => {
  if (!districtId) {
    notFound();
  }

  if (!checkRole(["district-deputy", "grand-administrator", "grand-officer"])) {
    return (
      <main className="flex flex-col gap-6 p-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle>District Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 text-center">Unauthorized</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const { data, message } = await getAllChaptersByDistrict(
    new Types.ObjectId(districtId)
  );
  const ranks = await getAllRanks();
  const statuses = await getAllStatuses();

  if (!data || !ranks.data || !statuses.data) {
    return (
      <main className="flex flex-col gap-6 p-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Chapter Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 text-center">
              Error: {message} {ranks.message} {statuses.message}
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const parsedData = JSON.parse(JSON.stringify(data)) as ChapterDocument[];
  const { data: finances, message: financesMessage } =
    await getDistrictFinances(new Types.ObjectId(districtId), {});

  if (!finances) {
    return (
      <main className="flex flex-col gap-6 p-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Chapter Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 text-center">Error: {financesMessage}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-6 p-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle>District Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col w-full gap-2 divide-y-2 divide-slate-200">
            <li className="flex w-full items-center justify-between py-3">
              <h4 className="text-lg text-slate-600 font-normal">
                District Details
              </h4>
              <DistrictDetailsPDF chapters={parsedData} finances={finances}>
                Download
              </DistrictDetailsPDF>
            </li>
            <li className="flex w-full items-center justify-between py-3">
              <h4 className="text-lg text-slate-600 font-normal">
                Upcoming Birthdays
              </h4>
              <UpcomingBirthdaysPDF>Download</UpcomingBirthdaysPDF>
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
};

export default DistrictReports;
