import { DataTable } from "@/components/ui/data-table";
import { Table as TableType, Row, SortingState } from "@tanstack/react-table";
import { JadwalJumatan, columns } from "./columns";
import { useCRUD } from "@/hooks/backend";
import { AddJadwalJumatanForm } from "./add";
import { Button } from "@/components/ui/button";
import { PlusIcon, RocketIcon, TrashIcon } from "@radix-ui/react-icons";
import { AddJadwalJumatanBulk } from "./bulk";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";
import ConfirmDialog from "../../components/custom/confirmDialog";
import { useEffect, useRef, useState } from "react";
import Broadcast from "./broadcast";
import useFirstRender from "@/hooks/firstRender";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import BroadcastBulanan from "./broadcastBulanan";

const limit = 20;

export default function JadwalMasjidPage() {
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Row<JadwalJumatan>[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(new Date().setHours(0, 0, 0, 0)),
    to: new Date(
      new Date(new Date().setMonth(new Date().getMonth() + 1)).setHours(
        0,
        0,
        0,
        0
      )
    ),
  });
  const { data, loading, update, remove, create, get } = useCRUD<JadwalJumatan>(
    {
      url: "/jadwal-jumatan",
      params: {
        page: page.toString(),
        limit: limit.toString(),
        ...(sorting[0] && {
          orderBy: sorting[0].id,
          orderType: sorting[0].desc ? "desc" : "asc",
        }),
        dateStart: new Date(
          new Date(dateRange.from).setHours(
            new Date().getTimezoneOffset() / -60
          )
        ).toISOString(),
        dateEnd: new Date(
          new Date(dateRange.to).setHours(new Date().getTimezoneOffset() / -60)
        ).toISOString(),
      },
    }
  );

  const { data: masjidForDropdown } = useCRUD<{
    id: string;
    nama_masjid: string;
  }>({
    url: "/masjid",
    params: {
      fields: "id,nama_masjid",
    },
  });
  const { data: mubalighForDropdown } = useCRUD<{
    id: string;
    nama_mubaligh: string;
  }>({
    url: "/mubaligh",
    params: {
      fields: "id,nama_mubaligh",
    },
  });
  const { data: template } = useCRUD<{
    id: string;
    content: string;
    nama_template: string;
  }>({
    url: "/template",
    params: {
      fields: "id,content,nama_template",
      type: "jumatan_reminder",
    },
  });

  const masjidDropdown = masjidForDropdown?.map((item) => ({
    label: item.nama_masjid,
    value: item.id,
  }));
  const mubalighDropdown = mubalighForDropdown?.map((item) => ({
    label: item.nama_mubaligh,
    value: item.id,
  }));

  const apiFetch = useApiFetch();
  const tableRef = useRef<TableType<JadwalJumatan>>(null);
  const isFirstRender = useFirstRender();

  function uploadTemplate(file: File) {
    apiFetch({
      url: `${BASE_URL}/jadwal-jumatan/upload`,
      options: {
        headers: {
          "Content-Type": file.type,
        },
        method: "POST",
        body: file,
      },
    }).then(() => {
      get();
    });
  }

  function deleteBatch() {
    apiFetch({
      url: `${BASE_URL}/jadwal-jumatan/batch?${
        new URLSearchParams({
          id: selectedRows.map((row) => row.original.id).join(","),
        }).toString() || ""
      }`,
      options: {
        method: "DELETE",
      },
    }).then(() => {
      get().then(() => {
        tableRef.current?.toggleAllPageRowsSelected(false);
      });
    });
  }

  const { data: templateBulanan } = useCRUD<{
    id: string;
    content: string;
    nama_template: string;
  }>({
    url: "/template",
    params: {
      fields: "id,content,nama_template",
      type: "jumatan_bulanan",
    },
  });

  useEffect(() => {
    if (!isFirstRender) {
      get();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sorting, dateRange]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4  items-start gap-4 sm:gap-0">
        <div>
          <h1 className="inline-block text-xl font-semibold">Jumatan</h1>
          <p className="text-sm text-muted-foreground">Atur Jadwal Jumatan</p>
        </div>
        <div className="space-x-4 space-y-2 -mt-2">
          <AddJadwalJumatanForm
            onSubmit={create}
            mubalighDropdown={mubalighDropdown || []}
            masjidDropdown={masjidDropdown || []}
          >
            <Button variant="white" className="ml-4 mt-2">
              <PlusIcon className="mr-2" />
              Add
            </Button>
          </AddJadwalJumatanForm>
          <AddJadwalJumatanBulk onSubmit={uploadTemplate}>
            <Button variant="white">
              <PlusIcon className="mr-2" />
              Bulk Upload
            </Button>
          </AddJadwalJumatanBulk>
          <BroadcastBulanan template={templateBulanan || []}>
            <Button variant="white">
              <RocketIcon className="mr-2" />
              Broadcast Bulanan
            </Button>
          </BroadcastBulanan>
          {selectedRows?.length ? (
            <>
              <ConfirmDialog
                title={`Apakah Anda Yakin Untuk Menghapus ${selectedRows.length} Jadwal Jumatan?`}
                description="Data yang sudah dihapus tidak dapat dikembalikan"
                cancelText="Batal"
                confirmText="Hapus"
                onConfirm={deleteBatch}
                dangerous
              >
                <Button
                  variant="white"
                  className="text-red-600 hover:text-red-600 hover:bg-red-100"
                >
                  <TrashIcon className="mr-2" />
                  Delete Selected ({selectedRows?.length})
                </Button>
              </ConfirmDialog>
              <Broadcast
                template={template || []}
                idJadwal={selectedRows.map((row) => row.original.id)}
              >
                <Button variant="white">
                  <RocketIcon className="mr-2" />
                  Broadcast Selected ({selectedRows?.length})
                </Button>
              </Broadcast>
            </>
          ) : null}
        </div>
      </div>
      <div className="mb-4">
        <DateRangePicker
          onUpdate={({ range: { from, to } }) =>
            setDateRange({ from, to: to! })
          }
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          align="start"
          locale="id-ID"
        />
      </div>
      <DataTable
        ref={tableRef}
        columns={columns(
          masjidDropdown || [],
          mubalighDropdown || [],
          template || []
        )}
        data={data}
        isLoading={loading}
        page={page}
        limit={limit}
        meta={{
          previousPage: () => {
            if (page > 1) {
              setPage(page - 1);
            }
          },
          nextPage: () => {
            setPage(page + 1);
          },
          updateData: (id: string, key: string, value: unknown) => {
            update(id, {
              [key]: value,
            });
          },
          removeData: (id: string) => {
            remove(id);
          },
        }}
        onSortingChange={setSorting}
        onSelectedRowsChange={setSelectedRows}
      />
    </div>
  );
}
