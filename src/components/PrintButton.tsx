"use client";

import { cn } from "@/utils";
import { BlobProvider } from "@react-pdf/renderer";
import { VariantProps } from "class-variance-authority";
import { Printer } from "lucide-react";
import ChapterLedgerDocument from "./pdf/ChapterLedger";
import { Button } from "./ui/button";
import { BillDocument } from "@/models/bill";

type Props = {
  label: string;
  data: BillDocument[];
  className?: string;
  variant?: VariantProps<typeof Button>["variant"];
};

const PrintButton = ({
  className,
  variant = "outline",
  label,
  data,
}: Props) => {
  const handlePrint = (url: string | null) => {
    return () => {
      if (!url) return;

      const printWindow = window.open(url, "", "width=800,height=600");
      printWindow && printWindow.print();
    };
  };

  return (
    <BlobProvider document={<ChapterLedgerDocument data={data} />}>
      {({ url }) => (
        <Button
          variant={variant}
          className={cn("flex items-center", className)}
          onClick={handlePrint(url)}
        >
          <Printer className="mr-2 h-4 w-4" /> {label}
        </Button>
      )}
    </BlobProvider>
  );
};

export default PrintButton;
