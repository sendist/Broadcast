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
  TrashIcon,
  RocketIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";
import { ColumnDef, TableMeta } from "@tanstack/react-table";
import { EditCell } from "@/components/custom/editCell";
import CellHeaderSortable from "@/components/custom/cellHeaderSortable";
import Broadcast from "./broadcast";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import ConfirmDialogContent from "@/components/custom/confirmDialogContent";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type JadwalJumatan = {
  id: string;
  tanggal: Date;
  id_masjid: string;
  id_mubaligh: string;
};

interface CustomTableMeta<T extends { id: string }> extends TableMeta<T> {
  removeData?: (id: string) => void;
}

export const columns: (
  selectMasjid: {
    value: string;
    label: string;
  }[],
  selectMubaligh: {
    value: string;
    label: string;
  }[],
  template: {
    id: string;
    content: string;
    nama_template: string;
  }[]
) => ColumnDef<JadwalJumatan>[] = (selectMasjid, selectMubaligh, template) => [
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
    accessorKey: "tanggal",
    header: (header) => CellHeaderSortable(header, "Tanggal Jumatan"),
    cell: (props) => <EditCell {...props} calendar />,
    enableSorting: true,
  },
  {
    accessorKey: "id_masjid",
    header: (header) => CellHeaderSortable(header, "Masjid"),
    cell: (props) => <EditCell {...props} select={selectMasjid} />,
  },
  {
    accessorKey: "id_mubaligh",
    header: (header) => CellHeaderSortable(header, "Mubaligh"),
    cell: (props) => <EditCell {...props} select={selectMubaligh} />,
  },
  {
    accessorKey: "broadcasted",
    header: (header) => CellHeaderSortable(header, "Status Broadcast"),
    cell: ({ getValue }) =>
      getValue<boolean>() ? (
        <div className="flex flex-row items-center gap-2 text-green-600 ">
          <CheckCircledIcon />
          Sudah Broadcast
        </div>
      ) : (
        <p>Belum Broadcast</p>
      ),
  },
  {
    id: "broadcast",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Broadcast template={template} idJadwal={[row.original.id]}>
          <Button variant="ghost">
            <RocketIcon className="mr-4" />
            Broadcast
          </Button>
        </Broadcast>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const jadwaljumatan = row.original;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [alertDialogOpen, setAlertDialogOpen] = useState(false);

      return (
        <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-600 focus:bg-red-600 focus:text-white">
                  <TrashIcon className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <ConfirmDialogContent
            title={`Apakah Anda Yakin Untuk Menghapus Jadwal dengan ID ${jadwaljumatan.id}?`}
            description="Data yang sudah dihapus tidak dapat dikembalikan"
            cancelText="Batal"
            confirmText="Hapus"
            onConfirm={() =>
              (
                table.options.meta as CustomTableMeta<JadwalJumatan>
              )?.removeData?.(jadwaljumatan.id)
            }
            dangerous
          />
        </AlertDialog>
      );
    },
  },
];
