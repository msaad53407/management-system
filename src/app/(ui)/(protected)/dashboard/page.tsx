import LoadingSpinner from "@/components/LoadingSpinner";
import { checkRole } from "@/lib/role";
import { ChapterDocument } from "@/models/chapter";
import { DistrictDocument } from "@/models/district";
import { capitalize, capitalizeSentence } from "@/utils";
import { getAllChapters, getAllDistricts } from "@/utils/functions";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Suspense } from "react";
import ActiveMembersCard from "./components/ActiveMembersCard";
import FilterDropdown from "./components/FilterDropdown";
import MemberBirthdaysCard from "./components/MemberBirthdaysCard";
import MemberDistributionCard from "./components/MemberDistributionCard";
import MemberGrowthCard from "./components/MemberGrowthCard";
import MoneyDetailsCard from "./components/MoneyDetailsCard";
import NewMembersCard from "./components/NewMembersCard";
import TextEditor from "@/components/TextEditor";

type Props = {
  searchParams?: {
    filter?: "chapter" | "district" | "month";
    chapterId?: string;
    districtId?: string;
    month?: string;
  };
};

const Dashboard = async ({ searchParams }: Props) => {
  if (checkRole("member")) {
    return (
      <main className="flex flex-col items-center justify-center gap-6 p-4 w-full h-screen">
        <h2 className="text-xl font-bold">Unauthorized</h2>
      </main>
    );
  }

  const role = auth().sessionClaims?.metadata.role!;

  const user = await clerkClient().users.getUser(auth().userId!);

  let chapters: ChapterDocument[] | null = null;
  let districts: DistrictDocument[] | null = null;

  if (checkRole(["grand-administrator", "grand-officer"])) {
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
  }
  return (
    <main className="flex flex-col gap-6 p-4 w-full">
      <div className="flex flex-col gap-2 w-full">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <div className="flex flex-row w-full items-center justify-between">
          <h3 className="text-slate-600 text-lg font-semibold">
            Welcome to the dashboard{" "}
            <span className="text-pink-600">
              {capitalize(user.firstName)} {capitalize(user.lastName)} -{" "}
              {capitalizeSentence(role, "-")}
            </span>
          </h3>
          <FilterDropdown
            chapters={chapters}
            districts={districts}
            className={searchParams && searchParams?.filter && "text-lime-500"}
          />
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
                : searchParams.filter === "district"
                ? {
                    type: "district",
                    districtId: searchParams.districtId!,
                    moneyType: "in",
                  }
                : {
                    type: "month",
                    month: searchParams.month!,
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
                : searchParams.filter === "district"
                ? { type: "district", districtId: searchParams.districtId! }
                : { type: "month", month: searchParams.month! })}
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
                : searchParams.filter === "district"
                ? { type: "district", districtId: searchParams.districtId! }
                : {
                    type: "month",
                    month: searchParams.month!,
                  })}
            />
          </Suspense>
        </div>
      </section>
      <section className="w-full space-y-3">
        <h2 className="text-lg font-semibold">Insights</h2>
        <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2">
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
      <TextEditor />
    </main>
  );
};

export default Dashboard;
