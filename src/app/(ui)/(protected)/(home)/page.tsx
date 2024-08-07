import { checkRole } from "@/lib/role";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!checkRole("member")) {
    redirect("/dashboard");
  }

  redirect("/chapter/members");
}
