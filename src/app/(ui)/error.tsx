"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error(error);
  return (
    <div className="flex flex-col gap-5 items-center justify-center w-screen min-h-screen">
      <h1 className="text-2xl font-bold">Some Error Occurred</h1>
      <p className="text-lg text-center text-red-500 max-w-screen-md mx-auto">
        We are tying to fix the issue. Please Try again, or go to Home Page by
        clicking on the button.
      </p>
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
