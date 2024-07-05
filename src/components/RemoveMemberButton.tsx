"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import LoadingSpinner from "./LoadingSpinner";
import { cn } from "@/utils";

const RemoveMemberButton = ({
  memberId,
  children,
  removeMemberHandler,
  className,
}: {
  memberId: string;
  children: React.ReactNode;
  removeMemberHandler: (memberId: string) => void;
  className?: string;
}) => {
  const { pending } = useFormStatus();

  return (
    <Button
      variant="destructive"
      disabled={pending}
      className={cn(
        "w-full",
        className,
        pending && "opacity-50 cursor-not-allowed"
      )}
      onClick={async () => removeMemberHandler(memberId)}
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

export default RemoveMemberButton;
