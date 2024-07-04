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

type Props = {
  members: MemberDocument[];
};

export default function DetailsTable({ members }: Props) {
  const removeMemberHandler = async (memberId: string) => {
    const { message } = await removeMember(memberId);
    alert(message);
  };

  const { user } = useUser();

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
              <TableHead>Role</TableHead>
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
                  {member?.firstName} {member?.lastName}
                </TableCell>
                <TableCell className="font-medium text-slate-600">
                  {capitalize(member?.role)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-lime-400 text-white px-3 py-2 rounded-xl"
                  >
                    Draft
                  </Badge>
                </TableCell>
                {(user?.publicMetadata?.role === "member" &&
                  user?.id === member.userId) ||
                user?.publicMetadata?.role === "secretary" ? (
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
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={async () =>
                          removeMemberHandler(member.userId)
                        }
                      >
                        {user.publicMetadata?.role === "member"
                          ? "Leave"
                          : "Remove"}
                      </Button>
                    </TableCell>
                  </>
                ) : null}
                <TableCell className="table-cell lg:hidden">
                  {(user?.publicMetadata?.role === "member" &&
                    user?.id === member.userId) ||
                  user?.publicMetadata?.role === "secretary" ? (
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link href={`/chapter/member/${member.userId}/edit`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Dues</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={async () =>
                            removeMemberHandler(member.userId)
                          }
                          className="bg-red-500 text-white"
                        >
                          {user.publicMetadata?.role === "member"
                            ? "Leave"
                            : "Remove"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  );
}
