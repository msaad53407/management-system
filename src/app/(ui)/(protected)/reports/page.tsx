import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { checkRole } from "@/lib/role";
import { getAllDistricts } from "@/utils/functions";
import Link from "next/link";

const ReportsPage = async () => {
  if (!checkRole(["grand-administrator", "grand-officer"])) {
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

  const { data: districts } = await getAllDistricts();

  if (!districts || districts.length === 0) {
    return (
      <section className="flex flex-col gap-6 p-4 w-full">
        <h3 className="text-xl font-semibold text-slate-600 text-center my-10">
          There are currently no Districts setup.
        </h3>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 p-4 w-full">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-xl font-semibold text-slate-600">All Districts</h3>
        {checkRole(["grand-administrator"]) && (
          <Link href={`/district/add`}>
            <Button
              variant={"destructive"}
              className="bg-button-primary hover:bg-button-primary"
            >
              Add District
            </Button>
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-600 text-lg">
              Total Districts: {districts.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Name</TableHead>
                  {/* <TableHead>City</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {districts.map((district, indx) => (
                  <TableRow key={indx}>
                    <TableCell className="font-medium text-slate-600">
                      <p>{district.name?.split(" ").at(1)}</p>
                    </TableCell>
                    <TableCell className="font-medium text-slate-600">
                      <Link href={`/reports/district/${district._id}`}>
                        {district.name}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ReportsPage;
