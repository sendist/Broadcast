import {
  ColumnDef,
  SortingState,
  Table as TableType,
  TableMeta,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useImperativeHandle,
  useState,
  ForwardedRef,
  forwardRef,
  useEffect,
} from "react";
import { Button } from "./button";

interface CustomTableMeta<TData> extends TableMeta<TData> {
  previousPage?: () => void;
  nextPage?: () => void;
  updateData?: (id: string, key: string, value: unknown) => void;
  removeData?: (id: string) => void;
  [key: string]: unknown;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  meta?: CustomTableMeta<TData>;
  isLoading?: boolean;
  page: number;
  limit: number;
  onSelectedRowsChange?: (rows: Row<TData>[]) => void;
}

function DataTable1<TData, TValue>(
  {
    columns,
    data,
    meta,
    isLoading,
    page,
    limit,
    onSelectedRowsChange,
  }: DataTableProps<TData, TValue>,
  ref: ForwardedRef<TableType<TData>>
) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  useEffect(() => {
    onSelectedRowsChange && onSelectedRowsChange(selectedRows);
  }, [onSelectedRowsChange, selectedRows]);

  useImperativeHandle(ref, () => table);

  return (
    <>
      <div className="rounded-md border bg-white">
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading Data...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedRows.length} of {table.getFilteredRowModel().rows.length}{" "}
          row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (meta && meta.previousPage) {
                meta.previousPage();
              }
            }}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (meta && meta.nextPage) {
                meta.nextPage();
              }
            }}
            disabled={table.getRowModel().rows?.length < limit}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

export const DataTable = forwardRef(DataTable1) as <TData, TValue>(
  props: DataTableProps<TData, TValue> & {
    ref?: ForwardedRef<TableType<TData>>;
  }
) => ReturnType<typeof DataTable1>;
