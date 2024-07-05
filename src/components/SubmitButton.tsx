"use client";

import React from "react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import { cn } from "@/utils";
import LoadingSpinner from "./LoadingSpinner";

const SubmitButton = ({
  className,
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn(
        "w-1/2 mx-auto bg-purple-800 hover:bg-purple-700 text-white",
        className,
        pending && "opacity-50 cursor-not-allowed"
      )}
    >
      {!pending ? (
        children
      ) : (
        <LoadingSpinner
          className="size-full"
          spinnerClassName="border-t-white"
        />
      )}
    </Button>
  );
};

export default SubmitButton;
