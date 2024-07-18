import React, { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table";
import { capitalize, getMonth, getYear } from "@/utils";
import { getAllChaptersByDistrict, getAllDistricts } from "@/utils/functions";
import FinancesDetails from "./FinancesDetails";
import LoadingSpinner from "./LoadingSpinner";
import { Types } from "mongoose";
import { getChapterMembers } from "@/actions/chapter";

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
};

const FinancesDetailsTable = async ({ finances }: Props) => {
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
        <Suspense
          key={district.id}
          fallback={<LoadingSpinner className="w-4 h-4" />}
        >
          <FinancesDetails finances={{ type: "all", district }} />
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
        <Suspense
          key={chapter.id}
          fallback={<LoadingSpinner className="w-4 h-4" />}
        >
          <FinancesDetails finances={{ type: "district", chapter }} />
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
      <Suspense
        key={member.id}
        fallback={<LoadingSpinner className="w-4 h-4" />}
      >
        <FinancesDetails finances={{ type: "chapter", member }} />
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
          <h3 className="text-slate-600 text-lg">
            <span className="text-pink-600">
              {getMonth(new Date())},{getYear(new Date())}
            </span>{" "}
            Records
          </h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {finances.type === "all"
                  ? "District"
                  : capitalize(finances.type)}
                s
              </TableHead>
              <TableHead>Paid Dues $</TableHead>
              <TableHead>Total Dues $</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderDetails()}</TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FinancesDetailsTable;
