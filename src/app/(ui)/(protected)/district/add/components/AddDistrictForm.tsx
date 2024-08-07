"use client";

import { addDistrict } from "@/actions/district";
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
import { getDayLabelsForMonth } from "@/utils";

const districtFormFields = [
  {
    label: "Name",
    id: "name",
    required: true,
  },
  {
    label: "District Charter Date",
    id: "districtCharterDate",
    type: "date",
    required: true,
  },
  {
    label: "District Meet 1",
    id: "districtMeet1",
    type: "select",
    dropdownType: "meetings",
    placeholder: "Select a meeting",
  },
  {
    label: "District Meet 2",
    id: "districtMeet2",
    type: "select",
    dropdownType: "meetings",
    placeholder: "Select a meeting",
  },
];

const districtDeputyFormFields = [
  {
    label: "First Name",
    id: "firstName",
    required: true,
  },
  {
    label: "Last Name",
    id: "lastName",
    required: true,
  },
  {
    label: "Username",
    id: "username",
    required: true,
  },
  {
    label: "Email",
    id: "email",
    type: "email",
    required: true,
  },
  {
    label: "Password",
    id: "password",
    type: "password",
    required: true,
  },
];

const AddDistrictForm = () => {
  const { formAction, formMessage, infoMessage, setInfoMessage } =
    useFormAction(addDistrict);

  const meetingDays = getDayLabelsForMonth(
    new Date().getFullYear(),
    new Date().getMonth() + 1
  );

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
        className="grid grid-cols-1 gap-5 w-full overflow-x-hidden p-2"
        action={formAction}
      >
        <h3 className="text-xl font-semibold text-slate-600">
          District Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {districtFormFields.map(
            ({ id, label, type, placeholder, required }, indx) =>
              type === "select" ? (
                <div key={indx}>
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
                  <Select name={id}>
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
                <div className="w-full flex flex-col gap-1" key={indx}>
                  <p className="text-red-500 text-xs font-medium">
                    {typeof formMessage === "string"
                      ? ""
                      : formMessage && formMessage[id]}
                  </p>
                  <Label htmlFor={id} className="text-slate-600 w-fit relative">
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
                  <Input id={id} type={type || "text"} name={id} />
                </div>
              )
          )}
        </div>
        <h3 className="text-xl font-semibold text-slate-600">Deputy Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {districtDeputyFormFields.map(
            ({ id, label, type, required }, indx) => (
              <div className="w-full flex flex-col gap-1" key={indx}>
                <p className="text-red-500 text-xs font-medium">
                  {typeof formMessage === "string"
                    ? ""
                    : formMessage && formMessage[id]}
                </p>
                <Label htmlFor={id} className="text-slate-600 w-fit relative">
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
                <Input id={id} type={type || "text"} name={id} />
              </div>
            )
          )}
        </div>
        <SubmitButton>Add District</SubmitButton>
      </form>
    </>
  );
};

export default AddDistrictForm;
