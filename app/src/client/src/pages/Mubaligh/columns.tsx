import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon, TrashIcon } from "@radix-ui/react-icons";
import { ColumnDef, TableMeta } from "@tanstack/react-table";
import { EditCell } from "@/components/custom/editCell";
import CellHeaderSortable from "@/components/custom/cellHeaderSortable";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Mubaligh = {
  id: string;
  nama_mubaligh: string;
  no_hp: string;
};

interface CustomTableMeta<T extends { id: string }> extends TableMeta<T> {
  removeData?: (id: string) => void;
}

export const columns: ColumnDef<Mubaligh>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: true,
  },
  {
    accessorKey: "nama_mubaligh",
    header: (header) => CellHeaderSortable(header, "Nama Mubaligh"),
    cell: EditCell,
    enableSorting: true,
  },
  {
    accessorKey: "no_hp",
    header: (header) => CellHeaderSortable(header, "No. HP"),
    cell: EditCell,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const mubaligh = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="text-red-600 focus:bg-red-600 focus:text-white"
              onClick={() =>
                (table.options.meta as CustomTableMeta<Mubaligh>)?.removeData?.(
                  mubaligh.id
                )
              }
            >
              <TrashIcon className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
