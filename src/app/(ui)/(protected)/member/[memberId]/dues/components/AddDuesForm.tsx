"use client";

import { updateDues } from "@/actions/dues";
import InfoMessageCard from "@/components/InfoMessageCard";
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
import useFormAction from "@/hooks/useFormAction";
import { MonthlyDue } from "@/types/globals";

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

  const { formAction, formMessage, infoMessage, setInfoMessage } =
    useFormAction(updateDues);

  return (
    <>
      {infoMessage.message && (
        <InfoMessageCard
          message={infoMessage.message}
          clearMessage={setInfoMessage}
          variant={infoMessage.variant}
        />
      )}
      <form
        className="flex flex-col gap-4 overflow-x-hidden p-2"
        action={formAction}
      >
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-2">
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
            <Input
              type="text"
              name="dueId"
              value={currentMonthDues._id?.toString()}
              readOnly
              className="sr-only w-min"
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
                    {["paid", "unpaid", "overdue"].map(
                      (paymentStatus, indx) => (
                        <SelectItem
                          key={indx}
                          value={paymentStatus}
                          className="capitalize"
                        >
                          {paymentStatus}
                        </SelectItem>
                      )
                    )}
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
    </>
  );
};

export default AddDuesForm;
