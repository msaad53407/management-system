import { connectDB } from "@/lib/db";
import { Chapter } from "@/models/chapter";
import { Member } from "@/models/member";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const userId = auth().userId;
  const role = auth().sessionClaims?.metadata?.role;

  try {
    let chapter;
    await connectDB();
    if (role === "secretary") {
      chapter = await Chapter.findOne({ secretaryId: userId });

      if (!chapter) {
        return Response.json(
          {
            data: null,
            message: "You are not secretary of any chapter",
          },
          { status: 404 }
        );
      }
    } else if (role === "member") {
      const member = await Member.findOne({ userId });

      if (!member) {
        return Response.json(
          {
            data: null,
            message: "You are not a member of any chapter",
          },
          { status: 404 }
        );
      }

      chapter = await Chapter.findById(member.chapterId);

      if (!chapter) {
        return Response.json(
          {
            data: null,
            message: "Chapter not found",
          },
          { status: 404 }
        );
      }
    }

    return Response.json(
      {
        data: chapter,
        message: "Chapter fetched successfully",
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
