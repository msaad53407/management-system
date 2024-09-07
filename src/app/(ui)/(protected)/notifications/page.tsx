/**
 * Logic to skip documents based on page Number
 * pageNumber - 1 * limit
 * e.g: for Page 1:(1 - 1) * 10 = 0
 * e.g: for Page 2:(2 - 1) * 10 = 10
 * e.g: for Page 3:(3 - 1) * 10 = 20
 * ...
 */
import { getNotifications, updateSeenStatus } from "@/actions/notification";
import MarkAsReadButton from "@/app/(ui)/(protected)/notifications/components/MarkAsReadButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UnauthorizedAccess from "@/components/UnauthorizedAccess";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface NotificationsPageProps {
  searchParams: { page?: string };
}

async function NotificationsList({ page }: { page: number }) {
  const { userId } = auth();
  if (!userId) {
    return <UnauthorizedAccess title="Unauthorized" />;
  }
  const notificationsPerPage = 10;
  const notificationsToSkip = (page - 1) * notificationsPerPage;

  const { data: notifications, message } = await getNotifications(
    userId,
    notificationsPerPage,
    notificationsToSkip
  );

  if (!notifications) {
    return (
      <div>
        <UnauthorizedAccess message={message} />
        <div className="flex justify-center items-center space-x-2">
          <Link href={`/notifications?page=1`} passHref>
            <Button variant="outline">Go to First Page</Button>
          </Link>
          <Link
            href={`/notifications?page=${page > 1 ? page - 1 : 1}`}
            passHref
          >
            <Button variant="outline" disabled={page <= 1}>
              Previous
            </Button>
          </Link>
          <div className="px-4 py-2 rounded bg-gray-100 text-gray-800">
            {page}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Showing Notifications {(page - 1) * notificationsPerPage + 1} -{" "}
          {notifications.length + (page - 1) * notificationsPerPage}
        </h1>
        {/* <div className="w-48 h-10 bg-gray-200 rounded">
          <span className="text-sm text-gray-500">Filter placeholder</span>
        </div> */}
      </div>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li
                key={notification._id.toString()}
                className="p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {notification.title}
                    </h3>
                    <p className="text-gray-600">{notification.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <MarkAsReadButton notification={notification} />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-center items-center space-x-2">
        {page > 1 && (
          <Link
            href={`/notifications?page=${page > 1 ? page - 1 : 1}`}
            passHref
          >
            <Button variant="outline">Previous</Button>
          </Link>
        )}
        <div className="px-4 py-2 rounded bg-gray-100 text-gray-800">
          {page}
        </div>
        {notifications.length >= notificationsPerPage && (
          <Link href={`/notifications?page=${page + 1}`} passHref>
            <Button variant="outline">Next</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function NotificationsPage({
  searchParams,
}: NotificationsPageProps) {
  if (searchParams.page && isNaN(Number(searchParams.page))) notFound();
  const page = Number(searchParams.page) || 1;

  return (
    <main className="flex flex-col gap-6 p-4 w-full">
      <Suspense fallback={<LoadingSpinner className="w-full min-h-screen" />}>
        <NotificationsList page={page} />
      </Suspense>
    </main>
  );
}
