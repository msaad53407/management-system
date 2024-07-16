import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { connectDB } from "@/lib/db";
import { checkRole } from "@/lib/role";
import { Chapter } from "@/models/chapter";
import { District } from "@/models/district";
import { capitalize } from "@/utils";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "District Chapters | Management System",
};

type Props = {
  params: {
    districtId?: string;
  };
};

const DistrictChapters = async ({ params: { districtId } }: Props) => {
  if (!districtId) {
    notFound();
  }
  try {
    await connectDB();
    const district = await District.findById(districtId);

    if (!district) {
      return (
        <section className="flex flex-col gap-6 p-4 w-full">
          <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
            No District found.
          </h3>
        </section>
      );
    }

    const chapters = await Chapter.find({ districtId: district._id });

    if (!chapters || chapters.length === 0) {
      return (
        <section className="flex flex-col gap-6 p-4 w-full">
          <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
            There are currently no Chapters in this District.
          </h3>
        </section>
      );
    }

    return (
      <section className="flex flex-col gap-6 p-4 w-full">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-xl font-semibold text-slate-600">
            District:{" "}
            <span className="text-pink-600">{capitalize(district.name)}</span>{" "}
            Chapters
          </h3>
          {checkRole(["grand-administrator"]) && (
            // <Link href={`/chapter/member/add?chapterId=${params.chapterId}`}>
            <Button
              variant={"destructive"}
              className="bg-purple-800 hover:bg-purple-700"
            >
              Add Chapter
            </Button>
            // </Link>
          )}
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-slate-600 text-lg">
                Total Chapters{" "}
                <span className="text-pink-600">{chapters.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 w-full">
                {chapters.map((chapter) => (
                  <Link
                    href={`/chapter/${chapter._id}/members`}
                    key={chapter._id.toHexString()}
                    className="w-full"
                  >
                    <h2 className="text-lg font-semibold text-slate-600">
                      {chapter.name}
                    </h2>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  } catch (error) {
    console.error(error);
    return (
      <section className="flex flex-col gap-6 p-4 w-full">
        <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
          Something went wrong. Please try again later.
        </h3>
      </section>
    );
  }
};

export default DistrictChapters;
