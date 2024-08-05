"use client";

import { NavLink as NavLinkType, Roles } from "@/types/globals";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { ArrowRightCircle, HomeIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import NavLink from "./NavLink";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const MobileSidebar = ({ navLinks }: { navLinks: NavLinkType[] }) => {
  const [open, setOpen] = useState(false);
  const role = useUser().user?.publicMetadata?.role as Roles | undefined;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="flex md:hidden">
        <ArrowRightCircle className="w-6 h-6 fixed -left-2 top-1/2" />
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="!rounded-l-none rounded-r-xl sm:w-1/2 w-full overflow-y-auto no-scrollbar"
      >
        <SheetHeader>
          <SheetTitle className="sr-only">Sidebar.</SheetTitle>
          <SheetDescription className="sr-only">
            A dialog containing Sidebar.{" "}
          </SheetDescription>
        </SheetHeader>
        <aside className="w-[90%] mx-auto px-4 py-10 space-y-4">
          <div className="flex items-center justify-center">
            <Image
              src="/Logo-removebg-preview.png"
              width={100}
              height={100}
              quality={100}
              alt="logo"
              className="object-cover"
            />
          </div>
          <nav className="flex flex-col gap-4">
            <NavLink
              title="Dashboard"
              href="/dashboard"
              className="justify-start"
              Icon={<HomeIcon />}
            />
            {navLinks.map(({ heading, links, roles }) =>
              roles && roles.includes(role!) ? (
                <div className="space-y-4" key={heading}>
                  <h4 className="text-sm font-semibold text-slate-600">
                    {heading}
                  </h4>
                  {links.map(({ Icon, href, title, roles }, indx) =>
                    /**
                     * Checking if there no roles on the link, then we render all links
                     * otherwise, we only render the link if the user has the authorized role
                     */
                    !roles || (roles && roles.includes(role!)) ? (
                      <NavLink
                        key={indx}
                        title={title}
                        href={href}
                        className="justify-start"
                        Icon={Icon}
                        onClick={() => setOpen(false)}
                      />
                    ) : null
                  )}
                </div>
              ) : null
            )}
          </nav>
          {/*@ts-ignore */}
          <SignOutButton className="w-full flex items-center justify-center text-white bg-pink-600 font-medium text-sm rounded-lg py-3"
            redirectUrl="/sign-in"
          >
            Logout
          </SignOutButton>
        </aside>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
