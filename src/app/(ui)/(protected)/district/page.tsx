import { checkRole } from "@/lib/role";
import { District } from "@/models/district";
import React from "react";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Districts | Management System",
};

const DistrictPage = async () => {
  if (!checkRole(["grand-administrator", "grand-officer"])) {
    return (
      <section className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-slate-600 text-2xl">Unauthorized</h1>
      </section>
    );
  }

  try {
    await connectDB();

    if (checkRole(["grand-administrator", "grand-officer"])) {
      const districts = await District.find({});

      if (!districts || districts.length === 0) {
        return (
          <section className="flex flex-col gap-6 p-4 w-full">
            <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
              There are currently no Districts setup.
            </h3>
          </section>
        );
      }

      return (
        <section className="flex flex-col gap-6 p-4 w-full">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-xl font-semibold text-slate-600">
              All Districts
            </h3>
            {checkRole(["grand-administrator"]) && (
              <Link href={`/district/add`}>
                <Button
                  variant={"destructive"}
                  className="bg-purple-800 hover:bg-purple-700"
                >
                  Add District
                </Button>
              </Link>
            )}
          </div>
          <div className="flex flex-col gap-4 w-full">
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-600 text-lg">
                  Total Districts{" "}
                  <span className="text-pink-600">{districts.length}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 w-full">
                  {districts.map((district) => (
                    <Link
                      href={`/district/${district._id}/chapters`}
                      key={district._id.toHexString()}
                      className="w-full"
                    >
                      <h2 className="text-md font-semibold text-slate-600">
                        {district.name}
                      </h2>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      );
    }
  } catch (error) {
    console.error(error);
    <section className="flex flex-col gap-6 p-4 w-full">
      <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
        Something went wrong
      </h3>
    </section>;
  }

  return null;
};

export default DistrictPage;
