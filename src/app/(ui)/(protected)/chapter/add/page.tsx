import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DistrictDocument } from "@/models/district";
import { getAllDistricts, getAllStates } from "@/utils/functions";
import Link from "next/link";
import AddChapterForm from "./components/AddChapterForm";

const AddChapter = async () => {
  const [states, districts] = await Promise.all([
    getAllStates(),
    getAllDistricts(),
  ]);

  if (!states.data || !districts.data) {
    <section className="flex flex-col gap-6 p-4 w-full">
      <Card>
        <CardHeader className="flex items-center justify-between w-full flex-row">
          <h3 className="text-xl font-semibold text-slate-600">Add Chapter</h3>
          <Link href="/district">
            <Button
              variant={"destructive"}
              className="bg-button-primary hover:bg-button-primary"
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
          <h3 className="text-xl font-semibold text-slate-600">Add Chapter</h3>
          <Link href="/district">
            <Button
              variant={"destructive"}
              className="bg-button-primary hover:bg-button-primary"
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
