"use client";

import { cn } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
  href: string;
  title: string;
  Icon: React.ReactNode;
  className?: string;
}

function NavLink({ href, title, Icon, className }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "w-full flex p-2 items-center justify-center gap-3 rounded-lg",
        isActive && "shadow-sm shadow-slate-400",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center p-1 shadow-md shadow-slate-400 rounded-lg text-slate-600",
          isActive && "shadow-none bg-pink-600 text-white"
        )}
      >
        {Icon}
      </div>
      <p className="text-sm font-medium text-slate-700">{title}</p>
    </Link>
  );
}

export default NavLink;
