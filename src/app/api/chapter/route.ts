import { connectDB } from "@/lib/db";
import { Chapter } from "@/models/chapter";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    await connectDB();
    const chapter = await Chapter.create(body);

    if (!chapter) {
      return Response.json(
        {
          data: null,
          message: "Chapter not created",
        },
        { status: 404 }
      );
    }

    return Response.json(
      { data: chapter, message: "Chapter created" },
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

export async function GET(_req: Request) {
  try {
    await connectDB();
    const chapters = await Chapter.find({});
    if (!chapters || chapters?.length === 0) {
      return Response.json(
        {
          data: null,
          message: "Chapters not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        data: chapters,
        message: "Chapters fetched successfully",
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
