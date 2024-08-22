"use client";

import { updateDues } from "@/actions/dues";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { DueDocument } from "@/models/dues";
import { getMonthName } from "@/utils";
import { Types } from "mongoose";
import { useEffect, useState } from "react";

type Props = {
  data: DueDocument;
  monthlyDues: number;
  memberId: Types.ObjectId;
  duesLeftForYear: number;
};

const DuesRow = ({ data, monthlyDues, memberId, duesLeftForYear }: Props) => {
  const [formFields, setFormFields] = useState({
    datePaid: data.datePaid
      ? new Date(data.datePaid).toISOString().split("T")[0]
      : "",
    receiptNo: data.receiptNo || "",
    paymentStatus: data.paymentStatus,
    dueId: data._id.toString(),
    memberId: memberId.toString(),
    amount: data.amount || 0,
    totalDues: data.totalDues,
    dueDate: data.dueDate
      ? new Date(data.dueDate).toISOString().split("T")[0]
      : "",
    balanceForward:
      new Date(data.dueDate).getMonth() < new Date().getMonth()
        ? data.balanceForward!
        : duesLeftForYear,
  });
  useEffect(() => {
    setFormFields({
      ...formFields,
      balanceForward:
        new Date(data.dueDate).getMonth() < new Date().getMonth()
          ? data.balanceForward!
          : duesLeftForYear,
    });
  }, [duesLeftForYear]);

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
        {getMonthName((new Date(data.dueDate).getMonth() + 1).toString())}
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
        ${formFields.balanceForward?.toFixed(2)}
      </TableCell>
      <TableCell>
        <form onSubmit={handleDuesUpdate}>
          <Button
            className="bg-green-400 text-white hover:bg-green-500"
            variant={"secondary"}
            disabled={
              isLoading ||
              new Date(data.dueDate).getMonth() > new Date().getMonth()
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
