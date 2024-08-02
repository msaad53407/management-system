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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils";
import { LucideListFilter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  className?: string;
};

const ContentFilter = ({ className }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const filter = formData.get("filter");

    if (!filter) {
      setError("Please select a filter");
      return;
    }
    const query = searchParams.get("q");
    router.replace(
      `${pathname}?filter=${filter}&${query ? `q=${query}` : ""}`,
      {
        scroll: true,
      }
    );
  };

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");
    setOpen(false);
    const query = searchParams.get("q");
    router.replace(`${pathname}${query ? `?q=${query}` : ""}`, {
      scroll: true,
    });
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
            <Label htmlFor="filter">Filters</Label>
            <Select
              name="filter"
              defaultValue={searchParams.get("filter") || ""}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a filter" />
              </SelectTrigger>
              <SelectContent className="h-auto overflow-y-scroll">
                <SelectItem value="chapter">Chapter</SelectItem>
                <SelectItem value="district">District</SelectItem>
                <SelectItem value="member">Member</SelectItem>
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

export default ContentFilter;
