"use client";

import { updateDues } from "@/actions/dues";
import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { FormMessage, MonthlyDue } from "@/types/globals";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";

type Props = {
  currentMonthDues: MonthlyDue;
};

const AddDuesForm = ({ currentMonthDues }: Props) => {
  const fields = [
    {
      label: "Amount Paid ($)",
      id: "amount",
      type: "number",
      defaultValue: currentMonthDues.amount,
    },
    {
      label: "Total Dues ($)",
      id: "totalDues",
      type: "number",
      defaultValue: currentMonthDues.totalDues,
    },
    {
      label: "Due Date",
      id: "dueDate",
      type: "date",
      defaultValue: new Date(currentMonthDues.dueDate)
        ?.toISOString()
        .split("T")[0],
    },
    {
      label: "Payment Status",
      id: "paymentStatus",
      type: "select",
      defaultValue: currentMonthDues.paymentStatus,
    },
  ];

  const initialState = {
    message: "",
    success: false,
  };

  const [formState, formAction] = useFormState(updateDues, initialState);

  const { toast } = useToast();

  useEffect(() => {
    if (formState.success) {
      toast({
        title: formState?.success ? "Success" : "Error",
        description:
          typeof formState?.message === "object" ? "" : formState?.message,
      });
      formState.success = false;
    }
  }, [formState, toast]);

  const formMessage: FormMessage | string | undefined = formState?.message;

  return (
    <form className="flex flex-col gap-4 overflow-x-hidden" action={formAction}>
      <p className="text-red-500 text-xs font-medium">
        {typeof formState?.message === "object" ? "" : formState?.message}
      </p>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="space-y-2">
          <p className="text-red-500 text-xs font-medium">
            {typeof formState?.message === "object" || formState?.success
              ? ""
              : formState?.message.includes("Error") && formState?.message}
          </p>
          <Label htmlFor="memberId" className="text-slate-600">
            Member Id
          </Label>
          <Input
            id="memberId"
            placeholder="Member Id"
            type="text"
            name="memberId"
            value={currentMonthDues.memberId?.toString()}
            readOnly
            className="cursor-not-allowed opacity-75"
          />
        </div>
        {fields.map(({ id, label, type, defaultValue }, indx) =>
          type === "select" ? (
            <div className="space-y-2" key={indx}>
              <p className="text-red-500 text-xs font-medium">
                {typeof formMessage === "string"
                  ? ""
                  : formMessage && formMessage[id]}
              </p>
              <Label htmlFor={id} className="text-slate-600">
                {label}
              </Label>
              <Select name={id} defaultValue={defaultValue as string}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an Option" />
                </SelectTrigger>
                <SelectContent>
                  {["paid", "unpaid", "overdue"].map((paymentStatus, indx) => (
                    <SelectItem
                      key={indx}
                      value={paymentStatus}
                      className="capitalize"
                    >
                      {paymentStatus}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2" key={indx}>
              <p className="text-red-500 text-xs font-medium">
                {typeof formMessage === "string"
                  ? ""
                  : formMessage && formMessage[id]}
              </p>
              <Label htmlFor={id} className="text-slate-600">
                {label}
              </Label>
              <Input
                id={id}
                type={type || "text"}
                name={id}
                defaultValue={defaultValue}
                min={0}
              />
            </div>
          )
        )}
      </div>
      <div className="w-1/2 mx-auto">
        <SubmitButton>Update Dues</SubmitButton>
      </div>
    </form>
  );
};

export default AddDuesForm;
