"use client";

import { addBill, updateBills } from "@/actions/bill";
import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import useFormAction from "@/hooks/useFormAction";
import { capitalize } from "@/utils";
import { Types } from "mongoose";
import React, { useEffect } from "react";

type Props =
  | {
      type: "add";
      children: React.ReactNode;
      chapterId: string;
    }
  | {
      type: "edit";
      billId: string | Types.ObjectId;
      chapterId: string;
      amount: number;
      payee: string;
      onAccountOf: string;
      date: string;
      children: React.ReactNode;
      disabled?: boolean;
    };

const BillModal = (props: Props) => {
  const { formAction, infoMessage, formMessage } = useFormAction(
    props.type === "add" ? addBill : updateBills
  );

  useEffect(() => {
    if (infoMessage.message) {
      if (infoMessage.variant === "success") {
        toast({
          title: "Success",
          description: infoMessage.message,
        });
        return;
      }

      if (infoMessage.variant === "error") {
        toast({
          title: "Error",
          description: infoMessage.message,
          variant: "destructive",
        });
        return;
      }
    }
  }, [infoMessage]);

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-green-500 hover:bg-green-600">
          {props.children}
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-5">
        <DialogHeader>
          <DialogTitle>
            {props.type === "add" ? "Add New" : "Edit"} Bill
          </DialogTitle>
          <form action={formAction} className="flex flex-col gap-4">
            {props.type === "edit" && (
              <Label htmlFor="billId" className="space-y-3">
                <p className="text-red-500">
                  {typeof formMessage !== "string" ? formMessage["billId"] : ""}
                </p>
                <p>Bill #</p>
                <Input
                  id="billId"
                  name="billId"
                  value={
                    props.type === "edit"
                      ? typeof props.billId === "string"
                        ? props.billId
                        : props.billId.toString()
                      : ""
                  }
                  readOnly
                />
              </Label>
            )}
            <Label htmlFor="amount" className="space-y-3">
              <p className="text-red-500">
                {typeof formMessage !== "string" ? formMessage["amount"] : ""}
              </p>
              <p>Enter Bill Amount $</p>
              <Input
                id="amount"
                name="amount"
                type="number"
                min={0}
                defaultValue={props.type === "edit" ? props.amount : ""}
              />
            </Label>
            <Input
              className="sr-only w-fit"
              readOnly
              value={props.chapterId.toString()}
              name="chapterId"
            />

            <Label htmlFor="payee" className="space-y-3">
              <p className="text-red-500">
                {typeof formMessage !== "string" ? formMessage["payee"] : ""}
              </p>
              <p>Enter Payee</p>
              <Input
                id="payee"
                name="payee"
                defaultValue={props.type === "edit" ? props.payee : ""}
              />
            </Label>

            <Label htmlFor="onAccountOf" className="space-y-3">
              <p className="text-red-500">
                {typeof formMessage !== "string"
                  ? formMessage["onAccountOf"]
                  : ""}
              </p>
              <p>Enter On Account Of</p>
              <Input
                id="onAccountOf"
                name="onAccountOf"
                defaultValue={props.type === "edit" ? props.onAccountOf : ""}
              />
            </Label>

            <Label htmlFor="date" className="space-y-3">
              <p className="text-red-500">
                {typeof formMessage !== "string" ? formMessage["date"] : ""}
              </p>
              <p>Enter Bill Date</p>
              <Input
                id="date"
                type="date"
                name="date"
                defaultValue={
                  props.type === "edit"
                    ? new Date(props.date).toISOString().split("T")[0]
                    : ""
                }
              />
            </Label>

            <SubmitButton
              disabled={props.type === "edit" ? props.disabled || false : false}
            >
              {capitalize(props.type)}
            </SubmitButton>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BillModal;
