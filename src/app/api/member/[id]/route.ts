import { connectDB } from "@/lib/db";
import { Member } from "@/models/member";

export async function DELETE(
  _req: Request,
  { params }: { params: { id?: string } }
) {
  //TODO Check for auth and role of secretary.
  if (!params?.id) {
    return Response.json(
      {
        message: "Missing id",
        data: null,
      },
      { status: 404 }
    );
  }
  const { id } = params;
  try {
    await connectDB();
    const member = await Member.findByIdAndDelete(id);
    if (!member) {
      return Response.json(
        {
          data: null,
          message: "Member not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        data: member,
        message: "Member deleted successfully",
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
  //TODO Check for auth and role of secretary or if the same member is trying to edit it's own info.
  if (!params?.id) {
    return Response.json(
      {
        message: "Missing id",
        data: null,
      },
      { status: 404 }
    );
  }
  const { id } = params;
  const body = await req.json();
  try {
    await connectDB();
    const member = await Member.findByIdAndUpdate(id, body, { new: true });
    if (!member) {
      return Response.json(
        {
          data: null,
          message: "Member not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        data: member,
        message: "Member updated successfully",
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

export async function GET(
  _req: Request,
  { params }: { params: { id?: string } }
) {
  //TODO Check for auth and role of secretary or If the same member is trying to see it's own info.
  if (!params?.id) {
    return Response.json(
      {
        data: null,
        message: "Missing id",
      },
      { status: 404 }
    );
  }
  const { id } = params;
  try {
    await connectDB();
    const member = await Member.findById(id);
    if (!member) {
      return Response.json(
        {
          data: null,
          message: "Member not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        data: member,
        message: "Member fetched successfully",
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
