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
  CheckCircledIcon,
  CrossCircledIcon,
  DotsHorizontalIcon,
  PaperPlaneIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { ColumnDef, TableMeta } from "@tanstack/react-table";
import CellHeaderSortable from "@/components/custom/cellHeaderSortable";
import { formatDateTime, whatsappFormatting } from "@/lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type MessageLog = {
  id: string;
  no_hp: string;
  message: string;
  status: string;
  send_time: Date;
  error_reason: string;
};

interface CustomTableMeta<T extends { id: string }> extends TableMeta<T> {
  removeData?: (id: string) => void;
  resend?: (id: string) => void;
}

export const columns: ColumnDef<MessageLog>[] = [
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
    accessorKey: "no_hp",
    header: (header) => CellHeaderSortable(header, "No. HP"),
    enableSorting: true,
  },
  {
    accessorKey: "message",
    header: (header) => CellHeaderSortable(header, "Message"),
    cell: (props) => (
      <span className="whitespace-pre-wrap">
        {whatsappFormatting(props.getValue<string>())}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: (header) => CellHeaderSortable(header, "Status"),
    cell: ({ getValue, row }) => (
      <p>
        {getValue<string>() === "success" ? (
          <div className="flex flex-row items-center gap-2 text-green-600 ">
            <CheckCircledIcon />
            Success
          </div>
        ) : (
          <>
            <div className="flex flex-row items-center gap-2 text-red-600">
              <CrossCircledIcon />
              Failed
            </div>
            {row.original.error_reason}
          </>
        )}
      </p>
    ),
  },
  {
    accessorKey: "send_time",
    header: (header) => CellHeaderSortable(header, "Waktu Pengiriman"),
    cell: ({ getValue }) => formatDateTime(getValue<string>()),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const messageLog = row.original;

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
              onClick={() =>
                (table.options.meta as CustomTableMeta<MessageLog>)?.resend?.(
                  messageLog.id
                )
              }
            >
              <PaperPlaneIcon className="mr-2" />
              Kirim Ulang
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:bg-red-600 focus:text-white"
              onClick={() =>
                (
                  table.options.meta as CustomTableMeta<MessageLog>
                )?.removeData?.(messageLog.id)
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
