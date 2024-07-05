import React from "react";
import { cn } from "@/utils";

function LoadingSpinner({
  className,
  spinnerClassName,
}: {
  className?: string;
  spinnerClassName?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "spinner size-5 border-4 border-transparent border-t-4 border-t-purple-600",
          spinnerClassName
        )}
      ></div>
    </div>
  );
}

export default LoadingSpinner;
