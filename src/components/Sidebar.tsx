import React from "react";
import NavLink from "./NavLink";
import {
  ArrowRightCircle,
  Banknote,
  Download,
  HomeIcon,
  Landmark,
  MessageSquareIcon,
  Settings,
  SidebarOpen,
  StickyNote,
  UsersRound,
} from "lucide-react";
import { NavLink as NavLinkType } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { capitalize, capitalizeSentence } from "@/utils";
import { getDistrict } from "@/actions/district";
import { DistrictDocument } from "@/models/district";
import { ChapterDocument } from "@/models/chapter";
import { getChapter } from "@/actions/chapter";
import { checkRole } from "@/lib/role";
import { MemberDocument } from "@/models/member";
import { getMemberByUserId } from "@/utils/functions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import MobileSidebar from "./MobileSidebar";

async function Sidebar() {
  const role = auth().sessionClaims?.metadata?.role;
  const { userId } = auth();
  let district: DistrictDocument | null = null;
  let chapter: ChapterDocument | null = null;
  let member: MemberDocument | null = null;
  if (checkRole("district-deputy")) {
    const { data } = await getDistrict({
      deputyId: userId!,
    });
    if (data) {
      district = data;
    }
  }

  if (checkRole("worthy-matron")) {
    const { data } = await getChapter({
      matronId: userId!,
    });
    if (data) {
      chapter = data;
    }
  }

  if (checkRole("secretary")) {
    const { data } = await getChapter({
      secretaryId: userId!,
    });
    if (data) {
      chapter = data;
    }
  }

  if (checkRole("member")) {
    const { data } = await getMemberByUserId(userId!);

    if (data) {
      member = data;
    }
  }

  const navLinks: NavLinkType[] = [
    {
      heading: "ROSTER",
      links: [
        {
          title: "Members Roster",
          href: `/chapter/members`,
          Icon: <UsersRound />,
          roles: ["member", "secretary", "worthy-matron"],
        },
        {
          title: "Chapter Roster",
          href: "/chapter",
          Icon: <UsersRound />,
          roles: ["district-deputy", "grand-officer", "grand-administrator"],
        },
        {
          title: "District Roster",
          href: "/district",
          Icon: <Landmark />,
          roles: ["grand-officer", "grand-administrator"],
        },
      ],
      roles: [
        "secretary",
        "member",
        "district-deputy",
        "worthy-matron",
        "grand-officer",
        "grand-administrator",
      ],
    },
    {
      heading: "FINANCES",
      links: [
        {
          title: "Finances",
          href: "/finances",
          Icon: <Banknote />,
          roles: ["grand-administrator", "grand-officer"],
        },
        {
          title: "Finances",
          href: `/finances/member/${member?._id}`,
          Icon: <Banknote />,
          roles: ["member"],
        },
        {
          title: "Finances",
          href: `/finances/chapter/${chapter?._id}`,
          Icon: <Banknote />,
          roles: ["secretary", "worthy-matron"],
        },
        {
          title: "Finances",
          href: `/finances/district/${district?._id}`,
          Icon: <Banknote />,
          roles: ["district-deputy"],
        },
      ],
      roles: [
        "secretary",
        "member",
        "district-deputy",
        "worthy-matron",
        "grand-officer",
        "grand-administrator",
      ],
    },
    {
      heading: "DOCUMENTS",
      links: [
        {
          title: "Reports",
          href: "/reports",
          Icon: <StickyNote />,
          roles: ["grand-officer", "grand-administrator"],
        },
        {
          title: "Reports",
          href: `/reports/chapter/${chapter?._id || member?.chapterId}`,
          Icon: <StickyNote />,
          roles: ["secretary", "worthy-matron", "member"],
        },
        {
          title: "Reports",
          href: `/reports/district/${district?._id}`,
          Icon: <StickyNote />,
          roles: ["district-deputy"],
        },
        {
          title: "Forms",
          href: "/forms",
          Icon: <Download />,
        },
      ],
      roles: [
        "secretary",
        "member",
        "district-deputy",
        "worthy-matron",
        "grand-officer",
        "grand-administrator",
      ],
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
      roles: [
        "secretary",
        "member",
        "district-deputy",
        "worthy-matron",
        "grand-officer",
        "grand-administrator",
      ],
    },
    {
      heading: "Manage",
      links: [
        {
          title: "Chapter Settings",
          href: `/chapter/${chapter?._id}/settings`,
          Icon: <Settings />,
          roles: ["secretary"],
        },
        {
          title: "District Settings",
          href: `/district/${district?._id}/settings`,
          Icon: <Settings />,
          roles: ["district-deputy"],
        },
      ],
      roles: ["secretary", "district-deputy"],
    },
  ];

  return (
    <>
      <aside className="w-72 px-4 py-10 space-y-4 overflow-y-auto no-scrollbar hidden md:block">
        <div className="flex items-center justify-center">
          <h2 className="text-xl font-bold text-center">
            {capitalizeSentence(role, "-")} Database
          </h2>
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
                    />
                  ) : null
                )}
              </div>
            ) : null
          )}
        </nav>
        {/*@ts-ignore */}
        <SignOutButton className="w-full flex items-center justify-center text-white bg-button-primary font-medium text-sm rounded-lg py-3"
          redirectUrl="/sign-in"
        >
          Logout
        </SignOutButton>
      </aside>
      <MobileSidebar navLinks={navLinks} />
    </>
  );
}

export default Sidebar;
