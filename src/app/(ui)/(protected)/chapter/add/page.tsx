import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import AddChapterForm from "./components/AddChapterForm";
import { getAllDistricts, getAllStates } from "@/utils/functions";
import { DistrictDocument } from "@/models/district";

const AddChapter = async () => {
  const [states, districts] = await Promise.all([
    getAllStates(),
    getAllDistricts(),
  ]);

  if (!states.data || !districts.data) {
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
            {!states.data && states.message}
            {!districts.data && districts.message}
          </p>
        </CardContent>
      </Card>
    </section>;
  }

  const dropdownOptions = {
    states: states.data,
    districts: JSON.parse(JSON.stringify(districts.data)) as DistrictDocument[],
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
