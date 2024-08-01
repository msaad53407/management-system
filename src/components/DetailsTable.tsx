"use client";

import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

import { removeMember } from "@/actions/chapter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useCheckRole } from "@/hooks/useCheckRole";
import { MemberDocument } from "@/models/member";
import { RankDocument } from "@/models/rank";
import { StatusDocument } from "@/models/status";
import { capitalize } from "@/utils";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import RemoveMemberButton from "./RemoveMemberButton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

type Props = {
  members: MemberDocument[];
  ranks: RankDocument[];
  statuses: StatusDocument[];
};

export default function DetailsTable({ members, ranks, statuses }: Props) {
  const [open, setOpen] = useState(false);
  const removeMemberHandler = async (memberId: string) => {
    const { message } = await removeMember(memberId);
    setOpen(false);
    alert(message);
  };

  const { user } = useUser();
  const checkRoleClient = useCheckRole();

  const allowedActions = (member: MemberDocument) => {
    if (
      (checkRoleClient("member") && user?.id === member.userId) ||
      checkRoleClient(["secretary", "grand-administrator"])
    ) {
      return true;
    }
    return false;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-slate-600 text-lg">
          Total Active Members on Rolls: {members.length}
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
                  <p>
                    {member?.firstName}{" "}
                    {member?.middleName && member.middleName} {member?.lastName}
                  </p>
                  <p className="text-slate-400">{member?.email}</p>
                  <p className="text-slate-400 line-clamp-1">
                    Member ID: {member._id.toString()}
                  </p>
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
                      <Link
                        href={`/chapter/member/${member.userId}/edit?chapterId=${member.chapterId}`}
                      >
                        <Button className="w-full bg-lime-400 hover:bg-lime-300 text-white">
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                    {checkRoleClient(["secretary", "grand-administrator"]) && (
                      <TableCell className="hidden lg:table-cell">
                        <Link href={`/member/${member._id}/dues`}>
                          <Button
                            variant="destructive"
                            className="w-full bg-blue-400 hover:bg-blue-300 text-white"
                          >
                            Dues
                          </Button>
                        </Link>
                      </TableCell>
                    )}
                    {checkRoleClient("grand-administrator") ? (
                      <TableCell className="hidden lg:table-cell">
                        <MemberRemoveAlert
                          open={open}
                          setOpen={setOpen}
                          member={member}
                          removeMemberHandler={removeMemberHandler}
                        />
                      </TableCell>
                    ) : null}
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
                          <Link
                            href={`/chapter/member/${member.userId}/edit?chapterId=${member.chapterId}`}
                          >
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        {checkRoleClient([
                          "secretary",
                          "grand-administrator",
                        ]) && (
                          <DropdownMenuItem className="justify-center">
                            <Link href={`/member/${member._id}/dues`}>
                              Dues
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {checkRoleClient("grand-administrator") ? (
                          <MemberRemoveAlert
                            open={open}
                            setOpen={setOpen}
                            member={member}
                            removeMemberHandler={removeMemberHandler}
                          />
                        ) : null}
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

const MemberRemoveAlert = ({
  member,
  removeMemberHandler,
  open,
  setOpen,
}: {
  member: MemberDocument;
  removeMemberHandler: (memberId: string) => Promise<void>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className={"w-full"}>
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will <strong>permanently</strong>{" "}
            remove this Member from this Chapter and also{" "}
            <strong>remove all user data</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <RemoveMemberButton
            memberId={member.userId}
            removeMemberHandler={removeMemberHandler}
            className="w-fit"
          >
            Remove
          </RemoveMemberButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
