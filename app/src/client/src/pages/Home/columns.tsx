import { CheckCircledIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import CellHeaderSortable from "@/components/custom/cellHeaderSortable";
import { formatDate } from "@/lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type JadwalPengajian = {
  id: string;
  tanggal: Date;
  waktu: string;
  id_masjid: string;
  id_mubaligh: string;
};
export type JadwalJumatan = {
  id: string;
  tanggal: Date;
  id_masjid: string;
  id_mubaligh: string;
};

export const pengajianColumns: (
  masjid: {
    value: string;
    label: string;
  }[],
  mubaligh: {
    value: string;
    label: string;
  }[],
) => ColumnDef<JadwalPengajian>[] = (masjid, mubaligh) => [
  // {
  //   accessorKey: "id",
  //   header: (header) => CellHeaderSortable(header, "ID"),
  //   enableSorting: true,
  // },
  {
    accessorKey: "tanggal",
    header: (header) => CellHeaderSortable(header, "Tanggal Pengajian"),
    cell: ({ getValue }) => formatDate(getValue<Date>()),
    enableSorting: true,
  },
  {
    accessorKey: "waktu",
    header: (header) => CellHeaderSortable(header, "Waktu Pengajian"),
    enableSorting: true,
  },
  {
    accessorKey: "id_masjid",
    header: (header) => CellHeaderSortable(header, "Masjid"),
    cell: ({getValue})=> masjid.find((m) => m.value === getValue<string>())?.label,
  },
  {
    accessorKey: "id_mubaligh",
    header: (header) => CellHeaderSortable(header, "Mubaligh"),
    cell: ({getValue})=> mubaligh.find((m) => m.value === getValue<string>())?.label,
  },
  {
    accessorKey: "broadcasted",
    header: (header) => CellHeaderSortable(header, "Status Broadcast"),
    cell: ({ getValue }) =>
      getValue<boolean>() ? (
        <div className="flex flex-row items-center gap-2 text-green-600">
          <CheckCircledIcon />
          Sudah Broadcast
        </div>
      ) : (
        <p>Belum Broadcast</p>
      ),
  },
];

export const jumatanColumns: (
  masjid: {
    value: string;
    label: string;
  }[],
  mubaligh: {
    value: string;
    label: string;
  }[],
) => ColumnDef<JadwalJumatan>[] = (masjid, mubaligh) => [
  {
    accessorKey: "id",
    header: (header) => CellHeaderSortable(header, "ID"),
    enableSorting: true,
  },
  {
    accessorKey: "tanggal",
    header: (header) => CellHeaderSortable(header, "Tanggal Jumatan"),
    cell: ({ getValue }) => formatDate(getValue<Date>()),
    enableSorting: true,
  },
  {
    accessorKey: "id_masjid",
    header: (header) => CellHeaderSortable(header, "Masjid"),
    cell: ({getValue})=> masjid.find((m) => m.value === getValue<string>())?.label,
  },
  {
    accessorKey: "id_mubaligh",
    header: (header) => CellHeaderSortable(header, "Mubaligh"),
    cell: ({getValue})=> mubaligh.find((m) => m.value === getValue<string>())?.label,
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
];
