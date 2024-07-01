import { connectDB } from "@/lib/db";
import { Chapter } from "@/models/chapter";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const userId = auth().userId;
  const role = auth().sessionClaims?.metadata?.role;

  if (!userId || !role || role !== "secretary") {
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
