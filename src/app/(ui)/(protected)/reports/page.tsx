import { getChapterMembers } from "@/actions/chapter";
import ChapterDetailsPDF from "@/components/pdf/ChapterDetails";
import UpcomingBirthdaysPDF from "@/components/pdf/UpcomingBirthdays";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { MemberDocument } from "@/models/member";
import {
  getAllRanks,
  getAllStatuses,
  getChapterFinances,
} from "@/utils/functions";
import React from "react";

const ReportsPage = async () => {
  return (
    <main className="flex flex-col gap-6 p-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
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

export default ReportsPage;
