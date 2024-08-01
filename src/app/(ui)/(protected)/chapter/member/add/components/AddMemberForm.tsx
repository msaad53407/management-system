"use client";

import { addMember } from "@/actions/chapter";
import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { MemberDocument } from "@/models/member";
import { StateDocument } from "@/models/state";
import { StatusDocument } from "@/models/status";
import { FormMessage } from "@/types/globals";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";

const introductoryFields = [
  {
    label: "Greeting",
    id: "greeting",
    options: ["Sis.", "Bro."],
    required: true,
  },
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
];

const detailsFields = [
  {
    label: "Email Address",
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
  {
    label: "Phone Number",
    id: "phoneNumber",
    type: "tel",
    required: true,
  },
  {
    label: "Address",
    id: "address",
    type: "text",
    required: true,
  },
  {
    label: "City",
    id: "city",
    type: "text",
    required: true,
  },
  {
    label: "State",
    id: "state",
    type: "select",
    required: true,
    placeholder: "Select State",
    dropdownType: "state",
  },
  {
    label: "Zip Code",
    id: "zipCode",
    type: "string",
    required: true,
  },
  {
    label: "Petitioner 1",
    id: "petitioner1",
    type: "select",
    required: true,
    placeholder: "Select Petitioner",
    dropdownType: "petitioners",
  },
  {
    label: "Petitioner 2",
    id: "petitioner2",
    type: "select",
    placeholder: "Select Petitioner",
    dropdownType: "petitioners",
  },
  {
    label: "Petitioner 3",
    id: "petitioner3",
    type: "select",
    placeholder: "Select Petitioner",
    dropdownType: "petitioners",
  },
  {
    label: "Member Status",
    id: "memberStatus",
    type: "select",
    required: true,
    placeholder: "Select Member Status",
    dropdownType: "memberStatus",
  },
];

interface Props {
  dropdownOptions: {
    [key: string]: StateDocument[] | StatusDocument[] | MemberDocument[];
  };
  chapterId?: string;
}

const AddMemberForm = ({ dropdownOptions, chapterId }: Props) => {
  const initialState = {
    message: "",
    success: false,
  };
  const [formState, formAction] = useFormState(addMember, initialState);
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
    <form
      className="grid grid-cols-1 gap-4 w-full overflow-x-hidden px-2"
      action={formAction}
    >
      <p className="text-red-500 text-xs font-medium">
        {typeof formState?.message === "object" || formState?.success
          ? ""
          : formState?.message.includes("Error") && formState?.message}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        <Input
          type="text"
          name="chapterId"
          value={chapterId}
          readOnly
          className="sr-only max-w-fit"
        />
        {introductoryFields.map(({ id, label, options, required }, indx) =>
          id === "greeting" ? (
            <RadioGroup key={indx} name={id} className="flex flex-col gap-4">
              <Label className="text-slate-600 relative w-fit">
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
              <div className="flex gap-2">
                {options &&
                  options.map((option, i) => (
                    <div className="flex items-center space-x-2" key={i}>
                      <RadioGroupItem
                        value={option}
                        id={option}
                        className="text-slate-600"
                      />
                      <Label htmlFor={option} className="text-slate-600">
                        {option}
                      </Label>
                    </div>
                  ))}
              </div>
            </RadioGroup>
          ) : (
            <div className="w-full flex flex-col gap-1" key={indx}>
              <p className="text-red-500 text-xs font-medium">
                {typeof formMessage === "string"
                  ? ""
                  : formMessage && formMessage[id]}
              </p>
              <Label htmlFor={id} className="text-slate-600 relative w-fit">
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
              <Input id={id} type="text" name={id} />
            </div>
          )
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {detailsFields.map(
          ({ id, label, type, placeholder, dropdownType, required }, indx) =>
            type === "select" ? (
              <div className="w-full flex flex-col gap-1" key={indx}>
                <p className="text-red-500 text-xs font-medium">
                  {typeof formMessage === "string"
                    ? ""
                    : formMessage && formMessage[id]}
                </p>
                <Label htmlFor={id} className="text-slate-600 relative w-fit">
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
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownOptions[dropdownType!]?.map((state: any) => {
                      console.log(dropdownType);
                      return dropdownType === "petitioners" ? (
                        <SelectItem
                          key={state._id?.toString()}
                          value={state._id?.toString()}
                        >
                          {state?.firstName} {state?.lastName}
                        </SelectItem>
                      ) : (
                        <SelectItem
                          key={state._id?.toString()}
                          value={state._id?.toString()}
                        >
                          {state?.name}
                        </SelectItem>
                      );
                    })}
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
                <Label htmlFor={id} className="text-slate-600 relative w-fit">
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
      <SubmitButton>Add Member</SubmitButton>
    </form>
  );
};

export default AddMemberForm;
