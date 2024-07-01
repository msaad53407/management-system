import { connectDB } from "@/lib/db";
import { Chapter } from "@/models/chapter";

export async function GET(
  _req: Request,
  { params }: { params: { id?: string } }
) {
  if (!params?.id) {
    return Response.json(
      {
        data: null,
        message: "Missing id",
      },
      { status: 400 }
    );
  }
  const { id } = params;
  try {
    await connectDB();
    const chapter = await Chapter.findById(id);

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

export async function DELETE(
  _req: Request,
  { params }: { params: { id?: string } }
) {
  if (!params?.id) {
    return Response.json(
      {
        message: "Missing id",
        data: null,
      },
      { status: 400 }
    );
  }
  const { id } = params;
  try {
    await connectDB();
    const chapter = await Chapter.findByIdAndDelete(id);
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
        message: "Chapter deleted successfully",
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

export async function PUT(
  req: Request,
  { params }: { params: { id?: string } }
) {
  const { name, chapterState, chapterCity } = await req.json();

  if (!name || !chapterState || !chapterCity) {
    return Response.json(
      {
        data: null,
        message: "Missing name or chapterState or chapterCity",
      },
      { status: 400 }
    );
  }

  if (!params?.id) {
    return Response.json(
      {
        message: "Missing id",
        data: null,
      },
      { status: 400 }
    );
  }
  const { id } = params;
  try {
    await connectDB();
    const chapter = await Chapter.findByIdAndUpdate(
      id,
      {
        name,
        chapterState,
        chapterCity,
      },
      { new: true }
    );
    if (!chapter) {
      return Response.json(
        {
          data: null,
          message: "Chapter not found",
        },
        { status: 404 }
      );
    }
    return Response.json(chapter, { status: 200 });
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
