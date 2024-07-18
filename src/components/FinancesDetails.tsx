import React from "react";

import { TableCell, TableRow } from "./ui/table";
import { DistrictDocument } from "@/models/district";
import { ChapterDocument } from "@/models/chapter";
import { MemberDocument } from "@/models/member";
import {
  getChapterFinances,
  getDistrictFinances,
  getMemberFinances,
} from "@/utils/functions";
import Link from "next/link";

type Props = {
  finances:
    | {
        type: "all";
        district: DistrictDocument;
        chapter?: never;
        member?: never;
      }
    | {
        type: "district";
        district?: never;
        chapter: ChapterDocument;
        member?: never;
      }
    | {
        type: "chapter";
        district?: never;
        chapter?: never;
        member: MemberDocument;
      };
};

const FinancesDetails = async ({ finances }: Props) => {
  if (finances.type === "all") {
    const result = await getDistrictFinances(finances.district._id);
    if (!result.data) {
      return (
        <TableRow className="text-red-500">Error: {result.message}</TableRow>
      );
    }
    return (
      <TableRow>
        <Link href={`/finances/district/${finances.district._id}`}>
          <TableCell className="font-medium text-slate-600">
            {result.data.name}
          </TableCell>
        </Link>
        <TableCell className="font-medium text-slate-600">
          {result.data.paidDues}$
        </TableCell>
        <TableCell className="font-medium text-slate-600">
          {result.data.totalDues}$
        </TableCell>
      </TableRow>
    );
  }

  if (finances.type === "district") {
    const result = await getChapterFinances(finances.chapter._id);
    if (!result.data) {
      return (
        <TableRow className="text-red-500">Error: {result.message}</TableRow>
      );
    }
    return (
      <TableRow>
        <Link href={`/finances/chapter/${finances.chapter._id}`}>
          <TableCell className="font-medium text-slate-600">
            {result.data.name}
          </TableCell>
        </Link>
        <TableCell className="font-medium text-slate-600">
          {result.data.paidDues}$
        </TableCell>
        <TableCell className="font-medium text-slate-600">
          {result.data.totalDues}$
        </TableCell>
      </TableRow>
    );
  }

  const result = await getMemberFinances(finances.member._id);
  if (!result.data) {
    return (
      <TableRow className="text-red-500">Error: {result.message}</TableRow>
    );
  }
  return (
    <TableRow>
      <Link href={`/finances/member/${finances.member._id}`}>
        <TableCell className="font-medium text-slate-600">
          {result.data.firstName}
        </TableCell>
      </Link>
      <TableCell className="font-medium text-slate-600">
        {result.data.paidDues}$
      </TableCell>
      <TableCell className="font-medium text-slate-600">
        {result.data.totalDues}$
      </TableCell>
    </TableRow>
  );
};

export default FinancesDetails;
