import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Printer, UserCheck, Check } from "lucide-react";
import BillRow from "./components/BillRow";
import BillModal from "./components/BillModal";
import { getChapterBills } from "@/utils/functions";

type Props = {
  params: { chapterId: string };
};

export default async function ChapterLedger({ params: { chapterId } }: Props) {
  const { data, message } = await getChapterBills(chapterId);

  return (
    <Card className="w-full mb-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Bill Workflow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-6">
          <Button variant="outline" className="flex items-center">
            <Printer className="mr-2 h-4 w-4" /> Print Bill Book
          </Button>
          <BillModal type="add" chapterId={chapterId}>
            Add New Bill
          </BillModal>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-medium">Number of Bills:</p>
            <p className="text-lg font-bold">{data?.length || 0}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Bill Totals $:</p>
            <p className="text-lg font-bold">
              {data?.reduce((acc, curr) => acc + curr.amount, 0) || 0}
            </p>
          </div>
        </div>

        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
          role="alert"
        >
          <p className="font-bold">
            Approved / Acknowledgement Status of both the Worshipful Master and
            Treasurer = ✅
          </p>
        </div>

        {data ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill #</TableHead>
                <TableHead>Bill Date</TableHead>
                <TableHead>Bill Amount</TableHead>
                <TableHead>Payee</TableHead>
                <TableHead>On Account Of</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Workflow</TableHead>
                <TableHead>WM Approval</TableHead>
                <TableHead>Treasurer Review</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((bill) => (
                <BillRow
                  key={bill.id}
                  bill={JSON.parse(JSON.stringify(bill))}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <h3 className="text-center text-2xl ">{message}</h3>
        )}
      </CardContent>
    </Card>
  );
}
