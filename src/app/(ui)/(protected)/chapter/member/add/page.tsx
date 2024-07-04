import { addMember } from "@/actions/chapter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkRole } from "@/lib/role";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const introductoryFields = [
  {
    label: "User Id",
    id: "userId",
  },
  {
    label: "Greeting",
    id: "greeting",
  },
  {
    label: "First Name",
    id: "firstName",
  },
  {
    label: "Last Name",
    id: "lastName",
  },
];

const detailsFields = [
  {
    label: "Email Address",
    id: "email",
    type: "email",
  },
  {
    label: "Phone Number",
    id: "phoneNumber",
    type: "tel",
  },
  {
    label: "Address",
    id: "address",
    type: "text",
  },
  {
    label: "City",
    id: "city",
    type: "text",
  },
  {
    label: "State",
    id: "state",
    type: "state",
  },
  {
    label: "Zip Code",
    id: "zipCode",
    type: "string",
  },
  {
    label: "Petitioner 1",
    id: "petitioner1",
    type: "text",
  },
  {
    label: "Petitioner 2",
    id: "petitioner2",
    type: "text",
  },
  {
    label: "Petitioner 3",
    id: "petitioner3",
    type: "text",
  },
  {
    label: "Member Status",
    id: "memberStatus",
    type: "text",
  },
];

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
          <form className="grid grid-cols-1 gap-4 w-full" action={addMember}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {introductoryFields.map(({ id, label }, indx) => (
                <div className="w-full flex flex-col gap-1" key={indx}>
                  <Label htmlFor={id} className="text-slate-600">
                    {label}
                  </Label>
                  <Input id={id} type="text" name={id} />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detailsFields.map(({ id, label, type }, indx) => (
                <div className="w-full flex flex-col gap-1" key={indx}>
                  <Label htmlFor={id} className="text-slate-600">
                    {label}
                  </Label>
                  <Input id={id} type={type} name={id} />
                </div>
              ))}
            </div>
            <Button
              type="submit"
              className="w-1/2 mx-auto bg-purple-800 hover:bg-purple-700 text-white"
            >
              Add Member
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default AddMember;
