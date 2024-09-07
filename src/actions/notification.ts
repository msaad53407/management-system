"use server";
//This File exports server side functions. Do not export functions from this file just to be able to import them in another file. Any function exported from this file becomes a POST API endpoint;

import { isAuthenticated } from "@/lib/authorization";
import { connectDB } from "@/lib/db";
import { pusherServer } from "@/lib/pusherServer";
import { Notification, NotificationDocument } from "@/models/notification";
import { Types } from "mongoose";

export const addNotification = async (userId: string, message: string) => {
  if (!(await isAuthenticated())) {
    return {
      data: null,
      message: "Unauthorized",
    };
  }

  try {
    await connectDB();

    const newNotificationInDB = await Notification.create({
      userId,
      title: `New Notification!`,
      message,
    });

    if (!newNotificationInDB) {
      return {
        data: null,
        message: "Error sending notification",
      };
    }

    const notification = await pusherServer.trigger(
      userId,
      "new-notification",
      JSON.parse(JSON.stringify(newNotificationInDB))
    );

    if (!notification.ok) {
      return {
        data: null,
        message: await notification.text(),
      };
    }

    return {
      data: JSON.parse(
        JSON.stringify(newNotificationInDB)
      ) as NotificationDocument,
      message: "Notification sent successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error sending notification",
    };
  }
};

export const updateSeenStatus = async (notificationId: string) => {
  if (!(await isAuthenticated())) {
    return {
      data: null,
      message: "Unauthorized",
    };
  }

  try {
    await connectDB();
    const notification = await Notification.findByIdAndUpdate(
      new Types.ObjectId(notificationId),
      { seen: true },
      { new: true }
    );

    if (!notification) {
      return {
        data: null,
        message: "Error updating notification",
      };
    }

    return {
      data: JSON.parse(JSON.stringify(notification)) as NotificationDocument,
      message: "Notification updated successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error updating notification",
    };
  }
};

export const getNotifications = async (
  userId: string,
  limit: number = 10,
  skip: number = 0,
  seen?: boolean
) => {
  if (!(await isAuthenticated())) {
    return {
      data: null,
      message: "Unauthorized",
    };
  }

  try {
    await connectDB();
    const notifications = await Notification.find(
      seen === true || seen === false ? { userId, seen } : { userId }
    )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!notifications || notifications.length === 0) {
      return {
        data: null,
        message: "No Notifications Found",
      };
    }

    return {
      data: JSON.parse(JSON.stringify(notifications)) as NotificationDocument[],
      message: "Notifications fetched successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      message: "Error getting notifications",
    };
  }
};
