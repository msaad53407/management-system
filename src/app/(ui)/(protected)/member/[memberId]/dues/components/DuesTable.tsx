"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Fragment } from "react";
import DuesRow from "./DuesRow";
import { YearlyDuesAggregation } from "@/types/globals";

type Props = {
  duesData: YearlyDuesAggregation;
};
export default function DuesTable({ duesData }: Props) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Dues Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-32">Month</TableHead>
                  <TableHead className="min-w-32">Date Paid</TableHead>
                  <TableHead className="min-w-32">Receipt No</TableHead>
                  <TableHead className="min-w-32">Monthly Dues</TableHead>
                  <TableHead className="min-w-32">Paid Dues $</TableHead>
                  <TableHead className="min-w-32">Member Balance</TableHead>
                  <TableHead className="min-w-32">Balance Forward</TableHead>
                  <TableHead className="min-w-32">Payment Status</TableHead>
                  <TableHead className="min-w-32">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {duesData?.yearlyDues
                  .sort(
                    (a, b) =>
                      new Date(a.dueDate).getMonth() -
                      new Date(b.dueDate).getMonth()
                  )
                  .map((row, index) => (
                    <Fragment key={index}>
                      <DuesRow
                        dues={row}
                        monthlyDues={duesData.chapter?.[0]?.chpMonDues}
                        memberId={duesData._id}
                        duesLeftForYear={duesData.duesLeftForYear}
                        extraDues={duesData.extraDues || 0}
                      />
                    </Fragment>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Total Dues $</Label>
              <Input
                type="text"
                value={
                  duesData.chapter?.[0]?.chpMonDues! *
                  duesData.yearlyDues.length
                }
                readOnly
                className="bg-red-50"
              />
            </div>
            <div className="space-y-2">
              <Label>Total Paid $</Label>
              <Input
                type="text"
                value={
                  duesData.yearlyDues.reduce(
                    (acc, curr) => acc + curr.amount,
                    0
                  ) + (duesData.extraDues || 0)
                }
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label>Member Balance $</Label>
              <Input type="text" value={duesData.extraDues} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Amount Past Due $</Label>
              <Input type="text" value="$40.00" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Payments Outstanding $</Label>
              <Input
                type="text"
                value="2.666"
                readOnly
                className="bg-green-50"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
