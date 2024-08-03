"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import SubmitButton from "./SubmitButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LucideListFilter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { dateFormSchema } from "@/lib/zod/member";
import { Button } from "./ui/button";
import { months, years } from "@/utils/constants";

type Props = {
  disableYear?: boolean;
};

const DateForm = ({ disableYear }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { success, data, error } = dateFormSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (!success) {
      setError(error.message);
      return;
    }
    setOpen(false);
    router.replace(
      `${pathname}?month=${data.month}${!disableYear && `&year=${data.year}`}`,
      {
        scroll: true,
      }
    );
  };

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");
    setOpen(false);
    router.replace(pathname, { scroll: true });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <span className="sr-only">Filter</span>
        <LucideListFilter className="size-6 text-slate-600" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-4">
        <p className="text-red-600 text-sm font-normal">{error}</p>
        <form
          className="flex flex-col gap-2 items-center justify-center"
          onSubmit={submitHandler}
        >
          <div>
            <Label htmlFor="month">Months</Label>
            <Select
              name="month"
              defaultValue={
                searchParams.get("month") ||
                (new Date().getMonth() + 1).toString()
              }
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent className="h-[250px] overflow-y-scroll">
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {!disableYear && (
            <div>
              <Label htmlFor="year">Years</Label>
              <Select
                name="year"
                defaultValue={
                  searchParams.get("year") ||
                  new Date().getFullYear().toString()
                }
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a year" />
                </SelectTrigger>
                <SelectContent className="h-[250px] overflow-y-scroll">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="w-full grid grid-cols-2 gap-2 items-center">
            <SubmitButton className="w-full">Apply Filter</SubmitButton>
            <Button
              onClick={handleReset}
              className="bg-button-primary hover:bg-button-primary"
            >
              Reset
            </Button>
          </div>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DateForm;
