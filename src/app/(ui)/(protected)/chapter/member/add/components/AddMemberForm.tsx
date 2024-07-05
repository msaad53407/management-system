"use client";

import { addMember } from "@/actions/chapter";
import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useFormState } from "react-dom";

const introductoryFields = [
  {
    label: "User Id",
    id: "userId",
  },
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
];

const detailsFields = [
  {
    label: "Email Address",
    id: "email",
    type: "email",
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
    type: "state",
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
    type: "text",
  },
];

interface FormMessage {
  [key: string]: string[] | undefined;
}

const AddMemberForm = () => {
  const initialState = {
    message: "",
  };
  const [formState, formAction] = useFormState(addMember, initialState);

  const formMessage: FormMessage | string | undefined = formState?.message;

  return (
    <form className="grid grid-cols-1 gap-4 w-full" action={formAction}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
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
        {detailsFields.map(({ id, label, type }, indx) => (
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
        ))}
      </div>
      <SubmitButton>Add Member</SubmitButton>
    </form>
  );
};

export default AddMemberForm;
