import SystemDetailsPDF from "@/components/pdf/SystemDetails";
import UpcomingBirthdaysPDF from "@/components/pdf/UpcomingBirthdays";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import {
  getAllRanks,
  getMembersBirthdays,
  getSystemFinances,
} from "@/utils/functions";
import React from "react";

const ReportsPage = async () => {
  if (!checkRole(["grand-administrator", "grand-officer"])) {
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

  const [
    { data: ranks, message: ranksMessage },
    { data: birthdays, message: birthdaysMessage },
    { data: systemFinances, message: systemFinancesMessage },
  ] = await Promise.all([
    getAllRanks(),
    getMembersBirthdays(null),
    getSystemFinances({}),
  ]);

  if (!ranks || !birthdays || !systemFinances) {
    return (
      <main className="flex flex-col gap-6 p-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle>All Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 text-center">
              Error: {!ranks && ranksMessage} {!birthdays && birthdaysMessage}{" "}
              {!systemFinances && systemFinancesMessage}
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

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
                System Details
              </h4>
              <SystemDetailsPDF
                districts={systemFinances.districts}
                finances={systemFinances.finances}
              >
                Download
              </SystemDetailsPDF>
            </li>
            <li className="flex w-full items-center justify-between py-3">
              <h4 className="text-lg text-slate-600 font-normal">
                Upcoming Birthdays
              </h4>
              <UpcomingBirthdaysPDF upcomingBirthdays={birthdays} ranks={ranks}>
                Download
              </UpcomingBirthdaysPDF>
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
};

export default ReportsPage;
