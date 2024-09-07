"use server"
//This File exports server side functions. Do not export functions from this file just to be able to import them in another file. Any function exported from this file becomes a POST API endpoint;

import { isAuthenticated } from "@/lib/authorization";
import { connectDB } from "@/lib/db";
import { meetingAddSchema, meetingEditSchema } from "@/lib/zod/member";
import { Meeting } from "@/models/meeting";
import { Types } from "mongoose";
import { redirect } from "next/navigation";

export const addMeeting = async (_prevState: any, formData: FormData) => {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/sign-in");
  }

  const rawData = Object.fromEntries(formData);

  const { success, data, error } = meetingAddSchema.safeParse(rawData);

  if (!success) {
    return {
      data: null,
      success: false,
      message: error.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();

    const newMeeting = await Meeting.create({
      chapterId: new Types.ObjectId(data.chapterId),
      meetingDate: new Date(data.meetingDate),
      meetingDoc: data.meetingDoc,
      meetingDocType: data.meetingDocType,
    });

    return {
      data: JSON.parse(JSON.stringify(newMeeting)),
      success: true,
      message: "Meeting added successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      success: false,
      message: "Error Connecting to Database",
    };
  }
};

export const editMeeting = async (_prevState: any, formData: FormData) => {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/sign-in");
  }

  const rawData = Object.fromEntries(formData);

  const { success, data, error } = meetingEditSchema.safeParse(rawData);

  if (!success) {
    return {
      data: null,
      success: false,
      message: error.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      data.meetingId,
      {
        meetingDate: new Date(data.meetingDate),
        meetingDoc: data.meetingDoc,
        meetingDocType: data.meetingDocType,
      },
      { new: true }
    );

    if (!updatedMeeting) {
      return {
        data: null,
        success: false,
        message: "Meeting not found",
      };
    }

    return {
      data: updatedMeeting.toJSON(),
      success: true,
      message: "Meeting updated successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      success: false,
      message: "Error Connecting to Database",
    };
  }
};
