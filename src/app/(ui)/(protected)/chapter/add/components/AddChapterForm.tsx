"use client";

import { addChapter } from "@/actions/chapter";
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
import { StateDocument } from "@/models/state";
import { getDayLabelsForMonth } from "@/utils";

const chapterFormFields = [
  {
    label: "Name",
    id: "name",
    required: true,
  },
  {
    label: "Number",
    id: "chapterNumber",
    type: "number",
    required: true,
  },
  {
    label: "Address 1",
    id: "chapterAddress1",
    required: true,
  },
  {
    label: "Address 2",
    id: "chapterAddress2",
  },
  {
    label: "City",
    id: "chapterCity",
    required: true,
  },
  {
    label: "State",
    id: "chapterState",
    type: "select",
    dropdownType: "states",
    required: true,
  },
  {
    label: "District",
    id: "chapterDistrict",
    type: "select",
    dropdownType: "districts",
    required: true,
  },
  {
    label: "Email",
    id: "chapterEmail",
    type: "email",
    required: true,
  },
  {
    label: "Zip Code",
    id: "chapterZipCode",
    required: true,
  },
  {
    label: "Charter Date",
    id: "chapterChartDate",
    type: "date",
    required: true,
  },
  {
    label: "Meet 1",
    id: "chapterMeet1",
    type: "select",
    placeholder: "Select Meeting Day 1",
    dropdownType: "meetings",
  },
  {
    label: "Meet 2",
    id: "chapterMeet2",
    type: "select",
    placeholder: "Select Meeting Day 2",
    dropdownType: "meetings",
  },
  {
    label: "Monthly Dues",
    id: "chpMonDues",
    type: "number",
    required: true,
  },
  {
    label: "Yearly Dues",
    id: "chpYrDues",
    type: "number",
    required: true,
  },
];

const secretaryFormFields = [
  {
    label: "First Name",
    id: "secretaryFirstName",
    required: true,
  },
  {
    label: "Last Name",
    id: "secretaryLastName",
    required: true,
  },
  {
    label: "Username",
    id: "secretaryUsername",
    required: true,
  },
  {
    label: "Email",
    id: "secretaryEmail",
    type: "email",
    required: true,
  },
  {
    label: "Password",
    id: "secretaryPassword",
    type: "password",
    required: true,
  },
];

const matronFormFields = [
  {
    label: "First Name",
    id: "matronFirstName",
    required: true,
  },
  {
    label: "Last Name",
    id: "matronLastName",
    required: true,
  },
  {
    label: "Username",
    id: "matronUsername",
    required: true,
  },
  {
    label: "Email",
    id: "matronEmail",
    type: "email",
    required: true,
  },
  {
    label: "Password",
    id: "matronPassword",
    type: "password",
    required: true,
  },
];

type Props = {
  dropdownOptions: {
    [key: string]: StateDocument[] | DistrictDocument[] | null;
  };
};

const AddChapterForm = ({ dropdownOptions }: Props) => {
  const { formAction, setInfoMessage, formMessage, infoMessage } =
    useFormAction(addChapter);

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
          Chapter Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {chapterFormFields.map(
            ({ id, label, type, required, placeholder, dropdownType }, indx) =>
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
                  <Select name={id}>
                    <SelectTrigger>
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownType === "meetings"
                        ? meetingDays.map(({ label, value }, indx) => (
                            <SelectItem key={indx} value={value}>
                              {label}
                            </SelectItem>
                          ))
                        : dropdownOptions[dropdownType!]?.map(
                            ({ _id, name }, indx) => (
                              <SelectItem key={indx} value={_id?.toString()}>
                                {name}
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
                  <Input id={id} type={type} name={id} />
                </div>
              )
          )}
        </div>
        <h3 className="text-xl font-semibold text-slate-600">
          Secretary Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {secretaryFormFields.map(({ id, label, type, required }, indx) => (
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
          ))}
        </div>
        <h3 className="text-xl font-semibold text-slate-600">
          Worthy Matron Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matronFormFields.map(({ id, label, type, required }, indx) => (
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
          ))}
        </div>
        <SubmitButton>Add Chapter</SubmitButton>
      </form>
    </>
  );
};

export default AddChapterForm;
