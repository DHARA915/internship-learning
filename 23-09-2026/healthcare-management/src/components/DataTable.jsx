import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

const DataTable = ({ columns, data, onRowDoubleClick, onDelete }) => {
  return (
    <div className="h-full overflow-auto">
      <Table className="w-full caption-bottom text-sm">
        <TableHeader className="sticky top-0 z-20 bg-background">
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.label}
              </TableHead>
            ))}
            {/* Show Actions column only when onDelete is passed */}
            {onDelete && (
              <TableHead className="text-right">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={row.id ?? index}
              onDoubleClick={() => onRowDoubleClick?.(row)}
              className={onRowDoubleClick ? "cursor-pointer" : ""}
            >
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {row[column.key]}
                </TableCell>
              ))}
              
              {/* Double Button */}
                   {onDelete && (
                  <TableCell className="text-right">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(row);
                      }}
                      className="rounded-md px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                    >
                       <Trash2 size={17} />
                    </button>
                  </TableCell>
                )}              

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default DataTable;