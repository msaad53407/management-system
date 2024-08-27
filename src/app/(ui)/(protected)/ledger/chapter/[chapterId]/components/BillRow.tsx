"use client";

import { voidBill as voidBillFunction } from "@/actions/bill";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { BillDocument } from "@/models/bill";
import { cn } from "@/utils";
import { CheckIcon, Edit, UserCheck, XIcon } from "lucide-react";
import { useState } from "react";
import BillModal from "./BillModal";

type Props = {
  bill: BillDocument;
};

const BillRow = ({ bill }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const voidBill = async () => {
    setIsLoading(true);
    const { data, message } = await voidBillFunction(bill._id);

    if (!data) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: message,
    });
    setIsLoading(false);
  };

  return (
    <TableRow>
      <TableCell>{bill._id.toString()}</TableCell>
      <TableCell>{new Date(bill.date).toISOString().split("T")[0]}</TableCell>
      <TableCell>${bill.amount}</TableCell>
      <TableCell>{bill.payee}</TableCell>
      <TableCell>{bill.onAccountOf}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <BillModal
            type="edit"
            amount={bill.amount}
            billId={bill._id}
            date={new Date(bill.date).toISOString().split("T")[0]}
            onAccountOf={bill.onAccountOf}
            payee={bill.payee}
            chapterId={bill.chapterId.toString()}
          >
            <Edit className="h-4 w-4" />
          </BillModal>

          <Button
            variant="default"
            size="sm"
            className={cn(
              "bg-red-500 hover:bg-red-700 text-white",
              isLoading && "cursor-not-allowed opacity-60"
            )}
            onClick={voidBill}
            disabled={isLoading}
          >
            Void
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <Button variant="outline" size="sm">
          <UserCheck className="h-4 w-4" />
        </Button>
      </TableCell>
      <TableCell>
        {bill.wmApproval === "Pending" ? (
          "Pending"
        ) : bill.wmApproval === "Approved" ? (
          <CheckIcon className="h-4 w-4 text-green-500" />
        ) : (
          <XIcon className="h-4 w-4 text-red-500" />
        )}
      </TableCell>
      <TableCell>
        {bill.treasurerReview === "Reviewed" ? (
          <CheckIcon className="h-4 w-4 text-green-500" />
        ) : (
          "Pending"
        )}
      </TableCell>
    </TableRow>
  );
};

export default BillRow;
