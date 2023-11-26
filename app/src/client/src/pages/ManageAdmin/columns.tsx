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
  LockClosedIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { ColumnDef, TableMeta } from "@tanstack/react-table";
import { EditCell } from "@/components/custom/editCell";
import CellHeaderSortable from "@/components/custom/cellHeaderSortable";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ChangePasswordForm } from "./changePassword";
import { useState } from "react";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ConfirmDialogContent from "@/components/custom/confirmDialogContent";

// const { update } = useCRUD<User>;

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: string;
  username: string;
  password: string;
};

interface CustomTableMeta<T extends { id: string }> extends TableMeta<T> {
  removeData?: (id: string) => void;
  updateData?: (id: string, key: string, value: unknown) => void;
}

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
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const user = row.original;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [dialogOpen, setDialogOpen] = useState(false);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [alertDialogOpen, setAlertDialogOpen] = useState(false);

      return (
        <>
          <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <DotsHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <>
                        <LockClosedIcon className="mr-2" />
                        Change Password
                      </>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-red-600 focus:bg-red-600 focus:text-white">
                      <TrashIcon className="mr-2" />
                      Delete User
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <ChangePasswordForm
                onSubmit={(data) => {
                  setDialogOpen(false);
                  (table.options.meta as CustomTableMeta<User>)?.updateData?.(
                    user.id,
                    "password",
                    data.password
                  );
                }}
              />
            </Dialog>
            <ConfirmDialogContent
              title={`Apakah Anda Yakin Untuk Menghapus Admin ${user.username}?`}
              description="Data yang sudah dihapus tidak dapat dikembalikan"
              cancelText="Batal"
              confirmText="Hapus"
              onConfirm={() =>
                (table.options.meta as CustomTableMeta<User>)?.removeData?.(
                  user.id
                )
              }
              dangerous
            />
          </AlertDialog>
        </>
      );
    },
  },
];
