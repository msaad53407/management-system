"use client";

import { editMember } from "@/actions/chapter";
import InfoMessageCard from "@/components/InfoMessageCard";
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
import { Textarea } from "@/components/ui/textarea";
import { useCheckRole } from "@/hooks/useCheckRole";
import useFormAction from "@/hooks/useFormAction";
import { ChapterDocument } from "@/models/chapter";
import { ChapterOfficeDocument } from "@/models/chapterOffice";
import { GrandOfficeDocument } from "@/models/grandOffice";
import { MemberDocument } from "@/models/member";
import { RankDocument } from "@/models/rank";
import { ReasonDocument } from "@/models/reason";
import { StateDocument } from "@/models/state";
import { StatusDocument } from "@/models/status";
import { Roles } from "@/types/globals";
import { Types } from "mongoose";

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
      | ChapterDocument[]
      | MemberDocument[]
      | undefined;
  };
}

export default function EditMemberForm({ member, dropdownOptions }: Props) {
  const checkRoleClient = useCheckRole();
  const { formAction, formState, setInfoMessage, formMessage, infoMessage } =
    useFormAction(editMember);

  const fields = [
    {
      label: "Greeting",
      id: "greeting",
      defaultValue: member.greeting,
      options: ["Sis.", "Bro."],
      roles: ["member", "secretary", "grand-administrator"],
      type: "radio",
      required: true,
    },
    {
      label: "First Name",
      id: "firstName",
      placeholder: "Donald",
      defaultValue: member.firstName,
      type: "text",
      roles: ["member", "secretary", "grand-administrator"],
      required: true,
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
      required: true,
    },
    {
      label: "Email Address",
      id: "emailAddress",
      placeholder: "donald@gecosla.com",
      type: "email",
      defaultValue: member.email,
      roles: ["member", "secretary", "grand-administrator"],
      required: true,
    },
    {
      label: "Password",
      id: "password",
      placeholder: "Password",
      type: "password",
      defaultValue: member.password,
      roles: [],
      required: true,
    },
    {
      label: "Phone Number",
      id: "phoneNumber",
      placeholder: "4443467891",
      type: "text",
      defaultValue: member.phoneNumber1,
      roles: ["member", "secretary", "grand-administrator"],
      required: true,
    },
    {
      label: "Address",
      id: "address",
      placeholder: "donald way",
      type: "text",
      defaultValue: member.address1,
      roles: ["member", "secretary", "grand-administrator"],
      required: true,
    },
    {
      label: "City",
      id: "city",
      placeholder: "marrero",
      type: "text",
      defaultValue: member.city,
      roles: ["member", "secretary", "grand-administrator"],
      required: true,
    },
    {
      label: "State",
      id: "state",
      placeholder: "Select a State",
      type: "select",
      dropdownType: "state",
      defaultValue:
        dropdownOptions?.state &&
        (dropdownOptions.state as StateDocument[]).find(
          (state) => state._id === member.state
        )?._id,
      roles: ["member", "secretary", "grand-administrator"],
      required: true,
    },
    {
      label: "Zipcode",
      id: "zipcode",
      placeholder: "34567",
      type: "text",
      defaultValue: member.zipCode,
      roles: ["member", "secretary", "grand-administrator"],
      required: true,
    },
    {
      label: "Petitioner 1",
      id: "petitioner1",
      placeholder: "Select a Petitioner",
      type: "select",
      defaultValue:
        dropdownOptions?.petitioners &&
        (dropdownOptions.petitioners as MemberDocument[]).find(
          (petitioner) => petitioner._id === member.sponsor1
        )?.firstName,
      roles: ["secretary", "grand-administrator"],
      dropdownType: "petitioners",
    },
    {
      label: "Petitioner 2",
      id: "petitioner2",
      placeholder: "Select a Petitioner",
      type: "select",
      defaultValue:
        dropdownOptions?.petitioners &&
        (dropdownOptions.petitioners as MemberDocument[]).find(
          (petitioner) => petitioner._id === member.sponsor2
        )?.firstName,
      roles: ["secretary", "grand-administrator"],
      dropdownType: "petitioners",
    },
    {
      label: "Petitioner 3",
      id: "petitioner3",
      placeholder: "Select a Petitioner",
      type: "select",
      defaultValue:
        dropdownOptions?.petitioners &&
        (dropdownOptions.petitioners as MemberDocument[]).find(
          (petitioner) => petitioner._id === member.sponsor3
        )?.firstName,
      roles: ["secretary", "grand-administrator"],
      dropdownType: "petitioners",
    },
    {
      label: "Member Status",
      id: "memberStatus",
      placeholder: "Select a Status",
      type: "select",
      dropdownType: "memberStatus",
      defaultValue:
        dropdownOptions?.memberStatus &&
        (dropdownOptions.memberStatus as StatusDocument[]).find(
          (status) => status._id === member.status
        )?._id,
      roles: ["secretary", "grand-administrator"],
      required: true,
    },
    {
      label: "Chapter Office",
      id: "chapterOffice",
      placeholder: "Select Chapter Office",
      type: "select",
      dropdownType: "chapterOffice",
      defaultValue:
        dropdownOptions?.chapterOffice &&
        (dropdownOptions.chapterOffice as ChapterOfficeDocument[]).find(
          (chapterOffice) => chapterOffice._id === member.chapterOffice
        )?._id,
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Grand Chapter Office",
      id: "grandChapterOffice",
      placeholder: "Select Grand Chapter Office",
      type: "select",
      dropdownType: "grandChapterOffice",
      defaultValue:
        dropdownOptions?.grandChapterOffice &&
        (dropdownOptions.grandChapterOffice as GrandOfficeDocument[]).find(
          (office) => office._id === member.grandOffice
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
        (dropdownOptions.memberRank as RankDocument[]).find(
          (rank) => rank._id === member.rank
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
      required: true,
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
      label: "Amaranth",
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
      placeholder: "Select a Chapter",
      type: "select",
      dropdownType: "chapters",
      defaultValue:
        dropdownOptions?.chapters &&
        (dropdownOptions?.chapters as ChapterDocument[]).find(
          (chapter) => chapter._id === member.demitToChapter
        )?._id,
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
      placeholder: "Select a Reason",
      type: "select",
      dropdownType: "reasons",
      defaultValue:
        dropdownOptions?.reasons &&
        (dropdownOptions.reasons as ReasonDocument[]).find(
          (reason) => reason._id === member.dropReason
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
      placeholder: "Select a Reason",
      type: "select",
      dropdownType: "reasons",
      defaultValue:
        dropdownOptions?.reasons &&
        (dropdownOptions.reasons as ReasonDocument[]).find(
          (reason) => reason._id === member.expelReason
        )?._id,
      roles: ["secretary", "grand-administrator"],
    },
    {
      label: "Reinstated Date",
      id: "reinstatedDate",
      placeholder: "mm/dd/yyyy",
      type: "date",
      defaultValue: member.reinstatedDate
        ? new Date(member.reinstatedDate)?.toISOString().split("T")[0]
        : "",
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
      required: true,
    },
    {
      label: "Emergency Contact Phone No",
      id: "emergencyContactPhone",
      placeholder: "Emergency Contact Phone No",
      type: "text",
      defaultValue: member.emergencyContactPhone,
      roles: ["member", "secretary", "grand-administrator"],
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
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-2">
            <p className="text-red-500 text-xs font-medium">
              {typeof formState?.message === "string"
                ? ""
                : formState?.message?.memberId}
            </p>
            <Label htmlFor="memberId" className="text-slate-600">
              Member Id
            </Label>
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
              {
                id,
                label,
                placeholder,
                type,
                defaultValue,
                dropdownType,
                roles,
                options,
                required,
              },
              indx
            ) =>
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
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions &&
                      dropdownType &&
                      dropdownType === "chapters"
                        ? (dropdownOptions[dropdownType!]! as ChapterDocument[])
                            .filter(
                              (chapter) => chapter._id !== member.chapterId
                            )
                            .map((chapter, indx) => (
                              <SelectItem
                                key={indx}
                                value={chapter._id?.toString()}
                              >
                                {chapter.name}
                              </SelectItem>
                            ))
                        : dropdownType === "petitioners"
                        ? (dropdownOptions[dropdownType]! as MemberDocument[])
                            .filter(({ _id }) => _id !== member._id)
                            .map((member, indx) => (
                              <SelectItem
                                key={indx}
                                value={member._id?.toString()}
                              >
                                {member.firstName} {member.lastName}
                              </SelectItem>
                            ))
                        : dropdownOptions[dropdownType!]!.map((state, indx) => (
                            <SelectItem
                              key={indx}
                              value={state._id?.toString()}
                            >
                              {/* @ts-ignore */}
                              {state?.name}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : type === "radio" ? (
                <RadioGroup
                  key={indx}
                  name={id}
                  className="flex flex-col gap-5 mt-2"
                  defaultValue={defaultValue as string}
                >
                  <Label className="text-slate-600 relative w-min">
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
                            id={option}
                            value={option}
                            className="text-slate-600"
                            {...(checkRoleClient(roles as Roles[])
                              ? {}
                              : {
                                  className: "cursor-not-allowed opacity-75",
                                  readOnly: true,
                                })}
                          />
                          <Label htmlFor={option} className="text-slate-600">
                            {option}
                          </Label>
                        </div>
                      ))}
                  </div>
                </RadioGroup>
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
    </>
  );
}
