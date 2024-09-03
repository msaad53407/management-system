"use client";

import { addMeeting } from "@/actions/meeting";
import SubmitButton from "@/components/SubmitButton";
import TextEditor from "@/components/TextEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useCheckRole } from "@/hooks/useCheckRole";
import useFormAction from "@/hooks/useFormAction";
import { ChapterDocument } from "@/models/chapter";
import { User } from "@clerk/nextjs/server";
import { useEffect, useState } from "react";

type Props = {
  chapter: ChapterDocument;
  matron: User;
};

const AddMeetingForm = ({ chapter, matron }: Props) => {
  const [meetingDocType, setMeetingDocType] = useState<
    "minutes" | "notes" | "history"
  >("minutes");

  const { formAction, infoMessage, formMessage } = useFormAction(addMeeting);

  const checkRoleClient = useCheckRole();

  const isAuthorizedToEdit = checkRoleClient([
    "grand-administrator",
    "secretary",
  ]);

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
    <form className="space-y-4" action={formAction}>
      <p className="text-red-500">
        {typeof formMessage !== "string" ? formMessage["meetingDoc"] : ""}
      </p>
      <TextEditor
        meetingDocType={meetingDocType}
        templateDataChapter={chapter}
        matron={matron}
      />
      <div className="flex flex-col sm:flex-row w-full items-center justify-between">
        <Label htmlFor="meetingDate" className="space-y-2">
          <p className="text-red-500">
            {typeof formMessage !== "string" ? formMessage["meetingDate"] : ""}
          </p>
          <p>Meeting Date</p>
          <Input
            type="date"
            id="meetingDate"
            name="meetingDate"
            required
            disabled={!isAuthorizedToEdit}
          />
        </Label>
        <Label htmlFor="meetingDocType" className="space-y-2">
          <p className="text-red-500">
            {typeof formMessage !== "string"
              ? formMessage["meetingDocType"]
              : ""}
          </p>
          <p>Meeting Type</p>
          <Select
            name="meetingDocType"
            defaultValue={meetingDocType}
            onValueChange={(value: "minutes" | "notes" | "history") =>
              setMeetingDocType(value)
            }
            value={meetingDocType}
            required
            disabled={!isAuthorizedToEdit}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a meeting Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minutes">Minutes</SelectItem>
              <SelectItem value="notes">Notes</SelectItem>
              <SelectItem value="history">History</SelectItem>
            </SelectContent>
          </Select>
        </Label>
      </div>
      <Input
        type="hidden"
        name="chapterId"
        value={chapter._id.toString()}
        disabled={!isAuthorizedToEdit}
      />
      <SubmitButton
        className="w-fit mx-auto"
        disabled={!checkRoleClient(["secretary", "grand-administrator"])}
      >
        Add Meeting
      </SubmitButton>
    </form>
  );
};

export default AddMeetingForm;
