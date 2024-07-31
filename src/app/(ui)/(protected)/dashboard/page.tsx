import LoadingSpinner from "@/components/LoadingSpinner";
import { checkRole } from "@/lib/role";
import { ChapterDocument } from "@/models/chapter";
import { DistrictDocument } from "@/models/district";
import { capitalize } from "@/utils";
import {
  getAllChapters,
  getAllDistricts,
  getMonthlyMoneyDetails,
} from "@/utils/functions";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import ActiveMembersCard from "./components/ActiveMembersCard";
import FilterDropdown from "./components/FilterDropdown";
import MemberBirthdaysCard from "./components/MemberBirthdaysCard";
import MemberDistributionCard from "./components/MemberDistributionCard";
import MemberGrowthCard from "./components/MemberGrowthCard";
import NewMembersCard from "./components/NewMembersCard";
import MoneyDetailsCard from "./components/MoneyDetailsCard";

type Props = {
  searchParams?: {
    filter?: "chapter" | "district";
    chapterId?: string;
    districtId?: string;
  };
};

const Dashboard = async ({ searchParams }: Props) => {
  const { userId } = auth();

  if (checkRole("member")) {
    return (
      <main className="flex flex-col items-center justify-center gap-6 p-4 w-full h-screen">
        <h2 className="text-xl font-bold">Unauthorized</h2>
      </main>
    );
  }

  let chapters: ChapterDocument[] | null = null;
  let districts: DistrictDocument[] | null = null;

  await Promise.all([getAllChapters(), getAllDistricts()]).then(
    ([rawChapters, rawDistricts]) => {
      chapters = JSON.parse(
        JSON.stringify(rawChapters?.data)
      ) as ChapterDocument[];
      districts = JSON.parse(
        JSON.stringify(rawDistricts?.data)
      ) as DistrictDocument[];
    }
  );

  const displayGreeting = () => {
    if (checkRole("secretary")) {
      const chapter = chapters?.find(
        (chapter) => chapter.secretaryId === userId
      );
      return (
        <h3 className="text-slate-600 text-lg font-semibold">
          Welcome &apos;{chapter?.name} {chapter?.chapterNumber}&apos; Secretary
        </h3>
      );
    }

    if (checkRole("worthy-matron")) {
      const chapter = chapters?.find((chapter) => chapter.matronId === userId);

      return (
        <h3 className="text-slate-600 text-lg font-semibold">
          Welcome &apos;{chapter?.name} {chapter?.chapterNumber}&apos; Worthy
          Matron
        </h3>
      );
    }

    if (checkRole("district-deputy")) {
      const district = districts?.find(
        (district) => district.deputyId === userId
      );
      return (
        <h3 className="text-slate-600 text-lg font-semibold">
          Welcome &apos;{district?.name}&apos; Deputy
        </h3>
      );
    }
  };

  return (
    <main className="flex flex-col gap-6 p-4 w-full">
      <div className="flex flex-col gap-2 w-full">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <div className="flex flex-row w-full items-center justify-between">
          <h3 className="text-slate-600 text-lg font-semibold">
            {displayGreeting()}
          </h3>
          {checkRole(["grand-administrator", "grand-officer"]) && (
            <FilterDropdown
              chapters={chapters}
              districts={districts}
              className={
                searchParams && searchParams?.filter && "text-lime-500"
              }
            />
          )}
        </div>
      </div>
      <section className="w-full space-y-3">
        <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Suspense
            fallback={
              <LoadingSpinner
                className="w-full h-[300px]"
                spinnerClassName="size-14"
              />
            }
          >
            <MoneyDetailsCard
              {...(!searchParams || !searchParams.filter
                ? { moneyType: "in" }
                : searchParams.filter === "chapter"
                ? {
                    type: "chapter",
                    chapterId: searchParams.chapterId!,
                    moneyType: "in",
                  }
                : {
                    type: "district",
                    districtId: searchParams.districtId!,
                    moneyType: "in",
                  })}
            />
          </Suspense>
          <Suspense
            fallback={
              <LoadingSpinner
                className="w-full h-[300px]"
                spinnerClassName="size-14"
              />
            }
          >
            <ActiveMembersCard
              {...(!searchParams || !searchParams.filter
                ? {}
                : searchParams.filter === "chapter"
                ? { type: "chapter", chapterId: searchParams.chapterId! }
                : { type: "district", districtId: searchParams.districtId! })}
            />
          </Suspense>
          <Suspense
            fallback={
              <LoadingSpinner
                className="w-full h-[300px]"
                spinnerClassName="size-14"
              />
            }
          >
            <NewMembersCard
              {...(!searchParams || !searchParams.filter
                ? {}
                : searchParams.filter === "chapter"
                ? { type: "chapter", chapterId: searchParams.chapterId! }
                : { type: "district", districtId: searchParams.districtId! })}
            />
          </Suspense>
        </div>
      </section>
      <section className="w-full space-y-3">
        <h2 className="text-lg font-semibold">Insights</h2>
        <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Suspense
            fallback={
              <LoadingSpinner
                className="w-full h-[300px]"
                spinnerClassName="size-14"
              />
            }
          >
            <MemberDistributionCard />
          </Suspense>
          <Suspense
            fallback={
              <LoadingSpinner
                className="w-full h-[300px]"
                spinnerClassName="size-14"
              />
            }
          >
            <MemberGrowthCard />
          </Suspense>
        </div>
      </section>
      <section className="w-full space-y-3">
        <h2 className="text-lg font-semibold">Announcements</h2>
        <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MemberBirthdaysCard />
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
