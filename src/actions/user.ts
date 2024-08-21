"use server";

import { isAuthenticated } from "@/lib/authorization";
import { Roles } from "@/types/globals";
import { clerkClient, User } from "@clerk/nextjs/server";

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

  const user = await clerkClient().users.getUser(userId);

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

export async function validateRole(email?: string, role?: Roles) {
  try {
    if (!email || !role) {
      return {
        message: "Missing email or role",
        data: null,
      };
    }

    const user = await clerkClient().users.getUserList({
      emailAddress: [email],
    });

    if (user.totalCount === 0) {
      return {
        message: "User not found",
        data: null,
      };
    }

    const userRole = user.data[0].publicMetadata?.role as Roles | undefined;

    if (!userRole) {
      return {
        message: "User role not found",
        data: null,
      };
    }

    if (userRole !== role) {
      return {
        message: "User role does not match with the provided role",
        data: null,
      };
    }

    return {
      message: "Member role validated",
      data: JSON.parse(JSON.stringify(user.data[0])) as User,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Internal server error. Please try again later.",
      data: null,
    };
  }
}
