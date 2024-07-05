import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import AddMemberForm from "./components/AddMemberForm";

const AddMember = () => {
  if (!checkRole("secretary")) {
    redirect("/");
  }
  return (
    <section className="flex flex-col gap-6 p-4 w-full">
      <Card>
        <CardHeader className="flex items-center justify-between w-full flex-row">
          <h3 className="text-xl font-semibold text-slate-600">Add Member</h3>
          <Link href="/chapter/members">
            <Button
              variant={"destructive"}
              className="bg-purple-800 hover:bg-purple-700"
            >
              Back
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <AddMemberForm />
        </CardContent>
      </Card>
    </section>
  );
};

export default AddMember;
