import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DotsHorizontalIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { ColumnDef, TableMeta } from "@tanstack/react-table";
import { EditCell } from "@/components/custom/editCell";
import CellHeaderSortable from "@/components/custom/cellHeaderSortable";
import { useState } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: string;
  username: string;
  password: string;
};

const [isPasswordHovered, setIsPasswordHovered] = useState(false);

interface CustomTableMeta<T extends { id: string }> extends TableMeta<T> {
  removeData?: (id: string) => void;
}

const renderPasswordCell = (cell: any) => {
  const { isEditing, value } = cell;

  // Jika dalam mode editing, render EditCell
  if (isEditing) {
    return <EditCell {...cell} />;
  }

  // Jika tidak dalam mode editing dan kursor berada di atasnya, tampilkan Pencil1Icon sebagai placeholder
  if (isPasswordHovered) {
    return (
      <span className="group" onMouseLeave={() => setIsPasswordHovered(false)}>
        <Pencil1Icon className="text-gray-500 mr-1 cursor-pointer group-hover:opacity-100" />
        {Array.from({ length: value.length }, () => "*").join("")}
      </span>
    );
  }

  // Jika tidak dalam mode editing dan kursor tidak berada di atasnya, tampilkan karakter bintang
  return (
    <span
      onMouseEnter={() => setIsPasswordHovered(true)}
      onMouseLeave={() => setIsPasswordHovered(false)}
    >
      {Array.from({ length: value.length }, () => "*").join("")}
    </span>
  );
};

export const columns: ColumnDef<User>[] = [
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
    header: (header) => CellHeaderSortable(header, "ID"),
    enableSorting: true,
  },
  {
    accessorKey: "username",
    header: (header) => CellHeaderSortable(header, "Username"),
    cell: EditCell,
    enableSorting: true,
  },
  {
    accessorKey: "password",
    header: (header) => CellHeaderSortable(header, "Password"),
    cell: renderPasswordCell,
    enableSorting: true,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const user = row.original;

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
                (table.options.meta as CustomTableMeta<User>)?.removeData?.(
                  user.id
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
