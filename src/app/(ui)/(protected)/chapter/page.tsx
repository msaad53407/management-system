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
import { Metadata } from "next";
import { getDistrict } from "@/actions/district";
import { getAllChapters, getAllChaptersByDistrict } from "@/utils/functions";
import { Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Chapters | Management System",
};

const Chapter = async () => {
  const { userId } = auth();

  if (!checkRole(["district-deputy", "grand-administrator", "grand-officer"])) {
    return (
      <section className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-slate-600 text-2xl">Unauthorized</h1>
      </section>
    );
  }

  if (checkRole("district-deputy")) {
    const { data: district } = await getDistrict({ deputyId: userId! });

    if (!district) {
      return (
        <section className="flex flex-col gap-6 p-4 w-full">
          <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
            You are not assigned to any District.
          </h3>
        </section>
      );
    }

    const { data: chapters } = await getAllChaptersByDistrict(district._id);

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
            <Link href={`/chapter/add`}>
              <Button
                variant={"destructive"}
                className="bg-purple-800 hover:bg-purple-700"
              >
                Add Chapter
              </Button>
            </Link>
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
                    className="w-full"
                    key={chapter._id.toHexString()}
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

  const { data: chapters } = await getAllChapters();

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
        <h3 className="text-xl font-semibold text-slate-600">All Chapters</h3>
        {checkRole(["grand-administrator"]) && (
          <Link href={`/chapter/add`}>
            <Button
              variant={"destructive"}
              className="bg-purple-800 hover:bg-purple-700"
            >
              Add Chapter
            </Button>
          </Link>
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
                <div
                  key={chapter._id.toHexString()}
                  className="w-full flex items-center justify-between"
                >
                  <Link
                    href={`/chapter/${chapter._id}/members`}
                    className="w-full"
                  >
                    <h2 className="text-md font-semibold text-slate-600">
                      {chapter.name}
                    </h2>
                  </Link>
                  <Link href={`/chapter/${chapter._id}/settings`}>
                    <Settings className="w-6 h-6" />
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Chapter;
