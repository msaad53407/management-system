import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await clerkClient.users.getUser(userId);

  return (
    <div className="w-full flex items-center justify-center min-h-screen overflow-y-auto">
      <h1 className="text-3xl font-semibold text-slate-600">
        Welcome to Management System{" "}
        <span className="text-pink-600">{user.fullName}</span>
      </h1>
    </div>
  );
}
