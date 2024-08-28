"use client";

import { Book, MoreHorizontal, Settings } from "lucide-react";
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
import { ChapterDocument } from "@/models/chapter";
import { DistrictDocument } from "@/models/district";
import { toast } from "./ui/use-toast";
import { checkRole } from "@/lib/role";

type Props =
  | {
      type: "member";
      members: MemberDocument[];
      ranks: RankDocument[];
      statuses: StatusDocument[];
    }
  | {
      type: "chapter";
      chapters: ChapterDocument[];
    }
  | {
      type: "district";
      districts: DistrictDocument[];
    };

type ActionsType =
  | {
      member: MemberDocument;
      chapter?: never;
      district?: never;
    }
  | {
      member?: never;
      chapter: ChapterDocument;
      district?: never;
    }
  | {
      member?: never;
      chapter?: never;
      district: DistrictDocument;
    };

export default function DetailsTable(props: Props) {
  const [open, setOpen] = useState(false);

  const removeMemberHandler = async (memberId: string) => {
    const { data, message } = await removeMember(memberId);
    setOpen(false);
    toast({
      title: !data ? "Error" : "Success",
      description: message,
      duration: 3000,
      variant: !data ? "destructive" : "default",
    });
  };
  const { user } = useUser();
  const checkRoleClient = useCheckRole();

  const allowedActions = ({ chapter, member, district }: ActionsType) => {
    if (member) {
      if (
        (checkRoleClient("member") && user?.id === member.userId) ||
        checkRoleClient(["secretary", "grand-administrator"])
      ) {
        return true;
      }
      return false;
    }

    if (chapter) {
      if (
        (checkRoleClient("secretary") && user?.id === chapter.secretaryId) ||
        checkRoleClient("grand-administrator")
      ) {
        return true;
      }
      return false;
    }

    if (district) {
      if (
        (checkRoleClient("district-deputy") &&
          user?.id === district.deputyId) ||
        checkRoleClient("grand-administrator")
      ) {
        return true;
      }
      return false;
    }
  };
  if (props.type === "member") {
    const { members, ranks, statuses } = props;
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
                      height={40}
                      width={40}
                      quality={100}
                      src={member.photo!}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-slate-600">
                    <p>
                      {member?.firstName}{" "}
                      {member?.middleName && member.middleName}{" "}
                      {member?.lastName}
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
                  {allowedActions({ member }) ? (
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
                      {checkRoleClient([
                        "secretary",
                        "grand-administrator",
                      ]) && (
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
                    {allowedActions({ member }) ? (
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
  if (props.type === "chapter") {
    const { chapters } = props;
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-600 text-lg">
            Total Chapters: {chapters.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chapters
                .sort(
                  (a, b) => (a?.chapterNumber || 0) - (b?.chapterNumber || 0)
                )
                .map((chapter, indx) => (
                  <TableRow key={indx}>
                    <TableCell className="font-medium text-slate-600">
                      <p>{chapter.chapterNumber}</p>
                    </TableCell>
                    <TableCell className="font-medium text-slate-600">
                      <Link href={`/chapter/${chapter._id}/members`}>
                        <p>{chapter.name}</p>
                        <p className="text-slate-400">{chapter.chapterEmail}</p>
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium text-slate-600">
                      {chapter.chapterCity}
                    </TableCell>
                    {allowedActions({ chapter }) ? (
                      <>
                        {" "}
                        {!checkRoleClient("member") && (
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex gap-5">
                              {checkRoleClient([
                                "secretary",
                                "grand-administrator",
                              ]) && (
                                <Link href={`/chapter/${chapter._id}/settings`}>
                                  <Settings className="size-6 text-slate-600" />
                                </Link>
                              )}
                              <Link href={`/ledger/chapter/${chapter._id}`}>
                                <Book className="size-6 text-slate-600" />
                              </Link>
                            </div>
                          </TableCell>
                        )}
                      </>
                    ) : null}
                    <TableCell className="table-cell lg:hidden">
                      {allowedActions({ chapter }) ? (
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
                            {checkRoleClient([
                              "secretary",
                              "grand-administrator",
                            ]) && (
                              <TableCell className="hidden lg:table-cell">
                                <Link href={`/chapter/${chapter._id}/settings`}>
                                  <Settings className="size-6 text-slate-600" />
                                </Link>
                              </TableCell>
                            )}
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
  const { districts } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-slate-600 text-lg">
          Total Districts: {districts.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Name</TableHead>
              {/* <TableHead>City</TableHead> */}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {districts.map((district, indx) => (
              <TableRow key={indx}>
                <TableCell className="font-medium text-slate-600">
                  <p>{district.name?.split(" ").at(1)}</p>
                </TableCell>
                <TableCell className="font-medium text-slate-600">
                  <Link href={`/district/${district._id}/chapters`}>
                    <p>{district.name}</p>
                  </Link>
                </TableCell>

                {allowedActions({ district }) ? (
                  <>
                    {" "}
                    {checkRoleClient([
                      "district-deputy",
                      "grand-administrator",
                    ]) && (
                      <TableCell>
                        <Link href={`/district/${district._id}/settings`}>
                          <Settings className="size-6 text-slate-600" />
                        </Link>
                      </TableCell>
                    )}
                  </>
                ) : null}
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
