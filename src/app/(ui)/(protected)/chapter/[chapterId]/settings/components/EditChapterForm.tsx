"use client";

import { editChapter } from "@/actions/chapter";
import InfoMessageCard from "@/components/InfoMessageCard";
import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFormAction from "@/hooks/useFormAction";
import { ChapterDocument } from "@/models/chapter";

type Props = {
  chapter: ChapterDocument;
};

const EditChapterForm = ({ chapter }: Props) => {
  const { formAction, formMessage, formState, infoMessage, setInfoMessage } =
    useFormAction(editChapter);

  const fields = [
    {
      id: "chapterAddress1",
      label: "Address 1",
      placeholder: "123 Main Street",
      type: "text",
      defaultValue: chapter.chapterAddress1,
    },
    {
      id: "chapterAddress2",
      label: "Address 2",
      placeholder: "Apt. 123",
      type: "text",
      defaultValue: chapter.chapterAddress2,
    },
    {
      id: "chapterCity",
      label: "City",
      placeholder: "New York",
      type: "text",
      defaultValue: chapter.chapterCity,
    },
    {
      id: "chapterZipCode",
      label: "Zip Code",
      placeholder: "10001",
      type: "text",
      defaultValue: chapter.chapterZipCode,
    },
    {
      id: "chapterEmail",
      label: "Email",
      placeholder: "wvV9K@example.com",
      type: "email",
      defaultValue: chapter.chapterEmail,
    },
    {
      id: "chapterChartDate",
      label: "Charter Date",
      type: "date",
      placeholder: "MM/DD/YYYY",
      defaultValue: chapter.chapterChartDate
        ? new Date(chapter.chapterChartDate)?.toISOString().split("T")[0]
        : "",
    },
    {
      id: "chapterMeet1",
      label: "Meeting 1",
      type: "text",
      placeholder: "Meeting 1",
      defaultValue: chapter.chapterMeet1,
    },
    {
      id: "chapterMeet2",
      label: "Meeting 2",
      type: "text",
      placeholder: "Meeting 2",
      defaultValue: chapter.chapterMeet2,
    },
    {
      id: "chpMonDues",
      label: "Monthly Dues",
      type: "number",
      placeholder: "0.00",
      defaultValue: chapter.chpMonDues,
    },
    {
      id: "chpYrDues",
      label: "Yearly Dues",
      type: "number",
      placeholder: "0.00",
      defaultValue: chapter.chpYrDues,
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
        <p className="text-red-500 text-xs font-medium">
          {typeof formState?.message === "object" || formState?.success
            ? ""
            : formState?.message.includes("Error") && formState?.message}
        </p>
        <Input
          type={"text"}
          name={"chapterId"}
          defaultValue={chapter._id?.toString()}
          className="sr-only w-min"
        />
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {fields.map(
            ({ id, label, placeholder, type, defaultValue }, indx) => (
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
                  defaultValue={defaultValue?.toString()}
                />
              </div>
            )
          )}
        </div>
        <div className="w-1/2 mx-auto">
          <SubmitButton>Update Chapter</SubmitButton>
        </div>
      </form>
    </>
  );
};

export default EditChapterForm;
