"use client";

import { capitalize } from "@/utils";
import { UserButton } from "@clerk/nextjs";
import { BellIcon, Menu, SearchIcon } from "lucide-react";
import { Types } from "mongoose";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import NotificationDropdown from "./NotificationDropdown";
import { addNotification } from "@/actions/notification";

const Header = () => {
  const pathname = usePathname();
  const [isObjectId, setIsObjectId] = useState(false);
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") || "");
  const router = useRouter();
  const pathLength = pathname.split("/").filter((path) => path).length;

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (search) {
      const searchEntriesArray = Array.from(searchParams.entries()); // shape: [["q", "test"], ["filter", "test"]]
      /** 
       * Remove query params from searchParams If it exists, because Updated one will be added.
       */
      const entriesWithoutQueryParam = searchEntriesArray
        .filter((entry) => entry[0] !== "q")
        .map((entry) => `${entry[0]}=${entry[1]}`)
        .join("&");
      router.push(
        `/search?q=${search}${
          entriesWithoutQueryParam ? `&${entriesWithoutQueryParam}` : ""
        }`
      );
    }
  };

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

  useEffect(() => {
    setSearch(searchParams.get("q") || "");
  }, [searchParams]);

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
    <>
      <Sheet>
        <SheetTrigger className="flex w-full lg:hidden items-center justify-between">
          <header className="flex w-full items-center justify-between h-fit p-4 border-b shrink-0">
            <nav className="flex-col flex  text-sm w-fit px-3">
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
            <Menu className="w-6 h-6" />
          </header>
        </SheetTrigger>
        <SheetContent className="w-full pt-10 rounded-xl">
          <div className="flex flex-col items-center w-full gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative flex items-center">
                <Button
                  type="submit"
                  className="bg-transparent hover:bg-transparent rounded-full"
                  variant={"secondary"}
                  size={"icon"}
                >
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </Button>
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </form>
            <UserButton />
            <Button
              className="bg-transparent text-slate-600 hover:bg-transparent p-1 rounded-md"
              size="icon"
            >
              <BellIcon />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <header className="hidden lg:flex w-full items-center justify-between h-fit p-4 border-b shrink-0">
        <nav className="flex-col flex  text-sm w-fit px-3">
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
        <div className="flex items-center w-full gap-4">
          <form
            onSubmit={handleSearch}
            className="flex-1 ml-auto sm:flex-initial"
          >
            <div className="relative flex items-center">
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                type="submit"
                className="bg-transparent hover:bg-transparent rounded-full"
                variant={"secondary"}
                size={"icon"}
              >
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </form>
          <UserButton />
          <Button
            className="bg-transparent hover:bg-transparent rounded-full"
            variant={"ghost"}
            size={"default"}
            onClick={async () =>
              await addNotification(
                "user_2kv7s7sAgFLl7yImOqeeGeWfizW",
                "Hey! this is a Test Notification. Check it out."
              )
            }
          >
            Send Notification
          </Button>
          <NotificationDropdown />
        </div>
      </header>
    </>
  );
};

export default Header;
