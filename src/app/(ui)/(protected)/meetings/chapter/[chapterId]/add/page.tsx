"use client";

import { addMeeting } from "@/actions/meeting";
import SubmitButton from "@/components/SubmitButton";
import TextEditor from "@/components/TextEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  params: {
    chapterId?: string;
  };
};

const ChapterMeetingAddPage = ({ params: { chapterId } }: Props) => {
  if (!chapterId) notFound();

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
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add Meeting</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action={formAction}>
            <p className="text-red-500">
              {typeof formMessage !== "string" ? formMessage["meetingDoc"] : ""}
            </p>
            <TextEditor meetingDocType={meetingDocType} />
            <div className="flex flex-col sm:flex-row w-full items-center justify-between">
              <Label htmlFor="meetingDate" className="space-y-2">
                <p className="text-red-500">
                  {typeof formMessage !== "string"
                    ? formMessage["meetingDate"]
                    : ""}
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
              value={chapterId}
              disabled={!isAuthorizedToEdit}
            />
            <SubmitButton
              className="w-fit mx-auto"
              disabled={!checkRoleClient(["secretary", "grand-administrator"])}
            >
              Add Meeting
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default ChapterMeetingAddPage;
