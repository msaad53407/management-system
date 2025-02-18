"use client";

import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCheckRole } from "@/hooks/useCheckRole";
import { ChapterDocument } from "@/models/chapter";
import { DistrictDocument } from "@/models/district";
import { cn } from "@/utils";
import { months } from "@/utils/constants";
import { LucideListFilter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  chapters: ChapterDocument[] | null;
  districts: DistrictDocument[] | null;
  className?: string;
};

const FilterDropdown = ({ chapters, districts, className }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const checkRoleClient = useCheckRole();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const districtOrChapterId = formData.get("districtOrChapterId");
    const month = formData.get("month");

    if (!districtOrChapterId && !month) {
      setError("Please select a District or Chapter or a Month to filter");
      return;
    }

    if (districtOrChapterId) {
      if (districtOrChapterId.toString().startsWith("c")) {
        router.replace(
          `${pathname}?filter=chapter&chapterId=${districtOrChapterId.slice(
            1
          )}`,
          {
            scroll: true,
          }
        );
      } else if (districtOrChapterId.toString().startsWith("d")) {
        router.replace(
          `${pathname}?filter=district&districtId=${districtOrChapterId.slice(
            1
          )}`,
          {
            scroll: true,
          }
        );
      }
    } else if (month) {
      router.replace(`${pathname}?filter=month&month=${month}`, {
        scroll: true,
      });
    }
  };

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");
    setOpen(false);
    setFilterValue("");
    router.replace(pathname, { scroll: true });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <span className="sr-only">Filter</span>
        <LucideListFilter className={cn("size-6 text-slate-600", className)} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-4">
        <p className="text-red-600 text-sm font-normal">{error}</p>
        <form
          className="flex flex-col gap-2 items-center justify-center"
          onSubmit={submitHandler}
        >
          {checkRoleClient(["grand-administrator", "grand-officer"]) && (
            <div>
              <Label htmlFor="districtOrChapterId">
                Select Chapter or District
              </Label>
              <Select
                name="districtOrChapterId"
                defaultValue={
                  searchParams.get("filter") === "chapter"
                    ? "c" + searchParams.get("chapterId")
                    : "d" + searchParams.get("districtId")
                }
                onValueChange={(e) => setFilterValue(e)}
                disabled={
                  !filterValue
                    ? false
                    : !filterValue.startsWith("c") &&
                      !filterValue.startsWith("d")
                }
                required
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a district or chapter" />
                </SelectTrigger>
                <SelectContent className="h-[250px] overflow-y-scroll">
                  <SelectGroup>
                    <SelectLabel>Districts</SelectLabel>
                    {districts &&
                      districts.map(({ id, name, _id }) => (
                        <SelectItem key={id} value={`d${_id.toString()}`}>
                          {name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Chapters</SelectLabel>
                    {chapters &&
                      chapters.map(({ id, name, _id }) => (
                        <SelectItem key={id} value={`c${_id.toString()}`}>
                          {name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="month">Months</Label>
            <Select
              name="month"
              defaultValue={
                searchParams.get("month") ||
                (new Date().getMonth() + 1).toString()
              }
              onValueChange={(e) => setFilterValue(e)}
              disabled={
                filterValue.startsWith("c") || filterValue.startsWith("d")
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

export default FilterDropdown;
