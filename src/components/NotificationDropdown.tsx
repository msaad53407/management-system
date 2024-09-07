"use client";

import { getNotifications, updateSeenStatus } from "@/actions/notification";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { pusherClient } from "@/lib/pusherClient";
import { NotificationDocument } from "@/models/notification";
import { playLocalAudio } from "@/utils/audio";
import { useUser } from "@clerk/nextjs";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<NotificationDocument[]>(
    []
  );
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const bellRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    getNotifications(user?.id!, 10, 0, false).then(({ data }) => {
      if (data) {
        setNotifications(data);
        setUnreadCount(data.length);
      }
    });
    const channel = pusherClient.subscribe(user?.id!);

    channel.bind("new-notification", (data: NotificationDocument) => {
      setNotifications((prev) => [...prev, data]);
      setUnreadCount((count) => count + 1);
      playLocalAudio("/notification-sound.mp3", {
        volume: 0.5,
      });
    });

    return () => {
      pusherClient.unsubscribe(user?.id!);
    };
  }, [user?.id]);

  useEffect(() => {
    if (unreadCount > 0) bellRef.current?.classList.add("animate-ring");

    setTimeout(() => {
      bellRef.current?.classList.remove("animate-ring");
    }, 1000);
  }, [unreadCount]);

  const markAsRead = async (id: string) => {
    setIsLoading(true);
    const { data } = await updateSeenStatus(id);
    if (data) {
      const updatedNotifications = notifications.map((notif) => {
        if (notif._id.toString() === id) {
          return {
            ...notif,
            seen: true,
          };
        }

        return notif;
      }) as NotificationDocument[];
      setNotifications(updatedNotifications);
      setUnreadCount((count) => Math.max(0, count - 1));
    }
    setIsLoading(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="bg-transparent relative text-slate-600 hover:bg-transparent p-1 rounded-md"
        >
          <Bell ref={bellRef} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-h-80 overflow-y-scroll"
      >
        <Card>
          <CardContent className="p-2">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <p className="p-4 text-center text-sm text-gray-500">
                  No new notifications
                </p>
                <Link
                  href="/notifications"
                  className="px-3 py-2 bg-button-primary rounded-xl w-fit text-white mb-2"
                >
                  See all Notifications
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <li
                    key={notification._id.toString()}
                    className={`p-4 hover:bg-gray-50 ${
                      notification.seen ? "opacity-50" : ""
                    }`}
                    onClick={() => markAsRead(notification._id.toString())}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-block h-8 w-8 rounded-full bg-gray-200" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {!isLoading ? (
                          <>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {notification.message}
                            </p>
                          </>
                        ) : (
                          <div className="w-24 h-4 animate-pulse bg-gray-200 rounded"></div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
                <div className="flex flex-col items-center justify-center w-full">
                  <Link
                    href="/notifications"
                    className="px-3 py-2 bg-button-primary rounded-xl w-fit text-white mb-2"
                  >
                    See all Notifications
                  </Link>
                </div>
              </ul>
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
