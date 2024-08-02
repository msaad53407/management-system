import { getDistrict } from "@/actions/district";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { capitalize } from "@/utils";
import { getAllChaptersByDistrict } from "@/utils/functions";
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

  const { data: district, message: districtMessage } = await getDistrict({
    districtId,
  });

  if (!district) {
    return (
      <section className="flex flex-col gap-6 p-4 w-full">
        <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
          {districtMessage}
        </h3>
      </section>
    );
  }

  const { data: chapters } = await getAllChaptersByDistrict(district._id);

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
            className="bg-button-primary hover:bg-button-primary"
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
};

export default DistrictChapters;
