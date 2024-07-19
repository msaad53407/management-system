import React from "react";
import { TableCell, TableRow } from "./ui/table";
import LoadingSpinner from "./LoadingSpinner";

const TableLoadingSpinner = () => {
  return (
    <TableRow>
      <TableCell colSpan={3}>
        <LoadingSpinner className="flex w-full items-center justify-center h-8" />
      </TableCell>
    </TableRow>
  );
};

export default TableLoadingSpinner;
