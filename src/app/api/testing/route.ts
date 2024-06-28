import { connectDB } from "@/lib/db";
import Club from "@/models/club";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const clubs = await Club.find({});
  if (clubs.length === 0)
    return NextResponse.json({ message: "No clubs found" }, { status: 404 });
  return NextResponse.json({ clubs }, { status: 200 });
}
