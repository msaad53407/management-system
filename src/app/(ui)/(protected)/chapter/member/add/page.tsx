import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import AddMemberForm from "./components/AddMemberForm";
import { State, StateDocument } from "@/models/state";
import { Status, StatusDocument } from "@/models/status";

const AddMember = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  if (!checkRole(["secretary", "grand-administrator"])) {
    redirect("/");
  }

  let states: StateDocument[];
  let statuses: StatusDocument[];
  try {
    states = JSON.parse(JSON.stringify(await State.find({})));
    statuses = JSON.parse(JSON.stringify(await Status.find({})));
  } catch (error) {
    console.error(error);
    return (
      <section className="flex flex-col gap-6 p-4 w-full">
        <Card>
          <CardHeader className="flex items-center justify-between w-full flex-row">
            <h3 className="text-xl font-semibold text-slate-600">Add Member</h3>
            <Link
              href={
                searchParams?.chapterId
                  ? `/chapter/${searchParams.chapterId}/members`
                  : "/chapter/members"
              }
            >
              <Button
                variant={"destructive"}
                className="bg-purple-800 hover:bg-purple-700"
              >
                Back
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">Something went wrong</p>
          </CardContent>
        </Card>
      </section>
    );
  }
  const dropdownOptions = {
    state: states,
    memberStatus: statuses,
  };

  return (
    <section className="flex flex-col gap-6 p-4 w-full">
      <Card>
        <CardHeader className="flex items-center justify-between w-full flex-row">
          <h3 className="text-xl font-semibold text-slate-600">Add Member</h3>
          <Link
            href={
              searchParams?.chapterId
                ? `/chapter/${searchParams.chapterId}/members`
                : "/chapter/members"
            }
          >
            <Button
              variant={"destructive"}
              className="bg-purple-800 hover:bg-purple-700"
            >
              Back
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <AddMemberForm dropdownOptions={dropdownOptions} chapterId={searchParams?.chapterId}/>
        </CardContent>
      </Card>
    </section>
  );
};

export default AddMember;
