"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import "./cl.css";
import { CircularProgress } from "@mui/material";
import useAdminDashboardStore from "@/store/adminDashboardStore";
import useCompanyLogoDialog from "@/hooks/useCompanyLogoDialog";

export function CompanyLogoTable({ data }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { isCLLoading } = useAdminDashboardStore();
  const { handleLogoUpload, selectedFiles, setSelectedFiles } = useCompanyLogoDialog();

  const handleFileSelect = (companyName, file) => {
    setSelectedFiles((prev) => {
      const updated = { ...prev };

      // Always overwrite the file for the given companyName
      updated[companyName] = file;

      return updated;
    });
  };


  const columns = [
    {
      accessorKey: "company",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Company
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("company")}</div>,
    },
    {
      accessorKey: "logo_upload",
      header: "Update Logo",
      cell: ({ row }) => {
        const {id: companyID} = row.original; // 👈 get company name from row

        const fileInputRef = React.useRef(null);

        const handleFileChange = (e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileSelect(companyID, file); // 👈 save with correct company name
          }
        };

        return (
          <div className="logoUpload_row">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }} // hide the ugly input
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="dialogBtn"
            >
              Select Logo
            </Button>
            {selectedFiles[companyID] && (
              <span className="text-xs text-gray-500">
                {selectedFiles[companyID].name}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "logo_url",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Logo URL
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <a href={row.getValue("logo_url")} target="_blank" className="logoURL_txt"><p>{row.getValue("logo_url")}</p></a>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="emailListTable">
      {/* Filter input */}

      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter company..."
          value={table.getColumn("company")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("company")?.setFilterValue(event.target.value)
          }
          className="tableInput"
        />
        <Button onClick={() => handleLogoUpload(selectedFiles)} className="addEmailBtn" variant="outline">
          {isCLLoading ? (
            <CircularProgress color="black" size="17px" />
          ) : (
            "Upload"
          )}
        </Button>
      </div>

      {/* Table */}
      <div className="tableWrapper rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
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
    </div>
  );
}
