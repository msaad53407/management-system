"use client";

import {
  startBillWorkflow,
  voidBill as voidBillFunction,
} from "@/actions/bill";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { BillDocument } from "@/models/bill";
import { cn } from "@/utils";
import { CheckIcon, Edit, UserCheck, XIcon } from "lucide-react";
import { useState } from "react";
import BillModal from "./BillModal";
import { useCheckRole } from "@/hooks/useCheckRole";
import LoadingSpinner from "@/components/LoadingSpinner";

type Props = {
  bill: BillDocument;
};

const BillRow = ({ bill }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const checkRoleClient = useCheckRole();

  const voidBill = async () => {
    setIsLoading(true);
    const { data, message } = await voidBillFunction(bill._id);

    if (!data) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: "Success",
      description: message,
    });
    setIsLoading(false);
  };

  const startWorkflow = async () => {
    setIsLoading(true);
    const { message, success } = await startBillWorkflow(bill._id);

    if (!success) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      setIsLoading(false);
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
      {checkRoleClient(["secretary", "grand-administrator"]) && (
        <>
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
          <TableCell className="flex place-content-center">
            <Button
              variant="outline"
              size="icon"
              title="Start Workflow"
              onClick={startWorkflow}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner spinnerClassName="size-6" />
              ) : (
                <UserCheck className="h-4 w-4" />
              )}
            </Button>
          </TableCell>
        </>
      )}
      <TableCell className="text-center">
        {/*
         * If workflow of bill is not started, then it is inactive
         * If workflow of bill is started, then check if wmApproval is Pending, Approved or Rejected
         */}
        {bill.workflowStarted ? (
          bill.wmApproval === "Pending" ? (
            checkRoleClient("worthy-matron") ? (
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                Approve
              </Button>
            ) : (
              "Pending"
            )
          ) : bill.wmApproval === "Approved" ? (
            <CheckIcon className="h-4 w-4 text-green-500" />
          ) : (
            <XIcon className="h-4 w-4 text-red-500" />
          )
        ) : (
          "Inactive"
        )}
      </TableCell>
      <TableCell className="text-center">
        {bill.workflowStarted ? (
          bill.treasurerReview === "Reviewed" ? (
            <CheckIcon className="h-4 w-4 text-green-500" />
          ) : (
            "Pending"
          )
        ) : (
          "Inactive"
        )}
      </TableCell>
    </TableRow>
  );
};

export default BillRow;
