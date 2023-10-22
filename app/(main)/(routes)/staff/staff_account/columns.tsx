"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown01,
  ArrowDown10,
  ArrowDownAZ,
  ArrowDownZA,
  MoreHorizontal,
} from "lucide-react";
import { Staff } from "../entities";

export const columns: ColumnDef<Staff>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div
          className="w-[100px] flex flex-row hover:opacity-80 ease-linear duration-200 hover:cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          <span>Staff Name</span>
          {column.getIsSorted() === false ? null : (
            <div>
              {column.getIsSorted() === "asc" ? (
                <ArrowDownAZ className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDownZA className="ml-2 h-4 w-4" />
              )}
            </div>
          )}
        </div>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("position")}</div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div
          className="w-[100px] flex flex-row hover:opacity-80 ease-linear duration-200 hover:cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          <span>Email</span>
          {column.getIsSorted() === false ? null : (
            <div>
              {column.getIsSorted() === "asc" ? (
                <ArrowDownAZ className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDownZA className="ml-2 h-4 w-4" />
              )}
            </div>
          )}
        </div>
      );
    },
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const rowData = row.original;

      const handleDeleteRow = (id: any) => {
        // Gửi request đến API để xóa row
      };

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
