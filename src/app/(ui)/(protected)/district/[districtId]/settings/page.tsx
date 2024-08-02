import { getDistrict } from "@/actions/district";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { DistrictDocument } from "@/models/district";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import EditDistrictForm from "./components/EditDistrictForm";

type Props = {
  params: {
    districtId?: string;
  };
};

const DistrictSettingsPage = async ({ params: { districtId } }: Props) => {
  if (!districtId) notFound();

  if (!checkRole(["secretary", "grand-administrator"])) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-3xl font-bold">Unauthorized</h1>
      </main>
    );
  }
  let district: DistrictDocument | null = null;
  let errorMessage = "";
  if (checkRole("secretary")) {
    const { data, message } = await getDistrict({ deputyId: auth().userId! });
    district = data;
    errorMessage = message;
  } else {
    const { data, message } = await getDistrict({
      districtId,
    });
    district = data;
    errorMessage = message;
  }

  if (!district) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-3xl font-bold">{errorMessage}</h1>
      </main>
    );
  }

  return (
    <main>
      <section className="flex flex-col gap-6 p-4 w-full overflow-x-hidden">
        <Card>
          <CardHeader className="flex items-center justify-between w-full flex-row">
            <h3 className="text-xl font-semibold text-slate-600">
              Edit District: {district?.name}
            </h3>
            {/* <Link href={checkRole("secretary")}>
                <Button
                  variant={"destructive"}
                  className="bg-purple-800 hover:bg-purple-700"
                >
                  Back
                </Button>
              </Link> */}
          </CardHeader>
          <CardContent>
            <EditDistrictForm district={district} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default DistrictSettingsPage;
