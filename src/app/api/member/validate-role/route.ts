import { isAuthenticated } from "@/lib/authorization";
import { Roles } from "@/types/globals";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          data: null,
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();
    const { email, role }: { email?: string; role?: Roles } = body;
    console.log(email, role);

    if (!email || !role) {
      return NextResponse.json(
        {
          message: "Missing email",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const user = await clerkClient().users.getUserList({
      emailAddress: [email],
    });

    if (user.totalCount === 0) {
      return NextResponse.json(
        {
          message: "User not found",
          data: null,
        },
        {
          status: 404,
        }
      );
    }

    const userRole = user.data[0].publicMetadata?.role as Roles | undefined;

    if (!userRole) {
      return NextResponse.json(
        {
          message: "User role not found",
          data: null,
        },
        {
          status: 404,
        }
      );
    }

    if (userRole !== role) {
      return NextResponse.json(
        {
          message: "User role does not match with the provided role",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Member role validated",
        data: user.data[0],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal server error",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}
