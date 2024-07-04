import { cn } from "@/utils";
import React from "react";

const Loading = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "w-full min-h-screen h-full flex justify-center items-center",
        className
      )}
    >
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default Loading;
