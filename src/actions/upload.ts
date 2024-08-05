"use server";

import { checkRole } from "@/lib/role";
import fs from "fs";

export default async function upload(_prevState: any, formData: FormData) {
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return {
      data: null,
      success: false,
      message: "File not found",
    };
  }

  if (file.size > 5 * 1024 * 1024) {
    return {
      data: null,
      success: false,
      message: "File should be less than 5MB",
    };
  }

  if (!checkRole("grand-administrator")) {
    return {
      data: null,
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const data = await file.arrayBuffer();
    await fs.unlink(`${process.cwd()}/public/upload/logo.png`, (err) => {
      if (err) {
        return {
          data: null,
          success: false,
          message: err.message,
        };
      }
    });
    await fs.writeFile(
      `${process.cwd()}/public/upload/logo.png`,
      Buffer.from(data),
      (err) => {
        if (err) {
          return {
            data: null,
            success: false,
            message: err.message,
          };
        }
      }
    );
    return {
      data: `/upload/logo.png`,
      message:
        "File uploaded Successfully, your image will be updated shortly.",
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      message: "Could not Upload File",
    };
  }
}
