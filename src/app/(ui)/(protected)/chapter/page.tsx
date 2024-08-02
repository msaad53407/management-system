import { getDistrict } from "@/actions/district";
import DetailsTable from "@/components/DetailsTable";
import { Button } from "@/components/ui/button";
import { checkRole } from "@/lib/role";
import { ChapterDocument } from "@/models/chapter";
import { capitalize } from "@/utils";
import { getAllChapters, getAllChaptersByDistrict } from "@/utils/functions";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Link from "next/link";

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
    const parsedChapters = JSON.parse(
      JSON.stringify(chapters)
    ) as ChapterDocument[];

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
                className="bg-button-primary hover:bg-button-primary"
              >
                Add Chapter
              </Button>
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-4 w-full">
          <DetailsTable type="chapter" chapters={parsedChapters} />
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
  const parsedChapters = JSON.parse(
    JSON.stringify(chapters)
  ) as ChapterDocument[];
  return (
    <section className="flex flex-col gap-6 p-4 w-full">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-xl font-semibold text-slate-600">All Chapters</h3>
        {checkRole(["grand-administrator"]) && (
          <Link href={`/chapter/add`}>
            <Button
              variant={"destructive"}
              className="bg-button-primary hover:bg-button-primary"
            >
              Add Chapter
            </Button>
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-4 w-full">
        <DetailsTable type="chapter" chapters={parsedChapters} />
      </div>
    </section>
  );
};

export default Chapter;
