"use client";

import { addChapter } from "@/actions/chapter";
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
import { DistrictDocument } from "@/models/district";
import { StateDocument } from "@/models/state";
import { FormMessage } from "@/types/globals";
import { useFormState } from "react-dom";

const chapterFormFields = [
  {
    label: "Name",
    id: "name",
  },
  {
    label: "Number",
    id: "chapterNumber",
    type: "number",
  },
  {
    label: "Address 1",
    id: "chapterAddress1",
  },
  {
    label: "Address 2",
    id: "chapterAddress2",
  },
  {
    label: "City",
    id: "chapterCity",
  },
  {
    label: "State",
    id: "chapterState",
    type: "select",
    dropdownType: "states",
  },
  {
    label: "District",
    id: "chapterDistrict",
    type: "select",
    dropdownType: "districts",
  },
  {
    label: "Email",
    id: "chapterEmail",
    type: "email",
  },
  {
    label: "Zip Code",
    id: "chapterZipCode",
  },
  {
    label: "Chart Date",
    id: "chapterChartDate",
    type: "date",
  },
  {
    label: "Meet 1",
    id: "chapterMeet1",
  },
  {
    label: "Meet 2",
    id: "chapterMeet2",
  },
  {
    label: "Monthly Dues",
    id: "chpMonDues",
    type: "number",
  },
  {
    label: "Yearly Dues",
    id: "chpYrDues",
    type: "number",
  },
];

const secretaryFormFields = [
  {
    label: "First Name",
    id: "secretaryFirstName",
  },
  {
    label: "Last Name",
    id: "secretaryLastName",
  },
  {
    label: "Username",
    id: "secretaryUsername",
  },
  {
    label: "Email",
    id: "secretaryEmail",
    type: "email",
  },
  {
    label: "Password",
    id: "secretaryPassword",
    type: "password",
  },
];

const matronFormFields = [
  {
    label: "First Name",
    id: "matronFirstName",
  },
  {
    label: "Last Name",
    id: "matronLastName",
  },
  {
    label: "Username",
    id: "matronUsername",
  },
  {
    label: "Email",
    id: "matronEmail",
    type: "email",
  },
  {
    label: "Password",
    id: "matronPassword",
    type: "password",
  },
];

type Props = {
  dropdownOptions: {
    [key: string]: StateDocument[] | DistrictDocument[] | null;
  };
};

const AddChapterForm = ({ dropdownOptions }: Props) => {
  const initialState = {
    message: "",
  };
  const [formState, formAction] = useFormState(addChapter, initialState);

  const formMessage: FormMessage | string | undefined = formState?.message;
  return (
    <form
      className="grid grid-cols-1 gap-5 w-full overflow-x-hidden"
      action={formAction}
    >
      <p className="text-red-500 text-xs font-medium">
        {typeof formState?.message === "object" ? "" : formState?.message}
      </p>
      <h3 className="text-xl font-semibold text-slate-600">Chapter Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {chapterFormFields.map(({ id, label, type, dropdownType }, indx) =>
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
              <Select name={id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a State" />
                </SelectTrigger>
                <SelectContent>
                  {dropdownOptions &&
                    dropdownOptions[dropdownType!]!.map((state, indx) => (
                      <SelectItem key={indx} value={state._id?.toString()}>
                        {state.name}
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
              <Input id={id} type={type} name={id} />
            </div>
          )
        )}
      </div>
      <h3 className="text-xl font-semibold text-slate-600">
        Secretary Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {secretaryFormFields.map(({ id, label, type }, indx) => (
          <div className="w-full flex flex-col gap-1" key={indx}>
            <p className="text-red-500 text-xs font-medium">
              {typeof formMessage === "string"
                ? ""
                : formMessage && formMessage[id]}
            </p>
            <Label htmlFor={id} className="text-slate-600">
              {label}
            </Label>
            <Input id={id} type={type || "text"} name={id} />
          </div>
        ))}
      </div>
      <h3 className="text-xl font-semibold text-slate-600">
        Worthy Matron Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matronFormFields.map(({ id, label, type }, indx) => (
          <div className="w-full flex flex-col gap-1" key={indx}>
            <p className="text-red-500 text-xs font-medium">
              {typeof formMessage === "string"
                ? ""
                : formMessage && formMessage[id]}
            </p>
            <Label htmlFor={id} className="text-slate-600">
              {label}
            </Label>
            <Input id={id} type={type || "text"} name={id} />
          </div>
        ))}
      </div>
      <SubmitButton>Add Chapter</SubmitButton>
    </form>
  );
};

export default AddChapterForm;
