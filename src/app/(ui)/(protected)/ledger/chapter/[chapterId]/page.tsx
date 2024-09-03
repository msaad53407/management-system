import { getChapter } from "@/actions/chapter";
import { getDistrict } from "@/actions/district";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UnauthorizedAccess from "@/components/UnauthorizedAccess";
import { checkRole } from "@/lib/role";
import {
  getAllChaptersByDistrict,
  getChapterBills,
  getMemberChapter,
} from "@/utils/functions";
import { auth } from "@clerk/nextjs/server";
import { Printer } from "lucide-react";
import BillModal from "./components/BillModal";
import BillRow from "./components/BillRow";
import PrintButton from "@/components/PrintButton";
import ChapterLedgerDocument from "@/components/pdf/ChapterLedger";

type Props = {
  params: { chapterId: string };
};

export default async function ChapterLedger({ params: { chapterId } }: Props) {
  const userId = auth().userId;
  if (!checkRole(["grand-officer", "grand-administrator"])) {
    if (checkRole("member")) {
      const { data, message } = await getMemberChapter(undefined, userId!);
      if (!data) {
        return <UnauthorizedAccess title="Error" message={message} />;
      }

      if (data._id.toString() !== chapterId) {
        return <UnauthorizedAccess title="Unauthorized" />;
      }
    }

    if (checkRole("secretary")) {
      const { data, message } = await getChapter({ secretaryId: userId! });

      if (!data) {
        return <UnauthorizedAccess title="Error" message={message} />;
      }

      if (data._id.toString() !== chapterId) {
        return <UnauthorizedAccess title="Unauthorized" />;
      }
    }

    if (checkRole("worthy-matron")) {
      const { data, message } = await getChapter({ matronId: userId! });

      if (!data) {
        return <UnauthorizedAccess title="Error" message={message} />;
      }

      if (data._id.toString() !== chapterId) {
        return <UnauthorizedAccess title="Unauthorized" />;
      }
    }

    if (checkRole("district-deputy")) {
      const { data: district, message: districtMessage } = await getDistrict({
        deputyId: userId!,
      });
      if (!district) {
        return <UnauthorizedAccess title="Error" message={districtMessage} />;
      }
      const { data, message } = await getAllChaptersByDistrict(district._id);

      if (!data) {
        return <UnauthorizedAccess title="Error" message={message} />;
      }

      if (!data.find((chapter) => chapter._id.toString() === chapterId)) {
        return <UnauthorizedAccess title="Unauthorized" />;
      }
    }
  }
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
          {data && (
            <PrintButton
              label="Print Bill Book"
              document={
                <ChapterLedgerDocument
                  data={JSON.parse(JSON.stringify(data))}
                />
              }
            />
          )}
          {checkRole(["secretary", "grand-administrator"]) && (
            <BillModal type="add" chapterId={chapterId}>
              Add New Bill
            </BillModal>
          )}
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
          <Table id="bills-table">
            <TableHeader>
              <TableRow>
                <TableHead>Bill #</TableHead>
                <TableHead>Bill Date</TableHead>
                <TableHead>Bill Amount</TableHead>
                <TableHead>Payee</TableHead>
                <TableHead>On Account Of</TableHead>
                {checkRole(["secretary", "grand-administrator"]) && (
                  <>
                    <TableHead className="text-center">Actions</TableHead>
                    <TableHead>Workflow</TableHead>
                  </>
                )}
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
