import { connectDB } from "@/lib/db";
import { Chapter } from "@/models/chapter";
import { Member } from "@/models/member";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const userId = auth().userId;

  if (!userId) {
    return Response.json(
      {
        data: null,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    await connectDB();

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

    const members = await Member.find({ chapterId: chapter._id });

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
