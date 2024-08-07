"use client";

import { editDistrict } from "@/actions/district";
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
import { DistrictDocument } from "@/models/district";
import { getDayLabelsForMonth } from "@/utils";
import React from "react";

type Props = {
  district: DistrictDocument;
};

const EditDistrictForm = ({ district }: Props) => {
  const { formAction, formMessage, infoMessage, setInfoMessage } =
    useFormAction(editDistrict);

  const meetingDays = getDayLabelsForMonth(
    new Date().getFullYear(),
    new Date().getMonth() + 1
  );

  const fields = [
    {
      id: "districtName",
      label: "Name",
      type: "text",
      placeholder: "District Name",
      defaultValue: district.name,
      required: true,
    },
    {
      id: "districtChartDate",
      label: "Charter Date",
      type: "date",
      placeholder: "MM/DD/YYYY",
      defaultValue: district.districtCharterDate
        ? new Date(district.districtCharterDate)?.toISOString().split("T")[0]
        : "",
      required: true,
    },
    {
      id: "districtMeet1",
      label: "Meeting 1",
      type: "select",
      defaultValue: district.districtMeet1,
      placeholder: "Select Meeting Day 1",
      dropdownType: "meetings",
    },
    {
      id: "districtMeet2",
      label: "Meeting 2",
      type: "select",
      placeholder: "Select Meeting Day 2",
      defaultValue: district.districtMeet2,
      dropdownType: "meetings",
    },
    {
      id: "districtMonDues",
      label: "Monthly Dues",
      type: "number",
      placeholder: "0.00",
      defaultValue: district.districtMonDues,
      required: true,
    },
    {
      id: "districtYrDues",
      label: "Yearly Dues",
      type: "number",
      placeholder: "0.00",
      defaultValue: district.districtYrDues,
      required: true,
    },
  ];

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
        <Input
          type={"text"}
          name={"districtId"}
          defaultValue={district._id?.toString()}
          className="sr-only w-min"
        />
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {fields.map(
            ({ id, label, placeholder, type, defaultValue, required }, indx) =>
              type === "select" ? (
                <div className="space-y-2" key={indx}>
                  <p className="text-red-500 text-xs font-medium">
                    {typeof formMessage === "string"
                      ? ""
                      : formMessage && formMessage[id]}
                  </p>
                  <Label htmlFor={id} className="text-slate-600 relative">
                    {label}
                    {required && (
                      <span
                        className="text-red-500 absolute -right-3 top-[2px]
                    "
                      >
                        *
                      </span>
                    )}
                  </Label>
                  <Select name={id} defaultValue={defaultValue?.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {meetingDays.map(({ label, value }, indx) => (
                        <SelectItem key={indx} value={value}>
                          {label}
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
                  <Label htmlFor={id} className="text-slate-600 relative">
                    {label}
                    {required && (
                      <span
                        className="text-red-500 absolute -right-3 top-[2px]
                    "
                      >
                        *
                      </span>
                    )}
                  </Label>
                  <Input
                    id={id}
                    placeholder={placeholder}
                    type={type}
                    name={id}
                    defaultValue={defaultValue?.toString()}
                  />
                </div>
              )
          )}
        </div>
        <div className="w-1/2 mx-auto">
          <SubmitButton>Update District</SubmitButton>
        </div>
      </form>
    </>
  );
};

export default EditDistrictForm;
