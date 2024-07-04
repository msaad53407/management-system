"use server";

import { isAuthenticated } from "@/lib/authorization";
import { clerkClient } from "@clerk/nextjs/server";

export const getUser = async (userId?: string) => {
  if (!(await isAuthenticated())) {
    return {
      data: null,
      message: "Unauthorized",
    };
  }

  if (!userId) {
    return {
      data: null,
      message: "Missing userId",
    };
  }

  const user =await  clerkClient.users.getUser(userId);

  if (!user) {
    return {
      data: null,
      message: "User not found",
    };
  }

  return {
    data: user,
    message: "User fetched Successfully",
  };
};
