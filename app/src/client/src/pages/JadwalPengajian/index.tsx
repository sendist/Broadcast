import { DataTable } from "@/components/ui/data-table";
import { JadwalPengajian, columns } from "./columns";
import { useCRUD } from "@/hooks/backend";
import { AddJadwalPengajianForm } from "./add";
import { Button } from "@/components/ui/button";
import { PlusIcon, RocketIcon, TrashIcon } from "@radix-ui/react-icons";
import { AddJadwalPengajianBulk } from "./bulk";
import { useApiFetch } from "@/hooks/fetch";
import { BASE_URL } from "@/lib/constants";
import { Row, Table as TableType } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import ConfirmDialog from "@/components/custom/confirmDialog";
import Broadcast from "./broadcast";

export default function JadwalPengajianPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Row<JadwalPengajian>[]>([]);
  const { data, loading, update, remove, create, get } =
    useCRUD<JadwalPengajian>({
      url: "/jadwal-pengajian",
      params: {
        page: page.toString(),
        limit: limit.toString(),
      },
    });

  useEffect(() => {
    get();
  }, [page, limit]);

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
      type: "pengajian_reminder",
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
  const tableRef = useRef<TableType<JadwalPengajian>>(null);

  function uploadTemplate(file: File) {
    apiFetch({
      url: `${BASE_URL}/jadwal-pengajian/upload`,
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
      url: `${BASE_URL}/jadwal-pengajian/batch?${
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

  return (
    <div>
      <div className="space-x-4">
        <AddJadwalPengajianForm
          onSubmit={create}
          mubalighDropdown={mubalighDropdown || []}
          masjidDropdown={masjidDropdown || []}
        >
          <Button variant="outline" className="mb-4">
            <PlusIcon className="mr-2" />
            Add
          </Button>
        </AddJadwalPengajianForm>
        <AddJadwalPengajianBulk onSubmit={uploadTemplate}>
          <Button variant="outline" className="mb-4">
            <PlusIcon className="mr-2" />
            Bulk Upload
          </Button>
        </AddJadwalPengajianBulk>
        {selectedRows?.length ? (
          <>
            <ConfirmDialog
              title={`Apakah Anda Yakin Untuk Menghapus ${selectedRows.length} Jadwal Pengajian?`}
              description="Data yang sudah dihapus tidak dapat dikembalikan"
              cancelText="Batal"
              confirmText="Hapus"
              onConfirm={deleteBatch}
              dangerous
            >
              <Button
                variant="outline"
                className="mb-4 text-red-600 hover:text-red-600 hover:bg-red-100"
              >
                <TrashIcon className="mr-2" />
                Delete Selected ({selectedRows?.length})
              </Button>
            </ConfirmDialog>
            <Broadcast
              template={template || []}
              idJadwal={selectedRows.map((row) => row.original.id)}
            >
              <Button variant="outline" className="mb-4">
                <RocketIcon className="mr-2" />
                Broadcast Selected ({selectedRows?.length})
              </Button>
            </Broadcast>
          </>
        ) : null}
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
        onSelectedRowsChange={setSelectedRows}
      />
    </div>
  );
}
