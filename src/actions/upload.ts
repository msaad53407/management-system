"use server"
//This File exports server side functions. Do not export functions from this file just to be able to import them in another file. Any function exported from this file becomes a POST API endpoint;

import { checkRole } from "@/lib/role";
import fs from "fs";

export default async function upload(_prevState: any, formData: FormData) {
  if (!checkRole("grand-administrator")) {
    return {
      data: null,
      success: false,
      message: "Unauthorized",
    };
  }

  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return {
      data: null,
      success: false,
      message: "File not found",
    };
  }

  if (!file.type.includes("image")) {
    return {
      data: null,
      success: false,
      message: "File should be an image",
    };
  }

  if (file.size > 5 * 1024 * 1024) {
    return {
      data: null,
      success: false,
      message: "File should be less than 5MB",
    };
  }

  try {
    const data = await file.arrayBuffer();
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
        "File uploaded Successfully, your image will be updated shortly. If it doesn't update, please try uploading again.",
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
