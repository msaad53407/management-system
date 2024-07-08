"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Error({ error }: { error: Error }) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen">
      <h1 className="text-2xl font-bold">Error</h1>
      <p className="text-lg">{error.message}</p>
      <Link href={pathname} className="text-lg text-blue-500">
        Back
      </Link>
      <Link href="/" className="text-lg text-blue-500">
        Home
      </Link>
    </div>
  );
}
