import { isAuthenticated } from "@/lib/authorization";
import { connectDB } from "@/lib/db";
import { Member } from "@/models/member";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  // if (!isAuthenticated()) {
  //   return Response.json(
  //     {
  //       data: null,
  //       message: "Unauthorized",
  //     },
  //     { status: 401 }
  //   );
  // }

  const body = await req.json();

  if (!body?.userId) {
    return Response.json(
      {
        data: null,
        message: "Missing userId",
      },
      { status: 404 }
    );
  }

  try {
    await connectDB();
    const user = await clerkClient.users.getUser(body.userId);

    if (!user) {
      return Response.json(
        {
          data: null,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const member = await Member.create(body);

    if (!member) {
      return Response.json(
        {
          data: null,
          message: "Member not created",
        },
        { status: 404 }
      );
    }

    return Response.json(
      { data: member, message: "Member created" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        data: null,
        message: "Error Connecting to DB",
      },
      { status: 500 }
    );
  }
}

