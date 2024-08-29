"use client";

import { editMeeting } from "@/actions/meeting";
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
import { MeetingDocument } from "@/models/meeting";
import { useEffect, useState } from "react";

type Props = {
  meeting: MeetingDocument;
};

const EditMeetingForm = ({ meeting }: Props) => {
  const [meetingDocType, setMeetingDocType] = useState(meeting.meetingDocType);
  const { formAction, formMessage, infoMessage } = useFormAction(editMeeting);

  const checkRoleClient = useCheckRole();

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
        initialContent={meeting.meetingDoc}
        meetingDocType={meetingDocType}
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
            disabled={!checkRoleClient(["secretary", "grand-administrator"])}
            defaultValue={
              new Date(meeting.meetingDate).toISOString().split("T")[0]
            }
          />
        </Label>
        <Input
          name="meetingId"
          type="hidden"
          value={meeting._id.toString()}
          disabled={!checkRoleClient(["secretary", "grand-administrator"])}
        />
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
            disabled={!checkRoleClient(["secretary", "grand-administrator"])}
            required
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
      <SubmitButton
        className="w-fit mx-auto"
        disabled={!checkRoleClient(["secretary", "grand-administrator"])}
      >
        Update Meeting
      </SubmitButton>
    </form>
  );
};

export default EditMeetingForm;
