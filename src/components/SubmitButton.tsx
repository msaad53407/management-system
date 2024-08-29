"use client";

import React from "react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import { cn } from "@/utils";
import LoadingSpinner from "./LoadingSpinner";

const SubmitButton = ({
  className,
  children,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn(
        "w-fit px-4 mx-auto bg-button-primary hover:bg-button-primary text-white",
        className,
        pending && "opacity-50 cursor-not-allowed"
      )}
      {...props}
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
