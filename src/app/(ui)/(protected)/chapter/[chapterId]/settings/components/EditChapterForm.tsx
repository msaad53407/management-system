"use client";

import { editChapter } from "@/actions/chapter";
import InfoMessageCard from "@/components/InfoMessageCard";
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
import useFormAction from "@/hooks/useFormAction";
import { ChapterDocument } from "@/models/chapter";
import { getDayLabelsForMonth } from "@/utils";

type Props = {
  chapter: ChapterDocument;
};

const EditChapterForm = ({ chapter }: Props) => {
  const { formAction, formMessage, infoMessage, setInfoMessage } =
    useFormAction(editChapter);

  const meetingDays = getDayLabelsForMonth(
    new Date().getFullYear(),
    new Date().getMonth() + 1
  );

  const fields = [
    {
      id: "chapterAddress1",
      label: "Address 1",
      placeholder: "123 Main Street",
      type: "text",
      defaultValue: chapter.chapterAddress1,
      required: true,
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
      required: true,
    },
    {
      id: "chapterZipCode",
      label: "Zip Code",
      placeholder: "10001",
      type: "text",
      defaultValue: chapter.chapterZipCode,
      required: true,
    },
    {
      id: "chapterEmail",
      label: "Email",
      placeholder: "wvV9K@example.com",
      type: "email",
      defaultValue: chapter.chapterEmail,
      required: true,
    },
    {
      id: "chapterChartDate",
      label: "Charter Date",
      type: "date",
      placeholder: "MM/DD/YYYY",
      defaultValue: chapter.chapterChartDate
        ? new Date(chapter.chapterChartDate)?.toISOString().split("T")[0]
        : "",
      required: true,
    },
    {
      id: "chapterMeet1",
      label: "Meeting 1",
      type: "select",
      placeholder: "Select Meeting Day 1",
      defaultValue: chapter.chapterMeet1,
      dropdownType: "meetings",
    },
    {
      id: "chapterMeet2",
      label: "Meeting 2",
      type: "select",
      placeholder: "Select Meeting Day 2",
      defaultValue: chapter.chapterMeet2,
      dropdownType: "meetings",
    },
    {
      id: "chpMonDues",
      label: "Monthly Dues",
      type: "number",
      placeholder: "0.00",
      defaultValue: chapter.chpMonDues,
      required: true,
    },
    {
      id: "chpYrDues",
      label: "Yearly Dues",
      type: "number",
      placeholder: "0.00",
      defaultValue: chapter.chpYrDues,
      required: true,
    },
    {
      id: "chapterTechnologyFees",
      label: "Technology Fees",
      type: "number",
      placeholder: "0.00",
      defaultValue: chapter.technologyFees,
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
        <Input
          type={"text"}
          name={"chapterId"}
          defaultValue={chapter._id?.toString()}
          className="sr-only w-min"
        />
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {fields.map(
            ({ id, label, placeholder, type, defaultValue, required }, indx) =>
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
                  <Select name={id} defaultValue={defaultValue?.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {meetingDays.map(({ label, value }, indx) => (
                        <SelectItem key={indx} value={value}>
                          {label}
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
