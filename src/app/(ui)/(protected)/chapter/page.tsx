import { checkRole } from "@/lib/role";
import { District } from "@/models/district";
import { Chapter as ChapterModel } from "@/models/chapter";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import Link from "next/link";
import { capitalize } from "@/utils";

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
        <section className="flex flex-col gap-4 items-center justify-center">
          <h1 className="text-slate-600 text-2xl">
            {`District ${capitalize(district.name)}`} Chapters
          </h1>
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
        <section className="flex flex-col gap-4 items-center justify-center">
          <h1 className="text-slate-600 text-2xl">All Chapters</h1>
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
