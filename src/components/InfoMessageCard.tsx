"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import { X } from "lucide-react";

const InfoMessageCard = ({
  message,
  variant,
  clearMessage,
}: {
  message: string;
  variant: "error" | "success" | "";
  clearMessage: React.Dispatch<
    React.SetStateAction<{
      variant: "error" | "success" | "";
      message: string;
    }>
  >;
}) => {
  const removeMessage = () => {
    clearMessage({
      variant: "",
      message: "",
    });
  };

  return (
    <Card
      className={variant === "error" ? "bg-red-500 mb-3" : "bg-green-500 mb-3"}
    >
      <CardContent className="flex flex-row justify-between items-center p-4">
        <h2 className="text-xl font-semibold text-white">{message}</h2>
        <X
          className="text-white size-6 cursor-pointer"
          onClick={removeMessage}
        />
      </CardContent>
    </Card>
  );
};

export default InfoMessageCard;
