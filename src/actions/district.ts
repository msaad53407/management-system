import { connectDB } from "@/lib/db";
import { checkRole } from "@/lib/role";
import { District, DistrictDocument } from "@/models/district";

type GetDistrictParams =
  | { deputyId: string; districtId?: never }
  | { deputyId?: never; districtId: string };

export async function getDistrict(params: GetDistrictParams) {
  try {
    await connectDB();
    //TODO Decide whether to keep this check or not.
    if (!checkRole(["district-deputy", "grand-administrator"])) {
      return {
        data: null,
        message: "Unauthorized",
      };
    }

    if (checkRole("district-deputy")) {
      if (!("deputyId" in params) || !params.deputyId) {
        return {
          data: null,
          message: "Please provide a valid deputyId",
        };
      }

      const district: DistrictDocument | null = JSON.parse(
        JSON.stringify(await District.findOne({ deputyId: params.deputyId }))
      );

      if (!district) {
        return {
          data: null,
          message: "District not found",
        };
      }

      return {
        data: district,
        message: "District fetched successfully",
      };
    }

    if (!("districtId" in params) || !params.districtId) {
      return {
        data: null,
        message: "Please provide a valid districtId",
      };
    }

    const district: DistrictDocument | null = JSON.parse(
      JSON.stringify(await District.findById(params.districtId))
    );

    if (!district) {
      return {
        data: null,
        message: "District not found",
      };
    }

    return {
      data: district,
      message: "District fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to DB",
    };
  }
}
