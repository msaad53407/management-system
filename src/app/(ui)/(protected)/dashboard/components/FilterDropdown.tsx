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
import { ChapterDocument } from "@/models/chapter";
import { DistrictDocument } from "@/models/district";
import { cn } from "@/utils";
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
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const districtOrChapterId = formData.get("districtOrChapterId");
    console.log(districtOrChapterId);
    if (!districtOrChapterId) {
      setError("Please select a district or chapter");
      return;
    }

    if (districtOrChapterId.toString().startsWith("c")) {
      router.replace(
        `${pathname}?filter=chapter&chapterId=${districtOrChapterId.slice(1)}`,
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
        <LucideListFilter className={cn("size-6 text-slate-600", className)} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-4">
        <p className="text-red-600 text-sm font-normal">{error}</p>
        <form
          className="flex flex-col gap-2 items-center justify-center"
          onSubmit={submitHandler}
        >
          <div>
            <Label htmlFor="districtOrChapterId">Select</Label>
            <Select
              name="districtOrChapterId"
              defaultValue={
                searchParams.get("filter") === "chapter"
                  ? "c" + searchParams.get("chapterId")
                  : "d" + searchParams.get("districtId")
              }
              required
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a month" />
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

          <div className="w-full grid grid-cols-2 gap-2 items-center">
            <SubmitButton className="w-full">Apply Filter</SubmitButton>
            <Button
              onClick={handleReset}
              className="bg-purple-800 hover:bg-purple-700"
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
