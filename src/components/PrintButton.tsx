"use client";

import { cn } from "@/utils";
import { BlobProvider } from "@react-pdf/renderer";
import { VariantProps } from "class-variance-authority";
import { Printer } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  label?: string;
  className?: string;
  printerClassName?: string;
  variant?: VariantProps<typeof Button>["variant"];
  document: any;
};

const PrintButton = ({
  className,
  variant = "outline",
  printerClassName,
  label,
  document,
}: Props) => {
  const handlePrint = (url: string | null) => {
    return () => {
      if (!url) return;

      const printWindow = window.open(url, "", "width=800,height=600");
      printWindow && printWindow.print();
    };
  };

  return (
    <BlobProvider document={document}>
      {({ url }) => (
        <Button
          variant={variant}
          className={cn("flex items-center", className)}
          onClick={handlePrint(url)}
        >
          <Printer className={cn("mr-2 h-4 w-4", printerClassName)} /> {label}
        </Button>
      )}
    </BlobProvider>
  );
};

export default PrintButton;
