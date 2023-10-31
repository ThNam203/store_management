"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/my_table_column_header";
import { getColumns } from "@/components/ui/my_table_default_column";
import { Staff } from "@/entities/Staff";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown01,
  ArrowDown10,
  ArrowDownAZ,
  ArrowDownZA,
  MoreHorizontal,
} from "lucide-react";

export const columnHeader = {
  avatar: "Avatar",
  id: "Staff ID",
  name: "Staff Name",
  phoneNumber: "Phone Number",
  CCCD: "CCCD",
  salaryDebt: "Salary Debt",
  note: "Note",
  birthday: "Birthday",
  sex: "Sex",
  email: "Email",
  address: "Address",
  branch: "Branch",
  position: "Position",
  createAt: "Date Created",
};

export const columns: ColumnDef<Staff>[] = getColumns<Staff>(columnHeader);
