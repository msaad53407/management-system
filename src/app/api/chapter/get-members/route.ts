import { isAuthenticated } from "@/lib/authorization";
import { connectDB } from "@/lib/db";
import { checkRole } from "@/lib/role";
import { Chapter } from "@/models/chapter";
import { Member } from "@/models/member";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  // if (!isAuthenticated()) {
  //   return Response.json(
  //     {
  //       data: null,
  //       message: "Unauthorized",
  //     },
  //     { status: 401 }
  //   );
  // }
  const userId = auth().userId;
  try {
    await connectDB();
    let members;
    if (checkRole("secretary")) {
      const chapter = await Chapter.findOne({ secretaryId: userId });

      if (!chapter) {
        return Response.json(
          {
            data: null,
            message: "Chapter not found",
          },
          { status: 404 }
        );
      }
      members = await Member.find({ chapterId: chapter._id });
    } else {
      const member = await Member.findOne({ userId });
      if (!member) {
        return Response.json(
          {
            data: null,
            message: "Chapter not found",
          },
          { status: 404 }
        );
      }
      members = await Member.find({ chapterId: member.chapterId });
    }

    if (!members || members?.length === 0) {
      return Response.json(
        {
          data: null,
          message: "Members not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        data: members,
        message: "Members fetched successfully",
      },
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
