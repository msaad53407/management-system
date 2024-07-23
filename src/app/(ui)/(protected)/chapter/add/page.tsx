import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import AddChapterForm from "./components/AddChapterForm";
import { getAllStates } from "@/utils/functions";

const AddChapter = async () => {
  const { data: states, message } = await getAllStates();

  if (!states) {
    <section className="flex flex-col gap-6 p-4 w-full">
      <Card>
        <CardHeader className="flex items-center justify-between w-full flex-row">
          <h3 className="text-xl font-semibold text-slate-600">Add Member</h3>
          <Link href="/district">
            <Button
              variant={"destructive"}
              className="bg-purple-800 hover:bg-purple-700"
            >
              Back
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="w-full flex items-center justify-center">
          <p className="text-red-500 text-lg font-medium text-center">
            {message}
          </p>
        </CardContent>
      </Card>
    </section>;
  }

  const dropdownOptions = {
    states,
  };

  return (
    <section className="flex flex-col gap-6 p-4 w-full">
      <Card>
        <CardHeader className="flex items-center justify-between w-full flex-row">
          <h3 className="text-xl font-semibold text-slate-600">Add Member</h3>
          <Link href="/district">
            <Button
              variant={"destructive"}
              className="bg-purple-800 hover:bg-purple-700"
            >
              Back
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <AddChapterForm dropdownOptions={dropdownOptions} />
        </CardContent>
      </Card>
    </section>
  );
};

export default AddChapter;
