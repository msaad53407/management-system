"use client";

import React from "react";
import { Button } from "../../../../../components/ui/button";
import { NotificationDocument } from "@/models/notification";
import { cn } from "@/utils";
import { updateSeenStatus } from "@/actions/notification";
import { revalidatePath } from "@/actions";

type Props = {
  notification: NotificationDocument;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null;
  size?: "default" | "sm" | "lg" | "icon" | null;
};

const MarkAsReadButton = ({
  notification,
  className,
  variant = "outline",
  size = "sm",
}: Props) => {
  const markAsRead = async (id: string) => {
    const { data } = await updateSeenStatus(id);

    if (data) revalidatePath("/notifications");
  };

  return (
    <Button
      onClick={() => markAsRead(notification._id.toString())}
      variant={variant}
      size={size}
      disabled={notification.seen}
      className={cn(className)}
    >
      {notification.seen ? "Read" : "Mark as Read"}
    </Button>
  );
};

export default MarkAsReadButton;
