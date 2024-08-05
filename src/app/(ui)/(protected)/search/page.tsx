import DetailsTable from "@/components/DetailsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkRole } from "@/lib/role";
import { RankDocument } from "@/models/rank";
import { StatusDocument } from "@/models/status";
import {
  getAllRanks,
  getAllStatuses,
  getQueryResults,
} from "@/utils/functions";
import ContentFilter from "./components/ContentFilter";

type Props = {
  searchParams: {
    q?: string;
    filter?: string;
  };
};

const SearchPage = async ({ searchParams: { q, filter } }: Props) => {
  if (!q) {
    return (
      <section className="flex flex-col gap-6 p-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 text-center">
              Error: Please provide a search query
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }
  const { data, message } = await getQueryResults({ query: q, filter });
  if (!data) {
    return (
      <section className="flex flex-col gap-6 p-4 w-full">
        <div className="flex items-center justify-between flex-row">
          <h3 className="text-xl font-semibold text-slate-600">
            Search results for <span className="text-pink-600">{q}</span>
          </h3>
          <ContentFilter />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 text-center">{message}</p>
          </CardContent>
        </Card>
      </section>
    );
  }
  const [{ data: rawRanks }, { data: rawStatuses }] = await Promise.all([
    getAllRanks(),
    getAllStatuses(),
  ]);
  const ranks = JSON.parse(JSON.stringify(rawRanks)) as
    | RankDocument[]
    | undefined;
  const statuses = JSON.parse(JSON.stringify(rawStatuses)) as
    | StatusDocument[]
    | undefined;
  const filterSearch = async () => {
    if (filter === "chapter") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Chapters</CardTitle>
          </CardHeader>
          <CardContent>
            {data.chapters?.length === 0 || !data.chapters ? (
              <p className="text-red-500 text-center">No results found</p>
            ) : (
              <DetailsTable
                type="chapter"
                chapters={JSON.parse(JSON.stringify(data.chapters))}
              />
            )}
          </CardContent>
        </Card>
      );
    }

    if (checkRole(["secretary", "grand-administrator", "grand-officer"])) {
      if (filter === "district") {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Districts</CardTitle>
            </CardHeader>
            <CardContent>
              {data.districts?.length === 0 || !data.districts ? (
                <p className="text-red-500 text-center">No results found</p>
              ) : (
                <DetailsTable
                  type="district"
                  districts={JSON.parse(JSON.stringify(data.districts))}
                />
              )}
            </CardContent>
          </Card>
        );
      }
    }

    if (filter === "member") {
      if (!ranks || !statuses || ranks.length === 0 || statuses.length === 0) {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-500 text-center">No results found</p>
            </CardContent>
          </Card>
        );
      }
      return (
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent>
            {data.members?.length === 0 || !data.members ? (
              <p className="text-red-500 text-center">No results found</p>
            ) : (
              <DetailsTable
                type="member"
                members={JSON.parse(JSON.stringify(data.members))}
                ranks={JSON.parse(JSON.stringify(ranks))}
                statuses={JSON.parse(JSON.stringify(statuses))}
              />
            )}
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-center">Invalid Filter</p>
        </CardContent>
      </Card>
    );
  };

  const renderContent = async () => {
    if (checkRole(["member", "secretary", "worthy-matron"])) {
      if (data?.members?.length === 0 || !data.members) {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-500 text-center">No results found</p>
            </CardContent>
          </Card>
        );
      }

      if (!ranks || !statuses || ranks.length === 0 || statuses.length === 0) {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-500 text-center">
                Could not fetch Details
              </p>
            </CardContent>
          </Card>
        );
      }

      return (
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailsTable
              type="member"
              members={JSON.parse(JSON.stringify(data.members))}
              ranks={JSON.parse(JSON.stringify(ranks))}
              statuses={JSON.parse(JSON.stringify(statuses))}
            />
          </CardContent>
        </Card>
      );
    }

    if (checkRole(["grand-administrator", "grand-officer"])) {
      if (!ranks || !statuses || ranks.length === 0 || statuses.length === 0) {
        if (filter) {
          return filterSearch();
        }
        return (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Chapters</CardTitle>
              </CardHeader>
              <CardContent>
                {data.chapters?.length === 0 || !data.chapters ? (
                  <p className="text-red-500 text-center">No results found</p>
                ) : (
                  <DetailsTable
                    type="chapter"
                    chapters={JSON.parse(JSON.stringify(data.chapters))}
                  />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Districts</CardTitle>
              </CardHeader>
              <CardContent>
                {data.districts?.length === 0 || !data.districts ? (
                  <p className="text-red-500 text-center">No results found</p>
                ) : (
                  <DetailsTable
                    type="district"
                    districts={JSON.parse(JSON.stringify(data.districts))}
                  />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Members</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-500 text-center">No results found</p>
              </CardContent>
            </Card>
          </>
        );
      }

      if (filter) {
        return filterSearch();
      }
      return (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Chapters</CardTitle>
            </CardHeader>
            <CardContent>
              {data.chapters?.length === 0 || !data.chapters ? (
                <p className="text-red-500 text-center">No results found</p>
              ) : (
                <DetailsTable
                  type="chapter"
                  chapters={JSON.parse(JSON.stringify(data.chapters))}
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Districts</CardTitle>
            </CardHeader>
            <CardContent>
              {data.districts?.length === 0 || !data.districts ? (
                <p className="text-red-500 text-center">No results found</p>
              ) : (
                <DetailsTable
                  type="district"
                  districts={JSON.parse(JSON.stringify(data.districts))}
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent>
              {data.members?.length === 0 || !data.members ? (
                <p className="text-red-500 text-center">No results found</p>
              ) : (
                <DetailsTable
                  type="member"
                  members={JSON.parse(JSON.stringify(data.members))}
                  ranks={JSON.parse(JSON.stringify(ranks))}
                  statuses={JSON.parse(JSON.stringify(statuses))}
                />
              )}
            </CardContent>
          </Card>
        </>
      );
    }

    if (!ranks || !statuses || ranks.length === 0 || statuses.length === 0) {
      if (filter) {
        return filterSearch();
      }
      return (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Chapters</CardTitle>
            </CardHeader>
            <CardContent>
              {data.chapters?.length === 0 || !data.chapters ? (
                <p className="text-red-500 text-center">No results found</p>
              ) : (
                <DetailsTable
                  type="chapter"
                  chapters={JSON.parse(JSON.stringify(data.chapters))}
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-500 text-center">No results found</p>
            </CardContent>
          </Card>
        </>
      );
    }

    if (filter) {
      return filterSearch();
    }
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Chapters</CardTitle>
          </CardHeader>
          <CardContent>
            {data.chapters?.length === 0 || !data.chapters ? (
              <p className="text-red-500 text-center">No results found</p>
            ) : (
              <DetailsTable
                type="chapter"
                chapters={JSON.parse(JSON.stringify(data.chapters))}
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent>
            {data.members?.length === 0 || !data.members ? (
              <p className="text-red-500 text-center">No results found</p>
            ) : (
              <DetailsTable
                type="member"
                members={JSON.parse(JSON.stringify(data.members))}
                ranks={JSON.parse(JSON.stringify(ranks))}
                statuses={JSON.parse(JSON.stringify(statuses))}
              />
            )}
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <section className="flex flex-col gap-6 p-4 w-full">
      <div className="flex items-center justify-between flex-row">
        <h3 className="text-xl font-semibold text-slate-600">
          Search results for <span className="text-pink-600">{q}</span>
        </h3>
        <ContentFilter />
      </div>
      <div className="w-full flex flex-col gap-3">{renderContent()}</div>
    </section>
  );
};

export default SearchPage;
