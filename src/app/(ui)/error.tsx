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
          className="bg-button-primary hover:bg-button-primary text-lg"
          variant="default"
          onClick={() => reset()}
        >
          Try Again
        </Button>
        <a href="/" className="text-lg">
          <Button
            className="bg-button-primary hover:bg-button-primary"
            variant="default"
          >
            Home
          </Button>
        </a>
      </div>
    </div>
  );
}
