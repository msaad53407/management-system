import { checkRole } from "@/lib/role";
import { District } from "@/models/district";
import { Chapter as ChapterModel } from "@/models/chapter";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import Link from "next/link";
import { capitalize } from "@/utils";
import { connectDB } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Chapter = async () => {
  const { userId } = auth();

  if (!checkRole(["district-deputy", "grand-administrator", "grand-officer"])) {
    return (
      <section className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-slate-600 text-2xl">Unauthorized</h1>
      </section>
    );
  }

  try {
    await connectDB();
    if (checkRole("district-deputy")) {
      const district = await District.findOne({ deputyId: userId });

      if (!district) {
        return (
          <section className="flex flex-col gap-6 p-4 w-full">
            <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
              You are not assigned to any District.
            </h3>
          </section>
        );
      }

      const chapters = await ChapterModel.find({ districtId: district._id });

      if (!chapters || chapters.length === 0) {
        return (
          <section className="flex flex-col gap-6 p-4 w-full">
            <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
              There are currently no Chapters in your District.
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
                  Total Chapters {chapters.length}
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
    }

    if (checkRole(["grand-administrator", "grand-officer"])) {
      const chapters = await ChapterModel.find({});

      if (!chapters || chapters.length === 0) {
        return (
          <section className="flex flex-col gap-6 p-4 w-full">
            <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
              There are currently no Chapters in Any District.
            </h3>
          </section>
        );
      }

      return (
        <section className="flex flex-col gap-6 p-4 w-full">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-xl font-semibold text-slate-600">
              All Chapters
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
                  Total Chapters {chapters.length}
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

export default Chapter;
