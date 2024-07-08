"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen">
      <h1 className="text-2xl font-bold">Error</h1>
      <p className="text-lg text-red-500">{error.message}</p>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
        <Button
          className="bg-purple-700 hover:bg-purple-600 text-lg"
          variant="default"
          onClick={() => reset()}
        >
          Try Again
        </Button>
        <Link href="/" className="text-lg">
          <Button
            className="bg-purple-700 hover:bg-purple-600"
            variant="default"
          >
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
