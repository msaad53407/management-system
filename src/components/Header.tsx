"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { BellIcon, SearchIcon, SettingsIcon, UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { capitalize } from "@/utils";
import { Types } from "mongoose";
import { UserButton } from "@clerk/nextjs";

const Header = () => {
  const pathname = usePathname();
  const [isObjectId, setIsObjectId] = useState(false);
  const pathLength = pathname.split("/").filter((path) => path).length;

  useEffect(() => {
    try {
      const lastPath = pathname.split("/").at(-1);
      const objectId = new Types.ObjectId(lastPath);
      if (Types.ObjectId.isValid(objectId)) {
        setIsObjectId(true);
      } else {
        setIsObjectId(false);
      }
    } catch (error) {
      setIsObjectId(false);
    }
  }, [pathname]);

  /**
   * Generating Path from the pathname
   * 1. If pathname contains less than 2 paths, it is rendered as it is.
   * 2. Otherwise, we only render last 2 paths.
   * 3. If last path has an id, we render second last path.
   */

  const path =
    pathLength < 3
      ? pathname
          .split("/")
          .map((path) => capitalize(path))
          .join("/")
      : `/.../${
          isObjectId ? pathname.split("/").at(-2) : pathname.split("/").at(-1)
        }`;

  return (
    <header className="flex items-center h-fit p-4 border-b shrink-0">
      <nav className="flex-col flex text-sm w-full px-3">
        <div className="font-medium text-sm flex w-full items-center">
          <span className="font-light text-slate-600">{"Pages "}</span>
          <span className="flex items-center text-slate-600">
            {/**
             * Adding space in between the paths
             * eg. Home / Sample
             */}
            {path}
          </span>
        </div>
        <p className="font-bold text-sm text-slate-600">
          {capitalize(path.split("/").pop())}
        </p>
      </nav>
      <div className="flex items-center w-full gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="flex-1 ml-auto sm:flex-initial">
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <Button
          variant="outline"
          className="hover:bg-pink-700 hover:text-white rounded-md border-2 font-medium border-pink-700 text-pink-700"
        >
          Sample
        </Button>
        <Button
          className="bg-transparent text-slate-600 hover:bg-transparent p-1 rounded-md"
          size="icon"
        >
          <UserIcon />
        </Button>
        <UserButton />
        <Button
          className="bg-transparent text-slate-600 hover:bg-transparent p-1 rounded-md"
          size="icon"
        >
          <BellIcon />
        </Button>
      </div>
    </header>
  );
};

export default Header;
