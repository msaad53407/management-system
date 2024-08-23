"use client";

import { updateDues } from "@/actions/dues";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { DueDocument } from "@/models/dues";
import { getMonthName } from "@/utils";
import { Types } from "mongoose";
import { useEffect, useState } from "react";

type Props = {
  dues: DueDocument;
  monthlyDues: number;
  memberId: Types.ObjectId;
  duesLeftForYear: number;
  extraDues: number;
};

const DuesRow = ({
  dues,
  monthlyDues,
  memberId,
  duesLeftForYear,
  extraDues,
}: Props) => {
  const [formFields, setFormFields] = useState({
    datePaid: dues.datePaid
      ? new Date(dues.datePaid).toISOString().split("T")[0]
      : "",
    receiptNo: dues.receiptNo || "",
    paymentStatus: dues.paymentStatus,
    dueId: dues._id.toString(),
    memberId: memberId.toString(),
    amount: dues.amount || 0,
    totalDues: dues.totalDues,
    dueDate: dues.dueDate
      ? new Date(dues.dueDate).toISOString().split("T")[0]
      : "",
    balanceForward:
      new Date(dues.dueDate).getMonth() < new Date().getMonth()
        ? dues.balanceForward!
        : duesLeftForYear,
    memberBalance:
      new Date(dues.dueDate).getMonth() < new Date().getMonth()
        ? dues.memberBalance!
        : extraDues,
  });
  useEffect(() => {
    setFormFields({
      ...formFields,
      balanceForward:
        new Date(dues.dueDate).getMonth() < new Date().getMonth()
          ? dues.balanceForward!
          : duesLeftForYear,
      memberBalance:
        new Date(dues.dueDate).getMonth() < new Date().getMonth()
          ? dues.memberBalance!
          : extraDues,
    });
  }, [duesLeftForYear, dues.memberBalance]);

  const [isLoading, setIsLoading] = useState(false);

  const handleDuesUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    if (
      formFields.amount < 0 ||
      !formFields.dueId ||
      !formFields.memberId ||
      !formFields.totalDues
    ) {
      toast({
        title: "Error",
        description: `Please enter all required fields`,
        variant: "destructive",
      });
      return;
    }

    const { message, success } = await updateDues(formFields);

    if (success) {
      toast({
        title: "Success",
        description: message,
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <TableRow>
      <TableCell className="min-w-32">
        {getMonthName((new Date(dues.dueDate).getMonth() + 1).toString())}
      </TableCell>
      <TableCell className="min-w-32">
        <Input
          type="date"
          value={formFields.datePaid}
          onChange={(event) =>
            setFormFields((prev) => ({ ...prev, datePaid: event.target.value }))
          }
          name="datePaid"
        />
      </TableCell>
      <TableCell className="min-w-32">
        <Input
          type="text"
          value={formFields.receiptNo}
          onChange={(event) =>
            setFormFields((prev) => ({
              ...prev,
              receiptNo: event.target.value,
            }))
          }
          placeholder="Enter receipt no"
          name="receiptNo"
        />
        <Input
          value={formFields.dueId}
          readOnly
          className="sr-only size-min"
          name="dueId"
        />
        <Input
          value={formFields.memberId.toString()}
          readOnly
          className="sr-only size-min"
          name="memberId"
        />
      </TableCell>
      <TableCell className="min-w-32">${monthlyDues?.toFixed(2)}</TableCell>
      <TableCell className="min-w-32">
        <Input
          type="number"
          value={formFields.amount}
          onChange={(event) =>
            setFormFields((prev) => ({
              ...prev,
              amount: Number(event.target.value),
            }))
          }
          min={0}
          name="amount"
          placeholder="Enter amount"
        />
        <Input
          type="number"
          value={formFields.totalDues}
          readOnly
          className="sr-only size-min"
          name="totalDues"
        />
      </TableCell>
      <TableCell className="min-w-32">
        ${formFields.memberBalance?.toFixed(2)}
      </TableCell>
      <TableCell className="min-w-32">
        ${formFields.balanceForward?.toFixed(2)}
      </TableCell>
      <TableCell className="min-w-32">
        <Select
          value={formFields.paymentStatus}
          onValueChange={(val: "unpaid" | "paid" | "overdue") =>
            setFormFields((prev) => ({
              ...prev,
              paymentStatus: val,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <form onSubmit={handleDuesUpdate}>
          <Button
            className="bg-green-400 text-white hover:bg-green-500"
            variant={"secondary"}
            disabled={
              isLoading ||
              new Date(dues.dueDate).getMonth() > new Date().getMonth() ||
              dues.paymentStatus === "paid" ||
              dues.paymentStatus === "overdue"
            }
          >
            Update
          </Button>
        </form>
      </TableCell>
    </TableRow>
  );
};

export default DuesRow;
