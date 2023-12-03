/* eslint-disable @next/next/no-img-element */
"use client";
import scrollbar_style from "@/styles/scrollbar.module.css";
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as ReactTable,
  flexRender,
} from "@tanstack/react-table";
import { columnTitles, discountTableColumns } from "./table_columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/my_table_column_visibility_toggle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { Ref, RefObject, useEffect, useRef, useState } from "react";
import { DataTablePagination } from "@/components/ui/my_table_pagination";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { ChevronRight, Lock, PenLine, Trash } from "lucide-react";
import { useAppDispatch } from "@/hooks";
import { deleteProduct, updateProduct } from "@/reducers/productsReducer";
import ProductService from "@/services/product_service";
import LoadingCircle from "@/components/ui/loading_circle";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useToast } from "@/components/ui/use-toast";
import { Discount } from "@/entities/Discount";

type Props = {
  data: Discount[];
};

export function CatalogDatatable({
  data,
}: Props) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: true,
      name: true,
      description: true,
      status: true,
      value: true,
      amount: true,
      startDate: true,
      endDate: true,
      createdAt: true,
    });
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [filterInput, setFilterInput] = React.useState("");
  const columns = discountTableColumns();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setFilterInput,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: filterInput,
    },
  });

  return (
    <div ref={tableContainerRef} className="w-full space-y-2">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search anything..."
          value={filterInput}
          onChange={(event) => setFilterInput(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-row">
          <div className="mr-2">
            <Button variant={"default"} onClick={() => {}}>
              Export Excel
            </Button>
          </div>

          <DataTableViewOptions
            title="Columns"
            table={table}
            columnHeaders={columnTitles}
          />
        </div>
      </div>
      <DataTableContent
        columns={columns}
        data={data}
        table={table}
        tableContainerRef={tableContainerRef}
      />
    </div>
  );
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  table: ReactTable<TData>;
  tableContainerRef: RefObject<HTMLDivElement>;
}

function DataTableContent<TData, TValue>({
  columns,
  data,
  table,
  tableContainerRef,
}: DataTableProps<TData, TValue>) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.map((row, idx) => (
                  <CustomRow
                    key={row.id}
                    row={row}
                    containerRef={tableContainerRef}
                  />
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

const CustomRow = ({
  row,
  containerRef,
}: {
  row: any;
  containerRef: RefObject<HTMLDivElement>;
}) => {
  const [showInfoRow, setShowInfoRow] = React.useState(false);
  const discount: Discount = row.original;
  const [disableDisableButton, setDisableDisableButton] = useState(false);
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const borderWidth =
    containerRef && containerRef.current
      ? Math.floor(containerRef.current?.getBoundingClientRect().width) -
        1 +
        "px"
      : "100%";

  return (
    <React.Fragment>
      <TableRow
        data-state={row.getIsSelected() && "selected"}
        onClick={(e) => {
          setShowInfoRow((prev) => !prev);
        }}
        className={cn("hover:cursor-pointer relative")}
      >
        {row.getVisibleCells().map((cell: any) => (
          <TableCell
            key={cell.id}
            className={cn(
              "whitespace-nowrap",
              showInfoRow ? "font-semibold" : ""
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
        <td
          className={cn(
            "absolute left-0 right-0 bottom-0 top-0",
            showInfoRow ? "border-t-2 border-green-400" : "hidden"
          )}
        ></td>
      </TableRow>
      
    </React.Fragment>
  );
};

// {showInfoRow ? (
//   <>
//     <tr className="hidden" />
//     {/* maintain odd - even row */}
//     <tr>
//       <td colSpan={row.getVisibleCells().length} className="p-0">
//         <div className={cn("border-b-2 border-green-400")}>
//           <div
//             className="p-2 flex flex-col gap-4 "
//             style={{
//               width: borderWidth,
//             }}
//           >
//             <h4 className="text-lg font-bold text-blue-800">
//               {product.name}
//             </h4>
//             <div className="flex flex-row gap-4">
//               <div className="flex flex-row grow-[5] shrink-[5] text-[0.8rem]">
//                 <div className="flex-1 flex flex-col pr-4">
//                   <div className="flex flex-row font-medium border-b mb-2">
//                     <p className="w-[100px] font-normal">Product id:</p>
//                     <p>{product.id}</p>
//                   </div>
//                   <div className="flex flex-row font-medium border-b mb-2">
//                     <p className="w-[100px] font-normal">
//                       Product group:
//                     </p>
//                     {product.productGroup ? (
//                       <p>{product.productGroup}</p>
//                     ) : null}
//                   </div>
//                   <div className="flex flex-row font-medium border-b mb-2">
//                     <p className="w-[100px] font-normal">Brand:</p>
//                     {product.productBrand ? (
//                       <p>{product.productBrand}</p>
//                     ) : null}
//                   </div>
//                   <div className="flex flex-row font-medium border-b mb-2">
//                     <p className="w-[100px] font-normal">Stock:</p>
//                     <p>{product.stock}</p>
//                   </div>
//                   <div className="flex flex-row font-medium border-b mb-2">
//                     <p className="w-[100px] font-normal">Stock quota:</p>
//                     <div className="flex flex-row items-center">
//                       <p>{product.minStock}</p>
//                       <ChevronRight size={14} className="mx-1 p-0" />
//                       <p>{product.maxStock}</p>
//                     </div>
//                   </div>

//                   <div className="flex flex-row font-medium border-b mb-2">
//                     <p className="w-[100px] font-normal">
//                       Product price:
//                     </p>
//                     <p>{product.productPrice}</p>
//                   </div>
//                   <div className="flex flex-row font-medium border-b mb-2">
//                     <p className="w-[100px] font-normal">
//                       Original price:
//                     </p>
//                     <p>{product.originalPrice}</p>
//                   </div>
//                   <div className="flex flex-row font-medium border-b mb-2">
//                     <p className="w-[100px] font-normal">Weight:</p>
//                     <p>{product.weight}</p>
//                   </div>
//                   <div className="flex flex-row font-medium border-b mb-2">
//                     <p className="w-[100px] font-normal">Location:</p>
//                     <p>{product.location}</p>
//                   </div>
//                 </div>
//                 <div className="flex-1 flex flex-col pr-4">
//                   <div className="flex flex-row font-medium border-b mb-2">
//                     <p className="w-[100px] font-normal">Status:</p>
//                     <p>{product.status}</p>
//                   </div>
//                   <div>
//                     <p className="mb-2">Description</p>
//                     <textarea
//                       readOnly
//                       className={cn(
//                         "resize-none border-2 rounded-sm p-1 h-[80px] w-full",
//                         scrollbar_style.scrollbar
//                       )}
//                       defaultValue={product.description}
//                     ></textarea>
//                   </div>
//                   <div>
//                     <p className="mb-2">Note</p>
//                     <textarea
//                       readOnly
//                       className={cn(
//                         "resize-none border-2 rounded-sm p-1 h-[80px] w-full",
//                         scrollbar_style.scrollbar
//                       )}
//                       defaultValue={product.note}
//                     ></textarea>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-row items-center gap-2">
//               <div className="flex-1" />
//               <Button
//                 variant={"green"}
//                 disabled={disableDeleteButton || disableDisableButton}
//               >
//                 <PenLine size={16} fill="white" className="mr-2" />
//                 Update
//               </Button>
//               <Button
//                 variant={product.status === "Active" ? "red" : "green"}
//                 disabled={disableDeleteButton || disableDisableButton}
//                 onClick={(e) => {
//                   setDisableDisableButton(true);
//                   ProductService.updateProduct(
//                     {
//                       ...product,
//                       status:
//                         product.status === "Active"
//                           ? "Disabled"
//                           : "Active",
//                     },
//                     null
//                   )
//                     .then((result) => {
//                       dispatch(updateProduct(result.data));
//                     })
//                     .catch((e) => axiosUIErrorHandler(e, toast))
//                     .finally(() => setDisableDisableButton(false));
//                 }}
//               >
//                 <Lock size={16} className="mr-2" />
//                 {product.status === "Active"
//                   ? "Disable product"
//                   : "Activate product"}
//                 {disableDisableButton ? <LoadingCircle /> : null}
//               </Button>
//               <Button
//                 variant={"red"}
//                 onClick={(e) => {
//                   setDisableDeleteButton(true);
//                   ProductService.deleteProduct(product.id)
//                     .then((result) => {
//                       dispatch(deleteProduct(product.id));
//                       setShowInfoRow(false);
//                     })
//                     .catch((error) => axiosUIErrorHandler(error, toast))
//                     .finally(() => setDisableDeleteButton(false));
//                 }}
//                 disabled={disableDeleteButton || disableDisableButton}
//               >
//                 <Trash size={16} className="mr-2" />
//                 Delete
//                 {disableDeleteButton ? <LoadingCircle /> : null}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </td>
//     </tr>
//   </>
// ) : null}
