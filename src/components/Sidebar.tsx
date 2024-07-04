import React from "react";
import NavLink from "./NavLink";
import {
  Banknote,
  Download,
  HomeIcon,
  MessageSquareIcon,
  Settings,
  StickyNote,
  UsersRound,
} from "lucide-react";
import { NavLink as NavLinkType } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { capitalize } from "@/utils";

const navLinks: NavLinkType[] = [
  {
    heading: "ROSTER",
    links: [
      {
        title: "Members Roster",
        href: "/chapter/members",
        Icon: <UsersRound />,
      },
    ],
    roles: ["secretary", "member"],
  },
  {
    heading: "FINANCES",
    links: [
      {
        title: "Finances",
        href: "/finances",
        Icon: <Banknote />,
      },
    ],
    roles: ["secretary", "member"],
  },
  {
    heading: "DOCUMENTS",
    links: [
      {
        title: "Reports",
        href: "/reports",
        Icon: <StickyNote />,
      },
      {
        title: "Forms",
        href: "/forms",
        Icon: <Download />,
      },
    ],
    roles: ["secretary", "member"],
  },
  {
    heading: "CONTACT US",
    links: [
      {
        title: "Contact Us",
        href: "/contact-us",
        Icon: <MessageSquareIcon />,
      },
    ],
    roles: ["secretary", "member"],
  },
  {
    heading: "MANAGE CHAPTER",
    links: [
      {
        title: "Chapter Settings",
        href: "/chapter-settings",
        Icon: <Settings />,
      },
    ],
    roles: ["secretary"],
  },
];

function Sidebar() {
  const role = auth().sessionClaims?.metadata?.role;
  return (
    <aside className="w-72 px-4 py-10 space-y-4 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-center">
        <h2 className="text-xl font-bold">{capitalize(role!)} Database</h2>
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
              {links.map(({ Icon, href, title }, indx) => (
                <NavLink
                  key={indx}
                  title={title}
                  href={href}
                  className="justify-start"
                  Icon={Icon}
                />
              ))}
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
  );
}

export default Sidebar;
