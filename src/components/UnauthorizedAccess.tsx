import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  title?: string;
  message?: string;
};

const UnauthorizedAccess = ({
  message = "You are not authorized to view this page",
  title = "Error",
}: Props) => {
  return (
    <Card className="w-full mb-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center">{message}</p>
      </CardContent>
    </Card>
  );
};

export default UnauthorizedAccess;
