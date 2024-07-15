"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { editMember } from "@/actions/chapter";
import { MemberDocument } from "@/models/member";
import SubmitButton from "@/components/SubmitButton";
import { useFormState } from "react-dom";
import { StateDocument } from "@/models/state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusDocument } from "@/models/status";
import { ChapterOfficeDocument } from "@/models/chapterOffice";
import { GrandOfficeDocument } from "@/models/grandOffice";
import { RankDocument } from "@/models/rank";
import { ReasonDocument } from "@/models/reason";
import { Roles } from "@/types/globals";
import { useCheckRole } from "@/hooks/useCheckRole";

interface FormMessage {
  [key: string]: string[] | undefined;
}

interface Props {
  member: MemberDocument;
  dropdownOptions: {
    [key: string]:
      | StateDocument[]
      | StatusDocument[]
      | ChapterOfficeDocument[]
      | GrandOfficeDocument[]
      | RankDocument[]
      | ReasonDocument[]
      | undefined;
  };
}

export default function EditMemberForm({ member, dropdownOptions }: Props) {
  const initialState = { message: "" };
  const checkRoleClient = useCheckRole();
  const [formState, formAction] = useFormState(editMember, initialState);

  const formMessage: FormMessage | string | undefined = formState?.message;

  const fields = [
    {
      label: "First Name",
      id: "firstName",
      placeholder: "Donald",
      defaultValue: member.firstName,
      type: "text",
      roles: ["member", "secretary", "grand-administrator"],
    },
    {
      label: "Middle Name",
      id: "middleName",
      placeholder: "Middle Name",
      type: "text",
      defaultValue: member.middleName,
      roles: ["member", "secretary", "grand-administrator"],
    },
    {
      label: "Last Name",
      id: "lastName",
      placeholder: "Duck",
      type: "text",
      defaultValue: member.lastName,
      roles: ["member", "secretary", "grand-administrator"],
    },
    {
      label: "Email Address",
      id: "emailAddress",
      placeholder: "donald@gecosla.com",
      type: "email",
      defaultValue: member.email,
      roles: ["member", "secretary", "grand-administrator"],
    },
    {
      label: "Password",
      id: "password",
      placeholder: "Password",
      type: "password",
      defaultValue: member.password,
      roles: [],
    },
    {
      label: "Phone Number",
      id: "phoneNumber",
      placeholder: "4443467891",
      type: "text",
      defaultValue: member.phoneNumber1,
      roles: ["member", "secretary", "grand-administrator"],
    },
    {
      label: "Address",
      id: "address",
      placeholder: "donald way",
      type: "text",
      defaultValue: member.address1,
      roles: ["member", "secretary", "grand-administrator"],
    },
    {
      label: "City",
      id: "city",
      placeholder: "marrero",
      type: "text",
      defaultValue: member.city,
      roles: ["member", "secretary", "grand-administrator"],
    },
    {
      label: "State",
      id: "state",
      placeholder: "Louisiana",
      type: "select",
      dropdownType: "state",
      defaultValue:
        dropdownOptions?.state &&
        dropdownOptions.state.find(
          (state: StateDocument) => state._id === member.state
        )?._id,
      roles: ["member", "secretary", "grand-administrator"],
    },
    {
      label: "Zipcode",
      id: "zipcode",
      placeholder: "34567",
      type: "text",
      defaultValue: member.zipCode,
      roles: ["member", "secretary", "grand-administrator"],
    },
    {
      label: "Petitioner 1",
      id: "petitioner1",
      placeholder: "S Williams",
      type: "text",
      defaultValue: member.sponsor1,
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Petitioner 2",
      id: "petitioner2",
      placeholder: "M W",
      type: "text",
      defaultValue: member.sponsor2,
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Petitioner 3",
      id: "petitioner3",
      placeholder: "SL",
      type: "text",
      defaultValue: member.sponsor3,
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Member Status",
      id: "memberStatus",
      placeholder: "Regular",
      type: "select",
      dropdownType: "memberStatus",
      defaultValue:
        dropdownOptions?.memberStatus &&
        dropdownOptions.memberStatus.find(
          (status: StatusDocument) => status._id === member.status
        )?._id,
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Chapter Office",
      id: "chapterOffice",
      placeholder: "Worthy Patron",
      type: "select",
      dropdownType: "chapterOffice",
      defaultValue:
        dropdownOptions?.chapterOffice &&
        dropdownOptions.chapterOffice.find(
          (chapterOffice: ChapterOfficeDocument) =>
            chapterOffice._id === member.chapterOffice
        )?._id,
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Grand Chapter Office",
      id: "grandChapterOffice",
      placeholder: "None",
      type: "select",
      dropdownType: "grandChapterOffice",
      defaultValue:
        dropdownOptions?.grandChapterOffice &&
        dropdownOptions.grandChapterOffice.find(
          (office: GrandOfficeDocument) => office._id === member.grandOffice
        )?._id,
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Member Rank",
      id: "memberRank",
      placeholder: "Select Member Rank",
      type: "select",
      dropdownType: "memberRank",
      defaultValue:
        dropdownOptions?.memberRank &&
        dropdownOptions.memberRank.find(
          (rank: RankDocument) => rank._id === member.rank
        )?._id,
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Birthdate",
      id: "birthdate",
      placeholder: "04/15/1960",
      type: "date",
      defaultValue: member.birthDate
        ? new Date(member.birthDate)?.toISOString().split("T")[0]
        : "",
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Initiation Date",
      id: "initiationDate",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.initiationDate
        ? new Date(member.initiationDate)?.toISOString().split("T")[0]
        : "",
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Queen of the South",
      id: "queenOfTheSouth",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.queenOfSouthDate
        ? new Date(member.queenOfSouthDate)?.toISOString().split("T")[0]
        : "",
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Amarant",
      id: "amarant",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.amaranthDate
        ? new Date(member.amaranthDate)?.toISOString().split("T")[0]
        : "",
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Petition Date",
      id: "petitionDate",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.petitionDate
        ? new Date(member.petitionDate)?.toISOString().split("T")[0]
        : "",
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Petition Received",
      id: "petitionReceived",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.petitionReceivedDate
        ? new Date(member.petitionReceivedDate)?.toISOString().split("T")[0]
        : "",
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Demit In",
      id: "demitIn",
      placeholder: "mm/dd/yyyy",
      type: "date",
      roles: ["secretary", "grand-administrator"],

      defaultValue: member.demitInDate
        ? new Date(member.demitInDate)?.toISOString().split("T")[0]
        : "",
    },
    {
      label: "Demit Out",
      id: "demitOut",
      placeholder: "mm/dd/yyyy",
      type: "date",

      roles: ["secretary", "grand-administrator"],
      defaultValue: member.demitOutDate
        ? new Date(member.demitOutDate)?.toISOString().split("T")[0]
        : "",
    },
    {
      label: "Demit to Chapter",
      id: "demitToChapter",
      placeholder: "Demit to Chapter",
      type: "text",
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Investigation Date",
      id: "investigationDate",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.investigationDate
        ? new Date(member.investigationDate)?.toISOString().split("T")[0]
        : "",
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Investigation Accept/Reject",
      id: "investigationAcceptReject",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.investigationAcceptOrRejectDate
        ? new Date(member.investigationAcceptOrRejectDate)
            ?.toISOString()
            .split("T")[0]
        : "",
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Enlightened Date",
      id: "enlightenedDate",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.enlightenDate
        ? new Date(member.enlightenDate)?.toISOString().split("T")[0]
        : "",
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Dropped Date",
      id: "droppedDate",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.dropDate
        ? new Date(member.dropDate)?.toISOString().split("T")[0]
        : "",
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Drop Reason",
      id: "dropReason",
      placeholder: "Select Drop Reason",
      type: "select",
      dropdownType: "reasons",
      defaultValue:
        dropdownOptions?.reasons &&
        dropdownOptions.reasons.find(
          (reason: ReasonDocument) => reason._id === member.dropReason
        )?._id,
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Suspension/Expelled Date",
      id: "suspensionExpelledDate",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.expelDate
        ? new Date(member.expelDate)?.toISOString().split("T")[0]
        : "",
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Suspension/Expelled Reason",
      id: "suspensionExpelledReason",
      placeholder: "Select Suspension/Expelled Reason",
      type: "select",
      dropdownType: "reasons",
      defaultValue:
        dropdownOptions?.reasons &&
        dropdownOptions.reasons.find(
          (reason: ReasonDocument) => reason._id === member.expelReason
        )?._id,
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Reinstated Date",
      id: "reinstatedDate",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.reinstatedDate,
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Date of Death",
      id: "dateOfDeath",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.deathDate
        ? new Date(member.deathDate)?.toISOString().split("T")[0]
        : "",
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Actual Date of Death",
      id: "actualDateOfDeath",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.actualDeathDate
        ? new Date(member.actualDeathDate)?.toISOString().split("T")[0]
        : "",
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Place of Death",
      id: "placeOfDeath",
      placeholder: "Place of Death",
      type: "text",
      defaultValue: member.deathPlace,
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Emergency Contact",
      id: "emergencyContact",
      placeholder: "Emergency Contact",
      type: "text",
      defaultValue: member.emergencyContact,
      roles: ["member", "secretary", "grand-administrator"],
    },
    {
      label: "Emergency Contact Phone No",
      id: "emergencyContactPhone",
      placeholder: "Emergency Contact Phone No",
      type: "text",
      defaultValue: member.emergencyContactPhone,
      roles: ["member", "secretary", "grand-administrator"],
    },
  ];

  return (
    <form className="flex flex-col gap-4 overflow-x-hidden" action={formAction}>
      <p className="text-red-500 text-xs font-medium">
        {typeof formState?.message === "object" ? "" : formState?.message}
      </p>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="space-y-2">
          <p className="text-red-500 text-xs font-medium">
            {typeof formState?.message === "string"
              ? ""
              : formState?.message?.memberId}
          </p>
          <Label htmlFor="memberId">Member Id</Label>
          <Input
            id="memberId"
            placeholder="Member Id"
            type="text"
            name="memberId"
            value={member.userId}
            readOnly
            className="cursor-not-allowed opacity-75"
          />
          <Input
            type="text"
            name="chapterId"
            value={member.chapterId?.toString()}
            readOnly
            className="sr-only max-w-fit"
          />
        </div>
        {fields.map(
          (
            { id, label, placeholder, type, defaultValue, dropdownType, roles },
            indx
          ) =>
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
                <Select
                  name={id}
                  {...(checkRoleClient(roles as Roles[])
                    ? { defaultValue: defaultValue?.toString() }
                    : {
                        value: defaultValue?.toString(),
                        open: false,
                      })}
                >
                  <SelectTrigger
                    {...(checkRoleClient(roles as Roles[])
                      ? {}
                      : { className: "cursor-not-allowed opacity-75" })}
                  >
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
                <Input
                  id={id}
                  placeholder={placeholder}
                  type={type}
                  name={id}
                  {...(checkRoleClient(roles as Roles[])
                    ? { defaultValue: defaultValue?.toString() }
                    : {
                        value: defaultValue?.toString(),
                        className: "cursor-not-allowed opacity-75",
                        readOnly: true,
                      })}
                />
              </div>
            )
        )}
        <div className="col-span-full space-y-2">
          <Label htmlFor="secretaryNotes">Secretary Notes</Label>
          <Textarea
            id="secretaryNotes"
            placeholder="Secretary Notes"
            name="secretaryNotes"
            {...(checkRoleClient(["secretary", "grand-administrator"])
              ? {
                  defaultValue: member.secretaryNotes,
                  className: "min-h-[100px]",
                }
              : {
                  value: member.secretaryNotes,
                  readOnly: true,
                  className: "min-h-[100px] cursor-not-allowed opacity-75",
                })}
          />
        </div>
      </div>
      <div className="w-1/2 mx-auto">
        <SubmitButton>Update Member</SubmitButton>
      </div>
    </form>
  );
}
