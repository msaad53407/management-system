"use client";

import { addMember } from "@/actions/chapter";
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
import { StateDocument } from "@/models/state";
import { StatusDocument } from "@/models/status";
import { FormMessage } from "@/types/globals";
import React from "react";
import { useFormState } from "react-dom";

const introductoryFields = [
  {
    label: "Greeting",
    id: "greeting",
  },
  {
    label: "First Name",
    id: "firstName",
  },
  {
    label: "Last Name",
    id: "lastName",
  },
  {
    label: "Username",
    id: "username",
  },
];

const detailsFields = [
  {
    label: "Email Address",
    id: "email",
    type: "email",
  },
  {
    label: "Password",
    id: "password",
    type: "password",
  },
  {
    label: "Phone Number",
    id: "phoneNumber",
    type: "tel",
  },
  {
    label: "Address",
    id: "address",
    type: "text",
  },
  {
    label: "City",
    id: "city",
    type: "text",
  },
  {
    label: "State",
    id: "state",
    type: "select",
  },
  {
    label: "Zip Code",
    id: "zipCode",
    type: "string",
  },
  {
    label: "Petitioner 1",
    id: "petitioner1",
    type: "text",
  },
  {
    label: "Petitioner 2",
    id: "petitioner2",
    type: "text",
  },
  {
    label: "Petitioner 3",
    id: "petitioner3",
    type: "text",
  },
  {
    label: "Member Status",
    id: "memberStatus",
    type: "select",
  },
];

interface Props {
  dropdownOptions: {
    [key: string]: StateDocument[] | StatusDocument[];
  };
  chapterId?: string;
}

const AddMemberForm = ({ dropdownOptions, chapterId }: Props) => {
  const initialState = {
    message: "",
  };
  const [formState, formAction] = useFormState(addMember, initialState);

  const formMessage: FormMessage | string | undefined = formState?.message;

  return (
    <form
      className="grid grid-cols-1 gap-4 w-full overflow-x-hidden"
      action={formAction}
    >
      <p className="text-red-500 text-xs font-medium">
        {typeof formState?.message === "object" ? "" : formState?.message}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        <Input
          type="text"
          name="chapterId"
          value={chapterId}
          readOnly
          className="sr-only max-w-fit"
        />
        {introductoryFields.map(({ id, label }, indx) => (
          <div className="w-full flex flex-col gap-1" key={indx}>
            <p className="text-red-500 text-xs font-medium">
              {typeof formMessage === "string"
                ? ""
                : formMessage && formMessage[id]}
            </p>
            <Label htmlFor={id} className="text-slate-600">
              {label}
            </Label>
            <Input id={id} type="text" name={id} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {detailsFields.map(({ id, label, type }, indx) =>
          type === "select" ? (
            <div className="w-full flex flex-col gap-1" key={indx}>
              <p className="text-red-500 text-xs font-medium">
                {typeof formMessage === "string"
                  ? ""
                  : formMessage && formMessage[id]}
              </p>
              <Label htmlFor={id} className="text-slate-600">
                {label}
              </Label>
              <Select name={id}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select a/an ${id}`} />
                </SelectTrigger>
                <SelectContent>
                  {dropdownOptions[id].map((state) => (
                    <SelectItem
                      key={state._id?.toString()}
                      value={state._id?.toString()}
                    >
                      {state.name}
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
              <Label htmlFor={id} className="text-slate-600">
                {label}
              </Label>
              <Input id={id} type={type} name={id} />
            </div>
          )
        )}
      </div>
      <SubmitButton>Add Member</SubmitButton>
    </form>
  );
};

export default AddMemberForm;
