"use server";

import { connectDB } from "@/lib/db";
import { checkRole } from "@/lib/role";
import { addDistrictSchema } from "@/lib/zod/member";
import { District, DistrictDocument } from "@/models/district";
import { clerkClient, User } from "@clerk/nextjs/server";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export async function addDistrict(_prevState: any, formData: FormData) {
  let shouldRedirect: boolean = false;

  try {
    await connectDB();

    const rawFormData = Object.fromEntries(formData);

    const { success, data, error } = addDistrictSchema.safeParse(rawFormData);

    if (!success) {
      console.error(error);
      return {
        message: error.flatten().fieldErrors,
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    let user: User | null = null;
    try {
      user = await clerkClient().users.createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        emailAddress: [data.email],
        publicMetadata: {
          role: "district-deputy",
        },
        passwordHasher: "bcrypt",
        passwordDigest: hashedPassword,
        skipPasswordRequirement: true,
        skipPasswordChecks: true,
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      return {
        message:
          "Provide all required User details or Email or Username may already exist",
      };
    }

    if (!user) {
      return { message: "User not found" };
    }

    const district = await District.create({
      name: data.name,
      deputyId: user.id,
      districtCharterDate: new Date(data.districtCharterDate),
      districtMeet1: data.districtMeet1,
      districtMeet2: data.districtMeet2,
    });

    if (!district) {
      return {
        data: null,
        message: "Could not add District",
      };
    }

    shouldRedirect = true;
    revalidatePath("/district");
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error Connecting to DB",
    };
  } finally {
    if (shouldRedirect) {
      redirect("/district");
    }
  }
}
