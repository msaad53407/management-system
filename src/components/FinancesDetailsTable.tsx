import { getChapterMembers } from "@/actions/chapter";
import { capitalize } from "@/utils";
import { getAllChaptersByDistrict, getAllDistricts } from "@/utils/functions";
import { Types } from "mongoose";
import { Suspense } from "react";
import DateForm from "./DateForm";
import FinancesDetails from "./FinancesDetails";
import TableLoadingSpinner from "./TableLoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table";

type Props = {
  finances:
    | {
        type: "all";
        districtId?: never;
        chapterId?: never;
        memberId?: never;
      }
    | {
        type: "district";
        districtId: Types.ObjectId;
        chapterId?: never;
        memberId?: never;
      }
    | {
        type: "chapter";
        districtId?: never;
        chapterId: Types.ObjectId;
        memberId?: never;
      };
  date: { month?: number; year?: number };
};

const FinancesDetailsTable = async ({ finances, date }: Props) => {
  const renderDetails = async () => {
    if (finances.type === "all") {
      const { data, message } = await getAllDistricts();
      if (!data) {
        return <TableRow>{message}</TableRow>;
      }

      if (data.length === 0) {
        return <TableRow>No Districts found</TableRow>;
      }

      return data.map((district) => (
        <Suspense key={district.id} fallback={<TableLoadingSpinner />}>
          <FinancesDetails finances={{ type: "all", district }} date={date} />
        </Suspense>
      ));
    }

    if (finances.type === "district") {
      const { data, message } = await getAllChaptersByDistrict(
        finances.districtId
      );
      if (!data) {
        return <TableRow>{message}</TableRow>;
      }

      if (data.length === 0) {
        return <TableRow>No Chapters found</TableRow>;
      }

      return data.map((chapter) => (
        <Suspense key={chapter.id} fallback={<TableLoadingSpinner />}>
          <FinancesDetails
            finances={{ type: "district", chapter }}
            date={date}
          />
        </Suspense>
      ));
    }

    const { data, message } = await getChapterMembers(finances.chapterId);
    if (!data) {
      return <TableRow>{message}</TableRow>;
    }
    if (data.length === 0) {
      return <TableRow>No Members found</TableRow>;
    }

    return data.map((member) => (
      <Suspense key={member.id} fallback={<TableLoadingSpinner />}>
        <FinancesDetails finances={{ type: "chapter", member }} date={date} />
      </Suspense>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h3 className="text-slate-600 text-lg">
            {finances.type === "all"
              ? "Districts"
              : `${capitalize(
                  finances.type === "chapter" ? "member" : "chapter"
                )}s`}
          </h3>
          <DateForm />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {finances.type === "all"
                  ? "District"
                  : capitalize(
                      finances.type === "chapter" ? "member" : "chapter"
                    )}
                s
              </TableHead>
              <TableHead>Dues Paid $</TableHead>
              <TableHead>Total Dues Received $</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderDetails()}</TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FinancesDetailsTable;
