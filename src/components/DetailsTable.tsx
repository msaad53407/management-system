"use client";

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { MemberDocument } from "@/models/member";
import { removeMember } from "@/actions/chapter";
import { useUser } from "@clerk/nextjs";
import { capitalize } from "@/utils";
import RemoveMemberButton from "./RemoveMemberButton";
import { RankDocument } from "@/models/rank";
import { StatusDocument } from "@/models/status";
import { Roles } from "@/types/globals";

type Props = {
  members: MemberDocument[];
  ranks: RankDocument[];
  statuses: StatusDocument[];
};

export default function DetailsTable({ members, ranks, statuses }: Props) {
  //TODO Convert it into a server component and replace the event handler with a form and replace useUser hook with server side user fetching capability
  const removeMemberHandler = async (memberId: string) => {
    const { message } = await removeMember(memberId);
    alert(message);
  };

  const { user } = useUser();
  const userRole = user?.publicMetadata?.role as Roles | null;

  const allowedActions = (member: MemberDocument) => {
    if (
      (userRole === "member" && user?.id === member.userId) ||
      userRole === "secretary" ||
      userRole === "grand-administrator"
    ) {
      return true;
    }
    return false;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-slate-600 text-lg">
          Total Active Members: {members.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Rank</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead colSpan={3} className="text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member, indx) => (
              <TableRow key={indx}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={`${member?.firstName}'s profile picture`}
                    className="size-full rounded-full object-cover"
                    height={20}
                    width={20}
                    src={member.photo!}
                  />
                </TableCell>
                <TableCell className="font-medium text-slate-600">
                  {member?.firstName} {member?.middleName} {member?.lastName}
                </TableCell>
                <TableCell className="font-medium text-slate-600">
                  {capitalize(
                    ranks.find((rank) => rank._id === member.rank)?.name
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-lime-400 text-white px-3 py-2 rounded-xl"
                  >
                    {capitalize(
                      statuses.find((status) => status._id === member.status)
                        ?.name
                    )}
                  </Badge>
                </TableCell>
                {allowedActions(member) ? (
                  <>
                    {" "}
                    <TableCell className="hidden lg:table-cell">
                      <Link href={`/chapter/member/${member.userId}/edit`}>
                        <Button className="w-full bg-lime-400 hover:bg-lime-300 text-white">
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Button
                        variant="destructive"
                        className="w-full bg-blue-400 hover:bg-blue-300 text-white"
                      >
                        Dues
                      </Button>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <RemoveMemberButton
                        memberId={member.userId}
                        removeMemberHandler={removeMemberHandler}
                      >
                        {userRole === "member" ? "Leave" : "Remove"}
                      </RemoveMemberButton>
                    </TableCell>
                  </>
                ) : null}
                <TableCell className="table-cell lg:hidden">
                  {allowedActions(member) ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="flex justify-center">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem className="justify-center">
                          <Link href={`/chapter/member/${member.userId}/edit`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="justify-center">
                          Dues
                        </DropdownMenuItem>
                        <RemoveMemberButton
                          memberId={member.userId}
                          removeMemberHandler={removeMemberHandler}
                          className="p-1 !h-fit"
                        >
                          {userRole === "member" ? "Leave" : "Remove"}
                        </RemoveMemberButton>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
