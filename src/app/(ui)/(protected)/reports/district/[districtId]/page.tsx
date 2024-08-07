import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { checkRole } from "@/lib/role";
import { getAllChaptersByDistrict } from "@/utils/functions";
import { MoreHorizontal } from "lucide-react";
import { Types } from "mongoose";
import Link from "next/link";
import { notFound } from "next/navigation";
import ChapterReportsRow from "../../ChapterReportsRow";
import { Suspense } from "react";
import TableLoadingSpinner from "@/components/TableLoadingSpinner";
import LoadingSpinner from "@/components/LoadingSpinner";

type Props = {
  params: {
    districtId?: Types.ObjectId;
  };
};

const DistrictReportsPage = async ({ params: { districtId } }: Props) => {
  if (!districtId) {
    notFound();
  }

  if (!checkRole(["district-deputy", "grand-administrator", "grand-officer"])) {
    return (
      <main className="flex flex-col gap-6 p-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle>District Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 text-center">Unauthorized</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const [{ data: chapters, message: chaptersMessage }] = await Promise.all([
    getAllChaptersByDistrict(districtId),
  ]);

  if (!chapters || chapters.length === 0) {
    return (
      <main className="flex flex-col gap-6 p-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle>District Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 text-center">
              Error:
              {!chapters && chaptersMessage}
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-6 p-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-600 text-lg">
            Total Chapters: {chapters.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Reports</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chapters
                .sort(
                  (a, b) => (a?.chapterNumber || 0) - (b?.chapterNumber || 0)
                )
                .map((chapter, indx) => (
                  <TableRow key={indx}>
                    <TableCell className="font-medium text-slate-600">
                      <p>{chapter.chapterNumber}</p>
                    </TableCell>
                    <TableCell className="font-medium text-slate-600">
                      <Link href={`/reports/chapter/${chapter._id}`}>
                        <p>{chapter.name}</p>
                        <p className="text-slate-400">{chapter.chapterEmail}</p>
                      </Link>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell">
                      <Suspense fallback={<TableLoadingSpinner />}>
                        <ChapterReportsRow chapter={chapter} />
                      </Suspense>
                    </TableCell>

                    <TableCell className="table-cell lg:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel className="flex justify-center">
                            Reports
                          </DropdownMenuLabel>
                          <Suspense fallback={<LoadingSpinner />}>
                            <ChapterReportsRow chapter={chapter} />
                          </Suspense>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

export default DistrictReportsPage;
