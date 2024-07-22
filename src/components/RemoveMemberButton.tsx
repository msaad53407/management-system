"use client";

import { useState } from "react";
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
  removeMemberHandler: (memberId: string) => Promise<void>;
  className?: string;
}) => {
  const [isPending, setIsPending] = useState(false);
  return (
    <Button
      variant="destructive"
      disabled={isPending}
      className={cn(
        "w-full",
        className,
        isPending && "opacity-50 cursor-not-allowed"
      )}
      onClick={async () => {
        setIsPending(true);
        await removeMemberHandler(memberId);
        setIsPending(false);
      }}
    >
      {!isPending ? (
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
